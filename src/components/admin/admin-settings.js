"use client";
import { useRef, useState } from "react";
import { useAdmin, newId } from "./admin-provider";
import {
  Heading,
  Panel,
  Action,
  Field,
  Textarea,
  Check,
  Confirm,
  Modal,
  Table,
  formValues,
} from "./admin-ui";
import { requisiteLabels } from "./admin-orders";
import { EMAIL_VARIABLES } from "@/data/admin";

export function AdminEntities() {
  const { entities, setEntities, events, notify } = useAdmin();
  const [selectedId, setSelectedId] = useState(entities[0].id);
  const entity = entities.find((e) => e.id === selectedId) || entities[0];
  function add() {
    const item = {
      id: newId("entity"),
      shortName: "Новое юрлицо",
      legalName: "",
      isDefault: false,
    };
    setEntities([...entities, item]);
    setSelectedId(item.id);
  }
  function save(e) {
    const values = formValues(e);
    setEntities(entities.map((item) => (item.id === entity.id ? { ...item, ...values } : item)));
    notify("Юрлицо сохранено");
  }
  function stamp(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      notify("Выберите изображение до 5 МБ");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setEntities((list) =>
        list.map((item) => (item.id === entity.id ? { ...item, stamp: reader.result } : item)),
      );
    reader.readAsDataURL(file);
  }
  return (
    <>
      <Heading
        title="Юрлица организатора"
        description="Реквизиты для счетов и закрывающих документов"
        action={<Action onClick={add}>＋ Добавить юрлицо</Action>}
      />
      <div className="admin-settings">
        <nav className="admin-list-nav" aria-label="Юридические лица">
          {entities.map((item) => (
            <button
              type="button"
              key={item.id}
              aria-current={item.id === entity.id ? "true" : undefined}
              className={item.id === entity.id ? "admin-list-nav__active" : ""}
              onClick={() => setSelectedId(item.id)}
            >
              <strong>{item.shortName}</strong>
              <span>
                {item.isDefault ? "Основное · " : ""}
                {item.inn ? `ИНН ${item.inn}` : "Реквизиты не заполнены"}
              </span>
            </button>
          ))}
        </nav>
        <Panel
          title={entity.shortName}
          action={
            <div className="admin-actions">
              {!entity.isDefault && (
                <Action
                  secondary
                  onClick={() => {
                    setEntities(
                      entities.map((item) => ({ ...item, isDefault: item.id === entity.id })),
                    );
                    notify("Основное юрлицо изменено");
                  }}
                >
                  Сделать основным
                </Action>
              )}
              {!entity.isDefault && entities.length > 1 && (
                <Confirm
                  danger
                  title="Удалить юрлицо?"
                  description={
                    events.some((e) => e.legalEntityId === entity.id)
                      ? "Сначала выберите другое юрлицо в связанных мероприятиях."
                      : "Юрлицо будет удалено из справочника."
                  }
                  disabled={events.some((e) => e.legalEntityId === entity.id)}
                  onConfirm={() => {
                    setEntities(entities.filter((item) => item.id !== entity.id));
                    setSelectedId(entities.find((item) => item.id !== entity.id).id);
                  }}
                >
                  Удалить
                </Confirm>
              )}
            </div>
          }
        >
          <p className="admin-info">
            Юрлицо выбирается при создании мероприятия. Изменение реквизитов не изменяет уже
            выставленные документы.
          </p>
          <form key={entity.id} className="admin-form" onSubmit={save}>
            <div className="admin-grid">
              <Field
                label="Короткое название"
                name="shortName"
                defaultValue={entity.shortName}
                required
              />
              {Object.entries(requisiteLabels).map(([name, label]) => (
                <Field
                  key={name}
                  label={label}
                  name={name}
                  defaultValue={entity[name] || ""}
                  required={name === "legalName"}
                />
              ))}
            </div>
            <label className="admin-field">
              <span>Печать и подпись</span>
              <input type="file" accept="image/*" onChange={stamp} />
            </label>
            {entity.stamp && (
              <img className="admin-stamp" src={entity.stamp} alt="Печать и подпись организатора" />
            )}
            <Action type="submit">Сохранить реквизиты</Action>
          </form>
        </Panel>
      </div>
    </>
  );
}
export function AdminFormats() {
  const { formats, setFormats, events, notify } = useAdmin();
  const [editing, setEditing] = useState(null);
  function save(e) {
    const values = formValues(e);
    const item = {
      ...editing,
      ...values,
      id: editing.id || newId("format"),
      active: values.active === "on",
    };
    setFormats(
      formats.some((f) => f.id === item.id)
        ? formats.map((f) => (f.id === item.id ? item : f))
        : [...formats, item],
    );
    setEditing(null);
    notify("Формат сохранён");
  }
  return (
    <>
      <Heading
        title="Форматы мероприятий"
        description="Справочник форматов для событий и фильтров"
        action={<Action onClick={() => setEditing({ active: true })}>＋ Добавить формат</Action>}
      />
      <Panel>
        <Table
          rows={formats}
          columns={[
            {
              key: "name",
              label: "Название",
              render: (f) => (
                <div className="admin-cell">
                  <strong>{f.name}</strong>
                  <span>{f.desc}</span>
                </div>
              ),
            },
            {
              key: "usage",
              label: "Мероприятий",
              render: (f) => events.filter((e) => e.formatId === f.id).length,
            },
            {
              key: "active",
              label: "Статус",
              render: (f) => (
                <Check
                  checked={f.active}
                  onChange={() =>
                    setFormats(
                      formats.map((item) =>
                        item.id === f.id ? { ...item, active: !item.active } : item,
                      ),
                    )
                  }
                >
                  Активен
                </Check>
              ),
            },
            {
              key: "actions",
              label: "Действия",
              render: (f) => (
                <div className="admin-actions">
                  <Action secondary onClick={() => setEditing(f)}>
                    Изменить
                  </Action>
                  <Confirm
                    title="Удалить формат?"
                    disabled={events.some((e) => e.formatId === f.id)}
                    description="Удаление доступно, если формат не используется в мероприятиях."
                    danger
                    onConfirm={() => setFormats(formats.filter((item) => item.id !== f.id))}
                  >
                    Удалить
                  </Confirm>
                </div>
              ),
            },
          ]}
        />
      </Panel>
      {editing && (
        <Modal
          title={editing.id ? "Редактирование формата" : "Новый формат"}
          onClose={() => setEditing(null)}
        >
          <form className="admin-form" onSubmit={save}>
            <Field label="Название" name="name" defaultValue={editing.name} required />
            <Textarea label="Описание" name="desc" defaultValue={editing.desc} />
            <Check name="active" defaultChecked={editing.active}>
              Активен
            </Check>
            <div className="admin-actions">
              <Action type="submit">Сохранить формат</Action>
              <Action secondary onClick={() => setEditing(null)}>
                Отмена
              </Action>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
function RichEditor({ value, onChange, editorRef }) {
  const initialHTML = useRef(value);
  const rangeRef = useRef(null);
  const [linking, setLinking] = useState(false);
  function selection() {
    const sel = window.getSelection();
    if (sel.rangeCount && editorRef.current?.contains(sel.anchorNode))
      rangeRef.current = sel.getRangeAt(0).cloneRange();
  }
  function execute(command, argument) {
    editorRef.current.focus();
    if (rangeRef.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(rangeRef.current);
    }
    if (command === "createLink" && window.getSelection().isCollapsed) {
      const link = document.createElement("a");
      link.href = argument;
      link.textContent = argument;
      document.execCommand("insertHTML", false, link.outerHTML);
    } else document.execCommand(command, false, argument);
    onChange(editorRef.current.innerHTML);
    selection();
  }
  const tools = [
    ["bold", "B", "Полужирный"],
    ["italic", "I", "Курсив"],
    ["insertUnorderedList", "• Список", "Маркированный список"],
    ["insertOrderedList", "1. Список", "Нумерованный список"],
    ["removeFormat", "Очистить", "Убрать форматирование"],
  ];
  return (
    <>
      <div className="admin-editor">
        <div className="admin-editor__toolbar">
          {["h2", "h3", "p"].map((tag) => (
            <button
              type="button"
              key={tag}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => execute("formatBlock", tag)}
            >
              {tag === "p" ? "Абзац" : tag.toUpperCase()}
            </button>
          ))}
          {tools.map(([command, text, title]) => (
            <button
              type="button"
              key={command}
              title={title}
              aria-label={title}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => execute(command)}
            >
              {text}
            </button>
          ))}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setLinking(true)}
          >
            Ссылка
          </button>
        </div>
        <div
          ref={editorRef}
          className="admin-editor__body"
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label="Текст письма"
          aria-multiline="true"
          dangerouslySetInnerHTML={{ __html: initialHTML.current }}
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          onPaste={(e) => {
            e.preventDefault();
            document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
          }}
          onDrop={(e) => e.preventDefault()}
          onKeyUp={selection}
          onMouseUp={selection}
          onBlur={selection}
        />
      </div>
      {linking && (
        <Modal title="Вставить ссылку" onClose={() => setLinking(false)}>
          <form
            className="admin-form"
            onSubmit={(e) => {
              const data = formValues(e);
              const url = data.url.trim();
              if (!/^(https?:\/\/|mailto:|\{\{)/i.test(url)) {
                e.currentTarget.elements.url.setCustomValidity(
                  "Используйте https://, http://, mailto: или переменную",
                );
                e.currentTarget.elements.url.reportValidity();
                return;
              }
              e.currentTarget.closest("dialog").close();
              execute("createLink", url);
              setLinking(false);
            }}
          >
            <Field
              label="Адрес ссылки"
              name="url"
              required
              onInput={(e) => e.target.setCustomValidity("")}
            />
            <Action type="submit">Вставить ссылку</Action>
          </form>
        </Modal>
      )}
    </>
  );
}
export function AdminEmails() {
  const { templates, setTemplates, notify } = useAdmin();
  const [selectedId, setSelectedId] = useState(templates[0].id);
  const selected = templates.find((t) => t.id === selectedId);
  const [draft, setDraft] = useState(selected);
  const editor = useRef(null);

  const [body, setBody] = useState(selected.body);
  const [preview, setPreview] = useState(false);
  function select(t) {
    setSelectedId(t.id);
    setDraft(t);
    setBody(t.body);
    setPreview(false);
  }
  function save(e) {
    e.preventDefault();
    const updated = { ...draft, body: editor.current?.innerHTML ?? body };
    setTemplates(templates.map((t) => (t.id === updated.id ? updated : t)));
    setBody(updated.body);
    notify("Шаблон сохранён");
  }
  function insert(variable) {
    const el = editor.current;
    el.focus();
    const selection = window.getSelection();
    if (!el.contains(selection.anchorNode)) {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    document.execCommand("insertText", false, variable);
    setBody(el.innerHTML);
  }
  return (
    <>
      <Heading
        title="Шаблоны писем"
        description="Содержание и условия отправки сервисных сообщений"
      />
      <div className="admin-settings">
        <nav className="admin-list-nav" aria-label="Шаблоны писем">
          {templates.map((t) => (
            <button
              type="button"
              key={t.id}
              className={selectedId === t.id ? "admin-list-nav__active" : ""}
              onClick={() => select(t)}
            >
              <strong>{t.name}</strong>
              <span>
                {t.audience} · {t.active ? "Активен" : "Отключён"}
              </span>
            </button>
          ))}
        </nav>
        <Panel
          title={selected.name}
          action={
            <Action
              secondary
              onClick={() => notify("Тестовая отправка будет доступна после подключения API")}
            >
              Отправить тестовое
            </Action>
          }
        >
          <form className="admin-form" onSubmit={save}>
            <div className="admin-grid">
              <Check
                checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
              >
                Отправка включена
              </Check>
              <Field label="Код шаблона" value={draft.code} disabled />
            </div>
            <Field
              label="Тема письма"
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              required
            />
            <label className="admin-field">
              <span>Текст письма</span>
            </label>
            <RichEditor key={selectedId} value={body} onChange={setBody} editorRef={editor} />
            <fieldset className="admin-fieldset">
              <legend>Переменные</legend>
              <div className="admin-actions">
                {EMAIL_VARIABLES.map((variable) => (
                  <button
                    className="admin-variable"
                    key={variable}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => insert(variable)}
                  >
                    {variable}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="admin-actions">
              <Action type="submit">Сохранить шаблон</Action>
              <Action
                secondary
                onClick={() => {
                  setBody(editor.current.innerHTML);
                  setPreview(!preview);
                }}
              >
                Предпросмотр
              </Action>
            </div>
            {preview && (
              <iframe
                className="admin-email-preview"
                title="Предпросмотр письма"
                sandbox=""
                srcDoc={`<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>body{font:16px/1.6 Arial;padding:24px;overflow-wrap:anywhere}a{color:#5876e6}</style></head><body>${body}</body></html>`}
              />
            )}
          </form>
        </Panel>
      </div>
    </>
  );
}
