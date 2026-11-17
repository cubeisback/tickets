export function SelectField({ id, label, options, placeholder, className = "", ...props }) {
  return (
    <div className={`select-field ${className}`.trim()}>
      {label && (
        <label className="select-field__label" htmlFor={id}>
          {label}
        </label>
      )}
      <select id={id} className="select-field__input" {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
