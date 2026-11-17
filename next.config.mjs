const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default {
  poweredByHeader: false,
  output: staticExport ? "export" : "standalone",
  distDir: staticExport ? "out" : ".next",
  basePath,
  trailingSlash: staticExport,
  images: { unoptimized: staticExport },
};
