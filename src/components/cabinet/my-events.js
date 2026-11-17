"use client";

import { assetPath } from "@/lib/paths";
import Link from "@/components/ui/app-link";
import { useDemo } from "./demo-provider";
import { events } from "@/data/events";
import { formatPrice } from "@/data/cabinet";
import { EventCover } from "./event-cover";
import { StatusBadge } from "@/components/ui/status-badge";

export function MyEvents() {
  const { orders } = useDemo();
  return (
    <>
      <div className="my-events">
        {events.map((event) => {
          const eventOrders = orders.filter(
            (order) => order.eventId === event.id && order.status !== "refunded",
          );
          const participants = eventOrders.flatMap((order) =>
            order.participants.map((participant) => ({ ...participant, order })),
          );
          return (
            <article className={`event-card my-event event-card--${event.formatId}`} key={event.id}>
              <EventCover event={event} />
              <div className="my-event__details">
                <p className="event-card__date">
                  <img
                    src={assetPath("/assets/cabinet/calendar.svg")}
                    alt=""
                    width="16"
                    height="16"
                  />
                  {event.dates}
                </p>
                <h2 className="event-card__title">
                  {event.title}
                  {event.id === "nrf-2026" ? " (НРФ 2026)" : ""}
                </h2>
                <p className="event-card__description">{event.description}</p>
                {participants.length ? (
                  <>
                    <div className="my-event__summary">
                      <strong>
                        {participants.length} билет(ов) ·{" "}
                        {formatPrice(eventOrders.reduce((sum, order) => sum + order.sum, 0))}
                      </strong>
                      {[...new Set(eventOrders.map((order) => order.status))].map((status) => (
                        <StatusBadge status={status} key={status} />
                      ))}
                    </div>
                    <h3 className="section-label">УЧАСТНИКИ</h3>
                    <div className="my-event__participants">
                      {participants.map((participant) => (
                        <div className="ticket-row" key={participant.id}>
                          <div className="ticket-row__details">
                            <strong>
                              {participant.name} {participant.surname} · {participant.tariff}
                            </strong>
                            <p>
                              {participant.email} · {participant.phone}
                            </p>
                          </div>
                          <strong>{formatPrice(participant.price)}</strong>
                          {participant.order.status === "paid" && (
                            <a href="" className="button button--secondary cabinet-button">
                              <img
                                src={assetPath("/assets/cabinet/f95b6.svg")}
                                alt=""
                                width="20"
                                height="20"
                              />
                              Скачать билет
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    className="button button--primary cabinet-button"
                    href={`/cabinet/events/${event.id}`}
                  >
                    Выбрать тариф
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <header className="page-heading">
        <h2 className="panel__title">Прошедшие мероприятия</h2>
        <p className="panel__description">Мероприятия, в которых вы уже участвовали</p>
      </header>
      <article className="event-card my-event my-event--past">
        <EventCover event={events[0]} past />
        <div className="my-event__details">
          <p className="event-card__date">
            <img src={assetPath("/assets/cabinet/calendar.svg")} alt="" width="16" height="16" />
            22–25 сентября 2025
          </p>
          <h2 className="event-card__title">Национальный рекламный форум 2025 · Бизнес</h2>
        </div>
        <StatusBadge status="completed" />
      </article>
    </>
  );
}
