import { useEffect, useRef, useState } from "react";
import { X, Box } from "lucide-react";
import style from "./style.module.css";
import { AnimatePresence, motion } from "motion/react";

const messages = [
  "Design Engineer",
  "Design System",
  "Prototyping",
  "Animations",
  "Interactions",
  "Motion System",
  "Accesibility",
];

const Steps = () => {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);
  const ref = useRef([]);

  useEffect(() => {
    if (!ref.current[0] || !ref.current[1]) return;

    const previuos = () => setStep((prev) => Math.max(1, prev - 1));
    const next = () => setStep((prev) => Math.min(messages.length, prev + 1));

    ref.current[0].addEventListener("click", previuos);
    ref.current[1].addEventListener("click", next);

    return () => {
      ref.current[0].removeEventListener("click", previuos);
      ref.current[1].removeEventListener("click", next);
    };
  }, [isOpen]);

  return (
    <div
      className={`w-full min-h-screen bg-[#d8d8d8] text-black flex justify-center items-center ${style.container}`}
    >
      <div className={style.close} onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Box />}</div>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div className={style.steps} key={'steps'}
            initial={{
              scale: 0,
              y: 0,
              opacity: 0
            }}
            animate={{
              scale: 1,
              y: [0, -10, 0],
              opacity: 1,
              transition: { y: { repeat: Infinity, repeatType: "loop", duration: 2, ease: "easeInOut" } }
            }}
            exit={{
              scale: 0,
              y: 0,
              opacity: 0
            }}
          >
            {step > 0 ? (
              <>
                <div className={`${style.numbers}`}>
                  {messages.map((message, id) => {
                    return (
                      <div className={step >= id + 1 ? style.active : ""} key={id}>
                        {id + 1}
                        <div></div>
                      </div>
                    );
                  })}
                </div>

                <div className={style.message}>
                  <p>web needs more</p>
                  {messages[step - 1]}
                </div>

                <div className={style.buttons}>
                  <button
                    className="bg-[#3842ff] text-white"
                    ref={(el) => (ref.current[0] = el)}
                  >
                    <span>←</span>Previuos
                  </button>
                  <button
                    className="bg-[#3842ff] text-white"
                    ref={(el) => (ref.current[1] = el)}
                  >
                    Next<span>→</span>
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center flex justify-center items-center gap-2">
                sorry nothing to show <span className="text-xl">😪</span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Steps;
