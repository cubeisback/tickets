import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("out");
const { basePath } = JSON.parse(await readFile(path.join(root, "pages-config.json"), "utf8"));
const origin = "https://pages.invalid";
const checked = new Set();
let pages = 0;

async function checkLink(value, from) {
  if (!value || value.startsWith("#")) return;
  const url = new URL(value.replaceAll("&amp;", "&"), from);
  if (url.origin !== origin) return;
  assert(
    !basePath || url.pathname === basePath || url.pathname.startsWith(`${basePath}/`),
    `URL escapes base path: ${value} in ${from}`,
  );
  if (checked.has(url.pathname)) return;
  checked.add(url.pathname);
  let file = path.resolve(
    root,
    `.${decodeURIComponent(url.pathname.slice(basePath.length)) || "/"}`,
  );
  assert(file === root || file.startsWith(`${root}${path.sep}`), `Invalid local URL: ${value}`);
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
    assert((await stat(file)).isFile());
  } catch {
    assert.fail(`Missing exported file: ${url.pathname} linked from ${from}`);
  }
}

async function verify(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      assert(!entry.name.startsWith("__next."), `Unnormalized segment export: ${file}`);
      await verify(file);
    } else if (/\.(html|css)$/.test(entry.name)) {
      const relative = path.relative(root, file).split(path.sep).join("/");
      const from = `${origin}${basePath}/${relative.replace(/index\.html$/, "")}`;
      const source = await readFile(file, "utf8");
      if (entry.name.endsWith(".html")) {
        pages++;
        for (const match of source.matchAll(/\b(?:src|href)="([^"<>]*)"/g))
          await checkLink(match[1], from);
        for (const match of source.matchAll(/\bsrcSet="([^"<>]*)"/gi)) {
          for (const candidate of match[1].split(","))
            await checkLink(candidate.trim().split(/\s+/)[0], from);
        }
      }
      for (const match of source.matchAll(/url\(["']?([^\s)"']+)["']?\)/g))
        await checkLink(match[1], from);
    }
  }
}

await stat(path.join(root, ".nojekyll"));
await verify(root);
console.log(
  `Pages export verified: ${pages} HTML files, ${checked.size} local URLs, base ${basePath || "/"}`,
);
