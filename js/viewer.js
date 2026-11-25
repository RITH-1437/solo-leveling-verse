/* ==========================================================================
   SOLO LEVELING VERSE — entity viewer
   --------------------------------------------------------------------------
   SLV.viewer.open(id, { list, tab })  "Status window" profile for any entity:
       overview / powers / relations / history / forms tabs, prev-next through
       `list`, spoiler-masked manhwa content, deep link via ?view=<id>.
   SLV.viewer.lightbox(id, { list })   full-screen artwork with an entrance
       ("ARISE" smoke for shadows), click-to-zoom and arrow-key browsing.
   ========================================================================== */

(() => {
  "use strict";
  const SLV = window.SLV;
  const { esc } = SLV.util;
  const S = SLV.show;

  let root = null;           // { scrim, box }
  let state = { id: null, list: [], tab: "overview" };
  let lastFocus = null;

  /* ------------------------------------------------------------- helpers */
  const ent = (id) => SLV.get(id);
  const nameOf = (id) => { const e = ent(id); return e ? S.name(e) : id; };
  const chip = (id, note = "") => {
    const e = ent(id);
    if (!e) return "";
    return `<button type="button" class="rel-chip" data-open="${esc(id)}" style="--c:${SLV.colorOf(e)}">${SLV.artHTML(e)}<span>${esc(S.name(e))}${note ? ` <small>· ${esc(note)}</small>` : ""}</span></button>`;
  };
  /* Sealed text is kept out of the DOM until revealed, so screen readers,
     find-in-page and translation tools can't read it through the blur.
     The block shows placeholder bars of roughly the right length instead. */
  const sealedHTML = new Map();
  const spoilerBlock = (html, label = "Manhwa spoiler") => {
    if (SLV.spoilers.on) return html;
    const key = "s" + sealedHTML.size;
    sealedHTML.set(key, html);
    const lines = Math.min(6, Math.max(1, Math.round(html.replace(/<[^>]+>/g, "").length / 70)));
    const bars = Array.from({ length: lines }, (_, i) => `<span class="sb-bar" style="width:${i === lines - 1 && lines > 1 ? 55 : 92 + (i % 2) * 6}%"></span>`).join("");
    return `<div class="spoiler-block" data-sealed="${key}"><div class="sb-head">${SLV.ICON.lock.replace("<svg", '<svg width="14" height="14"')}${esc(label)}</div>
        <div class="sb-body" aria-hidden="true">${bars}</div><div class="sb-reveal"><button type="button" class="btn sm" data-reveal>Reveal this once</button></div></div>`;
  };
  const row = (k, v) => v ? `<div class="k">${esc(k)}</div><div>${v}</div>` : "";
  const orgNames = (e) => (e.orgs || []).map((o) => SLV.get(o)).filter((o) => o && SLV.visible(o))
    .map((o) => `<button type="button" class="badge" data-open="${o.id}" style="--c:${o.color}">${esc(o.name)}</button>`).join(" ");

  function tabsFor(e) {
    const t = [["overview", "Overview"]];
    if (["character", "monarch", "shadow"].includes(e._type)) t.push(["powers", e._type === "monarch" ? "Powers" : "Abilities"]);
    t.push(["relations", "Relations"]);
    t.push(["history", "History"]);
    if ((e.forms && e.forms.length) || (e.evolution && e.evolution.length)) t.push(["forms", e._type === "shadow" ? "Evolution" : "Transformations"]);
    return t;
  }

  /* ----------------------------------------------------------- overview */
  function overview(e) {
    const titles = S.titles(e).map((t) => `<span class="badge" style="--c:${SLV.colorOf(e)}">${esc(t)}</span>`).join(" ");
    const hiddenTitles = !SLV.spoilers.on && (e.titlesM || []).length;
    let rows = "";
    const first = esc(e.first || "—");
    switch (e._type) {
      case "character": {
        const r = SLV.rank(e.rank);
        rows = row("Rank", `<span class="rank${r.id === "National" ? " nat" : ""}" style="--c:${r.color}">${r.id === "National" ? "NAT" : esc(r.id === "-" ? "—" : r.id)}</span> ${esc(r.label)}${e.rankNote ? `<br><small style="color:var(--text-soft)">${esc(e.rankNote)}</small>` : ""}`)
          + row("Affiliation", orgNames(e) || "—") + row("Role", esc(e.role)) + row("Country", esc(e.country))
          + row("Status", esc(S.status(e))) + row("First appearance", first) + row("Debut arc", esc(S.arc(e.arc)));
        break;
      }
      case "monarch":
        rows = row("Title", esc(SLV.spoilers.on ? e.domain : (S.titles(e)[0] || "")))
          + (SLV.spoilers.on && e.king && e.king !== "—" ? row("Rules", esc(e.king)) : "")
          + row("Kind", e.kind === "ruler" ? "Ruler / cosmic being" : "Monarch")
          + (e.army && e.army !== "—" ? row("Army", esc(e.army)) : "")
          + row("Status", esc(S.status(e))) + row("First appearance", first);
        break;
      case "shadow": {
        const g = S.grade(e);
        rows = row("Grade", g ? `<span class="badge" style="--c:${e.color}">${esc(g)}</span>` : "Not stated")
          + row("In life", e.originId ? `<button type="button" class="badge" data-open="${e.originId}">${esc(e.origin)}</button>` : esc(e.origin))
          + row("Raised at", e.source ? `<button type="button" class="badge" data-open="${e.source}">${esc(nameOf(e.source))}</button>` : "—")
          + row("Master", SLV.visible(ent("sung_jinwoo")) ? `<button type="button" class="badge" data-open="sung_jinwoo">Sung Jinwoo</button>` : "")
          + row("First appearance", first);
        break;
      }
      case "gate": {
        const c = (SLV.data.world.gateClasses || []).find((x) => x.id === e.cls);
        rows = row("Record", e.kind === "type" ? "Gate classification" : "Dungeon / event")
          + (c ? row("Class", `<span class="rank" style="--c:${c.color}">${c.id}</span> ${esc(c.label)}`) : "")
          + row("First appearance", first) + row("Arc", esc(S.arc(e.arc)));
        break;
      }
      case "monster":
        rows = row("Kind", esc(S.subtitle(e))) + row("Found in", e.home ? `<button type="button" class="badge" data-open="${e.home}">${esc(nameOf(e.home))}</button>` : "—")
          + (e.becameShadow ? row("Became", `<button type="button" class="badge" data-open="${e.becameShadow}" style="--c:var(--violet)">${esc(nameOf(e.becameShadow))}</button>`) : "")
          + row("First appearance", first);
        break;
      case "item":
        rows = row("Type", esc(e.type)) + row("Ability", esc(e.ability))
          + row("Owners", (e.owners || []).filter((o) => SLV.visible(ent(o))).map((o) => `<button type="button" class="badge" data-open="${o}">${esc(nameOf(o))}</button>`).join(" ") || "—")
          + row("Obtained from", e.from && SLV.visible(ent(e.from)) ? `<button type="button" class="badge" data-open="${e.from}">${esc(nameOf(e.from))}</button>` : "—")
          + row("Canon", e.canon === "unverified" ? '<span class="badge unverified">Unverified</span>' : "Original story")
          + row("First appearance", first);
        break;
      case "skill":
        rows = row("Type", esc(e.type))
          + row("Users", (e.users || []).filter((o) => SLV.visible(ent(o))).map((o) => `<button type="button" class="badge" data-open="${o}">${esc(nameOf(o))}</button>`).join(" ") || "—")
          + row("First appearance", first);
        break;
      case "org": {
        const members = SLV.relations(e.id).filter((r) => r.t === "member");
        rows = row("Kind", esc(S.subtitle(e))) + row("Country", esc(e.country)) + row("Known members", String(members.length));
        break;
      }
    }
    const bio = e._type === "org" ? e.note : e.bio;
    return `${titles || hiddenTitles ? `<h4>Titles</h4><div class="chip-row">${titles}${hiddenTitles ? ` <span class="badge spoiler">+${e.titlesM.length} hidden</span>` : ""}</div>` : ""}
      <h4>Record</h4><div class="stat-table">${rows}</div>
      <h4>Summary</h4><p>${esc(bio || "")}</p>
      ${e.bioM ? spoilerBlock(`<p style="margin:0">${esc(e.bioM)}</p>`) : ""}`;
  }

  /* -------------------------------------------------------------- powers */
  function powers(e) {
    const list = e.abilities || e.powers || [];
    const items = list.map((a) => {
      if (typeof a === "string" && ent(a)) {
        const s = ent(a);
        if (!SLV.visible(s)) return `<div class="ability" style="--c:var(--danger)"><b>Classified skill</b><span>Manhwa spoiler</span></div>`;
        return `<button type="button" class="ability" data-open="${s.id}" style="--c:${s.color}"><b>${esc(s.name)}</b><span>${esc(s.type)} · open skill</span></button>`;
      }
      const n = typeof a === "string" ? a : a.n;
      if (a.m && !SLV.spoilers.on) return `<div class="ability" style="--c:var(--danger)"><b>Classified ability</b><span>Manhwa spoiler</span></div>`;
      return `<div class="ability"><b>${esc(n)}</b><span>Ability</span></div>`;
    }).join("");
    const weapons = (e.weapons || []).map((w) => ent(w)).filter(Boolean).map((w) => SLV.visible(w)
      ? `<button type="button" class="ability" data-open="${w.id}" style="--c:${w.color}"><b>${esc(w.name)}</b><span>${esc(w.type)} · ${esc(w.ability)}</span></button>`
      : `<div class="ability" style="--c:var(--danger)"><b>Classified weapon</b><span>Manhwa spoiler</span></div>`).join("");
    const extraW = SLV.ofType("item").filter((w) => (w.owners || []).includes(e.id) && !(e.weapons || []).includes(w.id) && SLV.visible(w))
      .map((w) => `<button type="button" class="ability" data-open="${w.id}" style="--c:${w.color}"><b>${esc(w.name)}</b><span>${esc(w.type)}</span></button>`).join("");
    return `<h4>${e._type === "monarch" ? "Powers" : "Skills & abilities"}</h4>
      ${items ? `<div class="ability-list">${items}</div>` : "<p>No abilities on record.</p>"}
      ${weapons || extraW ? `<h4>Weapons & equipment</h4><div class="ability-list">${weapons}${extraW}</div>` : ""}`;
  }

  /* ----------------------------------------------------------- relations */
  const REL_ORDER = ["family", "spouse", "successor", "vessel", "creator", "ally", "rival", "command", "member", "shadow", "origin", "mount", "enemy", "wields", "skill", "source"];
  function relationsTab(e) {
    const rels = SLV.relations(e.id);
    const hidden = SLV.relations(e.id, { includeHidden: true }).length - rels.length;
    if (!rels.length) return `<p>No recorded connections.</p>${hidden ? `<p class="badge spoiler">${hidden} hidden by spoiler mode</p>` : ""}`;
    const groups = {};
    rels.forEach((r) => (groups[r.t] = groups[r.t] || []).push(r));
    const keys = Object.keys(groups).sort((a, b) => REL_ORDER.indexOf(a) - REL_ORDER.indexOf(b));
    const net = ["character", "monarch", "shadow", "org"].includes(e._type)
      ? `<a class="btn sm" href="${SLV.url.network(e.id)}">Show in Shadow Network →</a>` : "";
    return keys.map((k) => `<div class="rel-group"><h4>${esc(SLV.linkLabel(k))}</h4><div class="rel-chips">${groups[k].map((r) => chip(r.id, r.label)).join("")}</div></div>`).join("")
      + (hidden ? `<p><span class="badge spoiler">${hidden} more hidden by spoiler mode</span></p>` : "") + `<div class="v-actions">${net}</div>`;
  }

  /* ------------------------------------------------------------- history */
  function historyTab(e) {
    const events = (SLV.data.timeline || []).filter((t) => (t.ids || []).includes(e.id));
    const ev = events.map((t) => {
      const body = `<div class="form-step"><b>${esc(t.title)}</b><span><em style="color:var(--cyan);font-style:normal">${esc(t.when)}</em> — ${esc(t.text)}</span></div>`;
      return t.sp === "m" && !SLV.spoilers.on ? `<div class="form-step"><b style="color:var(--danger)">Classified event</b><span>A manhwa event — enable spoilers to read it.</span></div>` : body;
    }).join("");
    return `<h4>Chronicle</h4><p>${esc(e.bio || e.note || "")}</p>${e.bioM ? spoilerBlock(`<p style="margin:0">${esc(e.bioM)}</p>`) : ""}
      ${ev ? `<h4>On the timeline</h4><div class="form-steps">${ev}</div><div class="v-actions"><a class="btn sm" href="timeline.html#${events[0].id}">Open the timeline →</a></div>` : ""}`;
  }

  /* --------------------------------------------------------------- forms */
  function forms(e) {
    const steps = (e.forms || e.evolution || []).map((f) => {
      const html = `<div class="form-step"><b>${esc(f.name || f.grade || "Raised")}</b><span>${esc(f.desc || f.note || "")}</span></div>`;
      return f.m && !SLV.spoilers.on ? `<div class="form-step"><b style="color:var(--danger)">Classified</b><span>Manhwa spoiler — enable spoilers to see this stage.</span></div>` : html;
    }).join("");
    const grades = e._type === "shadow" ? `<h4>Shadow grades</h4><div class="chip-row">${(SLV.data.world.shadowGrades || []).map((g) =>
      `<span class="chip${g.id === S.grade(e) ? " active" : ""}">${esc(g.id)}</span>`).join("")}</div>` : "";
    return `<h4>${e._type === "shadow" ? "Evolution" : "Transformations"}</h4><div class="form-steps">${steps}</div>${grades}`;
  }

  /* -------------------------------------------------------------- render */
  function render() {
    sealedHTML.clear();
    const e = ent(state.id);
    const { box } = root;
    const col = SLV.colorOf(e);
    box.style.setProperty("--c", col);
    const i = state.list.indexOf(state.id);
    const nav = state.list.length > 1 ? `<span class="v-nav"><button type="button" class="btn sm icon" data-step="-1" aria-label="Previous entry">‹</button>
      <span class="v-count">${i + 1} / ${state.list.length}</span><button type="button" class="btn sm icon" data-step="1" aria-label="Next entry">›</button></span>` : "";
    const head = `<div class="sys-head"><span class="bang">!</span><span>Status window · ${esc(S.typeLabel(e) || "Record")}</span>
      <span style="margin-left:auto;display:flex;gap:10px;align-items:center">${nav}<button type="button" class="btn sm icon v-close" data-close aria-label="Close">✕</button></span></div>`;

    if (!SLV.visible(e)) {
      box.innerHTML = `${head}<div class="v-art">${SLV.artHTML(e, { eager: true })}</div>
        <div class="v-main"><div class="locked-note"><span class="badge spoiler">Manhwa spoiler</span>
          <h2 class="v-name">Classified entry</h2>
          <p style="color:var(--text-soft);margin:0">This ${esc((SLV.types[e._type] || {}).label.toLowerCase())} only appears in the manhwa, beyond what the anime (Seasons 1–2) has covered.</p>
          <div class="v-actions"><button type="button" class="btn primary" data-unlock>Reveal manhwa spoilers</button><button type="button" class="btn" data-close>Close</button></div></div></div>`;
      return;
    }

    const tabs = tabsFor(e);
    if (!tabs.some(([k]) => k === state.tab)) state.tab = "overview";
    const r = e._type === "character" ? SLV.rank(e.rank) : null;
    const typeBadge = `<span class="badge" style="--c:${col}">${esc(S.typeLabel(e))}</span>`;
    const badges = [typeBadge,
      r && r.id !== "-" ? `<span class="badge" style="--c:${r.color}">${esc(r.label)}</span>` : "",
      e._type === "shadow" && S.grade(e) ? `<span class="badge" style="--c:${col}">${esc(S.grade(e))}</span>` : "",
      e.country && e.country !== "—" ? `<span class="badge" style="--c:#7c8db5">${esc(e.country)}</span>` : "",
      S.status(e) ? `<span class="badge" style="--c:${/Deceased|Slain|Defeated/.test(S.status(e)) ? "#ff4d6a" : "#3ed598"}">${esc(S.status(e))}</span>` : "",
      e.sp === "m" ? '<span class="badge spoiler">Manhwa</span>' : '<span class="badge" style="--c:#5ec8ff">Anime</span>',
      e.canon === "unverified" ? '<span class="badge unverified">Unverified</span>' : "",
      S.hasHidden(e) ? '<span class="badge spoiler">Has hidden spoilers</span>' : ""
    ].join("");
    const alt = S.alt(e).filter((a) => a !== S.name(e));
    box.innerHTML = `${head}
      <div class="v-art">${SLV.artHTML(e, { eager: true })}
        ${r && r.id !== "-" ? `<span class="rank lg v-rank${r.id === "National" ? " nat" : ""}" style="--c:${r.color}">${r.id === "National" ? "NAT" : esc(r.id)}</span>` : ""}
        <button type="button" class="btn sm v-art-hint sys" data-lightbox>⛶ Full screen</button></div>
      <div class="v-main">
        <div class="v-top">
          <h2 class="v-name" id="v-title">${esc(S.name(e))}${e.ko ? `<span class="v-ko">${esc(e.ko)}</span>` : ""}</h2>
          ${alt.length ? `<p class="v-alt">Also known as ${alt.map(esc).join(" · ")}</p>` : ""}
          <div class="v-badges">${badges}</div>
        </div>
        <div class="v-tabs" role="tablist">${tabs.map(([k, l]) => `<button type="button" role="tab" data-tab="${k}" aria-selected="${k === state.tab}">${l}</button>`).join("")}</div>
        <div class="v-panel" role="tabpanel" id="v-panel">${panel(e)}</div>
      </div>`;
    box.setAttribute("aria-labelledby", "v-title");
  }
  function panel(e) {
    return ({ overview, powers, relations: relationsTab, history: historyTab, forms }[state.tab] || overview)(e);
  }

  /* ---------------------------------------------------------- open/close */
  function setUrl(id) {
    try {
      const u = new URL(location.href);
      if (id) u.searchParams.set("view", id); else u.searchParams.delete("view");
      history.replaceState(history.state, "", u.pathname + u.search + u.hash);
    } catch (err) { /* file:// in some browsers: URL update is cosmetic */ }
  }
  function open(id, { list, tab } = {}) {
    const e = ent(id);
    if (!e) { SLV.notify && SLV.notify(`No record "${id}".`, { title: "Record not found", kind: "error" }); return; }
    if (list && list.length) state.list = list.includes(id) ? list : [id, ...list];
    else if (!root) state.list = [id];
    state.id = id;
    state.tab = tab || "overview";
    if (!root) {
      lastFocus = document.activeElement;
      const scrim = document.createElement("div"); scrim.className = "viewer-scrim";
      const box = document.createElement("div");
      box.className = "viewer sys"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true");
      document.body.append(scrim, box);
      root = { scrim, box };
      document.documentElement.style.overflow = "hidden";
      scrim.addEventListener("click", close);
      box.addEventListener("click", onClick);
      box.addEventListener("keydown", trap);
    }
    render();
    setUrl(id);
    const closeBtn = root.box.querySelector("[data-close]");
    if (closeBtn) closeBtn.focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent("slv:view", { detail: { id } }));
  }
  function close() {
    if (!root) return;
    root.scrim.remove(); root.box.remove(); root = null;
    document.documentElement.style.overflow = "";
    setUrl(null);
    if (lastFocus && lastFocus.isConnected && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function step(d) {
    if (state.list.length < 2) return;
    const i = state.list.indexOf(state.id);
    open(state.list[(i + d + state.list.length) % state.list.length], { list: state.list });
  }
  function onClick(ev) {
    const t = ev.target;
    if (t.closest("[data-close]")) return close();
    const s = t.closest("[data-step]"); if (s) return step(Number(s.dataset.step));
    const tab = t.closest("[data-tab]");
    if (tab) { state.tab = tab.dataset.tab; render(); const b = root.box.querySelector(`[data-tab="${state.tab}"]`); if (b) b.focus(); return; }
    const o = t.closest("[data-open]");
    if (o) { const id = o.dataset.open; const list = state.list.includes(id) ? state.list : [...state.list, id]; return open(id, { list }); }
    if (t.closest("[data-reveal]")) {
      const blk = t.closest(".spoiler-block"), body = blk.querySelector(".sb-body");
      body.innerHTML = sealedHTML.get(blk.dataset.sealed) || ""; body.removeAttribute("aria-hidden");
      blk.classList.add("revealed"); body.setAttribute("tabindex", "-1"); body.focus({ preventScroll: true });
      return;
    }
    if (t.closest("[data-unlock]")) { SLV.spoilers.set(true); return; }
    if (t.closest("[data-lightbox]") || t.closest(".v-art .art")) return lightbox(state.id, { list: state.list });
  }
  function trap(ev) {
    if (ev.key !== "Tab" || !root) return;
    const f = [...root.box.querySelectorAll("button, a[href], input, [tabindex]:not([tabindex='-1'])")].filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    if (ev.shiftKey && document.activeElement === f[0]) { ev.preventDefault(); f[f.length - 1].focus(); }
    else if (!ev.shiftKey && document.activeElement === f[f.length - 1]) { ev.preventDefault(); f[0].focus(); }
  }
  document.addEventListener("keydown", (ev) => {
    if (lb) {
      if (ev.key === "Escape") { ev.preventDefault(); closeLightbox(); }
      else if (ev.key === "ArrowRight") lbStep(1);
      else if (ev.key === "ArrowLeft") lbStep(-1);
      return;
    }
    if (!root) return;
    if (ev.key === "Escape") { ev.preventDefault(); close(); }
    else if (ev.target.closest("input, select, textarea")) return;
    else if (ev.key === "ArrowRight") step(1);
    else if (ev.key === "ArrowLeft") step(-1);
  });
  SLV.spoilers.onChange(() => { if (root) render(); if (lb) renderLightbox(); });

  /* ------------------------------------------------------------ lightbox */
  let lb = null;   // { el, id, list }
  const WORD = { shadow: "Arise", monarch: "Monarch", gate: "Gate", monster: "Boss", item: "Item", skill: "Skill", org: "Guild" };
  function lightbox(id, { list } = {}) {
    if (!lb) {
      const el = document.createElement("div");
      el.className = "lightbox"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Full-screen artwork");
      document.body.appendChild(el);
      el.addEventListener("click", (ev) => {
        if (ev.target.closest("[data-lb-close]")) return closeLightbox();
        const s = ev.target.closest("[data-lb-step]"); if (s) return lbStep(Number(s.dataset.lbStep));
        if (ev.target.closest("[data-lb-profile]")) { const i = lb.id; closeLightbox(); return open(i, { list: lb ? lb.list : state.list }); }
        const stage = ev.target.closest(".lb-stage");
        if (stage) {
          const r = stage.getBoundingClientRect();
          stage.style.transformOrigin = `${((ev.clientX - r.left) / r.width) * 100}% ${((ev.clientY - r.top) / r.height) * 100}%`;
          el.classList.toggle("zoomed"); stage.style.transform = el.classList.contains("zoomed") ? "scale(1.7)" : "";
          return;
        }
        if (ev.target === el) closeLightbox();
      });
      lb = { el };
      document.documentElement.style.overflow = "hidden";
    }
    lb.id = id; lb.list = list && list.length ? list : [id];
    renderLightbox();
  }
  function renderLightbox() {
    const e = ent(lb.id);
    const t = e._type === "monarch" && e.kind === "ruler" ? "Ruler" : e._type === "character" && e.rank && e.rank !== "-" ? SLV.rank(e.rank).label : WORD[e._type] || "";
    const motion = !SLV.util.reducedMotion();
    const smoke = e._type === "shadow" && motion ? `<div class="lb-smoke">${[8, 30, 52, 70].map((x, i) => `<span style="left:${x}%;animation-delay:${i * 0.12}s"></span>`).join("")}</div>` : "";
    const many = lb.list.length > 1;
    lb.el.classList.remove("zoomed");
    lb.el.style.setProperty("--c", SLV.colorOf(e));
    lb.el.innerHTML = `
      <div class="lb-tools"><button type="button" class="btn sm sys" data-lb-profile>Profile</button><button type="button" class="btn sm icon sys" data-lb-close aria-label="Close full screen">✕</button></div>
      ${many ? `<button type="button" class="btn icon sys lb-prev" data-lb-step="-1" aria-label="Previous">‹</button><button type="button" class="btn icon sys lb-next" data-lb-step="1" aria-label="Next">›</button>` : ""}
      <div class="lb-stage" style="--c:${SLV.colorOf(e)}"><div class="lb-aura"></div>${SLV.artHTML(e, { eager: true })}${smoke}
        ${motion && t && SLV.visible(e) ? `<div class="lb-word">${esc(t)}</div>` : ""}
        <div class="lb-cap"><div><h2>${esc(S.name(e))}</h2><p>${esc(S.subtitle(e))}</p></div>
          <span class="badge" style="--c:${SLV.colorOf(e)}">${SLV.media.art(e) ? "Artwork" : "Generated sigil · add art in assets/"}</span></div></div>`;
    lb.el.querySelector("[data-lb-close]").focus({ preventScroll: true });
  }
  function lbStep(d) {
    if (!lb || lb.list.length < 2) return;
    const i = lb.list.indexOf(lb.id);
    lb.id = lb.list[(i + d + lb.list.length) % lb.list.length];
    renderLightbox();
  }
  function closeLightbox() {
    if (!lb) return;
    lb.el.remove(); lb = null;
    if (!root) document.documentElement.style.overflow = "";
    else { const b = root.box.querySelector("[data-lightbox]"); if (b) b.focus({ preventScroll: true }); }
  }

  SLV.viewer = { open, close, lightbox, isOpen: () => !!root || !!lb };
})();
