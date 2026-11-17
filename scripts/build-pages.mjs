import { spawnSync } from "node:child_process";
import { readdir, readFile, writeFile, copyFile, rm } from "node:fs/promises";
import path from "node:path";
import { pagesBasePath } from "./pages-config.mjs";

const basePath = pagesBasePath();
const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
    NEXT_PUBLIC_STATIC_EXPORT: "true",
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);

async function updateStyles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await updateStyles(file);
    else if (entry.name.endsWith(".css")) {
      const source = await readFile(file, "utf8");
      await writeFile(
        file,
        source.replace(/url\((['"]?)\/(assets|fonts)\//g, `url($1${basePath}/$2/`),
      );
    }
  }
}

async function flattenSegments(directory, exportDirectory = directory, prefix = "") {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (prefix) {
      const name = `${prefix}.${entry.name}`;
      if (entry.isDirectory()) await flattenSegments(file, exportDirectory, name);
      else await copyFile(file, path.join(exportDirectory, name));
    } else if (entry.isDirectory() && entry.name.startsWith("__next.")) {
      await flattenSegments(file, directory, entry.name);
      const absolute = path.resolve(file);
      if (!absolute.startsWith(`${path.resolve("out")}${path.sep}`))
        throw new Error("Invalid export path");
      await rm(absolute, { recursive: true });
    } else if (entry.isDirectory()) await flattenSegments(file);
  }
}

await flattenSegments("out");
await updateStyles("out");
await writeFile("out/.nojekyll", "");
await writeFile("out/pages-config.json", JSON.stringify({ basePath }));
console.log(`GitHub Pages export ready in out (base path: ${basePath || "/"})`);
