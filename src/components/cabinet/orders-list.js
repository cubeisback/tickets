"use client";

import { assetPath } from "@/lib/paths";
import { useState } from "react";
import Link from "@/components/ui/app-link";
import { useDemo } from "./demo-provider";
import { events } from "@/data/events";
import { statuses, paymentLabels, formatPrice } from "@/data/cabinet";
import { SelectField } from "@/components/ui/select-field";
import { StatusBadge } from "@/components/ui/status-badge";

export function OrdersList() {
  const { orders } = useDemo();
  const [filter, setFilter] = useState("all");
  const visible = orders.filter((order) => filter === "all" || order.status === filter);
  return (
    <>
      <SelectField
        id="order-status"
        aria-label="Статус заказа"
        className="orders-filter"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        options={[
          { value: "all", label: "Все статусы" },
          ...Object.entries(statuses).map(([value, label]) => ({ value, label })),
        ]}
      />
      <div className="orders-list panel">
        {visible.length ? (
          visible.map((order) => (
            <Link className="order-row" key={order.id} href={`/cabinet/orders/${order.id}`}>
              <div className="order-row__info">
                <h2 className="order-row__title">
                  Заказ №{order.id} · {events.find((event) => event.id === order.eventId).title}
                </h2>
                <p className="order-row__description">
                  {order.shortDate} · {order.participants.length} билет(ов) ·{" "}
                  {paymentLabels[order.paymentMethod]}
                </p>
              </div>
              <div className="order-row__meta">
                <StatusBadge status={order.status} />
                <strong>{formatPrice(order.sum)}</strong>
                <img src={assetPath("/assets/cabinet/b4138.svg")} alt="" width="16" height="16" />
              </div>
            </Link>
          ))
        ) : (
          <p className="panel__description">Заказов с таким статусом нет</p>
        )}
      </div>
    </>
  );
}
