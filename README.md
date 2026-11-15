# GAD Lifestyle website

One-page site: signature jersey flip, lookbook, team printing, about, contact.
Plain HTML + CSS + JavaScript. No build step. Open `index.html` to view it.

```
index.html      page structure
style.css       all styling
script.js       flip animation, lookbook, lightbox
data.js         ALL content: designs, colors, links, team work  <- edit this
assets/
  signature/<design-slug>/front.webp, back.webp, model/01.webp ...
  teams/        team printing photos
  brand/        logo and brand photos
```

Images: WebP, max 1600px wide, under 300KB each. Free converter: squoosh.app

---

## 1. Deploy for free

### Netlify (drag and drop)
1. Go to https://app.netlify.com/drop and sign in (free).
2. Drag this whole folder onto the page.
3. Netlify gives you a live link in a few seconds. Rename it under **Site configuration → Change site name**.
4. To update later: open the site in Netlify → **Deploys** → drag the folder again.

### GitHub Pages
1. Create a new **public** repository on github.com (for example `gad-lifestyle`).
2. On the repo page click **uploading an existing file**, drag in everything inside this folder (not the folder itself), then **Commit changes**.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**: Source = **Deploy from a branch**, Branch = **main**, folder = **/ (root)**. Click **Save**.
5. Wait about a minute. The link shows at the top of the Pages screen: `https://<username>.github.io/gad-lifestyle/`.

All paths are relative (`./assets/...`), so the site works on that sub-path.

---

## 2. Add a new signature design

1. Make a folder: `assets/signature/<slug>/` (lowercase, dashes, e.g. `midnight-gold`).
2. Add the product shots as `front.webp` and `back.webp`.
3. Add model photos as `model/01.webp`, `model/02.webp`, ...
4. Open `data.js` and add a block to `DESIGNS`. Position in the list = position in the flip. Put a new drop first and set `isNew: true` (remove `isNew` from the old one).

```js
{
  name: "Midnight Gold",
  slug: "midnight-gold",
  isNew: true,
  tagline: "One short line of copy.",
  note: "Pre-order open",
  price: "₱650",          // or null to hide
  sizes: "S – 3XL",       // or null to hide
  palette: { bg: "#0C0B06", fg: "#F6EEDD", accent: "#E2A738", accentFg: "#0C0B06" },
  front: "./assets/signature/midnight-gold/front.webp",
  back: "./assets/signature/midnight-gold/back.webp",   // or null
  models: [
    "./assets/signature/midnight-gold/model/01.webp",
    "./assets/signature/midnight-gold/model/02.webp",
  ],
},
```

Palette rules (so text stays readable):
- `bg` page background, `fg` text. Pick one dark and one light.
- `accent` is the button/highlight color taken from the jersey. It must stand out against `bg`.
- `accentFg` is the text on the button. Dark text on a bright accent, white on a deep accent.
- Check each pair at https://webaim.org/resources/contrastchecker/ and aim for 4.5 or higher.

## 3. Add more model photos to an existing design

1. Drop the photo into `assets/signature/<slug>/model/` with the next number (`04.webp`).
2. Add its path to that design's `models: [...]` list in `data.js`.

The first two model photos show beside the jersey in the flip. All of them show in the lookbook.

## 4. Add team printing work

1. Put the photo in `assets/teams/` (e.g. `pickleab.webp`). Photos of the team wearing the jerseys work best.
2. Add a line to `TEAMS` in `data.js`:

```js
const TEAMS = [
  { src: "./assets/teams/pickleab.webp", team: "Picklelab" },
  { src: "./assets/teams/league-set.webp", team: null },   // no name known
];
```

The team grid appears automatically once the list has at least one photo. The team name shows on hover.

---

## Other edits

- Links, phone, hours, Messenger/IG DM: `SITE` at the top of `data.js`.
- "How it works" steps and "What we offer": `TEAM_STEPS` and `TEAM_OFFERS` in `data.js`.
- About text: in `index.html`, section `id="about"`.

## Current gaps

- No prices or sizes set. Every design shows "DM for price and sizes" until `price` / `sizes` are filled in.
- No model photos yet for Reverse Thorns and Roses, Arctic Bloom, Venom Red, Snowflakes, Amber Ignite. Their lookbook groups show product shots only.
- `TEAMS` is empty, so the team photo grid is hidden.
- Phantom Black and Celestial White product shots are crops of one shared flat lay. Replace with separate front/back photos when available.
