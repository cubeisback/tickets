import { notFound } from "next/navigation";
import { events } from "@/data/events";
import { tariffs } from "@/data/cabinet";
import { Checkout } from "@/components/cabinet/checkout";
export const dynamicParams = false;
export function generateStaticParams() {
  return events.flatMap((event) =>
    tariffs[event.id].map((tariff) => ({ eventId: event.id, tariffId: tariff.id })),
  );
}
export const metadata = {
  title: "Оформить билеты",
  description: "Оформление билетов для себя и коллег на мероприятия ADPASS.",
};
export default async function Page({ params }) {
  const { eventId, tariffId } = await params;
  const event = events.find((item) => item.id === eventId);
  if (!event || !tariffs[eventId].some((tariff) => tariff.id === tariffId)) notFound();
  return (
    <Checkout
      key={`${eventId}-${tariffId}`}
      event={event}
      tariffs={tariffs[eventId]}
      initialTariffId={tariffId}
    />
  );
}
