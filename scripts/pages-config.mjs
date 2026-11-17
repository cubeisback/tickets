export function pagesBasePath() {
  const option = process.argv.find((argument) => argument.startsWith("--base-path="));
  const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] || "tickets";
  const fallback = repository.endsWith(".github.io") ? "" : `/${repository}`;
  const value = option
    ? option.slice("--base-path=".length)
    : (process.env.PAGES_BASE_PATH ?? fallback);
  if (value === "" || value === "/") return "";
  if (!/^\/[a-zA-Z0-9._-]+\/?$/.test(value)) {
    throw new Error("Base path must be empty or a repository path such as /tickets");
  }
  return value.replace(/\/$/, "");
}
