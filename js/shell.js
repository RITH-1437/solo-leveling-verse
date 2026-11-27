/* ==========================================================================
   SOLO LEVELING VERSE: page shell
   --------------------------------------------------------------------------
   Builds the shared navigation (one source for every page), the
   global command-palette search (Ctrl/⌘+K or "/"), the spoiler switch,
   System toasts, scroll reveals, the back-to-top button and `?view=<id>`
   deep links (opened in the viewer from viewer.js).
   ========================================================================== */

(() => {
  "use strict";
  const SLV = window.SLV;
  const { $, esc } = SLV.util;
  const page = document.body.dataset.page || "";

  const LINKS = [
    ["home", "index.html", "Dashboard"],
    ["archive", "archive.html", "Archive"],
    ["hunters", "hunters.html", "Hunters"],
    ["monarchs", "archive.html#monarchs", "Monarchs"],
    ["shadows", "archive.html#shadows", "Shadows"],
    ["timeline", "timeline.html", "Timeline"],
    ["network", "network.html", "Network"]
  ];
  const BRAND_MARK = `<svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="bm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5ec8ff"/><stop offset="1" stop-color="#b06bff"/></linearGradient></defs><path d="M20 2 36 11v18L20 38 4 29V11z" fill="#070a18" stroke="url(#bm)" stroke-width="2"/><path d="M20 9l3 15h-6z" fill="url(#bm)"/><path d="M13 25h14l-2 3H15z" fill="url(#bm)"/><circle cx="20" cy="31" r="1.8" fill="#e9ddff"/></svg>`;
  SLV.BRAND_MARK = BRAND_MARK;
  const ICON = {
    search: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    menu: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    alert: '<svg class="state-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/></svg>',
    empty: '<svg class="state-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><ellipse cx="12" cy="12" rx="6" ry="9"/><ellipse cx="12" cy="12" rx="2.5" ry="4.5"/></svg>'
  };
  SLV.ICON = ICON;

  /* --------------------------------------------------------------- nav */
  function currentKey() {
    if (page === "archive") {
      const tab = (location.hash.match(/^#(\w+)/) || [])[1];
      if (tab === "monarchs" || tab === "shadows") return tab;
    }
    return page;
  }
  function skipLink() {
    const main = document.querySelector("main");
    if (!main) return;
    if (!main.id) main.id = "main";
    if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
    const a = document.createElement("a");
    a.className = "skip-link"; a.href = "#" + main.id; a.textContent = "Skip to content";
    a.addEventListener("click", (e) => { e.preventDefault(); main.focus({ preventScroll: true }); main.scrollIntoView(); });
    document.body.prepend(a);
  }
  function buildNav() {
    const nav = $("#nav");
    if (!nav) return;
    nav.className = "nav";
    nav.innerHTML = `
      <div class="wrap nav-inner">
        <a class="brand" href="${esc(SLV.page("index.html"))}" aria-label="Solo Leveling Verse dashboard">${BRAND_MARK}
          <span class="brand-text"><span class="bt-full">Solo Leveling</span><span class="bt-short">SL</span> <em>Verse</em></span></a>
        <nav class="nav-links" id="nav-links" aria-label="Main">
          ${LINKS.map(([k, href, label]) => `<a href="${esc(SLV.page(href))}" data-key="${k}">${label}</a>`).join("")}
        </nav>
        <div class="nav-tools">
          <button type="button" class="btn sm nav-search" id="open-search" aria-label="Search the archive (Ctrl+K)">
            ${ICON.search}<span class="lbl">Search the archive</span><kbd>Ctrl K</kbd></button>
          <label class="switch spoiler-switch" title="Show manhwa content beyond the anime (Season 1–2)">
            <input type="checkbox" id="spoiler-toggle" ${SLV.spoilers.on ? "checked" : ""}>
            <span class="track"></span><span class="lbl-long">Manhwa spoilers</span><span class="lbl-short">Spoilers</span>
          </label>
          <button type="button" class="btn sm icon nav-toggle" id="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav-links">${ICON.menu}</button>
        </div>
      </div>`;
    markCurrent();
    $("#open-search").addEventListener("click", () => openPalette());
    $("#spoiler-toggle").addEventListener("change", (e) => {
      SLV.spoilers.set(e.target.checked);
      notify(e.target.checked ? "Manhwa content unlocked. Entries beyond the anime are now visible."
        : "Anime-safe mode. Content beyond Season 2 is hidden.", { title: e.target.checked ? "Spoilers revealed" : "Spoilers sealed" });
    });
    const tog = $("#nav-toggle");
    tog.addEventListener("click", () => {
      const open = !nav.classList.contains("open");
      nav.classList.toggle("open", open); tog.setAttribute("aria-expanded", String(open));
    });
    $("#nav-links").addEventListener("click", (e) => {
      if (e.target.closest("a")) { nav.classList.remove("open"); tog.setAttribute("aria-expanded", "false"); }
    });
    window.addEventListener("hashchange", markCurrent);
  }
  function markCurrent() {
    const key = currentKey();
    document.querySelectorAll("#nav-links a").forEach((a) => {
      if (a.dataset.key === key) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }
  SLV.spoilers.onChange((on) => { const t = $("#spoiler-toggle"); if (t) t.checked = on; });

  /* ------------------------------------------------------------- toasts */
  let toastBox;
  function notify(text, { title = "Notification", kind = "", ms = 3600 } = {}) {
    if (!toastBox) { toastBox = document.createElement("div"); toastBox.className = "toasts"; toastBox.setAttribute("aria-live", "polite"); document.body.appendChild(toastBox); }
    const t = document.createElement("div");
    t.className = `toast sys ${kind}`;
    t.innerHTML = `<div class="sys-head"><span class="bang">!</span>${esc(title)}</div><p>${esc(text)}</p>`;
    toastBox.appendChild(t);
    setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 320); }, ms);
  }
  SLV.notify = notify;

  /* One-time runtime error report so failures are visible, not silent. */
  let errShown = false;
  window.addEventListener("error", (e) => {
    if (errShown || !e.message) return;
    errShown = true;
    notify("Something went wrong rendering this page. Try reloading.", { title: "System error", kind: "error", ms: 6000 });
  });

  /* State blocks shared by pages. */
  SLV.stateHTML = (kind, title, text, action = "") =>
    `<div class="state ${kind}">${kind === "error" ? ICON.alert : ICON.empty}<h3>${esc(title)}</h3><p>${esc(text)}</p>${action}</div>`;

  /* --------------------------------------------------------- entity card */
  /* One card for every entity type. Spoiler entries render locked. */
  SLV.cardHTML = (e, i = 0) => {
    const S = SLV.show, col = SLV.colorOf(e);
    const locked = !SLV.visible(e);
    const r = e._type === "character" ? SLV.rank(e.rank) : null;
    const tags = [];
    if (!locked) {
      if (e._type === "character") (e.orgs || []).map(SLV.org).filter((o) => o && SLV.visible(o)).slice(0, 2)
        .forEach((o) => tags.push(`<span class="badge" style="--c:${o.color}">${esc(o.name)}</span>`));
      if (e._type === "character" && e.country && e.country !== "South Korea" && e.country !== "Other world") tags.push(`<span class="badge" style="--c:#7c8db5">${esc(e.country)}</span>`);
      if (e._type === "shadow" && S.grade(e)) tags.push(`<span class="badge" style="--c:${col}">${esc(S.grade(e))}</span>`);
      if (e._type === "gate" && e.cls) tags.push(`<span class="badge" style="--c:${col}">${esc(e.cls)}-class</span>`);
      if (e._type === "skill" || e._type === "item") tags.push(`<span class="badge" style="--c:${col}">${esc(e.type)}</span>`);
      if (e._type === "monster") tags.push(`<span class="badge" style="--c:${col}">${esc(e.kind)}</span>`);
      if (e.sp === "m") tags.push('<span class="badge spoiler">Manhwa</span>');
      if (e.canon === "unverified") tags.push('<span class="badge unverified">Unverified</span>');
    }
    return `<button type="button" class="card${locked ? " locked" : ""}" data-id="${esc(e.id)}" style="--c:${col};--i:${i}"
        aria-label="${esc(locked ? "Classified manhwa spoiler entry" : S.name(e))}: open profile">
      ${SLV.artHTML(e)}
      ${locked ? `<span class="lock">${ICON.lock}Manhwa spoiler<br><small style="color:var(--text-soft);letter-spacing:1px">Click to unlock</small></span>` : ""}
      ${r && r.id !== "-" && !locked ? `<span class="rank${r.id === "National" ? " nat" : ""}" style="--c:${r.color}" title="${esc(r.label)}">${r.id === "National" ? "NAT" : esc(r.id)}</span>` : ""}
      <span class="card-body">
        <span class="card-type">${esc(locked ? (SLV.types[e._type] || {}).label : S.typeLabel(e))}</span>
        <span class="card-name">${esc(S.name(e))}</span>
        <span class="card-sub">${esc(S.subtitle(e))}</span>
        ${tags.length ? `<span class="card-tags">${tags.join("")}</span>` : ""}
      </span>
    </button>`;
  };

  /* ----------------------------------------------------- command palette */
  let pal = null, palSel = 0, palItems = [], lastFocus = null;
  const QUICK = [
    ["archive.html#characters", "Character Archive", "Every hunter, ally and enemy"],
    ["hunters.html", "Hunter Database", "Rankings, guilds and countries"],
    ["archive.html#monarchs", "Monarchs & Rulers", "The nine kings and the beings of light"],
    ["archive.html#shadows", "Shadow Army", "Grades, origins and evolution"],
    ["archive.html#gates", "Gates & Dungeons", "Classifications, red gates, dungeon events"],
    ["archive.html#items", "Weapons & Equipment", "Daggers, swords and artifacts"],
    ["archive.html#skills", "Skills & Abilities", "Shadow Extraction, Arise, Ruler's Authority…"],
    ["timeline.html", "Timeline", "The world history in order"],
    ["network.html", "Shadow Network", "Interactive relationship map"]
  ];
  function openPalette(prefill = "") {
    if (pal) return;
    lastFocus = document.activeElement;
    const scrim = document.createElement("div");
    scrim.className = "palette-scrim";
    const box = document.createElement("div");
    box.className = "palette sys"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Search the archive");
    box.innerHTML = `
      <div class="sys-head"><span class="bang">?</span>System search</div>
      <div class="field"><span class="ico">${ICON.search}</span>
        <input class="input" id="pal-q" type="search" autocomplete="off" spellcheck="false" placeholder="Search characters, shadows, gates, skills…" aria-controls="pal-results" aria-autocomplete="list"></div>
      <div class="palette-results" id="pal-results" role="listbox" aria-label="Results"></div>
      <p class="sr-only" id="pal-status" role="status" aria-live="polite"></p>
      <div class="palette-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div>`;
    document.body.append(scrim, box);
    pal = { scrim, box };
    document.documentElement.style.overflow = "hidden";
    const q = $("#pal-q", box);
    q.value = prefill;
    q.addEventListener("input", () => { palSel = 0; renderPalette(q.value); });
    q.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); movePal(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); movePal(-1); }
      else if (e.key === "Enter") { e.preventDefault(); const it = palItems[palSel]; if (it) choose(it); }
    });
    /* keep Tab inside the dialog (aria-modal) */
    box.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const f = [...box.querySelectorAll("input, button")].filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    box.addEventListener("click", (e) => {
      const b = e.target.closest("[data-pi]");
      if (b) choose(palItems[Number(b.dataset.pi)]);
      if (e.target.closest("[data-unlock]")) { SLV.spoilers.set(true); renderPalette(q.value); }
    });
    scrim.addEventListener("click", closePalette);
    renderPalette(prefill);
    q.focus();
  }
  function closePalette() {
    if (!pal) return;
    pal.scrim.remove(); pal.box.remove(); pal = null;
    if (!document.querySelector(".viewer")) document.documentElement.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function movePal(d) {
    if (!palItems.length) return;
    palSel = (palSel + d + palItems.length) % palItems.length;
    pal.box.querySelectorAll("[data-pi]").forEach((b, i) => b.setAttribute("aria-selected", String(i === palSel)));
    const cur = pal.box.querySelector(`[data-pi="${palSel}"]`);
    if (cur) cur.scrollIntoView({ block: "nearest" });
  }
  function choose(it) {
    if (!it) return;
    if (it.href) { closePalette(); location.href = it.href; return; }
    closePalette();
    if (SLV.viewer) SLV.viewer.open(it.id, { list: palItems.filter((x) => x.id).map((x) => x.id) });
  }
  function renderPalette(text) {
    const out = $("#pal-results", pal.box);
    const { results, hidden } = SLV.search(text, { limit: 40 });
    if (!text.trim()) {
      palItems = QUICK.map(([href, name, sub]) => ({ href: SLV.page(href), name, sub }));
      out.innerHTML = `<div class="palette-note" style="text-align:left;padding:8px 10px 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--text-faint)">Jump to</div>` +
        palItems.map((it, i) => `<button type="button" class="pr-item" role="option" data-pi="${i}" aria-selected="${i === palSel}">
          <span><span class="pr-name">${esc(it.name)}</span><br><span class="pr-sub">${esc(it.sub)}</span></span></button>`).join("");
      return;
    }
    palItems = results.map((e) => ({ id: e.id, e }));
    const st = $("#pal-status", pal.box);
    if (st) st.textContent = `${palItems.length} result${palItems.length === 1 ? "" : "s"}${hidden ? `, ${hidden} hidden as spoilers` : ""}`;
    const hiddenNote = hidden ? `<div class="palette-note">${hidden} more result${hidden > 1 ? "s are" : " is"} hidden as manhwa spoilers.<br>
      <button type="button" class="btn sm" data-unlock>Reveal spoilers</button></div>` : "";
    if (!palItems.length) {
      out.innerHTML = (hidden ? "" : `<div class="palette-note">No record matches “${esc(text)}”. Try a name, rank, guild or skill.</div>`) + hiddenNote;
      return;
    }
    out.innerHTML = palItems.map(({ e }, i) => `<button type="button" class="pr-item" role="option" data-pi="${i}" aria-selected="${i === palSel}" style="--c:${SLV.colorOf(e)}">
        ${SLV.artHTML(e)}<span style="min-width:0"><span class="pr-name">${esc(SLV.show.name(e))}</span><br>
        <span class="pr-sub">${esc(SLV.show.subtitle(e))}</span></span>
        <span class="badge pr-type" style="--c:${SLV.colorOf(e)}">${esc(SLV.show.typeLabel(e))}</span></button>`).join("") + hiddenNote;
  }
  SLV.openSearch = openPalette;

  /* ------------------------------------------------------------ keyboard */
  document.addEventListener("keydown", (e) => {
    const inField = e.target.closest && e.target.closest("input, select, textarea, [contenteditable]");
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal ? closePalette() : openPalette(); return; }
    if (e.key === "Escape" && pal) { e.preventDefault(); e.stopImmediatePropagation(); closePalette(); return; }
    if (!inField && e.key === "/" && !pal && !document.querySelector(".viewer, .lightbox") && !document.body.dataset.slashLocal) { e.preventDefault(); openPalette(); }
  }, true);

  /* ------------------------------------------------- reveal + back-to-top */
  SLV.observeReveals = (root = document) => {
    const els = root.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
  };
  function backToTop() {
    if (document.body.dataset.noTop !== undefined) return;
    const b = document.createElement("button");
    b.type = "button"; b.className = "btn icon to-top sys"; b.hidden = true; b.setAttribute("aria-label", "Back to top"); b.textContent = "↑";
    document.body.appendChild(b);
    let ticking = false;
    const on = () => { ticking = false; const h = window.scrollY < 900; if (b.hidden !== h) b.hidden = h; };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(on); } }, { passive: true }); on();
    b.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: SLV.util.reducedMotion() ? "auto" : "smooth" });
      const first = document.querySelector(".skip-link, .brand"); if (first) first.focus({ preventScroll: true });
    });
  }

  /* ---------------------------------------------------------------- boot */
  function boot() {
    skipLink(); buildNav(); backToTop();
    if (!SLV.ready) {
      const main = document.querySelector("main");
      if (main) main.innerHTML = `<div class="wrap">${SLV.stateHTML("error", "Archive offline",
        "The data files in js/data/ could not be loaded. Check that the folder is complete and reload the page.")}</div>`;
      return;
    }
    SLV.observeReveals();
    const view = new URLSearchParams(location.search).get("view");
    if (view && SLV.viewer) {
      if (SLV.get(view)) requestAnimationFrame(() => SLV.viewer.open(view));
      else notify(`No archive entry has the id "${view}".`, { title: "Record not found", kind: "error" });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
