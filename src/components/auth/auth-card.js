export function AuthCard({ title, description, children }) {
  return (
    <section className="auth-card" aria-labelledby="auth-title">
      <header className="auth-card__header">
        <h2 id="auth-title" className="auth-card__title">
          {title}
        </h2>
        {description && <p className="auth-card__description">{description}</p>}
      </header>
      {children}
    </section>
  );
}
