import { useId } from "react";

type Props = {
  label: string;
  hint?: string;
  unit: string;
  value: number;
  onChange: (n: number) => void;
};

export default function NumberField({ label, hint, unit, value, onChange }: Props) {
  const id = useId();
  const hintId = `${id}-hint`;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {hint && (
        <p className="hint" id={hintId}>
          {hint}
        </p>
      )}
      <div className="input-row">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          value={Number.isFinite(value) ? value : ""}
          aria-describedby={hint ? hintId : undefined}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        />
        <span className="unit">{unit}</span>
      </div>
    </div>
  );
}
