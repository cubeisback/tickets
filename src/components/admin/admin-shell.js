"use client";

import { assetPath } from "@/lib/paths";
import { useState } from "react";
import { useAdminPathname } from "@/lib/navigation";
import Link from "@/components/ui/app-link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { useAdmin } from "./admin-provider";

const navigation = [
  ["dashboard", "Дашборд", "home"],
  ["events", "Мероприятия", "calendar"],
  ["refunds", "Возвраты", "orders"],
  ["users", "Пользователи", "user"],
  ["settings/entities", "Юрлица", "orders"],
  ["settings/formats", "Форматы", "calendar"],
  ["settings/emails", "Шаблоны писем", "help"],
];
export function AdminShell({ children }) {
  const pathname = useAdminPathname();
  const [collapsed, setCollapsed] = useState(false);
  const { refunds, reset } = useAdmin();
  if (pathname === "/admin" || pathname === "/admin/") return children;
  return (
    <div className={`admin-shell${collapsed ? " admin-shell--collapsed" : ""}`}>
      <header className="admin-header">
        <Link href="/admin/dashboard" aria-label="ADPASS.EVENT — панель управления">
          <BrandLogo />
        </Link>
        <span className="admin-header__label">Панель управления</span>
        <div className="admin-header__account">
          <span className="admin-avatar">А</span>
          <span>admin@adpass.ru</span>
          <Link href="/admin" onClick={reset}>
            Выйти ↗
          </Link>
        </div>
      </header>
      <aside className="admin-sidebar">
        <button
          className="admin-sidebar__toggle"
          type="button"
          aria-label="Свернуть или развернуть меню"
          aria-expanded={!collapsed}
          onClick={() => setCollapsed(!collapsed)}
        >
          ☰ <span>Свернуть меню</span>
        </button>
        <nav aria-label="Администрирование">
          {navigation.map(([path, label, icon], index) => (
            <div key={path}>
              {index === 4 && <span className="admin-sidebar__group">Настройки</span>}
              <Link
                title={label}
                aria-label={label}
                href={`/admin/${path}`}
                className={`admin-sidebar__link${pathname.startsWith(`/admin/${path}`) || (path === "events" && pathname.startsWith("/admin/orders")) ? " admin-sidebar__link--active" : ""}`}
                aria-current={pathname.startsWith(`/admin/${path}`) ? "page" : undefined}
              >
                <img
                  src={assetPath(`/assets/cabinet/${icon === "home" ? "65155" : icon}.svg`)}
                  alt=""
                  width="22"
                  height="22"
                />
                <span>{label}</span>
                {path === "refunds" && refunds.some((r) => r.status === "pending") && (
                  <small>{refunds.filter((r) => r.status === "pending").length}</small>
                )}
              </Link>
            </div>
          ))}
        </nav>
        <Link className="admin-sidebar__exit" href="/admin" onClick={reset}>
          ↗ <span>Выйти</span>
        </Link>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
