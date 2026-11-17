"use client";

import { Children, useState } from "react";
import { FilterTabs } from "@/components/ui/filter-tabs";

export function EventsCatalog({ children, items, formats }) {
  const [format, setFormat] = useState("all");
  const options = formats.map((item) => ({
    ...item,
    count: items.filter((event) => item.id === "all" || event.formatId === item.id).length,
  }));
  return (
    <section className="events-catalog" aria-labelledby="events-title">
      <header className="events-catalog__header">
        <h1 className="events-catalog__title" id="events-title">
          Мероприятия
        </h1>
        <p className="events-catalog__description">
          Выберите доступные для регистрации мероприятия
        </p>
      </header>
      <FilterTabs
        options={options}
        value={format}
        onChange={setFormat}
        label="Формат мероприятия"
      />
      <div className="events-catalog__list">
        {Children.toArray(children).map((card, index) => (
          <div
            className="events-catalog__item"
            key={items[index].id}
            hidden={format !== "all" && items[index].formatId !== format}
          >
            {card}
          </div>
        ))}
      </div>
    </section>
  );
}
