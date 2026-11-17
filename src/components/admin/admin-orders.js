"use client";
import { useState } from "react";
import Link from "@/components/ui/app-link";
import { useAppRouter as useRouter } from "@/lib/navigation";
import { useAdmin } from "./admin-provider";
import {
  Heading,
  Panel,
  Field,
  Select,
  Textarea,
  Check,
  Action,
  Badge,
  Table,
  Modal,
  Confirm,
  DocumentLink,
  ExportLink,
  formValues,
  applySearch,
} from "./admin-ui";
import {
  ORDER_STATUS,
  TICKET_STATUS,
  PAYMENT_LABEL,
  TODAY,
  currentPrice,
  formatPrice,
  dateKey,
} from "@/data/admin";

const representOptions = ["Агентства", "Бренды", "Медиа", "IT", "Другое"].map((value) => ({
  value,
  label: value,
}));
const all = (label, options) => [{ value: "all", label }, ...options];
function orderColumns() {
  return [
    {
      key: "id",
      label: "№ заказа",
      sort: (a, b) => a.id - b.id,
      render: (o) => <Link href={`/admin/orders/${o.id}`}>#{o.id}</Link>,
    },
    { key: "date", label: "Дата", sort: (a, b) => dateKey(a.date) - dateKey(b.date) },
    {
      key: "customer",
      label: "Заказчик",
      render: (o) => (
        <div className="admin-cell">
          <strong>{o.customerName}</strong>
          <span>{o.customer}</span>
          <small>{o.company}</small>
        </div>
      ),
    },
    { key: "tickets", label: "Билетов", render: (o) => o.participants.length },
    {
      key: "sum",
      label: "Сумма",
      sort: (a, b) => a.sum - b.sum,
      render: (o) => formatPrice(o.sum),
    },
    { key: "payment", label: "Оплата", render: (o) => PAYMENT_LABEL[o.payment] },
    { key: "status", label: "Статус", render: (o) => <Badge status={o.status} /> },
  ];
}
export function OrdersTable({ orders }) {
  return <Table columns={orderColumns()} rows={orders} />;
}
export function AdminOrders({ event }) {
  const { orders } = useAdmin();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [payment, setPayment] = useState("all");
  const [period, setPeriod] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const rows = applySearch(
    orders.filter((o) => o.eventId === event.id),
    query,
    ["id", "customer", "customerName", "company"],
  ).filter(
    (o) =>
      (status === "all" || status === o.status) &&
      (payment === "all" || payment === o.payment) &&
      (period !== "today" || o.date === TODAY) &&
      (period !== "week" || dateKey(o.date) >= 20260811) &&
      (period !== "month" || dateKey(o.date) >= 20260801) &&
      (!from || dateKey(o.date) >= Number(from.replaceAll("-", ""))) &&
      (!to || dateKey(o.date) <= Number(to.replaceAll("-", ""))),
  );
  return (
    <Panel
      title={`Заказы · ${rows.length}`}
      action={
        <div className="admin-actions">
          <ExportLink />
          <Link
            className="button button--primary admin-button"
            href={`/admin/events/${event.id}/orders/new`}
          >
            ＋ Новый заказ вручную
          </Link>
        </div>
      }
    >
      <div className="admin-filters">
        <Field
          label="Поиск заказа"
          placeholder="Номер, email, имя или компания"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select
          label="Статус заказа"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={all(
            "Все статусы",
            Object.entries(ORDER_STATUS).map(([value, s]) => ({ value, label: s.text })),
          )}
        />
        <Select
          label="Способ оплаты"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          options={all(
            "Все способы",
            Object.entries(PAYMENT_LABEL).map(([value, label]) => ({ value, label })),
          )}
        />
        <Select
          label="Период"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          options={all("За всё время", [
            { value: "today", label: "Сегодня" },
            { value: "week", label: "За неделю" },
            { value: "month", label: "За месяц" },
          ])}
        />
        <Field label="Дата от" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Field
          label="Дата до"
          type="date"
          min={from}
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <OrdersTable orders={rows} />
    </Panel>
  );
}
function ParticipantEditor({ participant, onClose, onSave }) {
  return (
    <Modal title="Редактирование участника" onClose={onClose}>
      <form className="admin-form" onSubmit={(e) => onSave({ ...participant, ...formValues(e) })}>
        <Field label="ФИО" name="name" defaultValue={participant.name} required />
        <div className="admin-grid">
          <Field
            label="Email"
            name="email"
            type="email"
            defaultValue={participant.email}
            required
          />
          <Field label="Телефон" name="phone" type="tel" defaultValue={participant.phone} />
          <Field label="Компания" name="company" defaultValue={participant.company} />
          <Select
            label="Я представляю"
            name="represent"
            defaultValue={participant.represent || "Другое"}
            options={representOptions}
          />
        </div>
        <div className="admin-actions">
          <Action type="submit">Сохранить участника</Action>
          <Action secondary onClick={onClose}>
            Отмена
          </Action>
        </div>
      </form>
    </Modal>
  );
}
export function AdminParticipants({ event }) {
  const { orders, updateOrder, notify } = useAdmin();
  const [query, setQuery] = useState("");
  const [tariff, setTariff] = useState("all");
  const [status, setStatus] = useState("all");
  const [represent, setRepresent] = useState("all");
  const [attendance, setAttendance] = useState("all");
  const [editing, setEditing] = useState(null);
  const participants = orders
    .filter((o) => o.eventId === event.id)
    .flatMap((o) =>
      o.participants.map((p, index) => ({ ...p, orderId: o.id, index, id: `${o.id}-${index}` })),
    );
  const rows = applySearch(participants, query, ["name", "email", "company", "phone"]).filter(
    (p) =>
      (tariff === "all" || p.tariffId === tariff) &&
      (status === "all" || p.status === status) &&
      (represent === "all" || p.represent === represent) &&
      (attendance === "all" || Boolean(p.checkedInAt) === (attendance === "yes")),
  );
  function save(p) {
    const order = orders.find((o) => o.id === p.orderId);
    updateOrder({
      ...order,
      participants: order.participants.map((item, i) =>
        i === p.index
          ? {
              ...item,
              name: p.name,
              email: p.email,
              phone: p.phone,
              company: p.company,
              represent: p.represent,
            }
          : item,
      ),
    });
    setEditing(null);
    notify("Данные участника сохранены");
  }
  return (
    <Panel title={`Участники · ${rows.length}`} action={<ExportLink />}>
      <div className="admin-filters">
        <Field label="Поиск участника" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Select
          label="Тариф"
          value={tariff}
          onChange={(e) => setTariff(e.target.value)}
          options={all("Все тарифы", event.tariffs)}
        />
        <Select
          label="Статус билета"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={all(
            "Все статусы",
            Object.entries(TICKET_STATUS).map(([value, s]) => ({ value, label: s.text })),
          )}
        />
        <Select
          label="Представляет"
          value={represent}
          onChange={(e) => setRepresent(e.target.value)}
          options={all("Все", representOptions)}
        />
        <Select
          label="Посещение"
          value={attendance}
          onChange={(e) => setAttendance(e.target.value)}
          options={all("Все участники", [
            { value: "yes", label: "Пришли на площадку" },
            { value: "no", label: "Ещё не пришли" },
          ])}
        />
      </div>
      <Table
        rows={rows}
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
          { key: "phone", label: "Телефон" },
          { key: "company", label: "Компания" },
          { key: "represent", label: "Представляет" },
          { key: "tariff", label: "Тариф" },
          {
            key: "orderId",
            label: "Заказ",
            render: (p) => <Link href={`/admin/orders/${p.orderId}`}>#{p.orderId}</Link>,
          },
          {
            key: "status",
            label: "Билет",
            render: (p) => (
              <div className="admin-cell">
                <Badge status={p.status} ticket />
                {p.checkedInAt && <small>{p.checkedInAt}</small>}
              </div>
            ),
          },
          {
            key: "edit",
            label: "Действия",
            render: (p) => (
              <Action secondary onClick={() => setEditing(p)}>
                Изменить
              </Action>
            ),
          },
        ]}
      />
      {editing && (
        <ParticipantEditor participant={editing} onClose={() => setEditing(null)} onSave={save} />
      )}
    </Panel>
  );
}
export function RejectRefund({ refund, onClose }) {
  const { resolveRefund } = useAdmin();
  return (
    <Modal title="Отклонить заявку на возврат" onClose={onClose}>
      <form
        className="admin-form"
        onSubmit={(e) => {
          const values = formValues(e);
          if (!values.comment.trim()) {
            e.currentTarget.elements.comment.setCustomValidity("Укажите причину отказа");
            e.currentTarget.elements.comment.reportValidity();
            return;
          }
          resolveRefund(refund, "rejected", values.comment.trim());
          onClose();
        }}
      >
        <Textarea
          label="Причина отказа"
          name="comment"
          required
          onInput={(e) => e.target.setCustomValidity("")}
        />
        <div className="admin-actions">
          <Action type="submit" danger>
            Отклонить заявку
          </Action>
          <Action secondary onClick={onClose}>
            Отмена
          </Action>
        </div>
      </form>
    </Modal>
  );
}
export function AdminOrder({ orderId }) {
  const { orders, events, refunds, updateOrder, resolveRefund, notify } = useAdmin();
  const [editing, setEditing] = useState(null);
  const [rejecting, setRejecting] = useState(false);
  const [mailType, setMailType] = useState("order_paid");
  const order = orders.find((o) => o.id === Number(orderId));
  if (!order)
    return (
      <Heading title="Заказ не найден" back={{ href: "/admin/events", label: "Мероприятия" }} />
    );
  const event = events.find((e) => e.id === order.eventId);
  const refund = refunds.find((r) => r.orderId === order.id && r.status === "pending");
  const hasUsedTicket = order.participants.some((p) => p.status === "used");
  function status(next) {
    updateOrder({
      ...order,
      status: next,
      ...(next === "paid" ? { paidAt: TODAY } : {}),
      participants: order.participants.map((p) => ({
        ...p,
        status: next === "paid" ? (p.status === "issued" ? "valid" : p.status) : "void",
      })),
    });
    notify(next === "paid" ? "Оплата отмечена в заказе" : "Заказ отменён");
  }
  return (
    <>
      <Heading
        title={`Заказ #${order.id}`}
        description={event?.name}
        back={{ href: `/admin/events/${order.eventId}/orders`, label: "К заказам мероприятия" }}
        action={<Badge status={order.status} />}
      />
      {refund && (
        <Panel title="Заявка на возврат">
          <p>{refund.reason}</p>
          <p className="admin-muted">Возврат всего заказа: {formatPrice(order.sum)}</p>
          <div className="admin-actions">
            <Confirm
              title="Одобрить возврат всего заказа?"
              description="Все билеты будут аннулированы."
              disabled={hasUsedTicket}
              onConfirm={() => resolveRefund(refund, "approved", "Возврат одобрен")}
            >
              Одобрить возврат
            </Confirm>
            <Action secondary danger onClick={() => setRejecting(true)}>
              Отклонить
            </Action>
          </div>
          {hasUsedTicket && (
            <p className="admin-info">Есть использованный билет. Одобрение возврата недоступно.</p>
          )}
        </Panel>
      )}
      <div className="admin-grid">
        <Panel title="Информация о заказе">
          <dl className="admin-details">
            {[
              ["Мероприятие", event?.name],
              ["Дата создания", order.date],
              ["Способ оплаты", PAYMENT_LABEL[order.payment]],
              ["Кол-во билетов", order.participants.length],
              ["Сумма до скидки", formatPrice(order.gross)],
              ["Скидка", formatPrice(order.discount)],
              ["Промокод", order.promoCode || "—"],
              ["Итого", formatPrice(order.sum)],
              ["Создан вручную", order.createdByAdmin || "Нет"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {order.expiresAt && (
            <p className="admin-info">Срок платёжной сессии: {order.expiresAt}</p>
          )}
          <div className="admin-actions">
            {order.status === "pending" && order.payment === "invoice" && (
              <Confirm title="Подтвердить получение оплаты?" onConfirm={() => status("paid")}>
                Подтвердить оплату
              </Confirm>
            )}
            {["pending", "expired"].includes(order.status) && (
              <Confirm danger title="Отменить заказ?" onConfirm={() => status("cancelled")}>
                Отменить заказ
              </Confirm>
            )}
            <DocumentLink>Скачать счёт</DocumentLink>
            {order.status === "paid" && <DocumentLink>Скачать акт</DocumentLink>}
          </div>
          {order.adminComment && (
            <p className="admin-info">Комментарий менеджера: {order.adminComment}</p>
          )}
        </Panel>
        <Panel title="Заказчик">
          <dl className="admin-details">
            {[
              ["ФИО", order.customerName],
              ["Email", order.customer],
              ["Компания", order.company],
              ...Object.entries(order.requisites || {}).map(([key, value]) => [
                requisiteLabels[key] || key,
                value,
              ]),
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="admin-form">
            <Select
              label="Письмо заказчику"
              value={mailType}
              onChange={(e) => setMailType(e.target.value)}
              options={[
                { value: "order_created", label: "Заказ создан, ожидает оплаты" },
                { value: "order_paid", label: "Оплата получена, билеты" },
                { value: "invoice_reminder", label: "Напоминание об оплате" },
                { value: "event_reminder", label: "Напоминание о мероприятии" },
              ]}
            />
            <Action
              secondary
              onClick={() => notify("Отправка писем будет доступна после подключения API")}
            >
              Отправить письмо
            </Action>
          </div>
        </Panel>
      </div>
      <Panel title="Участники">
        <Table
          rows={order.participants}
          rowKey={(_, i) => i}
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
            { key: "phone", label: "Телефон" },
            { key: "company", label: "Компания" },
            { key: "represent", label: "Представляет" },
            { key: "tariff", label: "Тариф" },
            { key: "price", label: "Цена", render: (p) => formatPrice(p.price) },
            {
              key: "status",
              label: "Билет",
              render: (p) => (
                <div className="admin-cell">
                  <Badge ticket status={p.status} />
                  {p.checkedInAt && <small>{p.checkedInAt}</small>}
                </div>
              ),
            },
            {
              key: "actions",
              label: "Действия",
              render: (p) => (
                <div className="admin-actions">
                  <Action
                    secondary
                    onClick={() => setEditing({ ...p, index: order.participants.indexOf(p) })}
                  >
                    Изменить
                  </Action>
                  {["valid", "used"].includes(p.status) && (
                    <>
                      <DocumentLink>Билет</DocumentLink>
                      <Action
                        secondary
                        onClick={() =>
                          notify("Отправка билетов будет доступна после подключения API")
                        }
                      >
                        Отправить
                      </Action>
                    </>
                  )}
                </div>
              ),
            },
          ]}
        />
      </Panel>
      <Panel title="История заказа">
        <ol className="admin-timeline">
          <li>
            Заказ создан — {order.date}
            {order.createdByAdmin ? ` · ${order.createdByAdmin}` : ""}
          </li>
          {["paid", "refunded"].includes(order.status) && (
            <li>Оплата подтверждена{order.paidAt ? ` — ${order.paidAt}` : ""}</li>
          )}
          {order.status === "cancelled" && <li>Заказ отменён, билеты аннулированы</li>}
          {order.status === "refunded" && <li>Возврат одобрен, билеты аннулированы</li>}
          {order.status === "expired" && (
            <li>Срок оплаты истёк — {order.expiresAt || order.date}</li>
          )}
        </ol>
      </Panel>
      {editing && (
        <ParticipantEditor
          participant={editing}
          onClose={() => setEditing(null)}
          onSave={(p) => {
            updateOrder({
              ...order,
              participants: order.participants.map((item, i) =>
                i === p.index
                  ? {
                      ...item,
                      name: p.name,
                      email: p.email,
                      phone: p.phone,
                      company: p.company,
                      represent: p.represent,
                    }
                  : item,
              ),
            });
            setEditing(null);
            notify("Участник сохранён");
          }}
        />
      )}
      {rejecting && <RejectRefund refund={refund} onClose={() => setRejecting(false)} />}
    </>
  );
}
export const requisiteLabels = {
  legalName: "Юридическое наименование",
  legalAddress: "Юридический адрес",
  inn: "ИНН",
  kpp: "КПП",
  ogrn: "ОГРН",
  account: "Расчётный счёт",
  bank: "Банк",
  bik: "БИК",
  corrAccount: "Корреспондентский счёт",
  signatoryName: "ФИО подписанта",
  signatoryPosition: "Должность подписанта",
};

export function ManualOrder({ eventId }) {
  const { events, orders, setOrders, notify } = useAdmin();
  const router = useRouter();
  const [tickets, setTickets] = useState([{}]);
  const [override, setOverride] = useState(false);
  const [customSum, setCustomSum] = useState("");
  const [sendTickets, setSendTickets] = useState(true);
  const event = events.find((e) => e.id === eventId);
  if (!event) return <Heading title="Мероприятие не найдено" />;
  const gross = tickets.reduce(
    (sum, ticket) =>
      sum + currentPrice(event.tariffs.find((t) => t.id === ticket.tariffId) || { prices: [] }),
    0,
  );
  const sum = override ? Number(customSum || 0) : gross;
  function update(index, key, value) {
    setTickets(tickets.map((t, i) => (i === index ? { ...t, [key]: value } : t)));
  }
  function submit(e) {
    const values = formValues(e);
    const order = {
      id: Math.max(4000, ...orders.map((o) => o.id)) + 1,
      eventId: event.id,
      date: TODAY,
      paidAt: TODAY,
      customer: values.customer,
      customerName: values.customerName || values.customer,
      company: tickets[0].company || "—",
      payment: "invoice",
      status: "paid",
      gross,
      discount: Math.max(0, gross - sum),
      sum,
      promoCode: null,
      expiresAt: null,
      requisites: null,
      createdByAdmin: "admin@adpass.ru",
      adminComment: values.comment,
      participants: tickets.map((ticket) => {
        const tariff = event.tariffs.find((t) => t.id === ticket.tariffId);
        return {
          ...ticket,
          tariff: tariff.name,
          price: currentPrice(tariff),
          status: "valid",
          checkedInAt: null,
        };
      }),
    };
    setOrders((list) => [order, ...list]);
    notify(sendTickets ? "Заказ создан. Отправка билетов требует подключения API" : "Заказ создан");
    router.push(`/admin/orders/${order.id}`);
  }
  return (
    <>
      <Heading
        title="Новый заказ вручную"
        description={event.name}
        back={{ href: `/admin/events/${event.id}/orders`, label: "Заказы мероприятия" }}
      />
      <Panel>
        <p className="admin-info">
          Заказ создаётся сразу оплаченным. Используйте, когда оплата прошла вне сайта.
        </p>
        <form className="admin-form" onSubmit={submit}>
          <div className="admin-grid">
            <Field
              label="Email заказчика"
              name="customer"
              type="email"
              list="admin-customers"
              required
            />
            <datalist id="admin-customers">
              {[...new Set(orders.map((o) => o.customer))].map((email) => (
                <option value={email} key={email} />
              ))}
            </datalist>
            <Field label="ФИО заказчика" name="customerName" />
          </div>
          <h2>Участники</h2>
          {tickets.map((ticket, index) => (
            <fieldset className="admin-fieldset" key={index}>
              <legend>Участник {index + 1}</legend>
              <div className="admin-grid">
                <Select
                  label="Тариф"
                  value={ticket.tariffId || ""}
                  required
                  onChange={(e) => update(index, "tariffId", e.target.value)}
                  options={[
                    { value: "", label: "Выберите тариф" },
                    ...event.tariffs.map((t) => ({
                      value: t.id,
                      label: `${t.name} — ${formatPrice(currentPrice(t))}`,
                    })),
                  ]}
                />
                <Field
                  label="ФИО участника"
                  value={ticket.name || ""}
                  required
                  onChange={(e) => update(index, "name", e.target.value)}
                />
                <Field
                  label="Email участника"
                  type="email"
                  value={ticket.email || ""}
                  required
                  onChange={(e) => update(index, "email", e.target.value)}
                />
                <Field
                  label="Телефон"
                  type="tel"
                  value={ticket.phone || ""}
                  onChange={(e) => update(index, "phone", e.target.value)}
                />
                <Field
                  label="Компания"
                  value={ticket.company || ""}
                  onChange={(e) => update(index, "company", e.target.value)}
                />
                <Select
                  label="Представляет"
                  value={ticket.represent || "Другое"}
                  onChange={(e) => update(index, "represent", e.target.value)}
                  options={representOptions}
                />
              </div>
              {tickets.length > 1 && (
                <Action
                  secondary
                  danger
                  onClick={() => setTickets(tickets.filter((_, i) => i !== index))}
                >
                  Удалить участника
                </Action>
              )}
            </fieldset>
          ))}
          <Action secondary onClick={() => setTickets([...tickets, {}])}>
            ＋ Добавить участника
          </Action>
          <div className="admin-grid">
            <div>
              <p>Сумма по тарифам</p>
              <strong className="admin-total">{formatPrice(gross)}</strong>
            </div>
            <div className="admin-form">
              <Check checked={override} onChange={(e) => setOverride(e.target.checked)}>
                Переопределить сумму
              </Check>
              <Field
                label="Итоговая сумма, ₽"
                type="number"
                min="0"
                step="1"
                required={override}
                disabled={!override}
                value={customSum}
                onChange={(e) => setCustomSum(e.target.value)}
              />
            </div>
          </div>
          <Textarea label="Комментарий менеджера" name="comment" />
          <Check checked={sendTickets} onChange={(e) => setSendTickets(e.target.checked)}>
            Отправить билеты на email участников
          </Check>
          <p className="admin-total">Итого: {formatPrice(sum)}</p>
          <div className="admin-actions">
            <Action type="submit">Создать заказ</Action>
            <Link href={`/admin/events/${event.id}/orders`}>Отмена</Link>
          </div>
        </form>
      </Panel>
    </>
  );
}
