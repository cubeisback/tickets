import { Suspense } from "react";
import { EVENTS, ORDERS, USERS } from "@/data/admin";
import { AdminRoute } from "@/components/admin/admin-route";
import { QueryAdminRoute } from "@/components/admin/query-admin-route";

export function generateStaticParams() {
  return [
    [],
    ["view"],
    ["dashboard"],
    ["events"],
    ["events", "new"],
    ["refunds"],
    ["users"],
    ...["entities", "formats", "emails"].map((key) => ["settings", key]),
    ...EVENTS.flatMap((event) => [
      ["events", event.id],
      ...["tariffs", "stats", "orders", "participants"].map((tab) => ["events", event.id, tab]),
      ["events", event.id, "orders", "new"],
    ]),
    ...ORDERS.map((order) => ["orders", String(order.id)]),
    ...USERS.map((user) => ["users", user.id]),
  ].map((path) => ({ path }));
}
export async function generateMetadata({ params }) {
  const { path = [] } = await params;
  const titles = {
    dashboard: "Дашборд",
    events: "Мероприятия",
    refunds: "Возвраты",
    users: "Пользователи",
    settings: "Настройки",
    orders: "Заказ",
  };
  return {
    title: path.length
      ? `${titles[path[0]] || "Раздел"} — панель управления`
      : "Вход в панель управления",
  };
}
export default async function AdminPage({ params }) {
  const { path = [] } = await params;
  if (path[0] === "view")
    return (
      <Suspense fallback={<p>Открываем раздел…</p>}>
        <QueryAdminRoute />
      </Suspense>
    );
  return <AdminRoute path={path} />;
}
