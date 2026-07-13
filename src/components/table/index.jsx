import React, { useState, useEffect } from "react";
import style from "./style.module.css";

const randomData = () => ({
  1: Math.floor(Math.random() * 6),
  2: Math.floor(Math.random() * 6),
  3: Math.floor(Math.random() * 6),
  4: Math.floor(Math.random() * 6),
  5: Math.floor(Math.random() * 6),
  6: Math.floor(Math.random() * 6),
  7: Math.floor(Math.random() * 6),
  8: Math.floor(Math.random() * 6),
  9: Math.floor(Math.random() * 6),
  10: Math.floor(Math.random() * 6),
});

const Table = () => {
  const [data, setData] = useState(randomData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(randomData());
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // const max = Math.max(...Object.values(data), 1);

  return (
    <table
      className={style.table}
    >
      <tbody>
        {Object.keys(data).map((coin) => (
          <tr key={coin}>
            {Array.from({ length: 6 }).map((_, i) => (
              <td
                key={i}
                style={{
                  background: i + 1 <= data[coin] ? "blue" : "#CCD2FF",
                  color: i + 1 <= data[coin] ? "lightsteelblue" : "#CCD2FF",
                }}
              >
                {i + 1 === data[coin] ? coin : "|"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};



export default Table;
