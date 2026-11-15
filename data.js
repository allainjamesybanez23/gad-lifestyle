/* GAD Lifestyle — ALL site content lives here. Edit this file, refresh the page.
   Paths are relative to index.html. See README.md for how to add designs/photos. */

const SITE = {
  brand: "GAD Lifestyle",
  tagline: "Grind All Day",
  bio: "Stay Focused. Stay Driven. and Grind all Day",
  location: "Queen City of The South — Cebu, Philippines",
  hours: "Mon–Sat 9:00AM – 9PM · Sunday closed",
  phone: "0999 461 2260",
  phoneHref: "tel:+639994612260",
  instagram: "https://www.instagram.com/gad.lifestyle_/",
  facebook: "https://www.facebook.com/profile.php?id=61574786605325",
  igDM: "https://www.instagram.com/m/gad.lifestyle_/",   // opens a DM thread with GAD (ig.me links fail on some networks)
  messenger: "https://m.me/61574786605325",

  // Theme used everywhere outside the signature flip (team printing, about, footer)
  neutral: { bg: "#0B0B0C", fg: "#F4F4F2", accent: "#F4F4F2", accentFg: "#0B0B0C" },
};

/* Signature collection — order here = order in the flip.
   palette: bg = page background, fg = text, accent = buttons/highlights,
            accentFg = text on top of accent. Keep fg/bg and accent/bg contrast >= 4.5.
   price / sizes: set to a string (e.g. "₱650", "S – 3XL") to show it; null hides it.
   front / back: product shots. back may be null.
   models: photos of people wearing THIS design. May be []. */
const DESIGNS = [
  {
    name: "Reverse Thorns and Roses",
    slug: "reverse-thorns-and-roses",
    isNew: true,
    tagline: "Built on grind. Defined by style. More than just merch — it's a lifestyle.",
    note: "Pre-order open · Production starts Nov 21, 2026",
    price: null,
    sizes: null,
    palette: { bg: "#0A0A0A", fg: "#F2F2F2", accent: "#FF3B3B", accentFg: "#0A0A0A" },
    front: "./assets/signature/reverse-thorns-and-roses/front.webp",
    back: "./assets/signature/reverse-thorns-and-roses/back.webp",
    models: [],
  },
  {
    name: "Thorns and Roses",
    slug: "thorns-and-roses",
    tagline: "Thorns cut. Roses bloom. You don't just grind — you love the grind.",
    note: "Limited restocks",
    price: null,
    sizes: null,
    palette: { bg: "#EFEFF2", fg: "#17090A", accent: "#A3121F", accentFg: "#FFFFFF" },
    front: "./assets/signature/thorns-and-roses/front.webp",
    back: "./assets/signature/thorns-and-roses/back.webp",
    models: ["./assets/signature/thorns-and-roses/model/01.webp"],
  },
  {
    name: "Arctic Bloom",
    slug: "arctic-bloom",
    tagline: "Strength in silence. Growth in the grind. Even in the coldest moments, we bloom.",
    note: "Cold blooded on and off the court",
    price: null,
    sizes: null,
    palette: { bg: "#0B0F1A", fg: "#F1F3FA", accent: "#7C93FF", accentFg: "#070A14" },
    front: "./assets/signature/arctic-bloom/front.webp",
    back: "./assets/signature/arctic-bloom/back.webp",
    models: [],
  },
  {
    name: "Venom Red",
    slug: "venom-red",
    tagline: "Feel the heat. See the venom. Crafted for killers of comfort zones.",
    note: "Sold out on the first drop",
    price: null,
    sizes: null,
    palette: { bg: "#05122C", fg: "#F3F4F8", accent: "#FF5A66", accentFg: "#12050A" },
    front: "./assets/signature/venom-red/front.webp",
    back: "./assets/signature/venom-red/back.webp",
    models: [],
  },
  {
    name: "Snowflakes",
    slug: "snowflakes",
    tagline: "No two grinds are ever the same, yet all thrive under pressure. Stay cool, work hard.",
    note: "Winter arc",
    price: null,
    sizes: null,
    palette: { bg: "#EEF3FF", fg: "#0E1E45", accent: "#1F56B0", accentFg: "#FFFFFF" },
    front: "./assets/signature/snowflakes/front.webp",
    back: "./assets/signature/snowflakes/back.webp",
    models: [],
  },
  {
    name: "Phantom Black",
    slug: "phantom-black",
    tagline: "Strength isn't built when it's easy. It's built in the reps no one sees.",
    note: "GAD Essentials",
    price: null,
    sizes: null,
    palette: { bg: "#070909", fg: "#F2F2F2", accent: "#C9D4D4", accentFg: "#070909" },
    front: "./assets/signature/phantom-black/front.webp",
    back: null,
    models: [
      "./assets/signature/phantom-black/model/01.webp",
      "./assets/signature/phantom-black/model/02.webp",
      "./assets/signature/phantom-black/model/03.webp",
    ],
  },
  {
    name: "Celestial White",
    slug: "celestial-white",
    tagline: "Engineered for movement. Designed for discipline. Worn by those who refuse to settle.",
    note: "GAD Essentials",
    price: null,
    sizes: null,
    palette: { bg: "#F4F6F7", fg: "#111111", accent: "#34505C", accentFg: "#FFFFFF" },
    front: "./assets/signature/celestial-white/front.webp",
    back: null,
    models: [
      "./assets/signature/celestial-white/model/01.webp",
      "./assets/signature/celestial-white/model/02.webp",
      "./assets/signature/celestial-white/model/03.webp",
    ],
  },
  {
    name: "Amber Ignite",
    slug: "amber-ignite",
    tagline: "Black and gold. Grind all day, lit in amber.",
    note: "Pre-order open",
    price: null,
    sizes: null,
    palette: { bg: "#0C0B06", fg: "#F6EEDD", accent: "#E2A738", accentFg: "#0C0B06" },
    front: "./assets/signature/amber-ignite/front.webp",
    back: null,
    models: [],
  },
];

/* Team printing work. Add: { src: "./assets/teams/your-file.webp", team: "Team name or null" }
   The grid appears on the page as soon as this list has at least one item. */
const TEAMS = [];

const TEAM_STEPS = [
  { title: "Send design", text: "DM us your logo, colors, or a rough idea. No design yet? Tell us the look you want." },
  { title: "Mockup", text: "We send back a mockup of your jersey, front and back." },
  { title: "Approve", text: "Check names, numbers, and sizes. We print only once you say go." },
  { title: "Print & deliver", text: "Full sublimation print, then pickup or delivery to your team." },
];

const TEAM_OFFERS = [
  "Full sublimation jerseys",
  "Silk screen printing",
  "Custom names & numbers",
  "Team sets and clothing",
];
