"use client";

import { notFound } from "next/navigation";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminEvents, AdminEvent, EventWizard } from "@/components/admin/admin-events";
import { AdminOrder, ManualOrder } from "@/components/admin/admin-orders";
import { AdminRefunds, AdminUsers, AdminUser } from "@/components/admin/admin-people";
import { AdminEntities, AdminFormats, AdminEmails } from "@/components/admin/admin-settings";

export function AdminRoute({ path }) {
  const [root, id, section] = path;
  if (!root) return <AdminLogin />;
  if (path.length === 1 && root === "dashboard") return <AdminDashboard />;
  if (root === "events") {
    if (!id) return <AdminEvents />;
    if (id === "new" && path.length === 2) return <EventWizard />;
    if (section === "orders" && path[3] === "new" && path.length === 4)
      return <ManualOrder eventId={id} />;
    if (
      path.length <= 3 &&
      (!section || ["tariffs", "stats", "orders", "participants"].includes(section))
    )
      return <AdminEvent eventId={id} section={section} />;
  }
  if (root === "orders" && id && path.length === 2) return <AdminOrder orderId={id} />;
  if (root === "refunds" && path.length === 1) return <AdminRefunds />;
  if (root === "users" && path.length === 1) return <AdminUsers />;
  if (root === "users" && id && path.length === 2) return <AdminUser userId={id} />;
  if (root === "settings" && path.length === 2) {
    if (id === "entities") return <AdminEntities />;
    if (id === "formats") return <AdminFormats />;
    if (id === "emails") return <AdminEmails />;
  }
  notFound();
}
