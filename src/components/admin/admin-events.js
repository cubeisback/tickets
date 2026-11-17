"use client";

import { assetPath } from "@/lib/paths";
import { useState } from "react";
import Link from "@/components/ui/app-link";
import { useAppRouter as useRouter } from "@/lib/navigation";
import { useAdmin, newId } from "./admin-provider";
import {
  Heading,
  Panel,
  Action,
  Field,
  Select,
  Textarea,
  Badge,
  Tabs,
  Confirm,
  formValues,
  applySearch,
} from "./admin-ui";
import { EventSales } from "./event-sales";
import { EventStatistics } from "./admin-dashboard";
import { AdminOrders, AdminParticipants } from "./admin-orders";

export function AdminEvents() {
  const { events, setEvents, formats, notify } = useAdmin();
  const [status, setStatus] = useState("active");
  const [format, setFormat] = useState("all");
  const [query, setQuery] = useState("");
  const rows = applySearch(events, query, ["name", "shortDesc"]).filter(
    (event) =>
      (status === "all" || status === event.status) &&
      (format === "all" || format === event.formatId),
  );
  function duplicate(event) {
    const tariffMap = Object.fromEntries(event.tariffs.map((t) => [t.id, newId("tariff")]));
    const copy = {
      ...event,
      id: newId("event"),
      name: `${event.name} (копия)`,
      status: "draft",
      tariffs: event.tariffs.map((t) => ({ ...t, id: tariffMap[t.id], sold: 0, reserved: 0 })),
      promocodes: event.promocodes.map((p) => ({
        ...p,
        id: newId("promo"),
        used: 0,
        ticketTypeIds: p.ticketTypeIds.map((id) => tariffMap[id]),
      })),
      promoBatches: (event.promoBatches || []).map((b) => ({
        ...b,
        id: newId("batch"),
        active: false,
        ticketTypeIds: b.ticketTypeIds.map((id) => tariffMap[id]),
        codes: b.codes.map((c) => ({ ...c, usedAt: null, orderId: null })),
      })),
    };
    setEvents((list) => [copy, ...list]);
    setStatus("draft");
    notify("Создана копия мероприятия в черновиках");
  }
  return (
    <>
      <Heading
        title="Мероприятия"
        description="Управляйте событиями, билетами и условиями продажи"
        action={
          <Link className="button button--primary admin-button" href="/admin/events/new">
            ＋ Создать мероприятие
          </Link>
        }
      />
      <Panel>
        <div className="admin-filters">
          <Tabs
            value={status}
            onChange={setStatus}
            items={[
              { id: "active", label: "Активные" },
              { id: "draft", label: "Черновики" },
              { id: "archive", label: "Архив" },
              { id: "all", label: "Все" },
            ]}
          />
          <Select
            label="Формат"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            options={[{ value: "all", label: "Все форматы" }, ...formats]}
          />
          <Field
            label="Поиск"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Название мероприятия"
          />
        </div>
      </Panel>
      <div className="admin-event-list">
        {rows.map((event) => (
          <article className="admin-event" key={event.id}>
            <Link className="admin-event__cover" href={`/admin/events/${event.id}`}>
              <img src={event.cover || assetPath("/assets/cabinet/forum.png")} alt="" />
            </Link>
            <div className="admin-event__body">
              <div className="admin-actions">
                <Badge status={event.status} />
                <span className="admin-muted">
                  {formats.find((f) => f.id === event.formatId)?.name}
                </span>
              </div>
              <h2>
                <Link href={`/admin/events/${event.id}`}>{event.name}</Link>
              </h2>
              <p className="admin-muted">
                {event.dates || `${event.dateStart} — ${event.dateEnd}`}
              </p>
              <p>{event.shortDesc}</p>
              <div className="admin-actions">
                <Link
                  className="button button--primary admin-button"
                  href={`/admin/events/${event.id}`}
                >
                  Открыть
                </Link>
                <Action secondary onClick={() => duplicate(event)}>
                  Дублировать
                </Action>
                <Confirm
                  title={
                    event.status === "archive"
                      ? "Вернуть мероприятие в активные?"
                      : "Перевести мероприятие в архив?"
                  }
                  onConfirm={() => {
                    setEvents((list) =>
                      list.map((item) =>
                        item.id === event.id
                          ? { ...item, status: event.status === "archive" ? "active" : "archive" }
                          : item,
                      ),
                    );
                    notify("Статус мероприятия изменён");
                  }}
                >
                  {event.status === "archive" ? "Восстановить" : "В архив"}
                </Confirm>
              </div>
            </div>
          </article>
        ))}
        {!rows.length && <p className="admin-empty">Мероприятий не найдено</p>}
      </div>
    </>
  );
}
function BasicsForm({ event, onSubmit, submitLabel, children }) {
  const { formats, entities } = useAdmin();
  const [cover, setCover] = useState(event.cover || "");
  const [error, setError] = useState("");
  function submit(e) {
    const values = formValues(e);
    if (values.dateEnd < values.dateStart) {
      setError("Дата окончания не может быть раньше даты начала");
      return;
    }
    onSubmit({
      ...event,
      ...values,
      cover,
      dates: `${new Date(`${values.dateStart}T12:00:00Z`).toLocaleDateString("ru-RU", { timeZone: "UTC" })} — ${new Date(`${values.dateEnd}T12:00:00Z`).toLocaleDateString("ru-RU", { timeZone: "UTC" })}`,
    });
  }
  function upload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setError("Выберите изображение до 5 МБ");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCover(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  }
  return (
    <form className="admin-form" onSubmit={submit}>
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      <Field label="Название мероприятия" name="name" defaultValue={event.name} required />
      <div className="admin-grid">
        <Select
          label="Формат"
          name="formatId"
          defaultValue={event.formatId || formats.find((f) => f.active)?.id}
          options={formats.filter((f) => f.active || f.id === event.formatId)}
        />
        <Select
          label="Юрлицо организатора"
          name="legalEntityId"
          defaultValue={event.legalEntityId || entities.find((e) => e.isDefault)?.id}
          options={entities.map((e) => ({ value: e.id, label: e.shortName }))}
          required
        />
        <Field
          label="Дата начала"
          name="dateStart"
          type="date"
          defaultValue={event.dateStart}
          required
        />
        <Field
          label="Дата окончания"
          name="dateEnd"
          type="date"
          defaultValue={event.dateEnd}
          required
        />
      </div>
      <Select
        label="Статус"
        name="status"
        defaultValue={event.status || "draft"}
        options={[
          { value: "draft", label: "Черновик" },
          { value: "active", label: "Активно" },
          { value: "archive", label: "Архив" },
        ]}
      />
      <Field label="Краткое описание" name="shortDesc" defaultValue={event.shortDesc} required />
      <Textarea label="Полное описание" name="fullDesc" defaultValue={event.fullDesc} rows="6" />
      <label className="admin-field">
        <span>Обложка мероприятия</span>
        <input type="file" accept="image/*" onChange={upload} />
        <small>Изображение до 5 МБ</small>
      </label>
      {cover && (
        <div className="admin-cover-preview">
          <img src={cover} alt="Обложка мероприятия" />
          <Action secondary onClick={() => setCover("")}>
            Убрать обложку
          </Action>
        </div>
      )}
      <div className="admin-actions">
        <Action type="submit">{submitLabel}</Action>
        {children}
      </div>
    </form>
  );
}
export function EventWizard() {
  const { setEvents, notify } = useAdmin();
  const router = useRouter();
  const [step, setStep] = useState("basics");
  const [draft, setDraft] = useState({
    name: "",
    status: "draft",
    tariffs: [],
    promocodes: [],
    promoBatches: [],
  });
  function finish() {
    if (!draft.tariffs.length) {
      notify("Добавьте хотя бы один тариф");
      return;
    }
    const event = { ...draft, id: newId("event") };
    setEvents((list) => [event, ...list]);
    notify("Мероприятие создано");
    router.push(`/admin/events/${event.id}`);
  }
  return (
    <>
      <Heading title="Новое мероприятие" back={{ href: "/admin/events", label: "Мероприятия" }} />
      <div className="admin-steps">
        <span className={step === "basics" ? "admin-steps__active" : ""}>1. Базовое описание</span>
        <span className={step === "sales" ? "admin-steps__active" : ""}>2. Тарифы и промокоды</span>
      </div>
      <div hidden={step !== "basics"}>
        <Panel title="Базовое описание">
          <BasicsForm
            event={draft}
            onSubmit={(values) => {
              setDraft(values);
              setStep("sales");
            }}
            submitLabel="Далее: тарифы и промокоды"
          >
            <Link href="/admin/events">Отмена</Link>
          </BasicsForm>
        </Panel>
      </div>
      <div hidden={step !== "sales"}>
        <EventSales event={draft} onChange={setDraft} />
        <div className="admin-actions">
          <Action secondary onClick={() => setStep("basics")}>
            Назад
          </Action>
          <Action onClick={finish}>Создать мероприятие</Action>
        </div>
      </div>
    </>
  );
}
export function AdminEvent({ eventId, section = "basics" }) {
  const { events, updateEvent, notify, entities } = useAdmin();
  const event = events.find((item) => item.id === eventId);
  if (!event)
    return (
      <Heading
        title="Мероприятие не найдено"
        back={{ href: "/admin/events", label: "К мероприятиям" }}
      />
    );
  const tabs = [
    ["basics", "Описание"],
    ["tariffs", "Тарифы и промокоды"],
    ["stats", "Статистика"],
    ["orders", "Заказы"],
    ["participants", "Участники"],
  ];
  return (
    <>
      <Heading
        title={event.name}
        description={`${event.dates} · ${entities.find((e) => e.id === event.legalEntityId)?.shortName || "Выберите юрлицо"}`}
        back={{ href: "/admin/events", label: "Мероприятия" }}
        action={<Badge status={event.status} />}
      />
      <nav className="admin-tabs" aria-label="Разделы мероприятия">
        {tabs.map(([id, label]) => (
          <Link
            className={`admin-tabs__tab${id === section ? " admin-tabs__tab--active" : ""}`}
            href={`/admin/events/${event.id}${id === "basics" ? "" : `/${id}`}`}
            key={id}
            aria-current={id === section ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      {section === "basics" && (
        <Panel title="Описание мероприятия">
          <BasicsForm
            key={event.id}
            event={event}
            onSubmit={(values) => {
              updateEvent(values);
              notify("Мероприятие сохранено");
            }}
            submitLabel="Сохранить изменения"
          />
        </Panel>
      )}
      {section === "tariffs" && <EventSales event={event} onChange={updateEvent} />}
      {section === "stats" && <EventStatistics event={event} />}
      {section === "orders" && <AdminOrders event={event} />}
      {section === "participants" && <AdminParticipants event={event} />}
    </>
  );
}
