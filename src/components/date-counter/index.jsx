import { useState } from "react";

const DateCounter = () => {
  const date = new Date();
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(0);

  date.setDate(date.getDate() + count);
  const formattedResultDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-[gray] w-full min-h-screen flex flex-col justify-center items-center">
      <div className="w-80 flex flex-col gap-2 bg-white text-black p-2 items-stretch rounded-xl">
        <div className="flex items-center justify-between gap-2">
          <Button onClick={() => setStep((prev) => prev - 1)}>-</Button>
          Step: {step}
          <Button onClick={() => setStep((prev) => prev + 1)}>+</Button>
        </div>
        <div className="w-full h-px bg-black"></div>
        <div className="flex items-center justify-between gap-2">
          <Button onClick={() => setCount((prev) => prev - step)}>-</Button>
          Count: {count}
          <Button onClick={() => setCount((prev) => prev + step)}>+</Button>
        </div>
      </div>

      <div className="mt-4 text-4xl bg-[#1a3cff] text-[#c4e7ff] px-1 rounded-xl select-none">
        {count} days from today {count < 0 ? "was" : "is"} {formattedResultDate}
      </div>
    </div>
  );
};

const Button = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1 bg-black text-white rounded-sm hover:bg-[gray]"
    >
      {children}
    </button>
  );
};

export default DateCounter;
