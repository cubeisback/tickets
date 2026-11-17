"use client";

import { createContext, useContext, useState } from "react";
import {
  EVENTS,
  ORDERS,
  USERS,
  REFUND_REQUESTS,
  LEGAL_ENTITIES,
  EVENT_FORMATS,
  EMAIL_TEMPLATES,
} from "@/data/admin";

const AdminContext = createContext(null);
export function AdminProvider({ children }) {
  const [events, setEvents] = useState(EVENTS);
  const [orders, setOrders] = useState(ORDERS);
  const [refunds, setRefunds] = useState(REFUND_REQUESTS);
  const [entities, setEntities] = useState(LEGAL_ENTITIES);
  const [formats, setFormats] = useState(EVENT_FORMATS);
  const [templates, setTemplates] = useState(EMAIL_TEMPLATES);
  const [notice, setNotice] = useState("");
  function reset() {
    setEvents(EVENTS);
    setOrders(ORDERS);
    setRefunds(REFUND_REQUESTS);
    setEntities(LEGAL_ENTITIES);
    setFormats(EVENT_FORMATS);
    setTemplates(EMAIL_TEMPLATES);
    setNotice("");
  }
  const updateEvent = (event) =>
    setEvents((list) => list.map((item) => (item.id === event.id ? event : item)));
  const updateOrder = (order) =>
    setOrders((list) => list.map((item) => (item.id === order.id ? order : item)));
  function resolveRefund(refund, status, comment) {
    setRefunds((list) =>
      list.map((item) => (item.id === refund.id ? { ...item, status, comment } : item)),
    );
    if (status === "approved")
      setOrders((list) =>
        list.map((order) =>
          order.id === refund.orderId
            ? {
                ...order,
                status: "refunded",
                participants: order.participants.map((item) => ({ ...item, status: "refunded" })),
              }
            : order,
        ),
      );
    setNotice(status === "approved" ? "Возврат одобрен" : "Заявка отклонена");
  }
  return (
    <AdminContext.Provider
      value={{
        events,
        setEvents,
        orders,
        setOrders,
        users: USERS,
        refunds,
        resolveRefund,
        entities,
        setEntities,
        formats,
        setFormats,
        templates,
        setTemplates,
        updateEvent,
        updateOrder,
        notify: setNotice,
        reset,
      }}
    >
      {children}
      {notice && (
        <div className="admin-notice" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Закрыть уведомление">
            ×
          </button>
        </div>
      )}
    </AdminContext.Provider>
  );
}
export function useAdmin() {
  return useContext(AdminContext);
}
export function newId(prefix = "item") {
  return `${prefix}-${crypto.randomUUID()}`;
}
