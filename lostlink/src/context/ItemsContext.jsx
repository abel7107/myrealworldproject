import { createContext, useContext, useState } from "react";
import itemsData from "../data/items";

const ItemsContext = createContext();

export function ItemsProvider({ children }) {
  const [items, setItems] = useState(itemsData);

  const addItem = (newItem) => {
    const item = {
      ...newItem,
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
    setItems((prev) => [item, ...prev]);
  };

  const getItem = (id) => items.find((item) => item.id === Number(id));

  return (
    <ItemsContext.Provider value={{ items, addItem, getItem }}>
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  return useContext(ItemsContext);
}