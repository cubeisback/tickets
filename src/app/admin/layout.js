import { AdminProvider } from "@/components/admin/admin-provider";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import "./admin.css";

export const metadata = { title: "Панель управления", robots: { index: false, follow: false } };
export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <Suspense fallback={<p>Открываем панель управления…</p>}>
        <AdminShell>{children}</AdminShell>
      </Suspense>
    </AdminProvider>
  );
}
