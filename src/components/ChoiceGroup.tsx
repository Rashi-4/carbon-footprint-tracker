type Option<T extends string> = { value: T; label: string; detail: string };

type Props<T extends string> = {
  legend: string;
  name: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
};

export default function ChoiceGroup<T extends string>({ legend, name, options, value, onChange }: Props<T>) {
  return (
    <fieldset className="choices">
      <legend>{legend}</legend>
      {options.map((o) => (
        <label key={o.value} className={`choice${value === o.value ? " selected" : ""}`}>
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
          <span className="choice-label">{o.label}</span>
          <span className="choice-detail">{o.detail}</span>
        </label>
      ))}
    </fieldset>
  );
}
