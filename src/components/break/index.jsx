import { useState } from "react";

const Break = () => {
  console.log("component rendered!");
  const [val, setVal] = useState(4);
  return (
    <div className="bg-[blue] p-2 select-none" onClick={() => setVal((prev) => prev + 1)}>
      {Array.from({ length: val }).map((_, id) => {
        return (
          <p key={id} className="mt-1 bg-[#000000]">
            all good_
          </p>
        );
      })}
    </div>
  );
};

export default Break;
