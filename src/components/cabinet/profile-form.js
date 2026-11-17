"use client";
import { useState } from "react";
import { useDemo } from "./demo-provider";
import { requisiteFields } from "@/data/cabinet";
import { TextField } from "@/components/ui/text-field";
import { PasswordField } from "@/components/ui/password-field";
import { Button } from "@/components/ui/button";

export function ProfileForm() {
  const { profile, setProfile } = useDemo();
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  function update(key, value) {
    setSaved(false);
    setDraft((current) => ({ ...current, [key]: value }));
  }
  function save(event) {
    event.preventDefault();
    setProfile(draft);
    setSaved(true);
  }
  function savePassword(event) {
    event.preventDefault();
    event.currentTarget.reset();
    setChangePassword(false);
    setPasswordSaved(true);
  }
  function validatePassword(event) {
    const { newPassword, repeatPassword } = event.currentTarget.elements;
    repeatPassword.setCustomValidity(
      repeatPassword.value && repeatPassword.value !== newPassword.value
        ? "Пароли не совпадают"
        : "",
    );
  }
  return (
    <section className="profile-form panel">
      <h2 className="panel__subtitle">Личные данные</h2>
      <div className="field-grid">
        {[
          ["name", "Имя"],
          ["surname", "Фамилия"],
          ["email", "E-mail"],
          ["phone", "Телефон"],
          ["company", "Компания"],
        ].map(([key, label]) => (
          <TextField
            key={key}
            form="profile-save"
            id={`profile-${key}`}
            name={key}
            label={label}
            value={draft[key]}
            required={key === "name" || key === "surname"}
            disabled={key === "email"}
            type={key === "phone" ? "tel" : "text"}
            onChange={(event) => update(key, event.target.value)}
          />
        ))}
      </div>
      {changePassword ? (
        <form
          className="password-change"
          method="post"
          onInput={validatePassword}
          onSubmit={savePassword}
        >
          <h3 className="panel__subtitle">Смена пароля</h3>
          <div className="field-grid">
            <PasswordField
              id="newPassword"
              name="newPassword"
              autoComplete="new-password"
              required
            />
            <PasswordField
              id="repeatPassword"
              name="repeatPassword"
              label="Повторите пароль"
              autoComplete="new-password"
              required
            />
          </div>
          <div className="button-row">
            <Button className="cabinet-button" type="submit">
              Сохранить
            </Button>
            <Button
              className="cabinet-button"
              variant="secondary"
              onClick={() => setChangePassword(false)}
            >
              Отмена
            </Button>
          </div>
        </form>
      ) : (
        <button
          className="accent-link"
          type="button"
          onClick={() => {
            setChangePassword(true);
            setPasswordSaved(false);
          }}
        >
          {passwordSaved ? "Пароль изменён" : "Сменить пароль"}
        </button>
      )}
      <hr className="section-rule" />
      <div className="page-heading">
        <h2 className="panel__subtitle">Реквизиты юрлица</h2>
        <p className="panel__description">
          Подставляются автоматически при оплате по счету — на шаге оформления заказа их можно
          скорректировать, это не изменит сохранённые здесь данные
        </p>
      </div>
      <div className="field-grid">
        {requisiteFields.map(([key, label]) => (
          <TextField
            key={key}
            form="profile-save"
            id={`profile-${key}`}
            name={key}
            label={label}
            placeholder={label}
            value={draft.requisites[key]}
            onChange={(event) => {
              setSaved(false);
              setDraft((current) => ({
                ...current,
                requisites: { ...current.requisites, [key]: event.target.value },
              }));
            }}
          />
        ))}
      </div>
      <form id="profile-save" className="profile-form__save" method="post" onSubmit={save}>
        <Button className="cabinet-button" type="submit">
          {saved ? "Изменения сохранены" : "Сохранить изменения"}
        </Button>
      </form>
    </section>
  );
}
