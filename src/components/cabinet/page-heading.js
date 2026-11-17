import Link from "@/components/ui/app-link";

export function PageHeading({ title, description, backHref, backLabel }) {
  return (
    <header className="page-heading">
      {backHref && (
        <Link href={backHref} className="page-heading__back">
          ← {backLabel}
        </Link>
      )}
      <h1 className="page-heading__title">{title}</h1>
      {description && <p className="page-heading__description">{description}</p>}
    </header>
  );
}
