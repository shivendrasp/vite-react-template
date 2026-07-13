import React from "react";

const Lev = () => {
  return <GradientBox />;
};

const GradientBox = () => {
  return (
    <div className="flex size-60 items-start justify-center bg-[#ff4a4a] pt-4">
      <div className="size-40 bg-linear-to-b from-black to-[#6f6f6f]" />
      <Chip />
    </div>
  );
};

const Chip = () => {
  return (
    <div className="size-10 bg-white"></div>
  )
}

export default Lev;
