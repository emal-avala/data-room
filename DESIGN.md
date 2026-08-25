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

- **What this is:** A gated investor-relations portal. Financial disclosure, not a pitch deck. The repo ships Acme Corporation — a fictional yard-autonomy company — as a complete Series A example.
- **Who it is for:** A partner who opens this at 11pm between board decks. Acme is the worked example they should be able to diligence in one sitting.
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

## Deck palette exception

The Series A deck (`content/documents/sample-pitch-deck.html`, mirrored
at `demo/deck.html`) carries its own palette and does **not** inherit the
tokens above. It is the only surface allowed to do so.

The deck is a self-contained presentation: one HTML file, inline styles,
no build. It is served in the data room, opened standalone on GitHub
Pages, printed, and handed to people outside the app — so it cannot
depend on stylesheets it may not be loaded alongside. It inverts the
site contract: dark canvas by default, accent used as a presentation
color rather than restricted to CTAs.

| Role | Value | Used for |
|------|-------|----------|
| Ink / paper | `#101010` / `#FFFFFF` | Dark and light slides |
| Warm paper | `#F0EEE9` | Evidence slides (why now, network) |
| Accent | `#1D4ED8` (`ACCENT`) | Emphasis, progress, active rail, close |
| Dim | `rgba(255,255,255,.62)` | Secondary copy on dark |

Change `ACCENT` once at the top of the HTML. Do not import these values
into `globals.css`. Geometry, type roles, and the ten-slide spine live
in [docs/guides/deck.md](docs/guides/deck.md) and are gated by
`src/__tests__/deck-theme.test.ts`.
