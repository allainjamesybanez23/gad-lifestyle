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

## Add model photos

Drop the file in `assets/signature/<slug>/model/` and add its path to that design's `models` list.

## Add team printing work

Put the photo in `assets/teams/` and add it to `TEAMS` in `data.js`:

```js
{ src: "./assets/teams/team-name.webp", team: "Team name" },   // team: null if unknown
```
