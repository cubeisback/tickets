"use client";
import { useState } from "react";
import Link from "@/components/ui/app-link";
import { useAdmin } from "./admin-provider";
import { Heading, Panel, Stat, Select, Tabs, Table, Badge } from "./admin-ui";
import { formatPrice, currentPrice, dateKey } from "@/data/admin";

export function SalesChart({ eventId, metric }) {
  const { orders } = useAdmin();
  const grouped = new Map();
  orders
    .filter((order) => order.eventId === eventId && order.status === "paid")
    .forEach((order) => {
      const point = grouped.get(order.date) || {
        label: order.date.slice(0, 5),
        date: order.date,
        tickets: 0,
        sum: 0,
      };
      point.tickets += order.participants.length;
      point.sum += order.sum;
      grouped.set(order.date, point);
    });
  const values = [...grouped.values()].sort((a, b) => dateKey(a.date) - dateKey(b.date));
  const max = Math.max(1, ...values.map((point) => point[metric]));
  const points = values
    .map(
      (point, index) =>
        `${50 + (index * 700) / Math.max(values.length - 1, 1)},${215 - (point[metric] / max) * 170}`,
    )
    .join(" ");
  return values.length ? (
    <div className="admin-chart">
      <svg
        viewBox="0 0 800 260"
        role="img"
        aria-label={metric === "tickets" ? "Динамика продаж билетов" : "Динамика суммы продаж"}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <line x1="50" x2="750" y1={45 + i * 42.5} y2={45 + i * 42.5} stroke="#e2e5ec" />
            <text x="2" y={49 + i * 42.5}>
              {Math.round((max * (4 - i)) / 4).toLocaleString("ru-RU")}
            </text>
          </g>
        ))}
        <polygon points={`50,215 ${points} 750,215`} fill="#5876e61a" />
        <polyline points={points} fill="none" stroke="#5876e6" strokeWidth="3" />
        {values.map((point, i) => (
          <g key={point.label}>
            <circle
              cx={50 + (i * 700) / Math.max(values.length - 1, 1)}
              cy={215 - (point[metric] / max) * 170}
              r="4"
              fill="#5876e6"
            >
              <title>{`${point.label}: ${metric === "sum" ? formatPrice(point.sum) : point.tickets}`}</title>
            </circle>
            <text x={50 + (i * 700) / Math.max(values.length - 1, 1)} y="245" textAnchor="middle">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  ) : (
    <p className="admin-empty">Продаж пока нет</p>
  );
}
export function EventStatistics({ event }) {
  const { orders } = useAdmin();
  const [metric, setMetric] = useState("tickets");
  const list = orders.filter((order) => order.eventId === event.id);
  const paid = list.filter((order) => order.status === "paid");
  const pending = list.filter((order) => order.status === "pending");
  const revenue = paid.reduce((sum, order) => sum + order.sum, 0);
  return (
    <div className="admin-stack">
      <div className="admin-stats">
        <Stat
          label="Продано билетов"
          value={paid.reduce((sum, order) => sum + order.participants.length, 0)}
        />
        <Stat label="Сумма продаж" value={formatPrice(revenue)} />
        <Stat
          label="Ожидает оплаты"
          value={formatPrice(pending.reduce((sum, order) => sum + order.sum, 0))}
          hint={`${pending.length} заказов`}
        />
        <Stat
          label="Средний чек"
          value={formatPrice(paid.length ? Math.round(revenue / paid.length) : 0)}
        />
        <Stat label="Возвраты" value={list.filter((order) => order.status === "refunded").length} />
      </div>
      <Panel
        title="Динамика продаж"
        action={
          <Tabs
            value={metric}
            onChange={setMetric}
            items={[
              { id: "tickets", label: "Билеты" },
              { id: "sum", label: "Сумма" },
            ]}
          />
        }
      >
        <SalesChart eventId={event.id} metric={metric} />
      </Panel>
      <Panel title="Продажи по тарифам">
        <Table
          rows={event.tariffs.map((tariff) => ({
            ...tariff,
            paid: paid
              .flatMap((order) => order.participants)
              .filter((p) => p.tariffId === tariff.id).length,
            reservedCount: pending
              .flatMap((order) => order.participants)
              .filter((p) => p.tariffId === tariff.id).length,
          }))}
          columns={[
            { key: "name", label: "Тариф" },
            { key: "price", label: "Текущая цена", render: (t) => formatPrice(currentPrice(t)) },
            { key: "paid", label: "Продано" },
            { key: "reservedCount", label: "В резерве" },
            { key: "limit", label: "Лимит" },
            { key: "left", label: "Остаток", render: (t) => t.limit - t.paid - t.reservedCount },
          ]}
        />
      </Panel>
      <div className="admin-grid">
        <Panel title="Способы оплаты">
          {["online", "invoice"].map((method) => (
            <div className="admin-summary" key={method}>
              <span>{method === "online" ? "Онлайн" : "По счёту"}</span>
              <strong>
                {formatPrice(
                  paid.filter((o) => o.payment === method).reduce((s, o) => s + o.sum, 0),
                )}
              </strong>
            </div>
          ))}
        </Panel>
        <Panel title="Кого представляют участники">
          {["Агентства", "Бренды", "Медиа", "IT", "Другое"].map((represent) => (
            <div className="admin-summary" key={represent}>
              <span>{represent}</span>
              <strong>
                {
                  paid.flatMap((o) => o.participants).filter((p) => p.represent === represent)
                    .length
                }
              </strong>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}
export function AdminDashboard() {
  const { events, orders, users, refunds } = useAdmin();
  const [eventId, setEventId] = useState(events[0].id);
  const event = events.find((item) => item.id === eventId) || events[0];
  return (
    <>
      <Heading
        title="Дашборд"
        description="Продажи, заказы и участники ваших мероприятий"
        action={
          <Select
            label="Мероприятие"
            value={event.id}
            onChange={(e) => setEventId(e.target.value)}
            options={events}
          />
        }
      />
      <div className="admin-overview">
        <span>
          Всего пользователей: <strong>{users.length}</strong>
        </span>
        <Link href="/admin/refunds">
          Заявок на возврат: <strong>{refunds.filter((r) => r.status === "pending").length}</strong>{" "}
          →
        </Link>
        <Link href={`/admin/events/${event.id}/orders`}>Все заказы →</Link>
      </div>
      <EventStatistics event={event} />
      <Panel
        title="Последние заказы"
        action={<Link href={`/admin/events/${event.id}/orders`}>Все заказы →</Link>}
      >
        <Table
          rows={orders.filter((o) => o.eventId === event.id).slice(0, 5)}
          columns={[
            {
              key: "id",
              label: "Заказ",
              render: (order) => <Link href={`/admin/orders/${order.id}`}>#{order.id}</Link>,
            },
            { key: "customerName", label: "Заказчик" },
            { key: "date", label: "Дата" },
            { key: "sum", label: "Сумма", render: (order) => formatPrice(order.sum) },
            { key: "status", label: "Статус", render: (order) => <Badge status={order.status} /> },
          ]}
        />
      </Panel>
    </>
  );
}
