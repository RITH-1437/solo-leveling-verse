/* ==========================================================================
   SOLO LEVELING VERSE — archive (archive.html)
   Seven collections behind tabs, each with its own facets and sort orders,
   plus search, content (anime / manhwa) filter and pagination.
   URL: archive.html#<tab>/<page>   e.g. #shadows, #monarchs/2
   ========================================================================== */

(() => {
  "use strict";
  const SLV = window.SLV;
  if (!SLV.ready) return;
  const { $, esc, norm } = SLV.util;
  const S = SLV.show;
  const W = SLV.data.world;

  const byRank = (a, b) => SLV.rank(b.rank).n - SLV.rank(a.rank).n;
  const arcN = (e) => Math.max(0, W.arcs.findIndex((a) => a.id === e.arc));
  const SORTS = {
    order: ["Story order", (a, b) => a._order - b._order],
    az: ["Name A–Z", (a, b) => S.name(a).localeCompare(S.name(b))],
    za: ["Name Z–A", (a, b) => S.name(b).localeCompare(S.name(a))],
    rank: ["Rank: highest first", (a, b) => byRank(a, b) || a._order - b._order],
    grade: ["Grade: highest first", (a, b) => SLV.gradeN(S.grade(b)) - SLV.gradeN(S.grade(a)) || a._order - b._order],
    arc: ["Debut: earliest first", (a, b) => arcN(a) - arcN(b) || a._order - b._order]
  };

  /* Facets: options() lists [value, label]; get(e) returns the value(s) of an entity. */
  const F = {
    rank: { label: "Rank", kind: "chips", get: (e) => e.rank,
      options: () => W.ranks.filter((r) => SLV.ofType("character").some((c) => c.rank === r.id)).map((r) => [r.id, r.id === "National" ? "National" : r.id === "-" ? "Unranked" : r.id]) },
    org: { label: "Affiliation", kind: "select", get: (e) => (e.orgs && e.orgs.length ? e.orgs : ["none"]),
      options: () => [...W.orgs.filter((o) => o.kind !== "faction" || o.id === "shadow_army").filter((o) => SLV.visible(o)).map((o) => [o.id, o.name]), ["none", "Unaffiliated"]] },
    country: { label: "Country", kind: "select", get: (e) => e.country,
      options: () => W.countries.filter((c) => SLV.ofType("character").some((x) => x.country === c.id && SLV.visible(x))).map((c) => [c.id, c.id === "—" ? "None / other world" : c.id]) },
    mkind: { label: "Kind", kind: "chips", get: (e) => e.kind, options: () => [["monarch", "Monarchs"], ["ruler", "Rulers"]] },
    grade: { label: "Grade", kind: "chips", get: (e) => S.grade(e) || "unknown",
      options: () => [...new Set(SLV.ofType("shadow").filter(SLV.visible).map((s) => S.grade(s) || "unknown"))]
        .sort((a, b) => SLV.gradeN(b) - SLV.gradeN(a)).map((g) => [g, g === "unknown" ? "Not stated" : g]) },
    gkind: { label: "Record", kind: "chips", get: (e) => e.kind, options: () => [["type", "Classifications"], ["dungeon", "Dungeons & events"]] },
    monkind: { label: "Kind", kind: "chips", get: (e) => e.kind, options: () => [["boss", "Bosses"], ["monster", "Monsters"], ["race", "Races"]] },
    home: { label: "Found in", kind: "select", get: (e) => e.home || "none",
      options: () => [...SLV.ofType("gate").filter((g) => SLV.ofType("monster").some((m) => m.home === g.id)).map((g) => [g.id, g.name]), ["none", "Elsewhere"]] },
    itype: { label: "Type", kind: "select", get: (e) => e.type,
      options: () => [...new Set(SLV.ofType("item").filter(SLV.visible).map((i) => i.type))].map((t) => [t, t]) },
    stype: { label: "Type", kind: "chips", get: (e) => e.type,
      options: () => [...new Set(SLV.ofType("skill").map((i) => i.type))].map((t) => [t, t]) },
    owner: { label: "Wielder", kind: "select", get: (e) => e.owners || [],
      options: () => [...new Set(SLV.ofType("item").flatMap((i) => i.owners || []))].map(SLV.get).filter((o) => o && SLV.visible(o)).map((o) => [o.id, S.name(o)]) }
  };

  const TABS = {
    characters: { type: "character", kicker: "Archive · Characters", title: "Character <em>Archive</em>",
      sub: "Hunters, allies, family and enemies — with ranks, affiliations, abilities, weapons, relationships and history.",
      facets: ["rank", "org", "country"], sorts: ["order", "rank", "az", "za", "arc"] },
    monarchs: { type: "monarch", kicker: "Archive · Monarchs & Rulers", title: "Monarchs &amp; <em>Rulers</em>",
      sub: "The nine Monarchs and the beings of light they war against. Almost all of it is manhwa territory, so these records stay sealed until you turn spoilers on.",
      facets: ["mkind"], sorts: ["order", "az", "za"] },
    shadows: { type: "shadow", kicker: "Archive · Shadow Army", title: "The Shadow <em>Army</em>",
      sub: "Soldiers raised by Shadow Extraction: who they were in life, where they were raised, their grades and how they grew.",
      facets: ["grade"], sorts: ["order", "grade", "az", "za"] },
    gates: { type: "gate", kicker: "Archive · Gates & Dungeons", title: "Gates &amp; <em>Dungeons</em>",
      sub: "How gates are classified, what makes a Red Gate or a dungeon break, and the dungeons that defined the story.",
      facets: ["gkind"], sorts: ["order", "arc", "az"], extra: true },
    monsters: { type: "monster", kicker: "Archive · Monsters", title: "Monsters &amp; <em>Bosses</em>",
      sub: "Dungeon bosses, monster races and the creatures that later rose again as shadows.",
      facets: ["monkind", "home"], sorts: ["order", "arc", "az", "za"] },
    items: { type: "item", kicker: "Archive · Equipment", title: "Weapons &amp; <em>Equipment</em>",
      sub: "Daggers, swords and artifacts, with their owners, abilities and where they came from.",
      facets: ["itype", "owner"], sorts: ["order", "az", "za", "arc"] },
    skills: { type: "skill", kicker: "Archive · Skills", title: "Skills &amp; <em>Abilities</em>",
      sub: "The System skills and class powers of the Shadow Monarch, from Dash to Ruler's Authority.",
      facets: ["stype"], sorts: ["order", "az", "za", "arc"] }
  };
  const TAB_KEYS = Object.keys(TABS);

  const PAGE_SIZES = [8, 12, 16, 24];
  const state = { tab: "characters", page: 1, per: 12, q: "", sort: "order", content: "all", facet: {} };
  const p0 = Number(SLV.util.store.get("slv-per-page")); if (PAGE_SIZES.includes(p0)) state.per = p0;

  /* ----------------------------------------------------------- filtering */
  function filtered() {
    const T = TABS[state.tab];
    const terms = norm(state.q).split(/\s+/).filter(Boolean);
    const facetOn = Object.entries(state.facet).filter(([, v]) => v && v !== "all");
    const list = SLV.ofType(T.type).filter((e) => {
      const vis = SLV.visible(e);
      if (state.content === "anime" && e.sp === "m") return false;
      if (state.content === "manhwa" && e.sp !== "m") return false;
      if ((terms.length || facetOn.length) && !vis) return false;   // locked records never match searches or facets
      if (terms.length && !terms.every((t) => e._hay.includes(t))) return false;
      return facetOn.every(([k, v]) => { const got = F[k].get(e); return Array.isArray(got) ? got.includes(v) : got === v; });
    });
    const sort = SORTS[state.sort] || SORTS.order;
    /* visible records first so locked cards gather at the end */
    return list.sort((a, b) => (SLV.visible(b) - SLV.visible(a)) || sort[1](a, b));
  }

  /* ------------------------------------------------------------ rendering */
  function renderTabs() {
    $("#tabs").innerHTML = TAB_KEYS.map((k) => {
      const n = SLV.ofType(TABS[k].type).filter(SLV.visible).length;
      const all = SLV.ofType(TABS[k].type).length;
      return `<button type="button" role="tab" class="tab" data-tab="${k}" aria-selected="${k === state.tab}">
        ${esc(SLV.types[TABS[k].type].plural)}<span class="count">${n}${n < all ? `<i title="${all - n} hidden spoiler records">+${all - n}</i>` : ""}</span></button>`;
    }).join("");
  }
  function renderControls() {
    const T = TABS[state.tab];
    $("#tab-kicker").textContent = T.kicker;
    $("#tab-title").innerHTML = T.title;
    $("#tab-sub").textContent = T.sub;
    document.title = `${SLV.types[T.type].plural} — Solo Leveling Verse`;
    $("#facets").innerHTML = T.facets.map((k) => {
      const f = F[k], cur = state.facet[k] || "all";
      const opts = f.options();
      if (f.kind === "chips") return `<div class="facet"><span class="label">${f.label}</span><div class="chip-row" data-facet="${k}">
        <button type="button" class="chip${cur === "all" ? " active" : ""}" data-v="all">All</button>
        ${opts.map(([v, l]) => `<button type="button" class="chip${cur === v ? " active" : ""}" data-v="${esc(v)}">${esc(l)}</button>`).join("")}</div></div>`;
      return `<div class="facet"><label class="label" for="f-${k}">${f.label}</label><select class="select" id="f-${k}" data-facet="${k}">
        <option value="all">All</option>${opts.map(([v, l]) => `<option value="${esc(v)}" ${cur === v ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></div>`;
    }).join("");
    if (!T.sorts.includes(state.sort)) state.sort = T.sorts[0];
    $("#sort").innerHTML = T.sorts.map((k) => `<option value="${k}" ${k === state.sort ? "selected" : ""}>${SORTS[k][0]}</option>`).join("");
    $("#content-chips").querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.content === state.content));
  }

  let lastList = [];
  function render(scroll = false) {
    const T = TABS[state.tab];
    const list = filtered();
    lastList = list;
    const pages = Math.max(1, Math.ceil(list.length / state.per));
    state.page = Math.min(Math.max(1, state.page), pages);
    const start = (state.page - 1) * state.per;
    const slice = list.slice(start, start + state.per);
    const grid = $("#grid");
    grid.innerHTML = slice.map((e, i) => SLV.cardHTML(e, i)).join("");
    const locked = list.filter((e) => !SLV.visible(e)).length;
    const plural = SLV.types[T.type].plural.toLowerCase();
    $("#count").innerHTML = list.length
      ? `Showing <b>${start + 1}–${start + slice.length}</b> of <b>${list.length}</b> ${esc(plural)}${locked ? ` · <span style="color:var(--danger)">${locked} sealed as spoilers</span>` : ""}`
      : `0 ${esc(plural)}`;
    const empty = $("#empty");
    empty.hidden = list.length > 0;
    if (!list.length) {
      const hiddenMatches = state.q && SLV.ofType(T.type).some((e) => !SLV.visible(e) && norm(state.q).split(/\s+/).every((t) => e._hay.includes(t)));
      empty.innerHTML = SLV.stateHTML("empty", "No records found",
        hiddenMatches ? "Matching records exist, but they are manhwa spoilers. Turn on spoilers to see them." : "Nothing in this collection matches your filters.",
        `<div class="chip-row" style="justify-content:center"><button type="button" class="btn" data-reset>Reset filters</button>${hiddenMatches ? '<button type="button" class="btn primary" data-unlock>Reveal spoilers</button>' : ""}</div>`);
    }
    renderPager(pages);
    writeHash();
    if (scroll) $("#tabs").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function pageList(cur, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const out = [1], lo = Math.max(2, cur - 1), hi = Math.min(total - 1, cur + 1);
    if (lo > 2) out.push("…");
    for (let p = lo; p <= hi; p++) out.push(p);
    if (hi < total - 1) out.push("…");
    out.push(total);
    return out;
  }
  function renderPager(pages) {
    const p = state.page;
    $("#pager").hidden = !lastList.length;
    $("#pager").innerHTML = `
      <button type="button" data-page="${p - 1}" ${p <= 1 ? "disabled" : ""} aria-label="Previous page">‹</button>
      ${pageList(p, pages).map((n) => n === "…" ? '<span class="gap">…</span>'
        : `<button type="button" data-page="${n}" ${n === p ? 'aria-current="page"' : ""} aria-label="Page ${n}">${n}</button>`).join("")}
      <button type="button" data-page="${p + 1}" ${p >= pages ? "disabled" : ""} aria-label="Next page">›</button>
      <label class="per">Per page <select class="select" data-per>${PAGE_SIZES.map((n) => `<option value="${n}" ${n === state.per ? "selected" : ""}>${n}</option>`).join("")}</select></label>`;
  }

  /* --------------------------------------------------------------- hash */
  function writeHash() {
    const h = `#${state.tab}${state.page > 1 ? "/" + state.page : ""}`;
    if (location.hash !== h) history.replaceState(history.state, "", location.pathname + location.search + h);
  }
  function readHash() {
    const m = location.hash.match(/^#(\w+)(?:\/(\d+))?$/);
    if (!m || !TABS[m[1]]) return false;
    state.tab = m[1]; state.page = Number(m[2] || 1);
    return true;
  }

  function setTab(tab, page = 1) {
    if (tab !== state.tab) { state.facet = {}; state.q = ""; $("#q").value = ""; state.sort = "order"; }
    state.tab = tab; state.page = page;
    renderTabs(); renderControls(); render();
  }
  function reset() {
    state.facet = {}; state.q = ""; state.content = "all"; state.page = 1; $("#q").value = "";
    renderControls(); render();
  }

  /* ------------------------------------------------------------- events */
  function bind() {
    $("#tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) setTab(b.dataset.tab); });
    $("#tabs").addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault(); e.stopPropagation();
      const i = TAB_KEYS.indexOf(state.tab), n = TAB_KEYS[(i + (e.key === "ArrowRight" ? 1 : -1) + TAB_KEYS.length) % TAB_KEYS.length];
      setTab(n); const b = $(`#tabs [data-tab="${n}"]`); if (b) b.focus();
    });
    $("#facets").addEventListener("click", (e) => {
      const c = e.target.closest(".chip"); const row = e.target.closest("[data-facet]");
      if (!c || !row) return;
      state.facet[row.dataset.facet] = c.dataset.v; state.page = 1;
      row.querySelectorAll(".chip").forEach((x) => x.classList.toggle("active", x === c));
      render();
    });
    $("#facets").addEventListener("change", (e) => {
      const s = e.target.closest("select[data-facet]"); if (!s) return;
      state.facet[s.dataset.facet] = s.value; state.page = 1; render();
    });
    $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; state.page = 1; render(); });
    $("#content-chips").addEventListener("click", (e) => {
      const c = e.target.closest("[data-content]"); if (!c) return;
      state.content = c.dataset.content; state.page = 1;
      $("#content-chips").querySelectorAll(".chip").forEach((x) => x.classList.toggle("active", x === c));
      render();
    });
    const onQ = SLV.util.debounce((v) => { state.q = v; state.page = 1; render(); }, 120);
    $("#q").addEventListener("input", (e) => onQ(e.target.value));
    $("#q").addEventListener("keydown", (e) => {
      if (e.key === "Escape" && e.target.value) { e.preventDefault(); e.stopPropagation(); e.target.value = ""; state.q = ""; state.page = 1; render(); }
    });
    $("#pager").addEventListener("click", (e) => {
      const b = e.target.closest("[data-page]"); if (!b || b.disabled) return;
      state.page = Number(b.dataset.page); render(true);
    });
    $("#pager").addEventListener("change", (e) => {
      if (!e.target.matches("[data-per]")) return;
      const first = (state.page - 1) * state.per;
      state.per = Number(e.target.value); state.page = Math.floor(first / state.per) + 1;
      SLV.util.store.set("slv-per-page", String(state.per));
      render();
    });
    $("#grid").addEventListener("click", (e) => {
      const card = e.target.closest(".card"); if (!card) return;
      SLV.viewer.open(card.dataset.id, { list: lastList.map((x) => x.id) });
    });
    $("#empty").addEventListener("click", (e) => {
      if (e.target.closest("[data-reset]")) reset();
      if (e.target.closest("[data-unlock]")) SLV.spoilers.set(true);
    });
    document.addEventListener("keydown", (e) => {
      if (SLV.viewer.isOpen() || document.querySelector(".palette")) return;
      if (e.target.closest("input, select, textarea, [role=tab]")) return;
      const pages = Math.max(1, Math.ceil(lastList.length / state.per));
      if (e.key === "ArrowRight" && state.page < pages) { state.page++; render(true); }
      if (e.key === "ArrowLeft" && state.page > 1) { state.page--; render(true); }
    });
    /* The grid follows the viewer's prev/next onto the right page. */
    document.addEventListener("slv:view", (ev) => {
      const i = lastList.findIndex((x) => x.id === ev.detail.id);
      if (i < 0) return;
      const page = Math.floor(i / state.per) + 1;
      if (page !== state.page) { state.page = page; render(); }
    });
    window.addEventListener("hashchange", () => {
      const tab = state.tab, page = state.page;
      if (readHash() && (state.tab !== tab || state.page !== page)) { const t = state.tab; state.tab = tab; setTab(t, state.page); }
    });
    SLV.spoilers.onChange(() => { renderTabs(); renderControls(); render(); });
  }

  bind();
  readHash();
  const q0 = new URLSearchParams(location.search).get("q");
  if (q0) { state.q = q0; $("#q").value = q0; }
  renderTabs(); renderControls(); render();
})();
