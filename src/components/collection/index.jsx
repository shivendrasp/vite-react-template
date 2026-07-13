import { motion, useMotionValue, useTransform, animate, useMotionTemplate } from "motion/react";
import { useEffect, useState, useRef } from "react";

function bezier(t, A, C, B) {
  const x = (1 - t) ** 2 * A.x + 2 * (1 - t) * t * C.x + t ** 2 * B.x;
  const y = (1 - t) ** 2 * A.y + 2 * (1 - t) * t * C.y + t ** 2 * B.y;
  return { x, y };
}

function lerp(a, b, p) {
  return a + (b - a) * p;
}

const images = [
  "https://images.unsplash.com/photo-1770954001166-2945c5433f85?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1780182309636-6b3eba4f37f2?q=80&w=1011&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1782149149482-51814650afd7?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1780182309635-990aea44c255?q=80&w=1014&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1778469841603-e0e622042ffb?q=80&w=2087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1778596301893-f919b121dd43?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

function Particle({ src, C, A, B, onComplete }) {
  const t = useMotionValue(0);

  const x = useTransform(t, (v) => bezier(v, A, C, B).x);
  const y = useTransform(t, (v) => bezier(v, A, C, B).y);
  const morph = useTransform(t, (v) => Math.sin(v * Math.PI));

  const width = useTransform(morph, (m) => lerp(4, 100, m));
  const height = useTransform(morph, (m) => lerp(4, 100, m));
  const radius = useTransform(morph, (m) => lerp(50, 14, m));
  const imgOpacity = useTransform(morph, (m) => Math.max(0, (m - 0) / 0.7));
  const scale = useTransform(t, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);
  const blurAmount = useTransform(morph, (m) => lerp(4, 0, m));
  const blur = useMotionTemplate`blur(${blurAmount}px)`;

  useEffect(() => {
    animate(t, 1, {
      duration: 1.4,
      ease: "ease-in",
      onComplete: onComplete,
    });
  }, []);

  return (
    <motion.div
      style={{ x, y, width, height, borderRadius: radius, scale, filter: blur }}
      className="absolute top-0 left-0 bg-[#ff6b5a] -translate-x-1/2 -translate-y-1/2 overflow-hidden"
    >
      <motion.img
        src={src}
        style={{ opacity: imgOpacity }}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}

const Point = ({ letter, mx, my }) => {
  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ x: mx, y: my, left: 0, top: 0 }}
      className="w-6 h-6 flex items-center justify-center bg-black text-white font-regular rounded-lg text-lg absolute select-none cursor-grab z-100"
    >
      {letter}
    </motion.div>
  );
};

const Collection = () => {
  const [particles, setParticles] = useState([]);
  const aX = useMotionValue(208);
  const aY = useMotionValue(224);
  const bX = useMotionValue(480);
  const bY = useMotionValue(480);
  const counter = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const imgIndex = counter.current % images.length;
      const id = counter.current++;
      const curA = { x: aX.get(), y: aY.get() };
      const curB = { x: bX.get(), y: bY.get() };

      setParticles((prev) => [
        ...prev,
        {
          id,
          src: images[imgIndex],
          A: curA,
          B: curB,
          C: {
            x: (curA.x + curB.x) / 2 + (Math.random() - 0.5) * 260,
            y: curA.y - 150 - Math.random() * 250,
          },
        },
      ]);
    }, 100); // â closes setInterval

    return () => clearInterval(interval); // â this belongs to useEffect, not setInterval
  }, []);

  const remove = (id) =>
    setParticles((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className=" w-full min-h-screen relative bg-[#e8e8e8]">
      <Point letter="A" mx={aX} my={aY} />
      <Point letter="B" mx={bX} my={bY} />
      {particles.map((p) => (
        <Particle
          key={p.id}
          src={p.src}
          A={p.A}
          B={p.B}
          C={p.C}
          onComplete={() => remove(p.id)}
        />
      ))}
    </div>
  );
};

export default Collection;
