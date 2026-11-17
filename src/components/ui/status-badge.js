import { statuses } from "@/data/cabinet";
export function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {statuses[status] || "Завершено"}
    </span>
  );
}
