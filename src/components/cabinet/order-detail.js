"use client";

import { assetPath } from "@/lib/paths";
import { useState } from "react";
import Link from "@/components/ui/app-link";
import { useDemo } from "./demo-provider";
import { events } from "@/data/events";
import { paymentLabels, formatPrice } from "@/data/cabinet";
import { PageHeading } from "./page-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function OrderDetail({ orderId }) {
  const { orders, updateOrder } = useDemo();
  const order = orders.find((item) => item.id === orderId);
  const [refund, setRefund] = useState(false);
  if (!order)
    return (
      <div className="cabinet-section">
        <PageHeading title="Заказ не найден" backHref="/cabinet/orders" backLabel="Мои заказы" />
        <p className="panel__description">Откройте заказ из списка ваших заказов.</p>
      </div>
    );
  const event = events.find((item) => item.id === order.eventId);
  function requestRefund(submitEvent) {
    submitEvent.preventDefault();
    const field = submitEvent.currentTarget.elements.reason;
    const reason = field.value.trim();
    if (!reason) {
      field.setCustomValidity("Опишите причину возврата");
      field.reportValidity();
      return;
    }
    updateOrder(order.id, { refundRequested: true, refundReason: reason });
    setRefund(false);
  }
  return (
    <div className="cabinet-section">
      <PageHeading
        title={`Заказ #${order.id}`}
        backHref="/cabinet/orders"
        backLabel="Назад к заказам"
      />
      <div className="order-detail__grid">
        <section className="order-summary panel">
          <div className="order-summary__heading">
            <h2 className="panel__title">{event.title}</h2>
            <StatusBadge status={order.status} />
          </div>
          <strong className="order-summary__amount">{formatPrice(order.sum)}</strong>
          <hr className="section-rule" />
          <dl className="summary-lines">
            <div>
              <dt>Кол-во билетов</dt>
              <dd>{order.participants.length} билета</dd>
            </div>
            <div>
              <dt>Способ оплаты</dt>
              <dd>{paymentLabels[order.paymentMethod]}</dd>
            </div>
            <div>
              <dt>Дата заказа</dt>
              <dd>{order.date}</dd>
            </div>
          </dl>
          <hr className="section-rule" />
          <div className="button-row">
            <a href="" className="button button--primary cabinet-button">
              <img src={assetPath("/assets/cabinet/76c14.svg")} alt="" width="20" height="20" />
              Скачать счёт
            </a>
            {order.status === "pending" && order.paymentMethod === "online" && (
              <Button
                className="cabinet-button"
                onClick={() => updateOrder(order.id, { status: "paid" })}
              >
                Оплатить
              </Button>
            )}
          </div>
          {order.status === "paid" && !order.refundRequested && !refund && (
            <p className="panel__description">
              Проблема с заказом?{" "}
              <button className="accent-link" type="button" onClick={() => setRefund(true)}>
                Оформить возврат
              </button>
            </p>
          )}
          {refund && (
            <form className="refund-form" method="post" onSubmit={requestRefund}>
              <h3 className="panel__subtitle">Заявка на возврат</h3>
              <p className="panel__description">
                Возврат оформляется на весь заказ целиком — вернётся ровно оплаченная сумма{" "}
                {formatPrice(order.sum)}. Все {order.participants.length} билет(ов) этого заказа
                будут аннулированы, отдельные билеты вернуть нельзя. Заявку рассматривает
                организатор в течение трёх рабочих дней, деньги возвращаются тем же способом,
                которым была произведена оплата.
              </p>
              <label className="text-field" htmlFor="refund-reason">
                <span className="panel__subtitle">Причина возврата</span>
                <textarea
                  className="text-area"
                  id="refund-reason"
                  name="reason"
                  onInput={(event) => event.currentTarget.setCustomValidity("")}
                  placeholder="Например: изменились планы участника"
                  required
                />
              </label>
              <Checkbox id="refund-agree" required>
                Подтверждаю, что все билеты заказа будут аннулированы
              </Checkbox>
              <div className="button-row">
                <Button className="cabinet-button" type="submit">
                  Отправить заявку
                </Button>
                <Button
                  className="cabinet-button"
                  variant="secondary"
                  onClick={() => setRefund(false)}
                >
                  Отмена
                </Button>
              </div>
            </form>
          )}
          {order.refundRequested && (
            <div className="refund-success">
              <strong>
                <img src={assetPath("/assets/cabinet/c6b16.svg")} alt="" width="18" height="18" />
                Заявка на возврат отправлена
              </strong>
              <p>
                Рассмотрим её в течение трёх рабочих дней и сообщим решение письмом. Билеты
                действительны до решения по заявке.
              </p>
            </div>
          )}
        </section>
        <section className="buyer-card panel">
          <h2 className="panel__title">Информация о заказчике</h2>
          <dl className="buyer-card__details">
            {[
              ["Компания", order.buyerCompany],
              ["ФИО представителя", order.buyerName],
              ["Электронная почта", order.buyerEmail],
              ["Номер телефона", order.buyerPhone],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value || "—"}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
      <section className="order-participants">
        <h2 className="panel__title">Участники</h2>
        {order.participants.map((participant, index) => (
          <article className="participant-ticket panel" key={participant.id}>
            <div className="participant-ticket__heading">
              <h3 className="panel__subtitle">Участник {index + 1}</h3>
              <span>Билет № {participant.id}</span>
            </div>
            <div className="ticket-row">
              <dl className="participant-ticket__details">
                <div>
                  <dt>ФИО:</dt>
                  <dd>{participant.fullName || `${participant.name} ${participant.surname}`}</dd>
                </div>
                <div>
                  <dt>Email:</dt>
                  <dd>{participant.email}</dd>
                </div>
                <div>
                  <dt>Телефон:</dt>
                  <dd>{participant.phone || "—"}</dd>
                </div>
              </dl>
              <strong>{formatPrice(participant.price)}</strong>
              {order.status === "paid" && (
                <a href="" className="button button--secondary cabinet-button">
                  <img src={assetPath("/assets/cabinet/f95b6.svg")} alt="" width="20" height="20" />
                  Скачать билет
                </a>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
