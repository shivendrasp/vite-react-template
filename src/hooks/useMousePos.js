import { useEffect, useRef, useState } from "react";

export const useMousePos = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const rect = ref.current.getBoundingClientRect();
    const handleMouse = (e) => {
      if (ref.current) {
        setPos({
          x: e.clientX - rect.left - rect.width / 2,
          y: e.clientY - rect.top - rect.height / 2,
        });
      }
    };

    window.addEventListener("mousemove", handleMouse);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return { pos, ref };
};
