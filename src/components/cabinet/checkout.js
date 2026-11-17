"use client";

import { assetPath } from "@/lib/paths";
import { useRef, useState } from "react";
import Link from "@/components/ui/app-link";
import { useDemo } from "./demo-provider";
import { PageHeading } from "./page-heading";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { SelectField } from "@/components/ui/select-field";
import { Checkbox } from "@/components/ui/checkbox";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatPrice, requisiteFields } from "@/data/cabinet";

function blankParticipant(id, tariffId) {
  return { id, tariffId, name: "", surname: "", email: "", phone: "", company: "", represent: "" };
}

export function Checkout({ event, tariffs, initialTariffId }) {
  const { profile, orders, addOrder } = useDemo();
  const [step, setStep] = useState("tickets");
  const [participants, setParticipants] = useState([blankParticipant("p1", initialTariffId)]);
  const [buyer, setBuyer] = useState({ email: "", paymentMethod: "online", agree: false });
  const [requisites, setRequisites] = useState({ ...profile.requisites });
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [result, setResult] = useState(null);
  const participantSequence = useRef(1);
  const completed = useRef(false);
  const heading = useRef(null);
  const steps =
    buyer.paymentMethod === "offline"
      ? ["tickets", "buyer", "participants", "requisites", "confirm"]
      : ["tickets", "buyer", "participants", "confirm"];
  const labels = {
    tickets: "Билеты",
    buyer: "Данные заказчика",
    participants: "Участники",
    requisites: "Реквизиты",
    confirm: "Оплата",
  };
  const count = (id) => participants.filter((participant) => participant.tariffId === id).length;
  const lines = tariffs
    .map((tariff) => ({ ...tariff, quantity: count(tariff.id) }))
    .filter((tariff) => tariff.quantity);
  const rawSum = lines.reduce((sum, tariff) => sum + tariff.price * tariff.quantity, 0);
  const discount = promo ? Math.round(rawSum * 0.1) : 0;
  const total = rawSum - discount;

  function navigate(next) {
    setStep(next);
    heading.current?.scrollIntoView({ block: "start" });
  }
  function proceed(submitEvent) {
    submitEvent.preventDefault();
    navigate(steps[steps.indexOf(step) + 1]);
  }
  function back() {
    navigate(steps[steps.indexOf(step) - 1]);
  }
  function updateQuantity(tariffId, quantity) {
    setParticipants((current) => {
      const matching = current.filter((participant) => participant.tariffId === tariffId);
      if (quantity < matching.length) {
        const remove = new Set(matching.slice(quantity).map((participant) => participant.id));
        return current.filter((participant) => !remove.has(participant.id));
      }
      return [
        ...current,
        ...Array.from({ length: quantity - matching.length }, () =>
          blankParticipant(`p${++participantSequence.current}`, tariffId),
        ),
      ];
    });
  }
  function updateParticipant(id, key, value) {
    setParticipants((current) =>
      current.map((participant) =>
        participant.id === id ? { ...participant, [key]: value } : participant,
      ),
    );
  }
  function applyPromo() {
    const valid = promoInput.trim().toUpperCase() === "NRF10";
    setPromo(valid);
    setPromoError(!valid);
  }
  function finish(submitEvent) {
    submitEvent.preventDefault();
    if (completed.current) return;
    completed.current = true;
    const id = String(Math.max(...orders.map((order) => Number(order.id))) + 1);
    let allocatedDiscount = 0;
    const orderedParticipants = participants.map((participant, index) => {
      const tariff = tariffs.find((item) => item.id === participant.tariffId);
      const itemDiscount =
        index === participants.length - 1
          ? discount - allocatedDiscount
          : Math.floor((discount * tariff.price) / rawSum);
      allocatedDiscount += itemDiscount;
      return {
        ...participant,
        id: `${id}-${String(index + 1).padStart(2, "0")}`,
        tariff: tariff.name,
        price: tariff.price - itemDiscount,
      };
    });
    const now = new Date();
    const order = {
      id,
      eventId: event.id,
      date: now.toLocaleString("ru-RU"),
      shortDate: now.toLocaleDateString("ru-RU"),
      status: buyer.paymentMethod === "online" ? "paid" : "pending",
      paymentMethod: buyer.paymentMethod,
      sum: total,
      participants: orderedParticipants,
      buyerEmail: buyer.email,
      buyerName: `${profile.name} ${profile.surname}`,
      buyerCompany: requisites.legalName || profile.company,
      buyerPhone: profile.phone,
      requisites: { ...requisites },
    };
    addOrder(order);
    setResult(order);
    navigate("success");
  }

  return (
    <div className="cabinet-section checkout" ref={heading}>
      <PageHeading
        title={event.title}
        description={`${event.dates} · ${event.id === "nrf-2026" ? "Москва, Новый Арбат" : "Региональная программа"}`}
        backHref={`/cabinet/events/${event.id}`}
        backLabel="Отменить оформление"
      />
      <ol className="checkout-steps" hidden={step === "success"}>
        {steps.map((id, index) => (
          <li
            key={id}
            className={`checkout-steps__item${id === step ? " checkout-steps__item--active" : steps.indexOf(step) > index ? " checkout-steps__item--complete" : ""}`}
            aria-current={id === step ? "step" : undefined}
          >
            <span className="checkout-steps__number">
              {steps.indexOf(step) > index ? "✓" : index + 1}
            </span>
            <span>{labels[id]}</span>
          </li>
        ))}
      </ol>

      <form
        className="checkout-panel panel"
        method="post"
        hidden={step !== "tickets"}
        onSubmit={proceed}
      >
        <h2 className="panel__title">Выберите билеты</h2>
        <div className="checkout-table">
          <div className="checkout-table__header">
            <span>Тариф</span>
            <span>Цена</span>
            <span>Количество</span>
          </div>
          {tariffs.map((tariff) => (
            <div className="checkout-table__row" key={tariff.id}>
              <div className="checkout-table__tariff">
                <strong>{tariff.name}</strong>
                <p>{tariff.short}</p>
              </div>
              <span>{formatPrice(tariff.price)}</span>
              <QuantityStepper
                label={tariff.name}
                value={count(tariff.id)}
                onChange={(quantity) => updateQuantity(tariff.id, quantity)}
              />
            </div>
          ))}
        </div>
        <div className="promo-input">
          <TextField
            id="promo-code"
            label="Промокод"
            placeholder="Введите код (если есть)"
            value={promoInput}
            onChange={(changeEvent) => {
              setPromoInput(changeEvent.target.value);
              setPromo(false);
              setPromoError(false);
            }}
          />
          <Button className="cabinet-button" variant="secondary" onClick={applyPromo}>
            Применить
          </Button>
        </div>
        {promo && <p className="checkout__promo-success">Промокод NRF10 применён. Скидка 10%</p>}
        {promoError && (
          <p className="checkout__error" role="alert">
            Промокод не найден или не действует для выбранных тарифов
          </p>
        )}
        <dl className="summary-lines">
          <div>
            <dt>Билетов выбрано:</dt>
            <dd>{participants.length}</dd>
          </div>
          {promo && (
            <div>
              <dt>Скидка:</dt>
              <dd>−{formatPrice(discount)}</dd>
            </div>
          )}
          <div className="summary-lines__total">
            <dt>Сумма заказа:</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
        <div className="checkout__actions checkout__actions--end">
          <Button className="cabinet-button" type="submit" disabled={!participants.length}>
            Далее
          </Button>
        </div>
      </form>

      <form
        className="checkout-panel panel"
        method="post"
        hidden={step !== "buyer"}
        onSubmit={proceed}
      >
        <h2 className="panel__title">Данные заказчика</h2>
        <div className="page-heading">
          <TextField
            id="buyer-email"
            name="buyerEmail"
            label="E-mail заказчика"
            type="email"
            autoComplete="email"
            placeholder="you@company.ru"
            value={buyer.email}
            onChange={(changeEvent) =>
              setBuyer((current) => ({ ...current, email: changeEvent.target.value }))
            }
            required
          />
          <p className="panel__description">
            На этот адрес придёт подтверждение заказа. Билеты участников будут отправлены отдельно
            на их e-mail.
          </p>
        </div>
        <fieldset className="payment-options">
          <legend className="panel__subtitle">Способ оплаты</legend>
          {[
            [
              "online",
              "Оплата онлайн",
              "Картой или через Yandex Split. Билеты придут сразу после оплаты.",
            ],
            [
              "offline",
              "Оплата по счету",
              "Укажите реквизиты юрлица на следующем шаге — мы выставим счёт.",
            ],
          ].map(([value, label, hint]) => (
            <label
              className={`payment-option${buyer.paymentMethod === value ? " payment-option--selected" : ""}`}
              key={value}
            >
              <input
                type="radio"
                className="payment-option__input"
                name="paymentMethod"
                value={value}
                checked={buyer.paymentMethod === value}
                onChange={() => setBuyer((current) => ({ ...current, paymentMethod: value }))}
              />
              <span className="payment-option__indicator">
                <img
                  src={assetPath(
                    `/assets/cabinet/${buyer.paymentMethod === value ? "50179.svg" : "7d718.svg"}`,
                  )}
                  alt=""
                  width={buyer.paymentMethod === value ? 27.2 : 18}
                  height={buyer.paymentMethod === value ? 27.2 : 18}
                />
              </span>
              <span>
                <strong>{label}</strong>
                <span className="payment-option__hint">{hint}</span>
              </span>
            </label>
          ))}
        </fieldset>
        <Checkbox
          id="buyer-agree"
          checked={buyer.agree}
          onChange={(changeEvent) =>
            setBuyer((current) => ({ ...current, agree: changeEvent.target.checked }))
          }
          required
        >
          Я согласен с условиями участия и политикой обработки данных
        </Checkbox>
        <StepActions onBack={back} />
      </form>

      <form
        className="checkout-panel panel"
        method="post"
        hidden={step !== "participants"}
        onSubmit={proceed}
      >
        <div className="page-heading">
          <h2 className="panel__title">Данные участников</h2>
          <p className="panel__description">
            Билеты именные — укажите контакты каждого участника. Тип билета можно изменить для
            каждого отдельно.
          </p>
        </div>
        {participants.map((participant, index) => (
          <fieldset className="participant-form" key={participant.id}>
            <legend className="visually-hidden">Участник №{index + 1}</legend>
            <div className="participant-form__header">
              <span className="participant-form__number">Участник №{index + 1}</span>
              <SelectField
                id={`tariff-${participant.id}`}
                aria-label={`Тариф участника ${index + 1}`}
                value={participant.tariffId}
                onChange={(changeEvent) =>
                  updateParticipant(participant.id, "tariffId", changeEvent.target.value)
                }
                options={tariffs.map((tariff) => ({
                  value: tariff.id,
                  label: `${tariff.name} · ${formatPrice(tariff.price)}`,
                }))}
              />
              <button
                className="participant-form__remove"
                type="button"
                aria-label={`Удалить участника ${index + 1}`}
                onClick={() =>
                  setParticipants((current) => current.filter((item) => item.id !== participant.id))
                }
              >
                <img src={assetPath("/assets/cabinet/dd5dc.svg")} alt="" width="18" height="18" />
              </button>
            </div>
            <div className="field-grid field-grid--three">
              {[
                ["name", "Имя"],
                ["surname", "Фамилия"],
                ["email", "E-mail"],
                ["phone", "Телефон"],
                ["company", "Компания"],
              ].map(([key, label]) => (
                <TextField
                  key={key}
                  id={`${participant.id}-${key}`}
                  label={label}
                  placeholder={label}
                  type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                  required={key !== "phone"}
                  value={participant[key]}
                  onChange={(changeEvent) =>
                    updateParticipant(participant.id, key, changeEvent.target.value)
                  }
                />
              ))}
              <SelectField
                id={`${participant.id}-represent`}
                label="Я представляю"
                value={participant.represent}
                placeholder="Выберите"
                required
                onChange={(changeEvent) =>
                  updateParticipant(participant.id, "represent", changeEvent.target.value)
                }
                options={["Агентства", "Бренды", "Медиа", "IT", "Другое"].map((value) => ({
                  value,
                  label: value,
                }))}
              />
            </div>
          </fieldset>
        ))}
        <Button
          className="cabinet-button"
          variant="secondary"
          onClick={() =>
            setParticipants((current) => [
              ...current,
              blankParticipant(`p${++participantSequence.current}`, tariffs[0].id),
            ])
          }
        >
          <img src={assetPath("/assets/cabinet/c96b3.svg")} alt="" width="24" height="24" />
          Добавить участника
        </Button>
        <div className="checkout__total">
          <span>Сумма заказа:</span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <StepActions onBack={back} disabled={!participants.length} />
      </form>

      <form
        className="checkout-panel panel"
        method="post"
        hidden={step !== "requisites"}
        onSubmit={proceed}
      >
        <div className="page-heading">
          <h2 className="panel__title">Реквизиты для выставления счёта</h2>
          <p className="panel__description">
            Эти данные будут подставлены в счёт на оплату для вашей организации.
          </p>
        </div>
        <div className="field-grid">
          {requisiteFields.map(([key, label]) => (
            <TextField
              key={key}
              id={`checkout-${key}`}
              label={label}
              placeholder={label}
              required={key === "legalName" || key === "inn"}
              value={requisites[key]}
              onChange={(changeEvent) =>
                setRequisites((current) => ({ ...current, [key]: changeEvent.target.value }))
              }
            />
          ))}
        </div>
        <StepActions onBack={back} />
      </form>

      <form
        className="checkout-panel panel"
        method="post"
        hidden={step !== "confirm"}
        onSubmit={finish}
      >
        <h2 className="panel__title">Проверьте и подтвердите заказ</h2>
        <div className="checkout__buyer-banner">
          <span>Заказчик:</span>
          <strong>{buyer.email}</strong>
        </div>
        <div className="checkout-table checkout-table--summary">
          <div className="checkout-table__header">
            <span>Тариф</span>
            <span>Цена</span>
            <span>Кол-во</span>
            <span>Сумма</span>
          </div>
          {lines.map((line) => (
            <div className="checkout-table__row" key={line.id}>
              <strong>{line.name}</strong>
              <span>{formatPrice(line.price)}</span>
              <strong>{line.quantity}</strong>
              <span>{formatPrice(line.price * line.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="checkout__total">
          <div>
            <h3 className="panel__subtitle">Итого к оплате</h3>
            <p className="panel__description">
              Способ оплаты:{" "}
              {buyer.paymentMethod === "online" ? "онлайн (карта / Yandex Split)" : "по счёту"}
            </p>
          </div>
          <strong>
            {promo && <del className="checkout__old-price">{formatPrice(rawSum)}</del>}
            {formatPrice(total)}
          </strong>
        </div>
        <h3 className="section-label">УЧАСТНИКИ ({participants.length})</h3>
        <div className="checkout__participants">
          {participants.map((participant) => (
            <div className="checkout__participant-summary" key={participant.id}>
              <strong>
                {participant.name} {participant.surname} ·{" "}
                {tariffs.find((tariff) => tariff.id === participant.tariffId).name}
              </strong>
              <p>
                {participant.email} · {participant.phone} · {participant.company} ·{" "}
                {participant.represent}
              </p>
            </div>
          ))}
        </div>
        <StepActions
          onBack={back}
          label={buyer.paymentMethod === "online" ? "Перейти к оплате" : "Сформировать счёт"}
        />
      </form>

      <section className="checkout-success panel" hidden={step !== "success"}>
        <span className="checkout-success__icon">
          <img src={assetPath("/assets/cabinet/55632.svg")} alt="" width="32" height="32" />
        </span>
        <h2 className="panel__title">
          {result?.status === "pending" ? "Заказ оформлен" : "Заказ оплачен"}
        </h2>
        <p className="panel__description">
          Номер заказа №{result?.id}.{" "}
          {result?.status === "pending"
            ? "Счёт доступен в разделе «Мои заказы». После оплаты билеты появятся в личном кабинете."
            : "Билеты доступны в разделах «Мои заказы» и «Мои события»."}
        </p>
        <Link className="button button--primary cabinet-button" href="/cabinet/orders">
          Перейти к моим заказам
        </Link>
        {result && (
          <Link className="accent-link" href={`/cabinet/orders/${result.id}`}>
            Открыть заказ №{result.id}
          </Link>
        )}
      </section>
    </div>
  );
}

function StepActions({ onBack, label = "Далее", disabled = false }) {
  return (
    <div className="checkout__actions">
      <Button className="cabinet-button" variant="secondary" onClick={onBack}>
        <img src={assetPath("/assets/cabinet/94de0.svg")} alt="" width="24" height="24" />
        Назад
      </Button>
      <Button className="cabinet-button" type="submit" disabled={disabled}>
        {label}
      </Button>
    </div>
  );
}
