/* ==========================================================================
   SOLO LEVELING VERSE — hunter database (hunters.html)
   Rank distribution, national-level spotlight, a sortable / filterable
   registry table, guild directory and a by-country breakdown.
   ========================================================================== */

(() => {
  "use strict";
  const SLV = window.SLV;
  if (!SLV.ready) return;
  const { $, esc, norm } = SLV.util;
  const S = SLV.show;
  const W = SLV.data.world;

  const people = () => SLV.ofType("character");
  const isHunter = (c) => c.rank && c.rank !== "-";
  const orgsOf = (c) => (c.orgs || []).map(SLV.org).filter((o) => o && SLV.visible(o) && o.kind !== "faction");
  const state = { q: "", rank: "all", org: "all", country: "all", civ: false, sort: "rank", dir: -1 };

  /* --------------------------------------------------------------- tiers */
  function tiers() {
    const hunters = people().filter((c) => isHunter(c) && SLV.visible(c));
    const sealed = people().filter((c) => isHunter(c) && !SLV.visible(c));
    const max = Math.max(1, ...W.ranks.map((r) => hunters.filter((c) => c.rank === r.id).length));
    $("#tiers").innerHTML = W.ranks.filter((r) => r.id !== "-").map((r) => {
      const n = hunters.filter((c) => c.rank === r.id).length;
      const hid = sealed.filter((c) => c.rank === r.id).length;
      return `<button type="button" class="tier" data-rank="${r.id}" aria-pressed="${state.rank === r.id}" style="--c:${r.color}">
        <span class="rank${r.id === "National" ? " nat" : ""}" style="--c:${r.color}">${r.id === "National" ? "NAT" : r.id}</span>
        <span><span class="tier-name">${esc(r.label)}${hid ? ` <small style="color:var(--danger);font-size:11px">+${hid} sealed</small>` : ""}</span>
          <span class="tier-bar"><span style="width:${(n / max) * 100}%"></span></span><span class="tier-note">${esc(r.note)}</span></span>
        <span class="tier-n">${n}</span></button>`;
    }).join("");
  }

  /* ------------------------------------------------------------ national */
  function national() {
    const list = people().filter((c) => SLV.rank(c.rank).n >= 6)
      .sort((a, b) => SLV.rank(b.rank).n - SLV.rank(a.rank).n || a._order - b._order);
    $("#national").innerHTML = list.map((c) => {
      const r = SLV.rank(c.rank), locked = !SLV.visible(c);
      return `<button type="button" class="nat-card${locked ? " locked" : ""}" data-id="${c.id}" style="--c:${r.color}">
        ${SLV.artHTML(c)}
        ${locked ? "" : `<span class="rank${r.id === "National" ? " nat" : ""}" style="--c:${r.color}">${r.id === "National" ? "NAT" : r.id}</span>`}
        <b>${esc(S.name(c))}</b><small>${esc(locked ? "Manhwa spoiler" : `${c.country} · ${(orgsOf(c)[0] || {}).name || c.role}`)}</small></button>`;
    }).join("");
  }

  /* --------------------------------------------------------------- table */
  const COLS = [
    ["name", "Hunter", (c) => S.name(c)],
    ["rank", "Rank", (c) => SLV.rank(c.rank).n],
    ["org", "Affiliation", (c) => (orgsOf(c)[0] || { name: "~" }).name],
    ["country", "Country", (c) => c.country],
    ["role", "Role", (c) => c.role || ""],
    ["status", "Status", (c) => S.status(c)],
    ["arc", "Debut", (c) => W.arcs.findIndex((a) => a.id === c.arc)]
  ];
  function rows() {
    const terms = norm(state.q).split(/\s+/).filter(Boolean);
    const col = COLS.find((c) => c[0] === state.sort) || COLS[1];
    return people().filter((c) => {
      if (!state.civ && !isHunter(c)) return false;
      if (!SLV.visible(c)) return false;
      if (state.rank !== "all" && c.rank !== state.rank) return false;
      if (state.org !== "all" && !(c.orgs || []).includes(state.org)) return false;
      if (state.country !== "all" && c.country !== state.country) return false;
      return !terms.length || terms.every((t) => c._hay.includes(t));
    }).sort((a, b) => {
      const x = col[2](a), y = col[2](b);
      const d = typeof x === "number" ? x - y : String(x).localeCompare(String(y));
      return d * state.dir || a._order - b._order;
    });
  }
  let lastRows = [];
  function table() {
    $("#h-head").innerHTML = COLS.map(([k, l]) => `<th ${state.sort === k ? `aria-sort="${state.dir > 0 ? "ascending" : "descending"}"` : ""} scope="col"><button type="button" data-sort="${k}">${l}</button></th>`).join("");
    const list = rows();
    lastRows = list;
    const sealed = people().filter((c) => (state.civ || isHunter(c)) && !SLV.visible(c)).length;
    $("#h-count").innerHTML = `<b>${list.length}</b> record${list.length === 1 ? "" : "s"}${sealed ? ` · <span style="color:var(--danger)">${sealed} sealed as manhwa spoilers</span>` : ""}`;
    $("#h-body").innerHTML = list.map((c, i) => {
      const r = SLV.rank(c.rank);
      const org = orgsOf(c);
      const st = S.status(c);
      return `<tr tabindex="0" data-id="${c.id}" style="--i:${i};animation-delay:${i * 18}ms">
        <td><span class="who">${SLV.artHTML(c)}<span><b>${esc(S.name(c))}</b><small>${esc(c.ko || "")}</small></span></span></td>
        <td>${r.id === "-" ? '<span style="color:var(--text-faint)">—</span>' : `<span class="rank${r.id === "National" ? " nat" : ""}" style="--c:${r.color}">${r.id === "National" ? "NAT" : r.id}</span>`}</td>
        <td>${org.length ? org.map((o) => `<span class="badge" style="--c:${o.color}">${esc(o.name)}</span>`).join(" ") : '<span style="color:var(--text-faint)">Independent</span>'}</td>
        <td>${esc(c.country)}</td>
        <td style="color:var(--text-soft)">${esc(c.role || "")}</td>
        <td><span class="badge" style="--c:${/Deceased/.test(st) ? "#ff4d6a" : /Missing|Hospital/.test(st) ? "#f59e0b" : "#3ed598"}">${esc(st)}</span></td>
        <td style="color:var(--text-soft);white-space:nowrap">${esc(S.arc(c.arc))}</td></tr>`;
    }).join("");
    $("#h-empty").hidden = list.length > 0;
    $("#h-empty").innerHTML = list.length ? "" : SLV.stateHTML("empty", "No hunters found", "No registered hunter matches these filters.",
      '<button type="button" class="btn" data-reset>Reset filters</button>');
  }
  function selects() {
    const opt = (v, l, cur) => `<option value="${esc(v)}" ${v === cur ? "selected" : ""}>${esc(l)}</option>`;
    $("#h-rank").innerHTML = opt("all", "All ranks", state.rank) + W.ranks.filter((r) => state.civ || r.id !== "-").map((r) => opt(r.id, r.label, state.rank)).join("");
    $("#h-org").innerHTML = opt("all", "All", state.org) + W.orgs.filter((o) => o.kind !== "faction" && SLV.visible(o)).map((o) => opt(o.id, o.name, state.org)).join("");
    $("#h-country").innerHTML = opt("all", "All countries", state.country) + W.countries.filter((c) => people().some((p) => p.country === c.id && SLV.visible(p) && (state.civ || isHunter(p))))
      .map((c) => opt(c.id, c.id === "—" ? "Other world" : c.id, state.country)).join("");
  }

  /* -------------------------------------------------------------- guilds */
  function guilds() {
    $("#guilds").innerHTML = W.orgs.filter((o) => o.kind !== "faction").map((o) => {
      if (!SLV.visible(o)) return `<div class="sys guild" style="--c:var(--danger)"><span class="badge spoiler">Manhwa spoiler</span><h3>Classified organisation</h3><p>Turn on manhwa spoilers to unseal this record.</p></div>`;
      const members = people().filter((c) => (c.orgs || []).includes(o.id) && SLV.visible(c));
      return `<div class="sys guild" style="--c:${o.color}">
        <span class="badge" style="--c:${o.color}">${o.kind === "guild" ? "Guild" : "Association"} · ${esc(o.country)}</span>
        <h3>${esc(o.name)}</h3><p>${esc(o.note)}</p>
        <div class="members">${members.map((c) => `<button type="button" class="rel-chip" data-id="${c.id}" style="--c:${SLV.colorOf(c)}">${SLV.artHTML(c)}<span>${esc(S.name(c))} <small>· ${esc(c.rank === "-" ? "—" : c.rank)}</small></span></button>`).join("") || '<span style="color:var(--text-faint);font-size:13px">No members on record.</span>'}</div>
        <button type="button" class="btn sm" data-filter-org="${o.id}" style="align-self:flex-start">Filter registry →</button></div>`;
    }).join("");
  }
  function countries() {
    const hunters = people().filter((c) => isHunter(c) && SLV.visible(c));
    const counts = W.countries.map((c) => [c.id, hunters.filter((h) => h.country === c.id).length]).filter(([, n]) => n);
    const max = Math.max(1, ...counts.map((x) => x[1]));
    $("#countries").innerHTML = counts.map(([c, n]) => `<button type="button" class="country-row" data-country="${esc(c)}" style="border:0;background:none;text-align:left;padding:4px 0">
      <span>${esc(c)}</span><span class="tier-bar"><span style="width:${(n / max) * 100}%"></span></span><b style="font-family:var(--display);font-size:18px">${n}</b></button>`).join("")
      || SLV.stateHTML("empty", "No data", "No hunters are visible.");
  }

  function renderAll() { tiers(); national(); selects(); table(); guilds(); countries(); }

  /* -------------------------------------------------------------- events */
  function goRegistry() { $("#registry").scrollIntoView({ behavior: "smooth", block: "start" }); }
  function bind() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".viewer, .palette, .lightbox, .nav")) return;
      const t = e.target.closest("[data-rank]");
      if (t) { state.rank = state.rank === t.dataset.rank ? "all" : t.dataset.rank; tiers(); selects(); table(); goRegistry(); return; }
      const s = e.target.closest("[data-sort]");
      if (s) { const k = s.dataset.sort; state.dir = state.sort === k ? -state.dir : (k === "rank" ? -1 : 1); state.sort = k; table(); return; }
      const fo = e.target.closest("[data-filter-org]");
      if (fo) { state.org = fo.dataset.filterOrg; selects(); table(); goRegistry(); return; }
      const fc = e.target.closest("[data-country]");
      if (fc) { state.country = fc.dataset.country; selects(); table(); goRegistry(); return; }
      if (e.target.closest("[data-reset]")) { Object.assign(state, { q: "", rank: "all", org: "all", country: "all" }); $("#hq").value = ""; renderAll(); return; }
      const row = e.target.closest("tr[data-id]");
      if (row) { SLV.viewer.open(row.dataset.id, { list: lastRows.map((c) => c.id) }); return; }
      const card = e.target.closest("[data-id]");
      if (card) {
        const scope = card.closest(".national-grid, .members");
        SLV.viewer.open(card.dataset.id, { list: scope ? [...scope.querySelectorAll("[data-id]")].map((x) => x.dataset.id) : [card.dataset.id] });
      }
    });
    $("#h-body").addEventListener("keydown", (e) => {
      const row = e.target.closest("tr[data-id]");
      if (row && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); SLV.viewer.open(row.dataset.id, { list: lastRows.map((c) => c.id) }); }
    });
    $("#hq").addEventListener("input", SLV.util.debounce((e) => { state.q = e.target.value; table(); }, 120));
    $("#h-rank").addEventListener("change", (e) => { state.rank = e.target.value; tiers(); table(); });
    $("#h-org").addEventListener("change", (e) => { state.org = e.target.value; table(); });
    $("#h-country").addEventListener("change", (e) => { state.country = e.target.value; table(); });
    $("#h-civ").addEventListener("change", (e) => { state.civ = e.target.checked; if (!state.civ && state.rank === "-") state.rank = "all"; selects(); table(); });
    SLV.spoilers.onChange(renderAll);
  }
  bind(); renderAll();
})();
