import React, { useState } from "react";
import { motion } from "motion/react";

const questions = [
  {
    id: 1,
    question: "What is the virtual DOM in React?",
    answer:
      "The virtual DOM is a lightweight representation of the real DOM. React uses it to optimize rendering by keeping it in memory and syncing it with the real DOM using a diffing algorithm.",
  },
  {
    id: 2,
    question:
      "Explain the difference between a controlled and uncontrolled component in React.",
    answer:
      "A controlled component's value is managed by React state, while an uncontrolled component manages its own state internally using refs.",
  },
  {
    id: 3,
    question:
      "How do you memoize a function in React to prevent unnecessary renders?",
    answer:
      "You can use the useCallback hook to memoize a function, so it only changes if its dependencies change.",
  },
  {
    id: 4,
    question: "What does the useEffect hook do?",
    answer:
      "The useEffect hook allows you to perform side effects in function components, such as fetching data, direct DOM manipulation, or setting up subscriptions.",
  },
  {
    id: 5,
    question: "How can you prevent a component from re-rendering in React?",
    answer:
      "You can use React.memo for functional components or shouldComponentUpdate for class components to prevent unnecessary re-renders.",
  },
  {
    id: 6,
    question: "What is prop drilling and how can it be avoided?",
    answer:
      "Prop drilling is passing data through many component levels. It can be avoided using context API or state management libraries like Redux.",
  },
  {
    id: 7,
    question: "How do you create a custom hook in React?",
    answer:
      "A custom hook is a function that starts with 'use' and can call other hooks inside, enabling you to reuse stateful logic between components.",
  },
  {
    id: 8,
    question: "What is the key prop and why is it important in lists?",
    answer:
      "The key prop is a unique identifier for each element in a list, helping React identify which items have changed, added, or removed for efficient updates.",
  },
  {
    id: 9,
    question: "Explain the difference between useState and useReducer hooks.",
    answer:
      "useState is good for simple state values, while useReducer is suited for more complex state logic or when the next state depends on the previous one.",
  },
  {
    id: 10,
    question: "What is context in React and how do you use it?",
    answer:
      "Context provides a way to pass data through the component tree without manually passing props at every level. Use React.createContext and the Provider/Consumer components or useContext hook.",
  },
];

const colors = { accent: "#DFE5FF", accent_dark: "#052FFF" };

const FlashCard = () => {
  const [selected, setSetSelected] = useState(3);
  return (
    <div
      className="w-full min-h-screen bg-[#1a1a1a] text-black grid grid-cols-3 gap-2 p-4"
      style={{
        perspective: "8000px",
        perspectiveOrigin: "0% -100%",
      }}
    >
      {questions.map((question) => (
        <motion.div
          key={question.id}
          className={`w-full h-60 relative select-none`}
          onClick={() => setSetSelected(question.id !== selected ? question.id : null)}
          style={{
            transformStyle: "preserve-3d",
          }}
          initial={{
            transform:
              selected == question.id ? "rotateY(-180deg)" : "rotateY(0deg)",
          }}
          animate={{
            transform:
              selected == question.id ? "rotateY(-180deg)" : "rotateY(0deg)",
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="w-full h-full bg-linear-to-t from-[#313131] to-[#494949] flex justify-center items-center rounded-2xl">
            <p className="max-w-[80%] text-center text-sm text-white">
              {question.question}
            </p>
          </div>
          <div
            className={`absolute inset-0 flex justify-center items-center rounded-2xl border-8 border-[#313131] -translate-z-px -scale-x-100`}
            style={{ background: colors.accent_dark }}
          >
            <div
              className="max-w-[80%] text-center text-sm p-2 relative"
              style={{
                background: colors.accent,
                color: colors.accent_dark,
              }}
            >
              <div
                className="w-4 h-4 absolute -top-2 -left-2"
                style={{ background: colors.accent }}
              ></div>
              <div
                className="w-4 h-4 absolute -bottom-2 -right-2"
                style={{ background: colors.accent }}
              ></div>
              {question.answer}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FlashCard;
