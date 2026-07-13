import React from "react";
import style from "./style.module.css";

const Block = ({ children }) => {
  return <div className={style.block}>{children}</div>;
};

export default Block;