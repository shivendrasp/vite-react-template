import { useState, useEffect, useRef } from "react";

export const useMouseEnter = () => {
  let ref = useRef(null);
  let [mouseIn, setMouseIn] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const handleMouseEnter = () => setMouseIn(true);
      ref.current.addEventListener("mouseenter", handleMouseEnter);

      const handleMouseLeave = () => setMouseIn(false);
      ref.current.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        ref.current.removeEventListener("mouseenter", handleMouseEnter);
        ref.current.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);
  return [ref, mouseIn];
};
