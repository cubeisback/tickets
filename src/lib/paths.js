export function assetPath(path) {
  return path.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}` : path;
}

export function staticRoute(href) {
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT !== "true" || typeof href !== "string") return href;
  const url = new URL(href, "https://demo.invalid");
  if (url.origin !== "https://demo.invalid") return href;
  const pathname = url.pathname.replace(/\/$/, "");
  if (/^\/admin\/(events|orders|users)\/[^/]+/.test(pathname) && pathname !== "/admin/events/new") {
    url.searchParams.set("path", pathname.slice("/admin/".length));
    return `/admin/view/${url.search}${url.hash}`;
  }
  const order = pathname.match(/^\/cabinet\/orders\/([^/]+)$/);
  if (order) {
    url.searchParams.set("id", order[1]);
    return `/cabinet/order/${url.search}${url.hash}`;
  }
  return href;
}
