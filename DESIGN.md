---
name: Data Room
surface: investor-relations
fonts:
  sans: Source Sans 3
  weights: [400, 600]
colors:
  background: "#FFFFFF"
  card: "#F9FAFB"
  foreground: "#141821"
  muted: "#676B73"
  border: "#E5E7EB"
  accent: "#1D4ED8"
spacing:
  base: 8
  max_width: 1024
---

# Design system — Data Room

## Product context

- **What this is:** A gated investor-relations portal. Financial disclosure, not a pitch deck.
- **Who it is for:** A partner who opens this at 11pm between board decks.
- **Posture:** Institutional clarity. The data persuades. The design gets out of the way.

## Aesthetic

- Light only. No dark mode. No theme toggle.
- Minimal decoration. Nothing that does not serve comprehension.
- Accent color is a CSS variable (`--primary`, default `#1D4ED8`). Change it in `.env` / `src/config/site.ts`. Do not scatter hex.

## Accent usage

The accent appears only in:

1. Primary CTA buttons
2. Active navigation
3. Link hover

It does **not** appear in metric values, eyebrow labels, borders, or body text. `#1D4ED8` on white is fine for large text; keep body text on `--foreground`.

## Type

- Source Sans 3, 400 (body) and 600 (headings, metric values)
- 13–15px body, 24px section, 32px page title
- Metric values use `--foreground`, not the accent

## Motion

- Subtle, functional. Fade + 20px translate, 0.5s ease-out.
- Honor `prefers-reduced-motion`.
- No cursor glow, no 3D scenes, no number tickers.

## Layout

- `max-w-5xl` (1024px)
- Cards: `.container-box` — 1px `--border`, `--card` fill, 12px radius
- Section padding: `py-16 md:py-24`
