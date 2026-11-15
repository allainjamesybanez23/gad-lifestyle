/* GAD Lifestyle — page behaviour. Content comes from data.js (SITE, DESIGNS, TEAMS...). */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const N = DESIGNS.length;
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (reduced) root.classList.add("reduced");

  /* ---------- static content from data.js ---------- */
  document.querySelectorAll("[data-link]").forEach((a) => (a.href = SITE[a.dataset.link]));
  $("about-bio").textContent = SITE.bio + ".";
  $("c-hours").textContent = SITE.hours;
  $("c-loc").textContent = SITE.location;
  $("c-phone").textContent = SITE.phone;
  $("c-phone").href = SITE.phoneHref;
  $("year").textContent = new Date().getFullYear();
  $("h-total").textContent = String(N).padStart(2, "0");

  const setVars = (el, p) => {
    el.style.setProperty("--bg", p.bg);
    el.style.setProperty("--fg", p.fg);
    el.style.setProperty("--accent", p.accent);
    el.style.setProperty("--accent-fg", p.accentFg);
  };
  setVars($("rest"), SITE.neutral);

  /* ---------- theme (CSS variables, blended by GSAP) ---------- */
  const mix = hasGsap ? gsap.utils.interpolate : (a, b, t) => (t < 0.5 ? a : b);
  function blendTheme(a, b, t) {
    setVars(root, { bg: mix(a.bg, b.bg, t), fg: mix(a.fg, b.fg, t), accent: mix(a.accent, b.accent, t), accentFg: mix(a.accentFg, b.accentFg, t) });
  }

  /* ---------- hero: signature flip ---------- */
  const track = document.querySelector(".hero-track");
  track.innerHTML = DESIGNS.map((d) => `<span>${d.name}</span>`).join("");
  const card = $("card"), faceA = $("face-a"), faceB = $("face-b");
  const copy = document.querySelector(".hero-copy"), sides = $("sides");
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let shown = -1;

  function setFace(img, i) {
    if (img.dataset.i === String(i)) return;
    img.dataset.i = i;
    img.src = DESIGNS[i].front;
    img.alt = `GAD ${DESIGNS[i].name} jersey`;
  }

  function showDesign(i) {
    if (i === shown) return;
    shown = i;
    const d = DESIGNS[i];
    $("h-badge").hidden = !d.isNew;
    $("h-num").textContent = String(i + 1).padStart(2, "0");
    $("h-name").textContent = d.name;
    $("h-tag").textContent = d.tagline;
    $("h-note").textContent = [d.note, d.price, d.sizes && "Sizes " + d.sizes].filter(Boolean).join(" · ") || "DM for price and sizes";
    $("h-look").href = "#look-" + d.slug;
    $("h-look").setAttribute("aria-label", `View ${d.name} lookbook`);
    $("h-order").href = SITE.igDM;
    $("h-order").setAttribute("aria-label", `Order ${d.name}, DM us on Instagram`);
    // side photos: model shots first, the back of the jersey as a fallback
    const pics = d.models.slice(0, 2).map((src) => ({ src, alt: `Model wearing GAD ${d.name} jersey`, cap: "On body" }));
    if (pics.length < 2 && d.back) pics.push({ src: d.back, alt: `GAD ${d.name} jersey, back`, cap: "Back" });
    [1, 2].forEach((n) => {
      const p = pics[n - 1], fig = $("side-" + n).parentElement;
      fig.hidden = !p;
      if (p) { $("side-" + n).src = p.src; $("side-" + n).alt = p.alt; $("cap-" + n).textContent = p.cap; }
    });
    $("h-prev").disabled = i === 0;
    $("h-next").disabled = i === N - 1;
  }

  /* render(pos): pos runs 0 → N-1. Pure function of scroll position, so scrubbing
     backwards and forwards always lands in the right state. */
  function render(pos) {
    pos = clamp(pos, 0, N - 1);
    const i = Math.min(Math.floor(pos), N - 2), f = pos - i;
    let t = clamp((f - 0.3) / 0.4, 0, 1);          // hold each design, flip in the middle 40%
    t = t * t * (3 - 2 * t);
    const r = i + t;                                // 0..N-1, eased
    // the two faces of the card carry the even / odd design nearest to r
    let even = 2 * Math.round(r / 2), odd = 2 * Math.floor(r / 2) + 1;
    if (even > N - 1) even -= 2;
    if (odd > N - 1) odd -= 2;
    setFace(faceA, even);
    if (odd >= 0) setFace(faceB, odd);

    if (reduced) {                                  // crossfade instead of flipping
      const evenOp = 1 - Math.abs(r - 2 * Math.round(r / 2));
      faceA.style.opacity = evenOp;
      faceB.style.opacity = 1 - evenOp;
    } else {
      const dip = 1 - 0.08 * Math.sin(t * Math.PI);
      card.style.transform = `rotateY(${r * 180}deg) scale(${dip})`;
    }

    showDesign(Math.round(r));
    const fade = Math.abs(1 - 2 * t);               // 1 at rest, 0 mid-flip
    copy.style.opacity = fade;
    sides.style.opacity = fade;
    if (!reduced) sides.style.transform = `translateY(${(t < 0.5 ? t : t - 1) * -60}px)`;
    track.style.transform = `translateX(${-r * 100}vw)`;
    $("h-bar").style.transform = `scaleX(${pos / (N - 1)})`;
    blendTheme(DESIGNS[i].palette, DESIGNS[i + 1].palette, t);
  }

  DESIGNS.forEach((d) => { new Image().src = d.front; });   // warm the cache so flips never show a blank face
  render(0);

  let goTo;
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: ".hero", start: "top top", end: () => "+=" + innerHeight * (N - 1) * 0.9,
      pin: true, scrub: reduced ? true : 0.4, invalidateOnRefresh: true,
      onUpdate: (self) => render(self.progress * (N - 1)),
    });
    // hand the nav over to the neutral brand theme as the lookbook arrives
    ScrollTrigger.create({
      trigger: "#rest", start: "top 70%", end: "top 20%", scrub: true,
      // at progress 0 (page load, scrolling back up) the hero owns the theme
      onUpdate: (self) => self.progress > 0
        ? blendTheme(DESIGNS[N - 1].palette, SITE.neutral, self.progress)
        : render(st.progress * (N - 1)),
    });
    goTo = (i) => window.scrollTo({ top: st.start + (i / (N - 1)) * (st.end - st.start), behavior: reduced ? "auto" : "smooth" });
  } else {
    goTo = (i) => render(i);   // GSAP failed to load: buttons still step through the designs
  }
  $("h-prev").addEventListener("click", () => goTo(Math.max(0, shown - 1)));
  $("h-next").addEventListener("click", () => goTo(Math.min(N - 1, shown + 1)));

  /* ---------- lookbook ---------- */
  const photos = [];   // flat list for the lightbox
  $("groups").innerHTML = DESIGNS.map((d) => {
    const items = d.models.map((src) => ({ src, alt: `Model wearing GAD ${d.name} jersey`, tag: "" }));
    if (d.front) items.push({ src: d.front, alt: `GAD ${d.name} jersey`, tag: "Product" });
    if (d.back) items.push({ src: d.back, alt: `GAD ${d.name} jersey, back`, tag: "Back" });
    const shots = items.map((p) => {
      const idx = photos.push({ ...p, design: d }) - 1;
      return `<button type="button" class="shot" data-idx="${idx}" aria-label="Open photo: ${p.alt}">
        <img src="${p.src}" alt="${p.alt}" loading="lazy" width="600" height="800">${p.tag ? `<span>${p.tag}</span>` : ""}</button>`;
    }).join("");
    const p = d.palette;
    return `<div class="group" id="look-${d.slug}" data-slug="${d.slug}" style="--bg:${p.bg};--fg:${p.fg};--accent:${p.accent};--accent-fg:${p.accentFg}">
      <div class="wrap"><div class="group-head"><div><h3>${d.name}</h3><p>${d.tagline}</p></div>
      <a class="btn" href="${SITE.igDM}" target="_blank" rel="noopener" aria-label="Order ${d.name}, DM us on Instagram">DM to order</a></div>
      <div class="shots">${shots}</div></div></div>`;
  }).join("");

  const chips = $("chips");
  chips.innerHTML = [{ name: "All", slug: "all" }, ...DESIGNS]
    .map((d) => `<button type="button" class="chip" data-slug="${d.slug}" aria-pressed="${d.slug === "all"}">${d.name}</button>`).join("");
  function filter(slug) {
    chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c.dataset.slug === slug));
    document.querySelectorAll(".group").forEach((g) => (g.hidden = slug !== "all" && g.dataset.slug !== slug));
    if (hasGsap) ScrollTrigger.refresh();
  }
  chips.addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (c) filter(c.dataset.slug); });
  // "View lookbook" must always land on a visible group
  $("h-look").addEventListener("click", () => filter("all"));

  /* ---------- lightbox (native <dialog>: focus trap + Esc for free) ---------- */
  const lb = $("lightbox");
  let cur = 0;
  const visible = () => photos.map((p, i) => i).filter((i) => !$("look-" + photos[i].design.slug).hidden);
  function openPhoto(i) {
    cur = i;
    const p = photos[i];
    $("lb-img").src = p.src;
    $("lb-img").alt = p.alt;
    $("lb-cap").textContent = p.design.name;
    $("lb-cta").href = SITE.igDM;
    if (!lb.open) lb.showModal();
  }
  function step(dir) {
    const v = visible(), at = v.indexOf(cur);
    openPhoto(v[(at + dir + v.length) % v.length]);
  }
  $("groups").addEventListener("click", (e) => { const s = e.target.closest(".shot"); if (s) openPhoto(+s.dataset.idx); });
  $("lb-prev").addEventListener("click", () => step(-1));
  $("lb-next").addEventListener("click", () => step(1));
  $("lb-close").addEventListener("click", () => lb.close());
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); });

  /* ---------- team printing ---------- */
  $("steps").innerHTML = TEAM_STEPS.map((s) => `<li><b>${s.title}</b><p>${s.text}</p></li>`).join("");
  $("offers").innerHTML = TEAM_OFFERS.map((o) => `<li>${o}</li>`).join("");
  if (TEAMS.length) {
    $("team-grid").hidden = false;
    $("team-grid").innerHTML = TEAMS.map((t) => `<figure tabindex="0"><img src="${t.src}" alt="${t.team ? t.team + " custom team jersey by GAD" : "Custom team jersey printed by GAD"}" loading="lazy" width="800" height="600">${t.team ? `<figcaption>${t.team}</figcaption>` : ""}</figure>`).join("");
  }

  if (hasGsap) addEventListener("load", () => ScrollTrigger.refresh());
})();
