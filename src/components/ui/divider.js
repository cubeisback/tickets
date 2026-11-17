import { assetPath } from "@/lib/paths";
export function Divider({ children }) {
  return (
    <div className="divider">
      <span className="divider__line" aria-hidden="true">
        <img src={assetPath("/assets/divider.svg")} alt="" width="146" height="1" />
      </span>
      <span className="divider__text">{children}</span>
      <span className="divider__line" aria-hidden="true">
        <img src={assetPath("/assets/divider.svg")} alt="" width="146" height="1" />
      </span>
    </div>
  );
}
