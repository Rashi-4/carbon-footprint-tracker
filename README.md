# Carbon Footprint Tracker

A short, accessible web app that estimates a person's yearly carbon footprint in four steps and points to the one category where a change matters most.

**Live demo:** _add your deployed link_

## The problem

Most footprint calculators are long forms that end with a single number and no next step. People either quit halfway or finish without knowing what to do. This project tries to fix both: keep the form short and clear, then turn the result into three concrete actions.

## What it does

- Four steps (Transport, Home energy, Food, Shopping) with a visible progress indicator and Back/Next navigation.
- Plain-language questions with hints and sensible defaults, so people who do not know their exact numbers can still finish.
- A results view with the total, a per-category breakdown, and tips for the largest category only, so the advice is focused.
- Answers are saved in the browser, so a refresh does not lose progress.

## Design decisions

| Decision | Reason |
| --- | --- |
| One topic per step | Smaller chunks lower the effort of each screen and make the progress visible. |
| Defaults and hints on number fields | Reduces the "I don't know" drop-off. |
| Tips for the top category only | Avoids a long generic list; helps people pick one action. |
| Category shown by label and percentage, not colour alone | Readable for colour-blind users. |
| Focus moves to the heading on every step | Keyboard and screen reader users are told the view changed. |
| 44px minimum touch targets, responsive layout | Works one-handed on a phone. |
| Light and dark themes, reduced-motion support | Follows the user's system settings. |

## Accessibility checklist

- Every input has a visible `<label>`; hints are linked with `aria-describedby`.
- Radio groups use `fieldset` and `legend`.
- Progress uses a list with `aria-current="step"`.
- Results are announced through an `aria-live` region.
- Visible focus ring on all interactive elements.

Not yet done: a full audit with a screen reader and an automated tool such as axe or Lighthouse. Run one before relying on the claims above.

## Research and testing

_Fill this in only with what you actually did. Example structure:_

- _Who you asked (for example 5 classmates), and how (short interviews or watching them use it)._
- _What you learned (for example "3 of 5 did not know their electricity usage")._
- _What you changed because of it._

## Tech

React 18, TypeScript, Vite, plain CSS with design tokens. Vitest for the calculation logic.

```
npm install
npm run dev      # local dev server
npm test         # unit tests for the calculation logic
npm run build    # type-check and production build
```

## Notes on the numbers

Emission factors in `src/calc.ts` are rounded estimates for illustration. Replace them with sourced values for your region before quoting results anywhere.

## Possible next steps

- Compare the result against a regional average, with a cited source.
- Track footprint over time and show progress.
- Add a backend and sign-in to sync across devices.
