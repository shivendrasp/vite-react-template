import React, { useState } from "react";
import style from "./style.module.css";
import { X, Check, Trash, Package } from "lucide-react";

const initialItems = [
  { id: 1, desc: "Passports", quantity: 2, packed: false },
  { id: 2, desc: "Socks", quantity: 12, packed: false },
  { id: 3, desc: "Toothbrush", quantity: 2, packed: true },
  { id: 4, desc: "Phone Charger", quantity: 1, packed: false },
  { id: 5, desc: "Sunscreen", quantity: 1, packed: false },
  { id: 6, desc: "Shorts", quantity: 3, packed: false },
  { id: 7, desc: "Hat", quantity: 1, packed: true },
  { id: 8, desc: "T-Shirts", quantity: 5, packed: false },
  { id: 9, desc: "Sunglasses", quantity: 1, packed: false },
  { id: 10, desc: "Camera", quantity: 1, packed: false },
  { id: 11, desc: "Swimsuit", quantity: 2, packed: true },
  { id: 12, desc: "Book", quantity: 1, packed: false },
];

const TravelList = () => {
  const [items, setItems] = useState(initialItems);

  const addItem = (item) => {
    setItems((prev) => [...prev, item]);
  };
  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };
  const setDone = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id == id ? { ...item, packed: !item.packed } : item,
      ),
    );
  };
  const clearAll = () => {
    setItems([]);
  };
  const doneAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, packed: true })));
  };

  return (
    <div className={style.app}>
      <Logo />
      <Form addItem={addItem} />
      <PackingList
        items={items}
        removeItem={removeItem}
        setDone={setDone}
        clearAll={clearAll}
        doneAll={doneAll}
      />
      <Stats items={items} />
    </div>
  );
};

const Logo = () => {
  return <h1>🧳 Far Away 🌴</h1>;
};

const Form = ({ addItem }) => {
  const [desc, setDesc] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!desc) return;
    const newItem = { id: Date.now(), desc, quantity, packed: false };
    addItem(newItem);

    setDesc("");
    setQuantity(1);
  };

  return (
    <div className={style.addform}>
      <form onSubmit={handleSubmit}>
        <h3>What do you need for your trip?</h3>
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <option value={num} key={num}>
              {num}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Item..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button>Add</button>
      </form>
    </div>
  );
};

const PackingList = ({ items, removeItem, setDone, clearAll, doneAll }) => {
  return (
    <div className={style.list}>
      <ul>
        {items.map((item) => (
          <Item
            item={item}
            key={item.id}
            removeItem={removeItem}
            setDone={setDone}
          />
        ))}
      </ul>
      <div className="w-full flex justify-center items-center gap-1">
        <button onClick={() => clearAll()}>
          clear all <Trash size={16} />
        </button>
        <button onClick={() => doneAll()}>
          packed all <Package size={16} />
        </button>
      </div>
    </div>
  );
};

const Item = ({ item, removeItem, setDone }) => {
  return (
    <li style={{ background: item.packed ? "hotpink" : "var(--foreground)" }}>
      <div className="flex items-center gap-2">
        <span className={style.quantity}>{item.quantity}</span>
        <span style={{ textDecoration: item.packed ? "line-through" : "none" }}>
          {item.desc}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => removeItem(item.id)}>
          <X size={20} color="var(--surface)" />
        </button>
        <button
          onClick={() => setDone(item.id)}
          style={{ background: item.packed ? "hotpink" : "#464646" }}
        >
          <Check size={20} color="var(--surface)" />
        </button>
      </div>
    </li>
  );
};

const Stats = ({ items }) => {
  const total_items = items.length;
  const packed_items = items.filter((item) => item.packed).length;
  const packed_percentage = total_items
    ? Math.round((packed_items / total_items) * 100)
    : 0;
  return (
    <footer className={style.stats}>
      You have X items on your list, and you already packed{" "}
      <span>{packed_items}</span> items (<span>{packed_percentage}%</span>)
    </footer>
  );
};

export default TravelList;
