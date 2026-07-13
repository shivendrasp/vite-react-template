import { useEffect, useRef, useState } from "react";
import style from "./style.module.css";

const ITEMS = ["🍕", "🚀", "🌵", "🦄", "💡"];
const MAX_SCALE = 2;
const RANGE = 120;

export default function Dock() {
  const [showNemo, setShowNemo] = useState(true);
  const itemRefs = useRef([]);

  useEffect(() => {
    console.log("Dock component mounted");
    
    const handleMouseMove = (e) => {
      itemRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const distance = Math.abs(e.clientX - center);

        const scale =
          distance < RANGE
            ? MAX_SCALE - (distance / RANGE) * (MAX_SCALE - 1)
            : 1;

        el.style.width = `${56 * scale}px`;
        el.style.height = `${56 * scale}px`;
        el.style.transform = `translateY(${(scale - 1) * -86}px) rotate(${(scale - 1) * 12}deg)`;
      });
    };

    const handleMouseLeave = () => {
      itemRefs.current.forEach((el) => {
        if (!el) return;
        el.style.width = "56px";
        el.style.height = "56px";
        el.style.transform = `translateY(${0}px) rotate(${0}deg)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div className={style.dock} onClick={() => setShowNemo((prev) => !prev)}>
        {ITEMS.map((icon, i) => (
          <div
            key={i}
            ref={(el) => (itemRefs.current[i] = el)}
            className={style.dockItem}
          >
            {icon}
          </div>
        ))}
      </div>
      {showNemo && <Nemo />}
    </div>
  );
}

function Nemo() {
  const [message, setMessage] = useState(0);

  useEffect(() => {
    console.log("Nemo component mounted, effect ran");
    let tick = setInterval(() => {
      setMessage((prev) => prev + 1);
    }, 200);
    return () => {
      clearInterval(tick);
      console.log("Nemo effect cleanup was done!");
    };
  }, []);

  return (
    <p
      style={{
        background: "blue",
        padding: "4px 8px",
        display: "block",
        borderRadius: "8px",
      }}
    >
      {message}
    </p>
  );
}


/*
"A component function runs → JSX is read → virtual DOM is created"
Correct. The function executes and returns JSX. React converts that JSX into a tree of plain objects (React elements) — that's the virtual DOM.

---
"virtual DOM gets written to the real DOM"
Correct on first render. On re-renders, React diffs the new virtual DOM against the previous one first, then only writes the differences to the real DOM. This is called reconciliation.

---
"after all elements get on the real DOM, mount completes"
Correct.

---
"after first mount, useEffect fires (if [] dependency)"
Correct, but incomplete. [] is just one mode. useEffect has three forms:
- useEffect(fn, []) — runs once after mount
- useEffect(fn, [dep]) — runs after mount + whenever dep changes
- useEffect(fn) — runs after every render

---
"useEffect contains all JS stuff just like normal html/css/js"
Closer to: useEffect is for side effects — code that reaches outside React (fetch calls, DOM manipulation, timers, subscriptions). React keeps the render function pure; useEffect is where impure work goes.

---
"it can update state"
Correct, but note: updating state inside useEffect triggers a re-render immediately after.

---
"state changes → function re-renders top to bottom"
Correct. Also worth knowing: a parent re-rendering causes all its children to re-render too, even if their props didn't change.

---
"new JSX compared with old, only changed elements updated"
Correct — this i

---
"useEffect does not re-run, only ran at first mount"
True only for []unt], it re-runswhenever count changes. If no array, it re-runs every render.

---
"it keeps doing imes functionre-renders"
Slightly off. Thes. If it startedan async operation (like a fetch), that async operation continues indepelf is done. Reactdoesn't "keep it running."                                   
---                                                          "return for clea
Correct. The cleanup also runs before the effect re-runs (if dependencies cha

---
"function re-render and useEffect re-run are independent"
Correct for []. e linked — are-render caused by a dep change will also re-run the effect.  
---                                                            "re-render is chly"
Directionally correct. Re-renders are designed to be fast (just JS function caln't guaranteed —unnecessary re-renders add up. useEffect cost depends entirely on what's inside

---
"React only tracks state, so only state changes cause
re-renders"
Mostly correct. Two additions:
- Context changemponents thatconsume that context
- Parent re-rendven withoutstate/prop changes)

---
"local variablesref to persistdata"
Correct. useRef at survivesre-renders without causing them.

---
"ref gets populae useEffect"
Correct for DOM refs (ref={myRef} on an element). The .current is null during ract writes to theDOM. That's why you read DOM refs inside useEffect, not during
render.

---
What you're missing:

1. Two phases — React has a render phase (pure, calculates what
 changed) and a then fireseffects). useEffect fires after the commit phase.
2. useRef for vauses: persisting a value across renders, and holding a reference to a DOM element. Both wod.
3. React StrictMode (Vite default in dev) — intentionally runs your component fffects in therender phase. Explains double logs you saw earlier.         
Overall your model is good — the gaps are mostly around the dependency array commit model. */