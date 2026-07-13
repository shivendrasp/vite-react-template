import { scaleBand } from "d3";
import { eachDayOfInterval, format, startOfMonth, endOfMonth } from "date-fns";
import { topics } from "./data";
import { useMotionValue, motion, animate, useTransform } from "motion/react";

const STATES = {
  active: {
    activeFill: "#45FF9C",
    activeStroke: "none",
    activeTextColor: "#023118",
  },
  due: { fill: "#0839FB", stroke: "none", textColor: "#D5DDFF" },
  done: { fill: "#FFDDF2", stroke: "#F18FCB", textColor: "#000000" },
  upcoming: { fill: "#000000", stroke: "none", textColor: "#FFFFFF" },
};

const MARGIN = { top: 20, right: 20, bottom: 60, left: 120 };
const SVG_WIDTH = 600;
const ROW_HEIGHT = 34;
const ROW_GAP = 12;
const ROW_RADIUS = 11;
const CIRCLE_RADIUS = 14;
const SVG_HEIGHT = MARGIN.top + topics.length * ROW_HEIGHT + MARGIN.bottom;

const PILL_WIDTH = 80;
const PILL_PADDING = 20; // gap from SVG left edge to pill
const AXIS_GAP = 20; // space between bottom bar and axis labels

const FONT_MD = 16;
const FONT_SM = 12;

const chartWidth = SVG_WIDTH - MARGIN.left - MARGIN.right;
// const chartHeight = SVG_HEIGHT - MARGIN.top - MARGIN.bottom;

const VISIBLE_DAYS = 7;
const COL_WIDTH = chartWidth / VISIBLE_DAYS; // width per column
const FADE = COL_WIDTH * 0.5;

const today = new Date();
const startDate = startOfMonth(today);
const endDate = endOfMonth(today);
const days = eachDayOfInterval({ start: startDate, end: endDate });
const TOTAL_DAYS = days.length;

const TOTAL_WIDTH = MARGIN.left + TOTAL_DAYS * COL_WIDTH + MARGIN.right;

const xScale = scaleBand()
  .domain(days.map((d) => format(d, "yyyy-MM-dd")))
  .range([0, TOTAL_DAYS * COL_WIDTH])
  .padding(0);

const TODAY_STR = format(new Date(), "yyyy-MM-dd");

const ChartCircle = ({ cx, cy, entry, x }) => {
  const isToday = entry.date === TODAY_STR;
  const style = STATES[entry.state];
  const fill = isToday ? STATES.active.activeFill : style.fill;
  const textColor = isToday ? STATES.active.activeTextColor : style.textColor;
  const stroke = isToday ? STATES.active.activeStroke : style.stroke;
  const visibleWidth = SVG_WIDTH - MARGIN.left - MARGIN.right;

  const scale = useTransform(x, (xVal) => {
    const pos = cx + xVal;
    if (pos <= 0 || pos >= visibleWidth) return 0;
    if (pos <= FADE) return pos / FADE;
    if (pos >= visibleWidth - FADE) return (visibleWidth - pos) / FADE;
    return 1;
  });

  return (
    <motion.g style={{ x: cx, y: cy, scale }}>
      <circle
        cx={0}
        cy={0}
        r={CIRCLE_RADIUS}
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
      />
      <text
        x={0}
        y={1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={FONT_MD}
        fontWeight={400}
        fill={textColor}
      >
        {entry.hours}
      </text>
    </motion.g>
  );
};

const TodayIndicator = ({ indicatorX, x }) => {
  const visibleWidth = SVG_WIDTH - MARGIN.left - MARGIN.right;

  const scaleX = useTransform(x, (xVal) => {
    const pos = indicatorX + xVal;
    if (pos <= 0 || pos >= visibleWidth) return 0;
    if (pos <= FADE) return pos / FADE;
    if (pos >= visibleWidth - FADE) return (visibleWidth - pos) / FADE;
    return 1;
  });

  return (
    <motion.g style={{ scaleX }}>
      <rect
        x={indicatorX - 6}
        y={0}
        width={CIRCLE_RADIUS * 2 + 12}
        height={topics.length * ROW_HEIGHT - ROW_GAP}
        fill="#FFFFFF"
        rx={0}
      />
    </motion.g>
  );
};

const AxisLabel = ({ d, axisX, yBase, x }) => {
  const visibleWidth = SVG_WIDTH - MARGIN.left - MARGIN.right;

  const opacity = useTransform(x, (xVal) => {
    const pos = axisX + xVal;
    if (pos <= 0 || pos >= visibleWidth) return 0;
    if (pos <= FADE) return pos / FADE;
    if (pos >= visibleWidth - FADE) return (visibleWidth - pos) / FADE;
    return 1;
  });

  return (
    <motion.g style={{ opacity }}>
      <text
        x={axisX}
        y={yBase}
        textAnchor="middle"
        fontSize={FONT_SM}
        fontWeight={400}
        fill="#111"
      >
        {format(d, "EEE")}
      </text>
      <text
        x={axisX}
        y={yBase + 14}
        textAnchor="middle"
        fontSize={FONT_SM}
        fill="#888"
      >
        {format(d, "d MMM")}
      </text>
    </motion.g>
  );
};

const DotChart = () => {
  const x = useMotionValue(0);
  const handleDragEnd = () => {
    const snapped = Math.round(x.get() / COL_WIDTH) * COL_WIDTH;
    const clamped = Math.max(-(TOTAL_WIDTH - SVG_WIDTH), Math.min(0, snapped));
    animate(x, clamped, { type: "spring", stiffness: 300, damping: 30 });
  };
  return (
    <div className="w-full min-h-screen bg-[#f0f0f0] text-[#050505] flex justify-center items-center">
      <div
        style={{
          width: SVG_WIDTH,
          height: SVG_HEIGHT,
          position: "relative",
          overflow: "hidden",
        }}
        className="rounded-3xl bg-[white]"
      >
        <motion.div
          drag="x"
          style={{
            x,
            touchAction: "none",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
          }}
          dragConstraints={{ left: -(TOTAL_WIDTH - SVG_WIDTH), right: 0 }}
          dragElastic={0.05}
          onDragEnd={handleDragEnd}
          whileHover={{ cursor: "grab" }}
          whileDrag={{ cursor: "grabbing" }}
        >
          <svg
            width={TOTAL_WIDTH}
            height={SVG_HEIGHT}
            draggable={false}
            className="rounded-2xl"
          >
            <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
              {(() => {
                const todayStr = format(new Date(), "yyyy-MM-dd");
                const todayX = xScale(todayStr);
                if (todayX === undefined) return null;
                return (
                  <TodayIndicator
                    indicatorX={todayX + xScale.bandwidth() / 2 - CIRCLE_RADIUS}
                    x={x}
                  />
                );
              })()}

              {topics.map((topic, i) => {
                return (
                  <g key={topic.name}>
                    {topic.entries.map((entry, id) => {
                      const entryX = xScale(entry.date);
                      if (entryX === undefined) return null;
                      const cx = entryX + xScale.bandwidth() / 2;
                      const barCenterY =
                        i * ROW_HEIGHT + (ROW_HEIGHT - ROW_GAP) / 2;
                      return (
                        <motion.g
                          key={id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            duration: 0.2,
                            ease: "easeOut",
                            delay: id * 0.1,
                          }}
                        >
                          <ChartCircle
                            key={entry.date}
                            cx={cx}
                            cy={barCenterY}
                            entry={entry}
                            x={x}
                          />
                        </motion.g>
                      );
                    })}
                  </g>
                );
              })}

              {days.map((d) => {
                const dateStr = format(d, "yyyy-MM-dd");
                const axisX = xScale(dateStr) + xScale.bandwidth() / 2;
                const yBase = topics.length * ROW_HEIGHT + AXIS_GAP;
                return (
                  <AxisLabel
                    key={dateStr}
                    d={d}
                    axisX={axisX}
                    yBase={yBase}
                    x={x}
                  />
                );
              })}
            </g>
          </svg>
        </motion.div>

        <svg
          style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
        >
          <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
            {topics.map((topic, i) => (
              <rect
                key={topic.name}
                x={0}
                y={i * ROW_HEIGHT}
                width={SVG_WIDTH - MARGIN.left - MARGIN.right}
                height={ROW_HEIGHT - ROW_GAP}
                rx={ROW_RADIUS}
                fill={topic.color}
              />
            ))}
          </g>
        </svg>

        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 3,
          }}
          width={MARGIN.left}
          height={SVG_HEIGHT}
        >
          <g transform={`translate(0, ${MARGIN.top})`}>
            {topics.map((topic, i) => {
              const cy = i * ROW_HEIGHT + (ROW_HEIGHT - ROW_GAP) / 2;
              const pillW = PILL_WIDTH;
              const pillH = ROW_HEIGHT - ROW_GAP;
              const pillX = PILL_PADDING;
              const pillY = cy - pillH / 2;

              return (
                <g key={topic.name}>
                  {/* pill background */}
                  <rect
                    x={pillX}
                    y={pillY}
                    width={pillW}
                    height={pillH}
                    rx={ROW_RADIUS}
                    fill={topic.color}
                  />
                  {/* label text centered in pill */}
                  <text
                    x={pillX + pillW / 2}
                    y={cy + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={FONT_SM}
                    fill="#333333"
                  >
                    {topic.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default DotChart;
