# GAD Lifestyle

All site content lives in `data.js`. Images go in `assets/` as WebP, max 1600px wide, under 300KB.

## Add a signature design

1. Put the photos in `assets/signature/<slug>/`: `front.webp`, `back.webp`, and model photos in `model/01.webp`, `model/02.webp`, ...
2. Add a block to `DESIGNS` in `data.js`. List order is flip order; mark the newest drop with `isNew: true`.

```js
{
  name: "Midnight Gold",
  slug: "midnight-gold",
  isNew: true,
  tagline: "One short line of copy.",
  note: "Pre-order open",
  price: "₱650",          // null to hide
  sizes: "S – 3XL",       // null to hide
  palette: { bg: "#0C0B06", fg: "#F6EEDD", accent: "#E2A738", accentFg: "#0C0B06" },
  front: "./assets/signature/midnight-gold/front.webp",
  back: "./assets/signature/midnight-gold/back.webp",   // or null
  models: ["./assets/signature/midnight-gold/model/01.webp"],
},
```

Keep `fg` on `bg` and `accentFg` on `accent` readable (contrast 4.5 or higher).

Optional fields:

- `cutout: "./assets/signature/<slug>/cutout.webp"`: jersey with the background removed (transparent WebP). The flip shows it floating on the theme color. Without it the flip shows `front` as a photo card. Make one with any background remover (Canva, remove.bg) and save as WebP.
- `deadline: "2026-11-21"` and `deadlineText: "Production starts"`: shows "Production starts in N days" and hides itself after that date.
- `sideShot`: photo shown beside the jersey when there are no model photos.

Follower numbers in the About section are in `SITE.proof` in `data.js`.

## Add model photos

Drop the file in `assets/signature/<slug>/model/` and add its path to that design's `models` list.

## Add team printing work

Put the photo in `assets/teams/` and add it to `TEAMS` in `data.js`:

```js
{ src: "./assets/teams/team-name.webp", team: "Team name" },   // team: null if unknown
```

## Styling rules

Design tokens live at the top of `style.css` (`:root`): type scale `--t-*`, spacing `--s-*`, radii `--r-*`, shadows `--shadow-*`, motion `--ease` / `--dur-*`, and the color roles `--bg --fg --accent --accent-fg --muted --line --soft`. New styles should use these instead of new one-off values. Reusable pieces: `.btn` (+ `.ghost`), `.pill`, `.chip`, `.path` (card), `.steps`, `.proof`, `.empty`.

The home section copy is plain HTML in `index.html` under `id="home"` and `id="start"`.
