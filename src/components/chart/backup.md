import { scaleBand } from "d3";
import { eachDayOfInterval, format } from "date-fns";

const topics = [
  {
    name: "React",
    color: "#E8EFFF",
    entries: [
      { date: "2025-06-01", hours: 24, state: "done" },
      { date: "2025-06-05", hours: 7, state: "due" },
      { date: "2025-06-07", hours: 4, state: "upcoming" },
    ],
  },
  {
    name: "CSS",
    color: "#ECECEC",
    entries: [
      { date: "2025-06-03", hours: 9, state: "done" },
      { date: "2025-06-04", hours: 24, state: "done" },
      { date: "2025-06-05", hours: 3, state: "due" },
      { date: "2025-06-07", hours: 24, state: "upcoming" },
    ],
  },
  {
    name: "Typescript",
    color: "#FFEE06",
    entries: [
      { date: "2025-06-02", hours: 7, state: "done" },
      { date: "2025-06-04", hours: 3, state: "done" },
      { date: "2025-06-05", hours: 24, state: "due" },
    ],
  },
  {
    name: "Motion",
    color: "#EFE1FF",
    entries: [
      { date: "2025-06-03", hours: 24, state: "done" },
      { date: "2025-06-05", hours: 24, state: "due" },
    ],
  },
  {
    name: "SVG",
    color: "#E8EFFF",
    entries: [
      { date: "2025-06-04", hours: 24, state: "done" },
      { date: "2025-06-05", hours: 24, state: "due" },
      { date: "2025-06-06", hours: 24, state: "due" },
    ],
  },
  {
    name: "Three",
    color: "#ECECEC",
    entries: [
      { date: "2025-06-02", hours: 24, state: "done" },
      { date: "2025-06-04", hours: 24, state: "done" },
      { date: "2025-06-07", hours: 24, state: "due" },
    ],
  },
  {
    name: "Next",
    color: "#EFE1FF",
    entries: [
      { date: "2025-06-02", hours: 24, state: "done" },
      { date: "2025-06-03", hours: 24, state: "done" },
      { date: "2025-06-05", hours: 7, state: "due" },
      { date: "2025-06-06", hours: 6, state: "due" },
      { date: "2025-06-07", hours: 24, state: "upcoming" },
    ],
  },
];

const STATES = {
  done: { fill: "#9CFF99", stroke: "#29BD25", textColor: "#000000" },
  due: { fill: "#343434", stroke: "none", textColor: "#FFFFFF" },
  upcoming: { fill: "#FFFFFF", stroke: "#000000", textColor: "#000000" },
};

const MARGIN = { top: 20, right: 20, bottom: 60, left: 120 };
const SVG_WIDTH = 600;
const ROW_HEIGHT = 32;
const ROW_GAP = 12;
const ROW_RADIUS = 10;
const CIRCLE_RADIUS = 10;
const SVG_HEIGHT = MARGIN.top + topics.length * ROW_HEIGHT + MARGIN.bottom;

const chartWidth = SVG_WIDTH - MARGIN.left - MARGIN.right;
// const chartHeight = SVG_HEIGHT - MARGIN.top - MARGIN.bottom;

const days = eachDayOfInterval({
  start: new Date("2025-06-01"),
  end: new Date("2025-06-07"),
});

const xScale = scaleBand()
  .domain(days.map((d) => format(d, "yyyy-MM-dd")))
  .range([0, chartWidth])
  .padding(0);

const DotChart = () => {
  return (
    <div className="w-full min-h-screen bg-[#e4e4e4] text-[#050505] flex justify-center items-center">
      <svg width={SVG_WIDTH} height={SVG_HEIGHT} className="bg-white rounded-2xl">
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          {topics.map((topic, i) => {
            return (
              <g key={topic.name}>
                <rect
                  x={0}
                  y={i * ROW_HEIGHT}
                  width={chartWidth}
                  height={ROW_HEIGHT - ROW_GAP}
                  rx={ROW_RADIUS}
                  fill={topic.color}
                />
                {topic.entries.map((entry) => {
                  const cx = xScale(entry.date) + xScale.bandwidth() / 2;
                  const style = STATES[entry.state];
                  const barCenterY = i * ROW_HEIGHT + (ROW_HEIGHT - ROW_GAP) / 2;

                  return (
                    <g key={entry.date}>
                      <circle
                        cx={cx}
                        cy={barCenterY}
                        r={CIRCLE_RADIUS}
                        fill={style.fill}
                        stroke={style.stroke}
                        strokeWidth={1}
                      />
                      <text
                        x={cx}
                        y={barCenterY + 1}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={10}
                        fontWeight={400}
                        fill={style.textColor}
                      >
                        {entry.hours}
                      </text>
                    </g>
                  );
                })}
              </g>
            )})}

          {days.map((d) => {
            const dateStr = format(d, "yyyy-MM-dd");
            const x = xScale(dateStr) + xScale.bandwidth() / 2;
            const yBase = topics.length * ROW_HEIGHT + 20; // 20px gap below bars

            return (
              <g key={dateStr}>
                <text
                  x={x}
                  y={yBase}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={400}
                  fill="#111"
                >
                  {format(d, "EEE")} {/* â "Mon", "Tue" */}
                </text>
                <text
                  x={x}
                  y={yBase + 14}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#888"
                >
                  {format(d, "d MMM")} {/* â "2 Jun" */}
                </text>
              </g>
            );
          })}

          {topics.map((topic, i) => {
            const cy = i * ROW_HEIGHT + (ROW_HEIGHT - ROW_GAP) / 2;
            const pillW = 90;
            const pillH = ROW_HEIGHT - ROW_GAP;
            const pillX = -(MARGIN.left - MARGIN.right);
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
                  fontSize={12}
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
  );
};

export default DotChart;
