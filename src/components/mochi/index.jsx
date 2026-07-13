import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import style from "./style.module.css";

const words = [ "component", "system", "layout", "prototype", "interaction", "spec", "token", "variant", "responsive", "breakpoint", "accessibility", "layer", "atomic", "pattern", "design", "engineer" ];
const colors = ["#272727", "#FFFFFE", "#1232FF"];

const Mochi = () => {
  const [chips, setChips] = useState([]);
  console.log('mochi rendered!');

  // useCallback: keeps removeChip's reference stable across re-renders.
  // Without this, every render creates a new function → every Chip sees a
  // changed onRemove prop and re-renders even though nothing about it changed.
  const removeChip = useCallback((id) => {
    setChips((prev) => prev.filter((chip) => chip.id !== id));
  }, []); // empty deps: safe because we use the functional form of setChips

  useEffect(() => {
    const interval = setInterval(() => {
      let newChip = {
        id: Math.random().toString(36).slice(2, 11),
        direction: Math.random() * 360 * 2,
        speed: Math.random() * 0.4 + 1.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: Math.random() * 0.4 + 0.4,
        lifespan: Math.random() * 2000 + 1000,
        word: words[Math.floor(Math.random() * words.length)],
      };

      setChips((prev) => [...prev, newChip]);
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={style.container}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 320,
          height: 320,
          borderRadius: "100%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle at 50% 50%, #47FF50 0%, #FDD9FF 60%, #F2F0EF 90%, #F2F0EF 100%)",
          filter: "blur(24px)",
          pointerEvents: "none",
        }}
      />
      <AnimatePresence>
        {chips.map((chip) => (
          <Chip key={chip.id} {...chip} onRemove={removeChip} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// memo: skips re-rendering this component when its props haven't changed.
// Each Chip's props are set once at creation and never change, so after
// mounting it will never re-render again — even when new chips are added.
const Chip = memo(({
  id,
  direction,
  speed,
  color,
  scale,
  lifespan,
  word,
  onRemove,
}) => {
  console.log('chip rendered!');

  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), lifespan);
    return () => clearTimeout(timer);
  }, [id, lifespan, onRemove]);

  // useMemo: these values derive purely from direction/speed which never change.
  // Wrapping them avoids re-running trig math on any future render that slips through.
  const { tx, ty } = useMemo(() => {
    const angleRad = (direction * Math.PI) / 180;
    const distance = speed * 100;
    return { tx: Math.cos(angleRad) * distance, ty: Math.sin(angleRad) * distance };
  }, [direction, speed]);

  return (
    <div className={style.chipWrapper}>
      <motion.div
        className={style.chip}
        style={{
          background: color,
          transform: "translate(-50%, -50%)",
        }}
        initial={{ scale: 0 }}
        animate={{ scale, x: tx, y: ty }}
        exit={{ scale: 0 }}   
        transition={{
          x: { duration: lifespan / 1000, ease: "easeOut" },
          y: { duration: lifespan / 1000, ease: "easeOut" },
          scale: { duration: 0.2 },
        }}
      >
        <p style={{ color: (color === colors[0] || color === colors[2]) ? "#fff" : "" }}>{word}</p>
   
      </motion.div>
    </div>
  );
});

export default Mochi;
