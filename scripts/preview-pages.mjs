import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("out");
const { basePath } = JSON.parse(await readFile(path.join(root, "pages-config.json"), "utf8"));
const port = Number(process.env.PORT || 3086);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ttf": "font/ttf",
};

http
  .createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://localhost");
      const pathname = decodeURIComponent(url.pathname);
      if (basePath && pathname !== basePath && !pathname.startsWith(`${basePath}/`)) {
        response.writeHead(404).end("Not found");
        return;
      }
      let file = path.resolve(root, `.${pathname.slice(basePath.length) || "/"}`);
      if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
        response.writeHead(403).end("Forbidden");
        return;
      }
      if ((await stat(file)).isDirectory()) {
        if (!pathname.endsWith("/")) {
          response.writeHead(301, { Location: `${url.pathname}/${url.search}` }).end();
          return;
        }
        file = path.join(file, "index.html");
      }
      const data = await readFile(file);
      response.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
      });
      response.end(request.method === "HEAD" ? undefined : data);
    } catch {
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(await readFile(path.join(root, "404.html")).catch(() => "Not found"));
    }
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Static Pages preview: http://127.0.0.1:${port}${basePath}/`);
  });
