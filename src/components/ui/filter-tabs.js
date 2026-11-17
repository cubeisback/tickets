export function FilterTabs({ options, value, onChange, label }) {
  return (
    <div className="filter-tabs" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`filter-tabs__button${value === option.id ? " filter-tabs__button--active" : ""}`}
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label}
          <span className="filter-tabs__count">{option.count}</span>
        </button>
      ))}
    </div>
  );
}
