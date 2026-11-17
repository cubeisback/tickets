"use client";

import { assetPath } from "@/lib/paths";
import Link from "@/components/ui/app-link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Главная", icon: "home", href: "/cabinet" },
  { label: "Мои события", icon: "calendar", href: "/cabinet/my-events" },
  { label: "Мои заказы", icon: "orders", href: "/cabinet/orders" },
  { label: "Профиль", icon: "user", href: "/cabinet/profile" },
  { label: "FAQ", icon: "help", href: "/cabinet/faq" },
];

function NavigationIcon({ name, active = false }) {
  const activeIcons = {
    home: "home.svg",
    calendar: "3fba0.svg",
    orders: "26166.svg",
    user: "35f07.svg",
    help: "a4139.svg",
  };
  if (active)
    return (
      <img
        className="cabinet-sidebar__icon"
        src={assetPath(`/assets/cabinet/${activeIcons[name]}`)}
        alt=""
        width="24"
        height="24"
      />
    );
  if (name === "home")
    return (
      <img
        className="cabinet-sidebar__icon"
        src={assetPath("/assets/cabinet/65155.svg")}
        alt=""
        width="24"
        height="24"
      />
    );
  const compact = ["calendar", "orders", "user", "help"].includes(name);
  return compact ? (
    <picture className="cabinet-sidebar__icon">
      <source
        media="(max-width: 1199px)"
        srcSet={assetPath(`/assets/cabinet/${name}-compact.svg`)}
      />
      <img src={assetPath(`/assets/cabinet/${name}.svg`)} alt="" width="24" height="24" />
    </picture>
  ) : (
    <img
      className="cabinet-sidebar__icon"
      src={assetPath(`/assets/cabinet/${name}.svg`)}
      alt=""
      width="24"
      height="24"
    />
  );
}

export function CabinetSidebar({ mode, onToggle, onClose, toggleRef }) {
  const currentPath = usePathname().replace(/\/$/, "");
  const pathname = currentPath === "/cabinet/order" ? "/cabinet/orders" : currentPath;
  return (
    <nav
      id="cabinet-navigation"
      className="cabinet-sidebar"
      aria-label="Личный кабинет"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <div className="cabinet-sidebar__items">
        <button
          ref={toggleRef}
          type="button"
          className="cabinet-sidebar__item cabinet-sidebar__item--toggle"
          onClick={onToggle}
          aria-label="Переключить меню"
          aria-controls="cabinet-navigation"
          aria-expanded={mode === "auto" ? undefined : mode === "expanded"}
        >
          <img
            className="cabinet-sidebar__menu-icon"
            src={assetPath("/assets/cabinet/menu.svg")}
            alt=""
            width="24"
            height="24"
          />
          <img
            className="cabinet-sidebar__close-icon"
            src={assetPath("/assets/cabinet/close.svg")}
            alt=""
            width="24"
            height="24"
          />
          <span className="cabinet-sidebar__label">Свернуть</span>
        </button>
        {items.map((item) => {
          const active =
            item.icon === "home"
              ? pathname === "/cabinet" || pathname.startsWith("/cabinet/events/")
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.icon}
              href={item.href}
              className={`cabinet-sidebar__item${active ? " cabinet-sidebar__item--active" : ""}`}
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
              title={item.label}
              onClick={onClose}
            >
              <NavigationIcon name={item.icon} active={active} />
              <span className="cabinet-sidebar__label">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <Link
        className="cabinet-sidebar__item cabinet-sidebar__item--logout"
        href="/"
        aria-label="Выйти"
        title="Выйти"
      >
        <NavigationIcon name="logout" />
        <span className="cabinet-sidebar__label">Выйти</span>
      </Link>
    </nav>
  );
}
