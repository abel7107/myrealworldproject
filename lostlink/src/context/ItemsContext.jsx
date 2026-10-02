import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../api/client";

const ItemsContext = createContext();

// Convert API item shape into the shape the UI expects
function normalizeItem(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    type: item.type === "LOST" ? "Lost" : "Found",
    location: item.location,
    date: item.dateLostOrFound
      ? new Date(item.dateLostOrFound).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
    imageUrl: item.imageUrl,
    status: item.status,
    contactName: item.contactName,
    contactPhone: item.contactPhone,
    ownerId: item.ownerId,
    category: item.category?.name || item.category || "Uncategorized",
  };
}

export function ItemsProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.getItems();
      setItems(data.map(normalizeItem));
    } catch {
      // keep previous items on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = async (newItem) => {
    const { data } = await api.createItem(newItem);
    setItems((prev) => [normalizeItem(data), ...prev]);
    return data;
  };

  const getItem = async (id) => {
    const { data } = await api.getItem(id);
    return normalizeItem(data);
  };

  const value = { items, loading, addItem, getItem, refresh };

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
}

export function useItems() {
  return useContext(ItemsContext);
}
