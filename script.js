/* GAD Lifestyle — page behaviour. Content comes from data.js (SITE, DESIGNS, TEAMS...). */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const N = DESIGNS.length;
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (reduced) root.classList.add("reduced");
  root.classList.add("js");

  /* ---------- image states: fade in when loaded, plain message when a file is missing ---------- */
  const ready = (img) => img.classList.add("ready");
  document.addEventListener("load", (e) => { if (e.target.tagName === "IMG") { ready(e.target); e.target.parentElement.classList.remove("broken"); } }, true);
  document.addEventListener("error", (e) => {
    if (e.target.tagName !== "IMG" || !e.target.getAttribute("src")) return;
    if (e.target.closest(".shot, .about-pics, .path, .team-grid figure, .side")) e.target.parentElement.classList.add("broken");
  }, true);

  /* ---------- DM buttons: every order/quote CTA offers Messenger and Instagram ---------- */
  const ICON = {
    fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C7 3 3 6.7 3 11.3c0 2.6 1.3 4.9 3.4 6.4V21l3.1-1.7c.8.2 1.6.3 2.5.3 5 0 9-3.7 9-8.3S17 3 12 3z"/><path d="M7.5 13.6l3.1-3.3 2.1 2 3.8-2.4-3.1 3.3-2.1-2z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/></svg>',
  };
  // Messenger opens with the message already typed (Instagram DM links cannot prefill)
  const msgr = (text) => SITE.messenger + (text ? "?text=" + encodeURIComponent(text) : "");
  const orderText = (d) => `Hi GAD! I want to order ${d.name}.`;
  const DM_TEXT = { "Get a quote": "Hi GAD! I'd like a quote for custom team jerseys.", "Message us": "Hi GAD! I have a question." };
  function dmButtons(verb, what, text) {
    const one = (cls, href, icon, app) =>
      `<a class="btn ${cls}" href="${href}" target="_blank" rel="noopener" aria-label="${what} on ${app}">${icon}<span><span class="dm-verb">${verb} on </span>${app}</span></a>`;
    return one("", msgr(text), ICON.fb, "Messenger") + one("ghost", SITE.igDM, ICON.ig, "Instagram");
  }
  document.querySelectorAll("[data-dm]").forEach((el) => (el.innerHTML = dmButtons(el.dataset.dm, el.dataset.dm, DM_TEXT[el.dataset.dm])));
  const relabel = (box, what, text) => box.querySelectorAll("a").forEach((a) => {
    const ig = a.href.includes("instagram");
    if (!ig) a.href = msgr(text);
    a.setAttribute("aria-label", `${what} on ${ig ? "Instagram" : "Messenger"}`);
  });

  /* ---------- static content from data.js ---------- */
  document.querySelectorAll("[data-link]").forEach((a) => (a.href = SITE[a.dataset.link]));
  $("about-bio").textContent = SITE.bio + ".";
  $("c-hours").textContent = SITE.hours;
  $("c-loc").textContent = SITE.location;
  $("c-phone").textContent = SITE.phone;
  $("c-phone").href = SITE.phoneHref;
  $("year").textContent = new Date().getFullYear();
  $("h-total").textContent = String(N).padStart(2, "0");
  const strip = SITE.marquee.map((w) => `<span>${w}</span><i></i>`).join("").repeat(4);
  document.querySelectorAll(".marquee-in").forEach((m) => (m.innerHTML = strip + strip));
  const W = SITE.wornBy;
  $("worn-h").textContent = W.title;
  $("worn-text").textContent = W.text;
  $("worn-who").innerHTML = W.who.map((w) => `<li>${w}</li>`).join("");
  $("worn-strip").innerHTML = W.photos.map((p) => `<figure><img src="${p.src}" alt="Baller wearing the GAD ${p.design} jersey" loading="lazy" width="600" height="800"><figcaption>${p.design}</figcaption></figure>`).join("");
  $("proof").innerHTML = SITE.proof.map((p) => `<li><b>${p.n}</b>${p.t}</li>`).join("");

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
    img.src = DESIGNS[i].cutout || DESIGNS[i].hero || DESIGNS[i].front;
    img.classList.toggle("is-cut", !!DESIGNS[i].cutout);
    img.alt = `GAD ${DESIGNS[i].name} jersey`;
  }

  function showDesign(i) {
    if (i === shown) return;
    shown = i;
    const d = DESIGNS[i];
    $("h-badge").hidden = !d.isNew;
    $("h-num").textContent = String(i + 1).padStart(2, "0");
    $("h-num").classList.remove("pop"); void $("h-num").offsetWidth; $("h-num").classList.add("pop");
    $("h-name").textContent = d.name;
    $("h-tag").textContent = d.tagline;
    $("h-note").textContent = [d.note, d.price, d.sizes && "Sizes " + d.sizes].filter(Boolean).join(" · ") || "DM for price and sizes";
    $("h-look").href = "#look-" + d.slug;
    $("h-look").setAttribute("aria-label", `View ${d.name} lookbook`);
    relabel($("h-dm"), `Order ${d.name}`, orderText(d));
    // each design's own motif (roses, scales, snowflakes...) drawn behind the stage
    $("motif").dataset.p = d.texture ? "tex" : d.pattern || "";
    if (d.texture) $("motif").style.setProperty("--tile", `url("${d.texture}")`); else $("motif").style.removeProperty("--tile");
    // urgency tag from a real date in data.js; disappears once the date has passed
    const days = d.deadline ? Math.ceil((new Date(d.deadline + "T00:00:00+08:00") - Date.now()) / 864e5) : -1;
    $("h-urgent").hidden = days < 0;
    if (days >= 0) $("h-urgent").textContent = `${d.deadlineText || "Closes"} ${days === 0 ? "today" : `in ${days} day${days === 1 ? "" : "s"}`}`;
    // side photos: model shots first, the back of the jersey as a fallback
    const pics = d.models.filter((m) => m !== d.hero).slice(0, 2).map((src) => ({ src, alt: `Model wearing GAD ${d.name} jersey`, cap: "On body" }));
    // sideShot (data.js) overrides the fallback when the cut-out already shows the back
    if (pics.length < 2 && d.sideShot) pics.push({ src: d.sideShot, alt: `GAD ${d.name} jersey`, cap: d.sideCap || "Front" });
    else if (pics.length < 2 && d.back) pics.push({ src: d.back, alt: `GAD ${d.name} jersey, back`, cap: "Back" });
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
    let t = clamp((f - 0.15) / 0.7, 0, 1);         // short hold on each design, long soft flip between
    t = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;   // cubic in-out
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
      // the card pulls back and lifts slightly while it turns, so the edge-on moment reads as depth, not a sliver
      const s = Math.sin(t * Math.PI);
      card.style.transform = `translateY(${-14 * s}px) rotateY(${r * 180}deg) scale(${1 - 0.14 * s})`;
    }

    showDesign(Math.round(r));
    const fade = Math.abs(1 - 2 * t);               // 1 at rest, 0 mid-flip
    copy.style.opacity = fade;
    sides.style.opacity = fade;
    $("motif").style.opacity = fade * (DESIGNS[Math.round(r)].texture ? 0.5 : 0.26);
    if (!reduced) {
      const drift = t < 0.5 ? t : t - 1;            // out upward, back in from below
      const blur = (1 - fade) * 8;
      copy.style.transform = `translateY(${drift * -24}px)`;
      copy.style.filter = blur > 0.2 ? `blur(${blur * 0.6}px)` : "";
      sides.style.transform = `translateY(${drift * -40}px)`;
      sides.style.filter = blur > 0.2 ? `blur(${blur}px)` : "";
    }
    track.style.transform = `translateX(${-r * 100}vw)`;
    $("h-bar").style.transform = `scaleX(${pos / (N - 1)})`;
    // swap the theme in a short window around the flip's midpoint, so a dark→light pair
    // never sits on a muddy half-gray background
    const tt = clamp((t - 0.38) / 0.24, 0, 1);
    blendTheme(DESIGNS[i].palette, DESIGNS[i + 1].palette, tt * tt * (3 - 2 * tt));
  }

  // warm the cache once the page has loaded, so flips never show a blank face
  addEventListener("load", () => (window.requestIdleCallback || setTimeout)(() => DESIGNS.forEach((d) => { new Image().src = d.cutout || d.hero || d.front; })));
  render(0);

  let goTo;
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: ".hero", start: "top top", end: () => "+=" + innerHeight * (N - 1) * 0.9,
      pin: true, scrub: reduced ? true : 0.9, invalidateOnRefresh: true,
      // always come to rest on a whole design, never frozen mid-flip
      snap: { snapTo: 1 / (N - 1), duration: { min: 0.25, max: 0.7 }, delay: 0.08, ease: "power2.inOut" },
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
    const shots = items.map((p, k) => {
      const idx = photos.push({ ...p, design: d }) - 1;
      return `<button type="button" class="shot${k === 0 ? " big" : ""}" data-idx="${idx}" aria-label="Open photo: ${p.alt}">
        <img src="${p.src}" alt="${p.alt}" loading="lazy" width="600" height="800">${p.tag ? `<span>${p.tag}</span>` : ""}</button>`;
    }).join("");
    const p = d.palette;
    return `<div class="group" id="look-${d.slug}" data-slug="${d.slug}" data-p="${d.texture ? "tex" : d.pattern || ""}" style="${d.texture ? `--tile:url('${d.texture}');` : ""}--bg:${p.bg};--fg:${p.fg};--accent:${p.accent};--accent-fg:${p.accentFg}">
      <div class="wrap"><div class="group-head"><div><h3>${d.name}</h3><p>${d.tagline}</p></div>
      <div class="dm">${dmButtons("Order", `Order ${d.name}`, orderText(d))}</div></div>
      <div class="shots">${shots}</div></div></div>`;
  }).join("");

  const chips = $("chips");
  chips.innerHTML = [{ name: "All", slug: "all" }, ...DESIGNS]
    .map((d) => `<button type="button" class="chip" data-slug="${d.slug}" aria-pressed="${d.slug === "all"}">${d.name}</button>`).join("");
  function filter(slug) {
    chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c.dataset.slug === slug));
    document.querySelectorAll(".group").forEach((g) => (g.hidden = slug !== "all" && g.dataset.slug !== slug));
    const n = document.querySelectorAll(".group:not([hidden]) .shot").length;
    const d = DESIGNS.find((x) => x.slug === slug);
    $("look-status").textContent = `Showing ${d ? d.name : "all designs"}: ${n} photo${n === 1 ? "" : "s"}`;
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
    $("lb-img").classList.remove("in"); void $("lb-img").offsetWidth; $("lb-img").classList.add("in");
    $("lb-img").src = p.src;
    $("lb-img").alt = p.alt;
    $("lb-cap").textContent = p.design.name;
    relabel($("lb-dm"), `Order ${p.design.name}`, orderText(p.design));
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
  $("team-empty").hidden = TEAMS.length > 0;
  if (TEAMS.length) {
    $("team-grid").hidden = false;
    $("team-grid").innerHTML = TEAMS.map((t) => `<figure tabindex="0"><img src="${t.src}" alt="${t.team ? t.team + " custom team jersey by GAD" : "Custom team jersey printed by GAD"}" loading="lazy" width="800" height="600">${t.team ? `<figcaption>${t.team}</figcaption>` : ""}</figure>`).join("");
  }

  /* ---------- mobile menu (full-screen overlay) ---------- */
  const menuBtn = $("menu-btn");
  function setMenu(open) {
    root.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Menu");
    document.querySelector("main").inert = open;
    if (open) $("menu").querySelector("a").focus({ preventScroll: true });
  }
  menuBtn.addEventListener("click", () => setMenu(!root.classList.contains("menu-open")));
  $("menu").addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("menu-open")) { setMenu(false); menuBtn.focus(); }
  });
  matchMedia("(min-width: 861px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ---------- copy phone number, with success / failure feedback ---------- */
  const copyBtn = $("c-copy");
  copyBtn.addEventListener("click", async () => {
    let ok = true;
    try { await navigator.clipboard.writeText(SITE.phone.replace(/\s/g, "")); } catch (err) { ok = false; }
    copyBtn.textContent = ok ? "Copied" : "Copy failed";
    copyBtn.classList.add(ok ? "done" : "fail");
    setTimeout(() => { copyBtn.textContent = "Copy"; copyBtn.classList.remove("done", "fail"); }, 2000);
  });

  /* ---------- sticky order button (phones, once the flip is behind you) ---------- */
  const sticky = $("sticky-dm");
  sticky.href = msgr("Hi GAD! I want to order.");
  sticky.innerHTML = ICON.fb + "<span>DM to order</span>";
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => (sticky.hidden = !e.isIntersecting)).observe($("rest"));
  }

  /* ---------- intro + scroll reveals ---------- */
  const intro = $("intro");
  if (hasGsap && !reduced) {
    gsap.timeline({ onComplete: () => intro.remove() })
      .from("#intro b", { yPercent: 60, opacity: 0, duration: 0.4, ease: "power3.out" })
      .from("#intro span", { opacity: 0, letterSpacing: "0.6em", duration: 0.4, ease: "power2.out" }, "-=0.2")
      .to(intro, { clipPath: "inset(0 0 100% 0)", duration: 0.6, ease: "power3.inOut" }, "+=0.2")
      .from("#home-art", { y: -110, opacity: 0, rotate: -6, duration: 0.9, ease: "back.out(1.4)", clearProps: "all" }, "-=0.35")
      .from(".home-copy > *", { y: 24, opacity: 0, duration: 0.5, stagger: 0.07, ease: "power2.out", clearProps: "all" }, "-=0.7");

    const rv = "#start h2, #start .lead, .worn-who li, .worn-strip figure, .team-grid figure, .path, .why li, #start .steps li, .order-cta, #rest h2, #rest .lead, .chips, .group-head, .shot, .steps li, .offers li, .quote, .about p, .about-pics img, .proof li, .info > div";
    gsap.set(rv, { opacity: 0, y: 26 });
    ScrollTrigger.batch(rv, {
      start: "top 92%", once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: "power2.out", overwrite: true }),
    });
  } else {
    intro.remove();
  }

  /* ---------- micro-interactions (all transform/opacity, nothing that triggers layout) ---------- */
  // new-drop pill on the home section, with the same countdown as the flip
  const fresh = DESIGNS.find((d) => d.isNew) || DESIGNS[0];
  const left = fresh.deadline ? Math.ceil((new Date(fresh.deadline + "T00:00:00+08:00") - Date.now()) / 864e5) : -1;
  $("home-drop-text").textContent = `New drop: ${fresh.name}` + (left > 0 ? ` · ${(fresh.deadlineText || "closes").toLowerCase()} in ${left} day${left === 1 ? "" : "s"}` : "");

  // jerseys lean toward the pointer (desktop only, one rAF per frame)
  if (!reduced && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let raf = 0;
    addEventListener("pointermove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        root.style.setProperty("--px", (e.clientX / innerWidth - 0.5).toFixed(3));
        root.style.setProperty("--py", (e.clientY / innerHeight - 0.5).toFixed(3));
      });
    }, { passive: true });
  }

  // nav: solid once you scroll, and the current section is marked
  const navEl = document.querySelector(".nav");
  const onScroll = () => navEl.classList.toggle("scrolled", scrollY > 24);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if ("IntersectionObserver" in window) {
    const links = [...document.querySelectorAll("#menu a")];
    const spy = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.toggleAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((a) => { const t = document.querySelector(a.getAttribute("href")); if (t) spy.observe(t); });

    // stats count up the first time they are seen
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const m = e.target.textContent.match(/^([\d,]+)(.*)$/);
      if (!m || reduced) return;
      const end = +m[1].replace(/,/g, ""), t0 = performance.now();
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / 900), v = Math.round(end * (1 - Math.pow(1 - k, 3)));
        e.target.textContent = v.toLocaleString("en-US") + m[2];
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    document.querySelectorAll(".proof b").forEach((b) => io.observe(b));
  }

  document.querySelectorAll("img").forEach((img) => { if (img.complete && img.naturalWidth) ready(img); });
  if (hasGsap) addEventListener("load", () => ScrollTrigger.refresh());
})();
