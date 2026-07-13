import { X } from "lucide-react";
import { useMotionValue, animate, motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef } from "react";

const FlashCard = () => {
  return (
    <div className="w-full min-h-screen bg-[#ffffff] text-black flex justify-center items-center relative">
      <Card />
    </div>
  );
};

const Card = () => {
  const [isOpen, setIsOpen] = useState(false);
  const rotateY = useMotionValue(0);
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current = animate(rotateY, 360, {
      duration: 3,
      repeat: Infinity,
      ease: "linear",
      repeatType: "loop", // jumps back to 0 seamlessly
    });
    return () => animationRef.current.stop();
  }, []);

  const handleClick = () => {
    animationRef.current?.stop();
    const angle = rotateY.get();
    const target = shortestPath(angle);
    animate(rotateY, target, {
      duration: 0.6,
      ease: [0.32, 0.72, 0, 1],
    });
    setIsOpen(true);
  };
  const handleClose = (e) => {
    e.stopPropagation(); // don't trigger handleClick
    setIsOpen(false);
    rotateY.set(0);
    animationRef.current = animate(rotateY, 360, {
      duration: 3,
      repeat: Infinity,
      ease: "linear",
      repeatType: "loop",
    });
  };

  function shortestPath(from, to = 0) {
    const normalized = ((from % 360) + 360) % 360;
    let diff = to - normalized;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return from + diff;
  }

  return (
    <div
      style={{ perspective: isOpen ? "none" : "5000px" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        className="overflow-hidden relative"
        style={{ rotateY }}
        animate={{
          width: isOpen ? 460 : 50,
          height: isOpen ? 380 : 50,
          borderRadius: isOpen ? 24 : 10,
          rotateX: isOpen ? 0 : -18,
          backgroundColor: isOpen ? "#FFA723" : "#FFA723",
        }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        onClick={!isOpen ? handleClick : undefined}
      >
        <AnimatePresence>
          {!isOpen && (
            <>
              {/* depth gradient overlay */}
              <motion.div
                key="depth"
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 55%, rgba(0,0,0,0.1) 100%)",
                }}
              />
              {/* light beam sweep */}
              <motion.div
                key="shine"
                className="absolute inset-0 pointer-events-none"
                exit={{ opacity: 0 }}
                animate={{ x: ["-180%", "180%"] }}
                transition={{
                  x: {
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                    ease: "easeInOut",
                  },
                }}
                style={{
                  background:
                    "linear-gradient(105deg, transparent 28%, #FFFFFFD9 50%, transparent 72%)",
                }}
              />
            </>
          )}
        </AnimatePresence>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0, duration: 0.2 }}
            className="w-full h-full flex flex-col justify-start items-stretch select-none"
          >
            <div className="h-60 relative">
              <img
                src="./vanished.png"
                alt="game_thumbnail"
                className="w-full h-full object-cover object-[0%_65%]"
              />
              {/* <div className="w-full h-24 absolute bottom-0 bg-[#ffffff07] mask-t-from-20% backdrop-blur-xl"></div> */}
              <div
                className="absolute right-2 top-2 w-8 h-8 flex justify-center items-center bg-[#ffffff25] rounded-full cursor-pointer backdrop-blur-sm"
                onClick={handleClose}
              >
                <X color="#FFFFFFA9" size={20} />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between items-stretch p-4 bg-[#1B1B1B]">
              <div className="flex flex-col items-stretch gap-1">
                <h3 className="text-xl text-[#F2F0EF] leading-[100%]">
                  Your game is ready to download
                </h3>
                <p className="text-[#66615E] text-md">
                  pick your OS to download
                </p>
              </div>
              <div className="grid grid-cols-5 gap-2 border-t border-[#ffffff1b] pt-2">
                <Button label="Windows" />
                <Button label="MacOS" />
                <Button label="Linux" />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const Button = ({ label }) => {
  return (
    <button className="bg-[#1a1aff] text-white text-sm h-8 rounded-lg border border-[#7d7dff] shadow-[0px_1px_0px_1px_#4444ff] cursor-pointer hue-rotate-180 hover:invert">
      {label}
    </button>
  );
};

export default FlashCard;
