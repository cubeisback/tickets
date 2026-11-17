"use client";

import { useSearchParams } from "next/navigation";
import { AdminRoute } from "./admin-route";

export function QueryAdminRoute() {
  const search = useSearchParams();
  const path = (search.get("path") || "dashboard").split("/").filter(Boolean);
  return <AdminRoute key={path.join("/")} path={path} />;
}
