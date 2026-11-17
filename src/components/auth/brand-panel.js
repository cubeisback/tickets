import { BrandLogo } from "@/components/ui/brand-logo";

const benefits = [
  ["🎫", "Выбирайте тариф и покупайте билеты в несколько кликов"],
  ["📅", "Все ваши билеты и заказы — в одном личном кабинете"],
  ["👥", "Удобно оформить сразу несколько именных билетов для коллег"],
  ["🛡️", "Оплата онлайн или по счету — документы формируются автоматически"],
];

export function BrandPanel() {
  return (
    <section className="brand-panel" aria-labelledby="platform-title">
      <BrandLogo tone="light" />
      <div className="brand-panel__content">
        <p className="brand-panel__eyebrow">ПЛАТФОРМА ДЛЯ УЧАСТНИКОВ</p>
        <h1 id="platform-title" className="brand-panel__title">
          Билеты на&nbsp;мероприятия ADPASS&nbsp;— быстро и&nbsp;напрямую
        </h1>
        <p className="brand-panel__description">
          Выбирайте тариф, оформляйте билеты на себя и коллег, оплачивайте онлайн или по счету — без
          сторонних сервисов и лишних шагов.
        </p>
        <ul className="brand-panel__benefits">
          {benefits.map(([emoji, text]) => (
            <li key={emoji} className="brand-panel__benefit">
              <span aria-hidden="true" className="brand-panel__badge">
                {emoji}
              </span>
              <p className="brand-panel__benefit-text">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
