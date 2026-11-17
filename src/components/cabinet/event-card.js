import { assetPath } from "@/lib/paths";
import Link from "@/components/ui/app-link";
import { EventCover } from "./event-cover";

export function EventCard({ event }) {
  return (
    <article
      className={`event-card event-card--${event.formatId}`}
      aria-labelledby={`event-${event.id}`}
    >
      <EventCover event={event} />
      <div className="event-card__details">
        <p className="event-card__date">
          <img src={assetPath("/assets/cabinet/calendar.svg")} alt="" width="16" height="16" />
          {event.dates}
        </p>
        <h2 className="event-card__title" id={`event-${event.id}`}>
          {event.title}
        </h2>
        <p className="event-card__description">{event.description}</p>
      </div>
      <Link
        href={`/cabinet/events/${event.id}`}
        className="button button--primary event-card__button"
      >
        Выбрать тариф
        <img src={assetPath("/assets/cabinet/arrow-right.svg")} alt="" width="20" height="20" />
      </Link>
    </article>
  );
}
