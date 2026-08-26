# Deck theme

The Series A deck is a self-contained HTML artifact: one file, inline
styles, no build. It is served from `content/documents/sample-pitch-deck.html`
and mirrored at `demo/deck.html` for the local snapshot.

It is **not** the IR site. Dark canvas by default. Accent used as a
presentation color, not only on buttons. Slide content uses Source Sans 3;
chrome (rail, overview, watermark) uses the same face so a fork does not
need a second licensed typeface.

## Geometry

| Token | Value | Role |
|-------|-------|------|
| Stage | `1920 × 1080` | One slide. Scaled to the viewport. |
| `--type-display` | `64px` | Thesis / claim |
| `--type-title` | `48px` | Evidence / support |
| `--type-subtitle` | `30px` | Secondary line |
| `--type-body` | `24px` | Body |
| `--type-small` | `18px` | Caption |
| `--type-micro` | `14px` | Eyebrow |
| `--pad-x` | `96px` | Side margin |
| `--pad-top` | `80px` | Title row |

Cover headlines may reach `96px`. Do not invent sizes between display and title.

## Color

Set `ACCENT` once at the top of the HTML. The Acme example is `#1D4ED8`.

| Role | Token | Used for |
|------|-------|----------|
| Ink / paper | `#101010` / `#FFFFFF` | Dark and light slides |
| Warm paper | `#F0EEE9` | Evidence slides |
| Accent | `ACCENT` | Emphasis, progress, active rail |
| Dim | `rgba(255,255,255,.62)` | Secondary copy on dark |

Do not import these into `globals.css`. The deck cannot depend on the app.

## Spine (10 slides)

One argument per slide. Cards only for genuine proof groupings.

| # | Label | Chapter |
|---|-------|---------|
| 01 | Title | Series A |
| 02 | The job | The job |
| 03 | Why now | Why now |
| 04 | Product | Product |
| 05 | Traction | Proof |
| 06 | Network | Proof |
| 07 | Competition | Why we win |
| 08 | Founders | Why we win |
| 09 | The round | The round |
| 10 | Close | The round |

The cover story-map jumps to those chapter starts. General slides do not
carry a raise amount; slide 09 points at the use-of-funds memo.

## Navigation

Arrows / space, `T` rail, `O` overview, `F` fullscreen, `?slide=N` and
`#/slide-N`. Print unstacks to one page per slide.

## Restyle a fork

1. Change `ACCENT` and the company strings in the HTML.
2. Keep the ten `data-slide` sections and their `data-chapter` labels in sync
   with the cover buttons (`data-story-target` is 1-based).
3. Do not add a slide without updating the cover map and the test in
   `src/__tests__/deck-theme.test.ts`.
