import React, { useEffect, useState } from "react";

const Test = () => {
  const [title, setTitle] = useState("loading...");
  const [count, setCount] = useState(0);
  console.log('component rendered!');

  useEffect(() => {
    const fetchData = async () => {
      let res = await fetch("https://jsonplaceholder.typicode.com/todos");
      let data = await res.json();
      setTitle(data[count].title);
    };
    fetchData();
  }, [count]);

  return (
    <p
      onClick={() => setCount((prev) => prev + 1)}
      style={{
        background: "blue",
        color: "white",
        fontSize: "2rem",
        padding: "4px 8px",
        borderRadius: "12px",
        userSelect: "none",
      }}
    >
      {title}
    </p>
  );
};

export default Test;
