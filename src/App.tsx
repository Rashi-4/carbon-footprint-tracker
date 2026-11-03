import { useEffect, useRef, useState } from "react";
import { Answers, calculate, DEFAULT_ANSWERS, TIPS, topCategory } from "./calc";
import NumberField from "./components/NumberField";
import ChoiceGroup from "./components/ChoiceGroup";
import Breakdown from "./components/Breakdown";

const STEPS = ["Transport", "Home energy", "Food", "Shopping"] as const;
const STORAGE_KEY = "carbon-tracker:answers";

function load(): Answers {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_ANSWERS, ...JSON.parse(raw) } : DEFAULT_ANSWERS;
  } catch {
    return DEFAULT_ANSWERS;
  }
}

export default function App() {
  const [answers, setAnswers] = useState<Answers>(load);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setAnswers((a) => ({ ...a, [k]: v }));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* storage can be blocked; the app still works */
    }
  }, [answers]);

  // Move focus to the new heading so keyboard and screen reader users know the view changed.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step, done]);

  const result = calculate(answers);
  const top = topCategory(result);

  if (done) {
    return (
      <main>
        <h1 ref={headingRef} tabIndex={-1}>
          Your estimate
        </h1>
        <section aria-live="polite" className="card">
          <p className="big">
            {(result.total / 1000).toFixed(1)} <span>tonnes CO2e per year</span>
          </p>
          <p className="hint">This is an estimate built from rounded emission factors. Use it to compare choices, not as an exact figure.</p>
          <Breakdown result={result} />
        </section>
        <section className="card">
          <h2>Start with {top.toLowerCase()}</h2>
          <p className="hint">It is your largest category, so changes here move the total most.</p>
          <ol className="tips">
            {TIPS[top].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        </section>
        <div className="actions">
          <button className="secondary" onClick={() => { setDone(false); setStep(0); }}>
            Edit answers
          </button>
          <button
            className="secondary"
            onClick={() => {
              setAnswers(DEFAULT_ANSWERS);
              setDone(false);
              setStep(0);
            }}
          >
            Start over
          </button>
        </div>
      </main>
    );
  }

  const isLast = step === STEPS.length - 1;

  return (
    <main>
      <p className="eyebrow">Carbon Footprint Tracker</p>
      <nav aria-label="Progress">
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? "step" : undefined} className={i < step ? "past" : i === step ? "current" : ""}>
              <span className="dot">{i < step ? "✓" : i + 1}</span>
              <span className="step-name">{s}</span>
            </li>
          ))}
        </ol>
      </nav>

      <form
        className="card"
        onSubmit={(e) => {
          e.preventDefault();
          if (isLast) setDone(true);
          else setStep(step + 1);
        }}
      >
        <h1 ref={headingRef} tabIndex={-1}>
          {STEPS[step]}
        </h1>

        {step === 0 && (
          <>
            <NumberField label="Car distance" hint="Roughly how far you drive in a normal week." unit="km / week" value={answers.carKmPerWeek} onChange={(n) => set("carKmPerWeek", n)} />
            <NumberField label="Bus or metro distance" unit="km / week" value={answers.busKmPerWeek} onChange={(n) => set("busKmPerWeek", n)} />
            <NumberField label="Flights" hint="Count each one-way flight." unit="flights / year" value={answers.flightsPerYear} onChange={(n) => set("flightsPerYear", n)} />
          </>
        )}
        {step === 1 && (
          <>
            <NumberField label="Electricity" hint="Check a recent bill. Not sure? The default is a typical home." unit="kWh / month" value={answers.electricityKwhPerMonth} onChange={(n) => set("electricityKwhPerMonth", n)} />
            <NumberField label="LPG cylinders" unit="per year" value={answers.lpgCylindersPerYear} onChange={(n) => set("lpgCylindersPerYear", n)} />
          </>
        )}
        {step === 2 && (
          <ChoiceGroup
            legend="Which best describes your diet?"
            name="diet"
            value={answers.diet}
            onChange={(v) => set("diet", v)}
            options={[
              { value: "vegan", label: "Vegan", detail: "No animal products" },
              { value: "vegetarian", label: "Vegetarian", detail: "Dairy and eggs, no meat" },
              { value: "mixed", label: "Mixed", detail: "Meat a few times a week" },
              { value: "meat-heavy", label: "Meat most days", detail: "Meat in most meals" },
            ]}
          />
        )}
        {step === 3 && (
          <ChoiceGroup
            legend="How much do you buy new each month?"
            name="shopping"
            value={answers.shoppingPerMonth}
            onChange={(v) => set("shoppingPerMonth", v)}
            options={[
              { value: "low", label: "Little", detail: "Mostly essentials" },
              { value: "medium", label: "Some", detail: "Clothes or gadgets now and then" },
              { value: "high", label: "A lot", detail: "Frequent new purchases" },
            ]}
          />
        )}

        <div className="actions">
          {step > 0 && (
            <button type="button" className="secondary" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
          <button type="submit">{isLast ? "See my estimate" : "Next"}</button>
        </div>
      </form>
    </main>
  );
}
