import { Category, Result } from "../calc";

const ORDER: Category[] = ["Transport", "Home energy", "Food", "Shopping"];

export default function Breakdown({ result }: { result: Result }) {
  const max = Math.max(...ORDER.map((c) => result.breakdown[c]), 1);
  return (
    <ul className="breakdown" aria-label="Footprint by category">
      {ORDER.map((c, i) => {
        const kg = result.breakdown[c];
        const pct = result.total > 0 ? Math.round((kg / result.total) * 100) : 0;
        return (
          <li key={c}>
            <div className="bar-head">
              <span>{c}</span>
              <span>
                {(kg / 1000).toFixed(2)} t &middot; {pct}%
              </span>
            </div>
            <div className="bar-track" aria-hidden="true">
              <div className={`bar-fill bar-${i}`} style={{ width: `${(kg / max) * 100}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
