import React, { createContext, useContext } from "react";

// import { useClickAway } from "@uidotdev/usehooks";
import { useMouseEnter } from "../../hooks/useMouseEnter";
import { pizzaData } from "./data";

import style from "./style.module.css";

import focaccia from "./pizzas/focaccia.jpg";
import funghi from "./pizzas/funghi.jpg";
import margherita from "./pizzas/margherita.jpg";
import prosciutto from "./pizzas/prosciutto.jpg";
import salamino from "./pizzas/salamino.jpg";
import spinaci from "./pizzas/spinaci.jpg";

const images = { focaccia, funghi, margherita, prosciutto, salamino, spinaci };

const PizzaContext = createContext();
const PizzaMenu = () => {
  return (
    <PizzaContext.Provider value={{ id: 2345, price: "234$" }}>
      <div className={style.container}>
        <Header>The React Pizza Co.</Header>
        <Menu />
        <Footer />
      </div>
    </PizzaContext.Provider>
  );
};

const Header = (props) => {
  return (
    <header className={style.header}>
      <h1>{props.children}</h1>
    </header>
  );
};

const Menu = () => {
  // const pizzaData = [];
  const numOfPizzas = pizzaData.length;
  return (
    <main className={style.menu}>
      <h2>Our Menu</h2>
      {numOfPizzas > 0 ? (
        <>
          <p>try some delicious react pizzas</p>
          <div className={style.pizzas}>
            {pizzaData.map((pizza, id) => {
              return <Pizzas key={id} pizza={pizza} />;
            })}
          </div>
        </>
      ) : (
        <p>sorry we dont have any react pizzas</p>
      )}
    </main>
  );
};

const Pizzas = ({ pizza }) => {
  const info = useContext(PizzaContext);
  const [ref, mouseIn] = useMouseEnter();
  const img = images[pizza.photoName.split("/")[1].split(".")[0]];
  const out = pizza.soldOut;
  return (
    <div className={`${style.pizza} ${out ? style.soldout : ""}`} ref={ref}>
      <div>
        <img
          src={img}
          alt="pizza"
          style={mouseIn && !out ? { scale: 0.9 } : {}}
        />
        {out && <span>out of order</span>}
      </div>
      <div>
        <div>
          <h3 style={{ color: mouseIn && !out ? "tomato" : "inherit" }}>
            {pizza.name}
          </h3>
          <p>{pizza.ingredients}</p>
        </div>
        <p>{info.price}</p>
      </div>
    </div>
  );
};

const Footer = () => {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 24;
  const isOpen = hour >= openHour && hour <= closeHour;

  return (
    <footer className={style.footer}>
      <div className={style.order}>
        <IsOpen isOpen={isOpen} />
        <button className={style.btn}>click here</button>
      </div>
    </footer>
  );
};

const IsOpen = ({ isOpen }) => {
  if (isOpen) return <p className={style.open}>We're currently open!</p>;

  return <p className={style.close}>Sorry! We're currently closed</p>;
};

export default PizzaMenu;
