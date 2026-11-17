import { assetPath } from "@/lib/paths";
import { faqItems } from "@/data/cabinet";

export function Faq() {
  return (
    <>
      <section className="manager-card panel" aria-label="Менеджер мероприятия">
        <span className="manager-card__avatar">ДК</span>
        <div className="manager-card__info">
          <h2>Дарья Ковалёва</h2>
          <p>Менеджер по работе с участниками</p>
          <div className="manager-card__contacts">
            <a href="mailto:d.kovaleva@adpass.ru">
              <img src={assetPath("/assets/cabinet/db536.svg")} alt="" width="14" height="14" />
              d.kovaleva@adpass.ru
            </a>
            <a href="https://t.me/_daria_adpass" target="_blank" rel="noreferrer">
              <img src={assetPath("/assets/cabinet/191d4.svg")} alt="" width="14" height="14" />
              @_daria_adpass
            </a>
          </div>
        </div>
      </section>
      <section className="faq panel" aria-label="Вопросы и ответы">
        {faqItems.map((item, index) => (
          <details className="faq__item" key={item.question} name="faq" open={index === 0}>
            <summary className="faq__question">
              {item.question}
              <span className="faq__icons">
                <img
                  className="faq__plus"
                  src={assetPath("/assets/cabinet/8a2fc.svg")}
                  alt=""
                  width="20"
                  height="20"
                />
                <img
                  className="faq__minus"
                  src={assetPath("/assets/cabinet/49590.svg")}
                  alt=""
                  width="20"
                  height="20"
                />
              </span>
            </summary>
            <p className="faq__answer">{item.answer}</p>
          </details>
        ))}
      </section>
    </>
  );
}
