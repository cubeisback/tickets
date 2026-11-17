import { assetPath } from "@/lib/paths";
import Link from "@/components/ui/app-link";
import { PageHeading } from "./page-heading";
import { formatPrice } from "@/data/cabinet";

export function TariffsPage({ event, tariffs }) {
  return (
    <div className="cabinet-section">
      <PageHeading
        title={event.title}
        description={event.dates}
        backHref="/cabinet"
        backLabel="Все мероприятия"
      />
      <div className="tariff-list">
        {tariffs.map((tariff) => (
          <article className="tariff-card" key={tariff.id}>
            <div className="tariff-card__details">
              <span className="tariff-card__tag">{tariff.tag}</span>
              <h2 className="tariff-card__title">{tariff.name}</h2>
              <p className="tariff-card__description">{tariff.description}</p>
              <ul className="tariff-card__points">
                {tariff.points.map((point) => (
                  <li key={point}>
                    <img
                      src={assetPath("/assets/cabinet/ca3a2.svg")}
                      alt=""
                      width="16"
                      height="16"
                    />
                    {point}
                  </li>
                ))}
              </ul>
              <p className="tariff-card__available">
                Осталось {tariff.available} билетов по этой цене
              </p>
            </div>
            <div className="tariff-card__action">
              <strong>{formatPrice(tariff.price)}</strong>
              {tariff.nextPrice && <p className="tariff-card__next-price">{tariff.nextPrice}</p>}
              <Link
                className="button button--primary cabinet-button"
                href={`/cabinet/events/${event.id}/checkout/${tariff.id}`}
              >
                Купить
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
