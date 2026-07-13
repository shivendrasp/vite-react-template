import { useEffect, useState } from "react";

const letters = Array.from({ length: 94 }, (_, i) => String.fromCharCode(i + 33));

const TypeEffect = () => {
  const [letter, setLetter] = useState([]);
  useEffect(() => {
    let tick = setInterval(() => {
      let newLetter = letters[Math.floor(Math.random() * letters.length)];
      if(letter.length < 12) {
      setLetter(prev => [...prev, newLetter])
      } else {
        setLetter([])
      }
    }, 100)

    return () => clearInterval(tick);
  }, [letter]);
  return (
    <div className="bg-linear-to-b from-[#ff0a0a] to-[#3a020272] text-[#ffffff] font-normal px-2 min-h-8 flex items-center rounded-lg border-2 border-black shadow-[0px_0px_0px_1px_#fff] relative">
      {letter}
      <Dot />
    </div>
  )
}

const Dot = () => {
  return <div className="w-4 h-4 rounded-full bg-white flex justify-center items-center text-black text-xs absolute right-0 top-0 translate-x-1/2 -translate-y-1/2">{new Date().getSeconds()}</div>
}

export default TypeEffect

/*
Explaination --->

First Mount
1. Fun() called → letter initialized as []
2. useEffect registered, not yet run
3. JSX calculated → DOM painted with [] (nothing visible)
4. Effect runs → setInterval attached (tick1)

---
tick1 fires (100ms later)

5. letter.length === 0 → < 12 → setLetter([...prev, newChar])
6. React schedules re-render

---
Re-render

7. Fun() called again → letter reads current state ['!'] (not [])
8. useEffect registered, not yet run
9. JSX calculated → DOM painted with ['!'] (char visible)
10. React compares deps → letter changed → cleanup runs → clearInterval(tick1)
11. New effect runs → setInterval attached (tick2)

---
tick2 fires (100ms later)

12. letter.length === 1 → < 12 → setLetter([...prev, newChar])
13. Back to step 7, repeat until length === 12

---
When length hits 12

14. else branch → setLetter([]) → re-render → DOM clears → back to step 7 with []

*/