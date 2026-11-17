export function QuantityStepper({ label, value, onChange }) {
  return (
    <div className="quantity-stepper" role="group" aria-label={`Количество: ${label}`}>
      <button
        type="button"
        className="quantity-stepper__button"
        aria-label={`Уменьшить: ${label}`}
        disabled={!value}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <output className="quantity-stepper__value" aria-label={`Выбрано: ${label}`}>
        {value}
      </output>
      <button
        type="button"
        className="quantity-stepper__button"
        aria-label={`Увеличить: ${label}`}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}
