"use client";
import { useState } from "react";
import Link from "@/components/ui/app-link";
import { useAdmin } from "./admin-provider";
import {
  Heading,
  Panel,
  Field,
  Select,
  Action,
  Badge,
  Stat,
  Table,
  Confirm,
  ExportLink,
  Tabs,
  applySearch,
} from "./admin-ui";
import { OrdersTable, RejectRefund, requisiteLabels } from "./admin-orders";
import { formatPrice } from "@/data/admin";

export function AdminRefunds() {
  const { refunds, orders, events, resolveRefund } = useAdmin();
  const [status, setStatus] = useState("pending");
  const [eventId, setEventId] = useState("all");
  const [query, setQuery] = useState("");
  const [rejecting, setRejecting] = useState(null);
  const rows = applySearch(refunds, query, ["orderId", "customer", "reason"]).filter(
    (r) =>
      (status === "all" || r.status === status) && (eventId === "all" || r.eventId === eventId),
  );
  return (
    <>
      <Heading title="Возвраты" description="Заявки на возврат всего заказа" />
      <div className="admin-stats">
        {[
          ["pending", "На рассмотрении"],
          ["approved", "Одобрено"],
          ["rejected", "Отклонено"],
        ].map(([key, label]) => (
          <Stat label={label} value={refunds.filter((r) => r.status === key).length} key={key} />
        ))}
      </div>
      <Panel>
        <div className="admin-filters">
          <Field label="Поиск заявки" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select
            label="Статус заявки"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: "all", label: "Все заявки" },
              { value: "pending", label: "На рассмотрении" },
              { value: "approved", label: "Одобрены" },
              { value: "rejected", label: "Отклонены" },
            ]}
          />
          <Select
            label="Мероприятие"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            options={[{ value: "all", label: "Все мероприятия" }, ...events]}
          />
        </div>
        <Table
          rows={rows}
          columns={[
            {
              key: "orderId",
              label: "Заказ",
              render: (r) => (
                <div className="admin-cell">
                  <Link href={`/admin/orders/${r.orderId}`}>#{r.orderId}</Link>
                  <small>{events.find((e) => e.id === r.eventId)?.name}</small>
                  <small>{r.date}</small>
                </div>
              ),
            },
            { key: "customer", label: "Заказчик" },
            {
              key: "reason",
              label: "Причина",
              render: (r) => (
                <div className="admin-cell">
                  <span>{r.reason}</span>
                  {r.comment && <small>Комментарий: {r.comment}</small>}
                </div>
              ),
            },
            {
              key: "sum",
              label: "К возврату",
              render: (r) => (
                <div className="admin-cell">
                  <strong>{formatPrice(r.sum)}</strong>
                  <small>Билетов: {r.tickets}</small>
                </div>
              ),
            },
            {
              key: "status",
              label: "Статус",
              render: (r) =>
                r.status === "pending" ? (
                  <span className="admin-badge admin-badge--pending">На рассмотрении</span>
                ) : (
                  <Badge status={r.status} />
                ),
            },
            {
              key: "actions",
              label: "Действия",
              render: (r) => {
                const order = orders.find((o) => o.id === r.orderId);
                const used = order?.participants.some((p) => p.status === "used");
                return r.status === "pending" ? (
                  <div className="admin-actions">
                    <Confirm
                      title="Одобрить возврат?"
                      description={`${formatPrice(r.sum)} за весь заказ. Все билеты будут аннулированы.`}
                      disabled={used || !order || order.status !== "paid"}
                      onConfirm={() => resolveRefund(r, "approved", "Возврат одобрен")}
                    >
                      Одобрить
                    </Confirm>
                    <Action secondary danger onClick={() => setRejecting(r)}>
                      Отклонить
                    </Action>
                    {used && <small>Есть использованный билет</small>}
                  </div>
                ) : (
                  <Link href={`/admin/orders/${r.orderId}`}>К заказу →</Link>
                );
              },
            },
          ]}
        />
      </Panel>
      {rejecting && <RejectRefund refund={rejecting} onClose={() => setRejecting(null)} />}
    </>
  );
}
export function AdminUsers() {
  const { users, orders, events } = useAdmin();
  const [query, setQuery] = useState("");
  const [purchased, setPurchased] = useState("all");
  const [eventId, setEventId] = useState("all");
  const stats = (user) => {
    const list = orders.filter((o) => o.customer === user.email);
    return { orders: list, paid: list.filter((o) => o.status === "paid") };
  };
  const rows = applySearch(users, query, ["email", "name", "company", "phone"]).filter((user) => {
    const data = stats(user);
    return (
      (eventId === "all" || data.orders.some((o) => o.eventId === eventId)) &&
      (purchased === "all" || Boolean(data.paid.length) === (purchased === "yes"))
    );
  });
  return (
    <>
      <Heading
        title="Пользователи"
        description="Заказчики и зарегистрированные пользователи платформы"
        action={<ExportLink />}
      />
      <Panel>
        <div className="admin-filters">
          <Field
            label="Поиск пользователя"
            placeholder="Имя, email, телефон или компания"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Select
            label="Участие в мероприятии"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            options={[{ value: "all", label: "Любое мероприятие" }, ...events]}
          />
          <Select
            label="Покупки"
            value={purchased}
            onChange={(e) => setPurchased(e.target.value)}
            options={[
              { value: "all", label: "Все пользователи" },
              { value: "yes", label: "С оплаченными заказами" },
              { value: "no", label: "Без покупок" },
            ]}
          />
        </div>
        <Table
          rows={rows}
          columns={[
            {
              key: "name",
              label: "Пользователь",
              sort: (a, b) => a.name.localeCompare(b.name, "ru"),
              render: (user) => (
                <div className="admin-cell">
                  <Link href={`/admin/users/${user.id}`}>{user.name}</Link>
                  <span>{user.email}</span>
                </div>
              ),
            },
            { key: "company", label: "Компания" },
            { key: "phone", label: "Телефон" },
            { key: "orders", label: "Заказов", render: (user) => stats(user).orders.length },
            {
              key: "sum",
              label: "Сумма покупок",
              render: (user) => formatPrice(stats(user).paid.reduce((s, o) => s + o.sum, 0)),
            },
            {
              key: "registeredAt",
              label: "Регистрация",
              render: (user) => (
                <div className="admin-cell">
                  <span>{user.registeredAt}</span>
                  <small>{user.source.site || "Источник неизвестен"}</small>
                </div>
              ),
            },
          ]}
        />
      </Panel>
    </>
  );
}
export function AdminUser({ userId }) {
  const { users, orders, events, notify } = useAdmin();
  const [tab, setTab] = useState("orders");
  const user = users.find((u) => u.id === userId);
  if (!user)
    return (
      <Heading
        title="Пользователь не найден"
        back={{ href: "/admin/users", label: "Пользователи" }}
      />
    );
  const list = orders.filter((o) => o.customer === user.email);
  const paid = list.filter((o) => o.status === "paid");
  const tickets = list.flatMap((o) =>
    o.participants.map((p, index) => ({
      ...p,
      orderId: o.id,
      eventId: o.eventId,
      id: `${o.id}-${index}`,
    })),
  );
  return (
    <>
      <Heading
        title={user.name}
        description={user.email}
        back={{ href: "/admin/users", label: "Пользователи" }}
        action={
          <Action
            secondary
            onClick={() => notify("Сброс пароля будет доступен после подключения API")}
          >
            Отправить ссылку сброса пароля
          </Action>
        }
      />
      <div className="admin-stats">
        <Stat label="Заказов" value={list.length} />
        <Stat label="Оплачено" value={formatPrice(paid.reduce((s, o) => s + o.sum, 0))} />
        <Stat label="Билетов" value={tickets.length} />
        <Stat label="Дата регистрации" value={user.registeredAt} />
      </div>
      <div className="admin-grid">
        <Panel title="Контактная информация">
          <dl className="admin-details">
            {[
              ["ФИО", user.name],
              ["Email", user.email],
              ["Телефон", user.phone],
              ["Компания", user.company],
              ...Object.entries(user.requisites || {}).map(([key, value]) => [
                requisiteLabels[key] || key,
                value,
              ]),
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value || "—"}</dd>
              </div>
            ))}
          </dl>
        </Panel>
        <Panel title="Источник регистрации">
          <dl className="admin-details">
            <div>
              <dt>Сайт</dt>
              <dd>{user.source.site || "Не определён"}</dd>
            </div>
            <div>
              <dt>Страница перехода</dt>
              <dd>{user.source.url}</dd>
            </div>
            <div>
              <dt>UTM-метки</dt>
              <dd>{user.source.utm || "Нет данных"}</dd>
            </div>
          </dl>
        </Panel>
      </div>
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "orders", label: `Заказы (${list.length})` },
          { id: "tickets", label: `Билеты (${tickets.length})` },
          { id: "archive", label: "Архив" },
        ]}
      />
      <Panel>
        {tab === "orders" && (
          <OrdersTable
            orders={list.filter(
              (o) => events.find((e) => e.id === o.eventId)?.status !== "archive",
            )}
          />
        )}
        {tab === "archive" && (
          <OrdersTable
            orders={list.filter(
              (o) => events.find((e) => e.id === o.eventId)?.status === "archive",
            )}
          />
        )}
        {tab === "tickets" && (
          <Table
            rows={tickets}
            columns={[
              {
                key: "name",
                label: "Участник",
                render: (p) => (
                  <div className="admin-cell">
                    <strong>{p.name}</strong>
                    <span>{p.email}</span>
                  </div>
                ),
              },
              {
                key: "event",
                label: "Мероприятие",
                render: (p) => events.find((e) => e.id === p.eventId)?.name,
              },
              { key: "tariff", label: "Тариф" },
              {
                key: "orderId",
                label: "Заказ",
                render: (p) => <Link href={`/admin/orders/${p.orderId}`}>#{p.orderId}</Link>,
              },
              { key: "status", label: "Билет", render: (p) => <Badge ticket status={p.status} /> },
            ]}
          />
        )}
      </Panel>
    </>
  );
}
