import { assetPath } from "@/lib/paths";
export function EventCover({ event, past = false }) {
  return (
    <div className="event-card__cover">
      <img
        className="event-card__background"
        src={event.background}
        alt=""
        width="1184"
        height="864"
      />
      {!past && <span className="event-card__badge">НРФ 2026</span>}
      <img
        className={`event-card__image${past ? " event-card__image--past" : ""}`}
        src={past ? assetPath("/assets/cabinet/02f0d.png") : event.image}
        alt={`Обложка: ${past ? "Национальный рекламный форум 2025" : event.title}`}
        width={past ? 1920 : event.imageWidth}
        height={past ? 1080 : event.imageHeight}
      />
    </div>
  );
}
