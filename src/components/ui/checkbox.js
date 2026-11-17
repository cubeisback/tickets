export function Checkbox({ children, id, ...props }) {
  return (
    <label htmlFor={id} className="checkbox">
      <input {...props} id={id} type="checkbox" className="checkbox__input" />
      <span className="checkbox__label">{children}</span>
    </label>
  );
}
