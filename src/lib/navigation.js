"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { staticRoute } from "./paths";

export function useAppRouter() {
  const router = useRouter();
  return {
    ...router,
    push: (href, options) => router.push(staticRoute(href), options),
    replace: (href, options) => router.replace(staticRoute(href), options),
  };
}

export function useAdminPathname() {
  const pathname = usePathname().replace(/\/$/, "");
  const search = useSearchParams();
  return pathname === "/admin/view" ? `/admin/${search.get("path") || "dashboard"}` : pathname;
}
