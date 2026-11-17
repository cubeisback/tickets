import { BrandPanel } from "./brand-panel";

export function AuthShell({ children }) {
  return (
    <main className="auth-page">
      <BrandPanel />
      <section aria-label="Авторизация" className="auth-page__panel">
        {children}
      </section>
    </main>
  );
}
