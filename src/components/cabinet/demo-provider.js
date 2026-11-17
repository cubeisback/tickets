"use client";

import { createContext, useContext, useState } from "react";
import { initialOrders, initialProfile } from "@/data/cabinet";

const DemoContext = createContext(null);
export function DemoProvider({ children }) {
  const [orders, setOrders] = useState(initialOrders);
  const [profile, setProfile] = useState(initialProfile);
  function updateOrder(id, changes) {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, ...changes } : order)),
    );
  }
  function addOrder(order) {
    setOrders((current) => [order, ...current]);
  }
  return (
    <DemoContext.Provider value={{ orders, profile, setProfile, addOrder, updateOrder }}>
      {children}
    </DemoContext.Provider>
  );
}
export function useDemo() {
  return useContext(DemoContext);
}
