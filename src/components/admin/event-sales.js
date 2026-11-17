"use client";
import { useState } from "react";
import { useAdmin, newId } from "./admin-provider";
import {
  Action,
  Panel,
  Table,
  Modal,
  Field,
  Select,
  Textarea,
  Check,
  Confirm,
  DocumentLink,
  formValues,
  Badge,
} from "./admin-ui";
import { currentPrice, formatPrice, sortedPrices, nextPriceChange, makeCodes } from "@/data/admin";

function TariffEditor({ initial, onSave, onClose }) {
  const [prices, setPrices] = useState(initial?.prices || [{ validFrom: "", price: "" }]);
  const [points, setPoints] = useState(initial?.points || [""]);
  function submit(event) {
    const values = formValues(event);
    onSave({
      ...initial,
      ...values,
      id: initial?.id || newId("tariff"),
      limit: Number(values.limit),
      sold: initial?.sold || 0,
      reserved: initial?.reserved || 0,
      points: points.filter(Boolean),
      prices: prices.map((p) => ({ ...p, price: Number(p.price) })),
    });
  }
  return (
    <Modal title={initial ? "Редактирование тарифа" : "Новый тариф"} onClose={onClose}>
      <form className="admin-form" onSubmit={submit}>
        <div className="admin-grid">
          <Field label="Название" name="name" defaultValue={initial?.name} required />
          <Field label="Тег" name="tag" defaultValue={initial?.tag} />
        </div>
        <Field label="Краткое описание" name="desc" defaultValue={initial?.desc} />
        <fieldset className="admin-fieldset">
          <legend>Преимущества тарифа</legend>
          {points.map((point, index) => (
            <div className="admin-row" key={index}>
              <Field
                label={`Пункт ${index + 1}`}
                value={point}
                onChange={(e) =>
                  setPoints(points.map((p, i) => (i === index ? e.target.value : p)))
                }
              />
              <Action
                secondary
                onClick={() => setPoints(points.filter((_, i) => i !== index))}
                aria-label={`Удалить пункт ${index + 1}`}
              >
                ×
              </Action>
            </div>
          ))}
          <Action secondary onClick={() => setPoints([...points, ""])}>
            Добавить пункт
          </Action>
        </fieldset>
        <fieldset className="admin-fieldset">
          <legend>Расписание цен</legend>
          <p className="admin-muted">
            Действует последняя цена, дата начала которой наступила. Лимит общий для всех периодов.
          </p>
          {prices.map((price, index) => (
            <div className="admin-row" key={index}>
              <Field
                label={index ? "Действует с" : "С начала продаж"}
                type={index ? "date" : "text"}
                disabled={!index}
                value={index ? toISO(price.validFrom) : "С начала продаж"}
                required={!!index}
                onChange={(e) =>
                  setPrices(
                    prices.map((p, i) =>
                      i === index ? { ...p, validFrom: fromISO(e.target.value) } : p,
                    ),
                  )
                }
              />
              <Field
                label="Цена, ₽"
                type="number"
                min="0"
                step="1"
                required
                value={price.price}
                onChange={(e) =>
                  setPrices(
                    prices.map((p, i) => (i === index ? { ...p, price: e.target.value } : p)),
                  )
                }
              />
              {index > 0 && (
                <Action
                  secondary
                  aria-label={`Удалить цену ${index + 1}`}
                  onClick={() => setPrices(prices.filter((_, i) => i !== index))}
                >
                  ×
                </Action>
              )}
            </div>
          ))}
          <Action secondary onClick={() => setPrices([...prices, { validFrom: "", price: "" }])}>
            Добавить цену с даты
          </Action>
        </fieldset>
        <div className="admin-grid">
          <Field
            label="Лимит количества"
            name="limit"
            type="number"
            min="1"
            defaultValue={initial?.limit}
            required
          />
          <Field
            label="Продажи до"
            name="salesEnd"
            defaultValue={initial?.salesEnd}
            placeholder="20.09.2026"
            pattern="\d{2}\.\d{2}\.\d{4}"
          />
        </div>
        <div className="admin-actions">
          <Action type="submit">Сохранить тариф</Action>
          <Action secondary onClick={onClose}>
            Отмена
          </Action>
        </div>
      </form>
    </Modal>
  );
}
function toISO(value) {
  return value?.split(".").reverse().join("-") || "";
}
function fromISO(value) {
  return value?.split("-").reverse().join(".") || "";
}

function PromoEditor({ initial, tariffs, batch = false, existingCodes, onSave, onClose }) {
  const [discountType, setDiscountType] = useState(initial?.discountType || "percent");
  const [scope, setScope] = useState(initial?.ticketTypeIds || []);
  const [active, setActive] = useState(initial?.active ?? true);
  const [rawCodes, setRawCodes] = useState("");
  const [error, setError] = useState("");
  async function importCodes(e) {
    const file = e.target.files[0];
    if (file) setRawCodes(await file.text());
  }
  function submit(e) {
    const values = formValues(e);
    const code = values.code?.trim().toUpperCase();
    if (!batch && existingCodes.includes(code) && code !== initial?.code) {
      setError("Такой промокод уже существует");
      return;
    }
    const parsed = [
      ...new Set(
        rawCodes
          .split(/[\s,;]+/)
          .map((c) => c.trim().toUpperCase())
          .filter(Boolean),
      ),
    ];
    if (
      batch &&
      parsed.some(
        (c) => existingCodes.includes(c) && !initial?.codes.some((item) => item.code === c),
      )
    ) {
      setError("Среди импортируемых кодов есть уже существующие");
      return;
    }
    const codes = initial
      ? [
          ...(initial.codes || []),
          ...parsed
            .filter((code) => !(initial.codes || []).some((item) => item.code === code))
            .map((code) => ({ code, usedAt: null, orderId: null })),
        ]
      : parsed.length
        ? parsed.map((code) => ({ code, usedAt: null, orderId: null }))
        : makeCodes(values.prefix || "CODE-", Number(values.count), 0);
    if (batch && !initial && codes.some((c) => existingCodes.includes(c.code))) {
      setError("Коды уже существуют. Измените префикс или импортируемый список");
      return;
    }
    if (batch && !codes.length) {
      setError("Добавьте коды или укажите их количество");
      return;
    }
    onSave({
      ...initial,
      ...values,
      id: initial?.id || newId(batch ? "batch" : "promo"),
      code,
      value: Number(values.value),
      usageLimit: Number(values.usageLimit || 1),
      used: initial?.used || 0,
      discountType,
      active,
      ticketTypeIds: scope,
      ...(batch ? { codes } : {}),
    });
  }
  return (
    <Modal
      title={
        batch
          ? initial
            ? "Редактирование пакета"
            : "Новый пакет одноразовых кодов"
          : initial
            ? "Редактирование промокода"
            : "Новый промокод"
      }
      onClose={onClose}
    >
      <form className="admin-form" onSubmit={submit}>
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
        <Field
          label={batch ? "Название пакета" : "Код"}
          name={batch ? "name" : "code"}
          defaultValue={batch ? initial?.name : initial?.code}
          required
        />
        <div className="admin-grid">
          <Select
            label="Тип скидки"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            options={[
              { value: "percent", label: "Процент, %" },
              { value: "fixed", label: "Сумма, ₽" },
            ]}
          />
          <Field
            label="Значение скидки"
            name="value"
            type="number"
            min="1"
            max={discountType === "percent" ? "100" : undefined}
            defaultValue={initial?.value}
            required
          />
        </div>
        <fieldset className="admin-fieldset">
          <legend>Действует на тарифы</legend>
          <p className="admin-muted">Ничего не выбрано — действует на все тарифы.</p>
          {tariffs.map((t) => (
            <Check
              key={t.id}
              checked={scope.includes(t.id)}
              onChange={(e) =>
                setScope(e.target.checked ? [...scope, t.id] : scope.filter((id) => id !== t.id))
              }
            >
              {t.name}
            </Check>
          ))}
        </fieldset>
        <div className="admin-grid">
          {!batch && (
            <Field
              label="Лимит использований"
              name="usageLimit"
              type="number"
              min="1"
              defaultValue={initial?.usageLimit || 1}
              required
            />
          )}
          <Field
            label="Действует до"
            name="validUntil"
            placeholder="01.09.2026"
            pattern="\d{2}\.\d{2}\.\d{4}"
            defaultValue={initial?.validUntil}
          />
        </div>
        {batch && (
          <fieldset className="admin-fieldset">
            <legend>Коды пакета</legend>
            {!initial && (
              <div className="admin-grid">
                <Field label="Префикс" name="prefix" defaultValue="CODE-" />
                <Field
                  label="Количество для генерации"
                  name="count"
                  type="number"
                  min="1"
                  max="10000"
                  defaultValue="100"
                  required={!rawCodes.trim()}
                />
              </div>
            )}
            <Textarea
              label={initial ? "Догрузить коды" : "Или импортировать коды списком"}
              value={rawCodes}
              onChange={(e) => setRawCodes(e.target.value)}
              placeholder="Один код на строку или через запятую"
            />
            <label className="admin-field">
              <span>Загрузить TXT / CSV</span>
              <input type="file" accept=".txt,.csv" onChange={importCodes} />
            </label>
          </fieldset>
        )}
        <Check checked={active} onChange={(e) => setActive(e.target.checked)}>
          Активен
        </Check>
        <div className="admin-actions">
          <Action type="submit">Сохранить</Action>
          <Action secondary onClick={onClose}>
            Отмена
          </Action>
        </div>
      </form>
    </Modal>
  );
}
function BatchCodes({ batch, onClose }) {
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const rows = batch.codes.filter(
    (code) =>
      (status === "all" || Boolean(code.usedAt) === (status === "used")) &&
      code.code.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Modal title={batch.name} onClose={onClose}>
      <div className="admin-filters">
        <Field label="Поиск кода" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Select
          label="Статус"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "all", label: "Все" },
            { value: "used", label: "Использованные" },
            { value: "free", label: "Неиспользованные" },
          ]}
        />
        <DocumentLink>Экспорт кодов</DocumentLink>
      </div>
      <Table
        rowKey="code"
        rows={rows}
        columns={[
          { key: "code", label: "Код" },
          { key: "usedAt", label: "Использован", render: (c) => c.usedAt || "Нет" },
          { key: "orderId", label: "Заказ", render: (c) => c.orderId || "—" },
        ]}
      />
    </Modal>
  );
}
export function EventSales({ event, onChange }) {
  const { notify, orders } = useAdmin();
  const [editor, setEditor] = useState(null);
  const [viewing, setViewing] = useState(null);
  function save(kind, value) {
    const list = event[kind] || [];
    onChange({
      ...event,
      [kind]: list.some((item) => item.id === value.id)
        ? list.map((item) => (item.id === value.id ? value : item))
        : [...list, value],
    });
    setEditor(null);
    notify("Изменения сохранены");
  }
  function remove(kind, id) {
    onChange({ ...event, [kind]: event[kind].filter((item) => item.id !== id) });
  }
  const scopeLabel = (ids) =>
    ids.length
      ? ids
          .map((id) => event.tariffs.find((t) => t.id === id)?.name || "Удалённый тариф")
          .join(", ")
      : "Все тарифы";
  const existingCodes = [
    ...event.promocodes.map((p) => p.code),
    ...(event.promoBatches || []).flatMap((b) => b.codes.map((c) => c.code)),
  ];
  return (
    <div className="admin-stack">
      <Panel
        title="Тарифы"
        action={<Action onClick={() => setEditor({ kind: "tariffs" })}>＋ Добавить тариф</Action>}
      >
        <div className="admin-tariffs">
          {event.tariffs.map((t) => (
            <article className="admin-tariff" key={t.id}>
              <header>
                <h3>{t.name}</h3>
                {t.tag && <span className="admin-badge">{t.tag}</span>}
              </header>
              <strong className="admin-tariff__price">{formatPrice(currentPrice(t))}</strong>
              <p>{t.desc}</p>
              <ul>
                {t.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              <div className="admin-muted">
                Лимит: {t.limit} · Продано:{" "}
                {
                  orders
                    .filter((o) => o.eventId === event.id && o.status === "paid")
                    .flatMap((o) => o.participants)
                    .filter((p) => p.tariffId === t.id).length
                }{" "}
                · Резерв:{" "}
                {
                  orders
                    .filter((o) => o.eventId === event.id && o.status === "pending")
                    .flatMap((o) => o.participants)
                    .filter((p) => p.tariffId === t.id).length
                }
              </div>
              <div className="admin-price-list">
                {sortedPrices(t).map((p, i) => (
                  <div className="admin-summary" key={i}>
                    <span>{p.validFrom || "С начала продаж"}</span>
                    <strong>{formatPrice(p.price)}</strong>
                  </div>
                ))}
              </div>
              {nextPriceChange(t) && (
                <p className="admin-info">Следующее изменение: {nextPriceChange(t).validFrom}</p>
              )}
              <div className="admin-actions">
                <Action secondary onClick={() => setEditor({ kind: "tariffs", initial: t })}>
                  Редактировать
                </Action>
                <Confirm
                  title="Удалить тариф?"
                  disabled={
                    t.sold > 0 ||
                    orders.some(
                      (o) =>
                        o.eventId === event.id && o.participants.some((p) => p.tariffId === t.id),
                    )
                  }
                  description="Тариф исчезнет из продажи. Оформленные билеты сохраняются."
                  onConfirm={() => {
                    onChange({
                      ...event,
                      tariffs: event.tariffs.filter((item) => item.id !== t.id),
                      promocodes: event.promocodes.map((p) => ({
                        ...p,
                        ticketTypeIds: p.ticketTypeIds.filter((id) => id !== t.id),
                      })),
                      promoBatches: (event.promoBatches || []).map((p) => ({
                        ...p,
                        ticketTypeIds: p.ticketTypeIds.filter((id) => id !== t.id),
                      })),
                    });
                  }}
                  danger
                >
                  Удалить
                </Confirm>
              </div>
            </article>
          ))}
          {!event.tariffs.length && <p className="admin-empty">Добавьте первый тариф</p>}
        </div>
      </Panel>
      <Panel
        title="Промокоды"
        action={
          <Action onClick={() => setEditor({ kind: "promocodes" })}>＋ Новый промокод</Action>
        }
      >
        <Table
          rows={event.promocodes}
          columns={[
            { key: "code", label: "Код" },
            {
              key: "value",
              label: "Скидка",
              render: (p) => (p.discountType === "percent" ? `${p.value}%` : formatPrice(p.value)),
            },
            { key: "scope", label: "Тарифы", render: (p) => scopeLabel(p.ticketTypeIds) },
            { key: "used", label: "Использовано", render: (p) => `${p.used} / ${p.usageLimit}` },
            { key: "validUntil", label: "До" },
            {
              key: "active",
              label: "Статус",
              render: (p) => <Badge status={p.active ? "active" : "archive"} />,
            },
            {
              key: "actions",
              label: "Действия",
              render: (p) => (
                <div className="admin-actions">
                  <Action secondary onClick={() => setEditor({ kind: "promocodes", initial: p })}>
                    Изменить
                  </Action>
                  <Check
                    checked={p.active}
                    onChange={() => save("promocodes", { ...p, active: !p.active })}
                  >
                    Включён
                  </Check>
                  <Confirm
                    title="Удалить промокод?"
                    onConfirm={() => remove("promocodes", p.id)}
                    danger
                  >
                    Удалить
                  </Confirm>
                </div>
              ),
            },
          ]}
        />
      </Panel>
      <Panel
        title="Пакеты одноразовых кодов"
        action={<Action onClick={() => setEditor({ kind: "promoBatches" })}>＋ Новый пакет</Action>}
      >
        <Table
          rows={event.promoBatches || []}
          columns={[
            { key: "name", label: "Название" },
            {
              key: "value",
              label: "Скидка",
              render: (b) => (b.discountType === "percent" ? `${b.value}%` : formatPrice(b.value)),
            },
            { key: "scope", label: "Тарифы", render: (p) => scopeLabel(p.ticketTypeIds) },
            {
              key: "used",
              label: "Использовано",
              render: (b) => `${b.codes.filter((c) => c.usedAt).length} / ${b.codes.length}`,
            },
            { key: "validUntil", label: "До" },
            {
              key: "active",
              label: "Статус",
              render: (b) => <Badge status={b.active ? "active" : "archive"} />,
            },
            {
              key: "actions",
              label: "Действия",
              render: (b) => (
                <div className="admin-actions">
                  <Action secondary onClick={() => setViewing(b)}>
                    Коды
                  </Action>
                  <Action secondary onClick={() => setEditor({ kind: "promoBatches", initial: b })}>
                    Изменить
                  </Action>
                  <Confirm
                    title="Удалить пакет?"
                    onConfirm={() => remove("promoBatches", b.id)}
                    danger
                  >
                    Удалить
                  </Confirm>
                </div>
              ),
            },
          ]}
        />
      </Panel>
      {editor?.kind === "tariffs" && (
        <TariffEditor
          initial={editor.initial}
          onClose={() => setEditor(null)}
          onSave={(v) => save("tariffs", v)}
        />
      )}
      {editor && editor.kind !== "tariffs" && (
        <PromoEditor
          initial={editor.initial}
          tariffs={event.tariffs}
          batch={editor.kind === "promoBatches"}
          existingCodes={existingCodes}
          onClose={() => setEditor(null)}
          onSave={(v) => save(editor.kind, v)}
        />
      )}
      {viewing && <BatchCodes batch={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}
