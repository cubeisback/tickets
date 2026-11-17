export function TextField({ label, id, trailing, className = "", ...props }) {
  return (
    <div className="text-field">
      <label htmlFor={id} className="text-field__label">
        {label}
      </label>
      <div className="text-field__control">
        <input id={id} className={`text-field__input ${className}`.trim()} {...props} />
        {trailing}
      </div>
    </div>
  );
}
