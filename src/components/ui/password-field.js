"use client";

import { assetPath } from "@/lib/paths";

import { useState } from "react";
import { TextField } from "./text-field";

export function PasswordField({ label = "Пароль", id = "password", ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      {...props}
      id={id}
      label={label}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          className="password-toggle"
          aria-label={`${visible ? "Скрыть" : "Показать"} ${label.toLowerCase()}`}
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
        >
          <img src={assetPath("/assets/eye.svg")} alt="" width="18" height="18" />
        </button>
      }
    />
  );
}
