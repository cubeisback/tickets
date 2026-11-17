import { notFound } from "next/navigation";
import { events } from "@/data/events";
import { tariffs } from "@/data/cabinet";
import { TariffsPage } from "@/components/cabinet/tariffs-page";
export const dynamicParams = false;
export function generateStaticParams() {
  return events.map((event) => ({ eventId: event.id }));
}
export async function generateMetadata({ params }) {
  const { eventId } = await params;
  return { title: events.find((event) => event.id === eventId)?.title || "Мероприятие" };
}
export default async function EventPage({ params }) {
  const { eventId } = await params;
  const event = events.find((item) => item.id === eventId);
  if (!event) notFound();
  return <TariffsPage event={event} tariffs={tariffs[eventId]} />;
}
