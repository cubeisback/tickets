import { assetPath } from "@/lib/paths";
export function BrandLogo({ tone = "dark", adaptive = false }) {
  return (
    <span className={`brand-logo brand-logo--${tone}${adaptive ? " brand-logo--adaptive" : ""}`}>
      <span className="brand-logo__symbol">
        {adaptive ? (
          <picture>
            <source
              media="(max-width: 1199px)"
              srcSet={assetPath("/assets/cabinet/ticket-small.svg")}
            />
            <img src={assetPath("/assets/ticket.svg")} alt="" width="18" height="18" />
          </picture>
        ) : (
          <img src={assetPath("/assets/ticket.svg")} alt="" width="18" height="18" />
        )}
      </span>
      <span className="brand-logo__text">ADPASS.EVENT</span>
    </span>
  );
}
