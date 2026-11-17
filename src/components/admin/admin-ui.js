"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "@/components/ui/app-link";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { ORDER_STATUS, TICKET_STATUS } from "@/data/admin";

export function Action({ children, secondary = false, danger = false, className = "", ...props }) {
  return (
    <Button
      variant={secondary ? "secondary" : "primary"}
      className={`admin-button${danger ? " admin-button--danger" : ""} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}
export function Field({ label, name, type = "text", ...props }) {
  const id = useId();
  return <TextField id={id} name={name} label={label} type={type} {...props} />;
}
export function Select({ label, options, ...props }) {
  const id = useId();
  return (
    <div className="admin-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="admin-input" {...props}>
        {options.map((option) => (
          <option value={option.value ?? option.id} key={option.value ?? option.id}>
            {option.label ?? option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
export function Textarea({ label, ...props }) {
  const id = useId();
  return (
    <div className="admin-field">
      <label htmlFor={id}>{label}</label>
      <textarea id={id} className="admin-input admin-input--textarea" {...props} />
    </div>
  );
}
export function Check({ children, ...props }) {
  return (
    <label className="admin-check">
      <input type="checkbox" {...props} />
      <span>{children}</span>
    </label>
  );
}
export function Panel({ title, action, children, className = "" }) {
  return (
    <section className={`admin-panel ${className}`}>
      {(title || action) && (
        <header className="admin-panel__header">
          <h2>{title}</h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
export function Heading({ title, description, action, back }) {
  return (
    <header className="admin-heading">
      <div>
        {back && (
          <Link className="admin-back" href={back.href}>
            ← {back.label}
          </Link>
        )}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
  );
}
export function Badge({ status, ticket = false }) {
  const labels = {
    active: "Активно",
    archive: "Архив",
    draft: "Черновик",
    approved: "Одобрена",
    rejected: "Отклонена",
  };
  return (
    <span className={`admin-badge admin-badge--${status}`}>
      {(ticket ? TICKET_STATUS : ORDER_STATUS)[status]?.text ?? labels[status] ?? status}
    </span>
  );
}
export function Stat({ label, value, hint }) {
  return (
    <div className="admin-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      {hint && <small>{hint}</small>}
    </div>
  );
}
export function Tabs({ items, value, onChange }) {
  return (
    <div className="admin-tabs" role="tablist">
      {items.map((item) => (
        <button
          type="button"
          role="tab"
          aria-selected={item.id === value}
          className={`admin-tabs__tab${item.id === value ? " admin-tabs__tab--active" : ""}`}
          key={item.id}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
export function Table({
  columns,
  rows,
  rowKey = "id",
  pageSize = 10,
  empty = "Ничего не найдено",
}) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: "", direction: 1 });
  const column = columns.find((item) => item.key === sort.key);
  const ordered = column?.sort
    ? [...rows].sort((a, b) => column.sort(a, b) * sort.direction)
    : rows;
  const pages = Math.max(1, Math.ceil(ordered.length / pageSize));
  const current = Math.min(page, pages);
  const visible = ordered.slice((current - 1) * pageSize, current * pageSize);
  return (
    <div className="admin-data">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={
                    col.sort
                      ? sort.key === col.key
                        ? sort.direction === 1
                          ? "ascending"
                          : "descending"
                        : "none"
                      : undefined
                  }
                >
                  {col.sort ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSort({
                          key: col.key,
                          direction: sort.key === col.key ? -sort.direction : 1,
                        });
                        setPage(1);
                      }}
                    >
                      {col.label} ↕
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, index) => (
              <tr key={typeof rowKey === "function" ? rowKey(row, index) : row[rowKey]}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="admin-empty">{empty}</p>}
      </div>
      {rows.length > pageSize && (
        <div className="admin-pagination">
          <span>Всего: {rows.length}</span>
          <Action secondary disabled={current === 1} onClick={() => setPage(current - 1)}>
            ← Назад
          </Action>
          <span>
            {current} / {pages}
          </span>
          <Action secondary disabled={current === pages} onClick={() => setPage(current + 1)}>
            Далее →
          </Action>
        </div>
      )}
    </div>
  );
}
export function Modal({ title, onClose, children }) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, [mounted]);
  return mounted
    ? createPortal(
        <dialog
          ref={ref}
          className="admin-modal"
          aria-labelledby={titleId}
          onCancel={onClose}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              const box = event.currentTarget.getBoundingClientRect();
              if (
                event.clientX < box.left ||
                event.clientX > box.right ||
                event.clientY < box.top ||
                event.clientY > box.bottom
              )
                onClose();
            }
          }}
        >
          <header className="admin-panel__header">
            <h2 id={titleId}>{title}</h2>
            <button
              className="admin-close"
              type="button"
              onClick={onClose}
              aria-label="Закрыть окно"
            >
              ×
            </button>
          </header>
          {children}
        </dialog>,
        document.body,
      )
    : null;
}
export function Confirm({
  children,
  title,
  description,
  onConfirm,
  disabled = false,
  danger = false,
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Action secondary danger={danger} disabled={disabled} onClick={() => setOpen(true)}>
        {children}
      </Action>
      {open && (
        <Modal title={title} onClose={() => setOpen(false)}>
          <p>{description}</p>
          <div className="admin-actions">
            <Action
              danger={danger}
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              Подтвердить
            </Action>
            <Action secondary onClick={() => setOpen(false)}>
              Отмена
            </Action>
          </div>
        </Modal>
      )}
    </>
  );
}
export function DocumentLink({ children }) {
  return (
    <a href="" className="button button--secondary admin-button">
      ↓ {children}
    </a>
  );
}
export function ExportLink() {
  return <DocumentLink>Экспорт в Excel</DocumentLink>;
}
export function formValues(event) {
  event.preventDefault();
  event.stopPropagation();
  return Object.fromEntries(new FormData(event.currentTarget));
}
export function applySearch(rows, query, fields) {
  const q = query.trim().toLocaleLowerCase("ru-RU");
  return rows.filter((row) =>
    fields.some((field) =>
      String(row[field] ?? "")
        .toLocaleLowerCase("ru-RU")
        .includes(q),
    ),
  );
}
