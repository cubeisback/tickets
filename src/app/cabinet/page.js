import { EventCard } from "@/components/cabinet/event-card";
import { EventsCatalog } from "@/components/cabinet/events-catalog";
import { events, eventFormats } from "@/data/events";

export const metadata = {
  title: "Мероприятия",
  description:
    "Доступные для регистрации мероприятия ADPASS: Национальный рекламный форум и НРФ. Регионы.",
};

export default function CabinetPage() {
  return (
    <EventsCatalog
      items={events.map(({ id, formatId }) => ({ id, formatId }))}
      formats={eventFormats}
    >
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </EventsCatalog>
  );
}
