import { useAnimate } from "motion/react";

const Mia = () => {
  return (
    <div className="bg-[#101010] w-full h-screen flex justify-center items-center">
      <div className="text-white text-2xl flex items-center gap-1">
        build great
        <Cuboid string={"things"} />
        on the
        <Cuboid string={"web"} />
      </div>
    </div>
  );
};

const Cuboid = ({ string }) => {
  const h = 36; // matches text-4xl line-height (2.5rem)
  const [scope, animate] = useAnimate();

  const faces = [
    { angle: 0, bg: "#292929", text: "#FFFFFF" },
    { angle: 90, bg: "#0A0A0A", text: "#FFFFFF" },
    { angle: 180, bg: "#292929", text: "#FFFFFF" },
    { angle: 270, bg: "#0A0A0A", text: "#9A9A9A" },
  ];

  const handleClick = async () => {
    // spin forward one full rotation
    await animate(
      scope.current,
      {
        rotateX: 180,
        rotateY: [0, 4, 0, 0,  0],
      },
      { duration: 1, ease: [0, 0, 0.2, 1] },
    );
    // 360° looks identical to 0° — reset instantly so the next click works

    animate(scope.current, { rotateX: 0, rotateY: 0 }, { duration: 0 });
  };

  return (
    <span
      style={{ perspective: "8000px" }}
      onClick={handleClick}
      className="cursor-pointer select-none flex flex-col justify-center items-center"
    >
      <span
        ref={scope}
        style={{
          display: "inline-block",
          position: "relative",
          transformStyle: "preserve-3d",
          height: h,
        }}
      >
        {/* Ghost â invisible, just establishes container width */}
        <span className="px-2 invisible select-none" aria-hidden="true">
          {string}
        </span>

        {/* All 4 faces â all absolutely positioned, all same size */}
        {faces.map((face, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: "1px",
              transform: `rotateX(${face.angle}deg) translateZ(${h / 2}px)`,
              background: face.bg,
              color: face.text,
              boxShadow: "inset 0 -12px 24px 0 #FFFFFF8D"
            }}
            className="px-2"
          >
            {string}
          </span>
        ))}
      </span>
    </span>
  );
};

export default Mia;
