/* ==========================================================================
   SOLO LEVELING VERSE: Shadow Network (html/network.html)
   --------------------------------------------------------------------------
   Two structured views instead of one big tangle:
   "Relationships"  one person in a centre card, their connections grouped by
                    kind into boxes (roots on the left, allies, enemies and
                    the Shadow Army on the right) with curved lines to every
                    name. Click a name to put them in the centre.
   "Shadow Army"    a top-down chart: the Shadow Monarch, then one row per
                    grade, highest first.
   Deep links: html/network.html?focus=<id>   html/network.html?layout=army
   ========================================================================== */

(() => {
  "use strict";
  const SLV = window.SLV;
  if (!SLV || !SLV.ready) return;
  const { $, esc, norm } = SLV.util;
  const S = SLV.show;

  /* connection kinds -> groups; `side` puts the box left or right of centre */
  const GROUPS = [
    { key: "family", label: "Family", side: "left", color: "#5ec8ff", types: ["family", "spouse"] },
    { key: "power", label: "Power & origins", side: "left", color: "#f6c453", types: ["vessel", "successor", "creator", "origin", "command"] },
    { key: "guild", label: "Guilds & affiliations", side: "left", color: "#8f7bff", types: ["member"] },
    { key: "ally", label: "Allies", side: "right", color: "#4ade80", types: ["ally"] },
    { key: "rival", label: "Rivals", side: "right", color: "#ff9f43", types: ["rival"] },
    { key: "enemy", label: "Enemies", side: "right", color: "#ff4d6a", types: ["enemy"] },
    { key: "army", label: "Shadow Army", side: "right", color: "#b06bff", types: ["shadow", "mount"] }
  ];
  const GRADES = ["Grand Marshal", "Marshal", "Elite Knight", "Knight", "Elite", "Normal"];
  const TYPES = ["character", "monarch", "shadow", "org"];

  const state = { view: "flow", focus: null, trail: [], off: new Set(), q: "" };
  const inMap = (e) => !!e && SLV.visible(e) && TYPES.includes(e._type) && !(e._type === "org" && e.kind === "faction");
  const groupOf = (r, a, b) => {
    if (r.t === "command" && (a._type === "shadow" || b._type === "shadow")) return "army";
    return (GROUPS.find((g) => g.types.includes(r.t)) || {}).key || null;
  };

  function connections(id, { all = false } = {}) {
    const me = SLV.get(id), out = [];
    SLV.relations(id).forEach((r) => {
      const e = SLV.get(r.id);
      if (!inMap(e)) return;
      const g = groupOf(r, me, e);
      if (!g || (!all && state.off.has(g))) return;
      const label = r.label || SLV.linkLabel(r.t);
      const hit = out.find((x) => x.g === g && x.e === e);
      if (hit) { if (label && !hit.labels.includes(label)) hit.labels.push(label); }
      else out.push({ g, e, labels: label ? [label] : [] });
    });
    return out;
  }
  const degree = (id) => new Set(connections(id, { all: true }).map((x) => x.e.id)).size;
  const hiddenCount = (id) => {
    const keep = (r) => { const e = SLV.get(r.id); return e && TYPES.includes(e._type) && !(e._type === "org" && e.kind === "faction") && groupOf(r, SLV.get(id), e); };
    return new Set(SLV.relations(id, { includeHidden: true }).filter(keep).map((r) => r.id)).size - new Set(SLV.relations(id).filter(keep).filter((r) => inMap(SLV.get(r.id))).map((r) => r.id)).size;
  };

  /* -------------------------------------------------------- relationship flow */
  const flow = $("#flow"), lines = $("#flow-lines");
  function row(x, g) {
    const n = S.name(x.e);
    return `<div class="fr" data-row="${x.e.id}">
      <button type="button" class="fr-go" data-goto="${x.e.id}" title="Put ${esc(n)} in the centre">${SLV.artHTML(x.e)}<span><b>${esc(n)}</b><small>${esc(x.labels.join(" · ") || g.label)}</small></span></button>
      <button type="button" class="fr-open" data-profile="${x.e.id}" aria-label="Open ${esc(n)}'s profile" title="Open profile">↗</button></div>`;
  }
  function drawFlow() {
    const c = SLV.get(state.focus), list = connections(state.focus);
    const people = new Set(connections(state.focus, { all: true }).map((x) => x.e.id)).size, hidden = hiddenCount(state.focus);
    const boxes = (side) => GROUPS.filter((g) => g.side === side).map((g) => [g, list.filter((x) => x.g === g.key)]).filter(([, l]) => l.length)
      .map(([g, l], i) => `<section class="fg sys" style="--c:${g.color};--i:${i}"><h3><i class="sw"></i>${esc(g.label)}<span>${l.length}</span></h3>${l.sort((a, b) => S.name(a.e).localeCompare(S.name(b.e))).map((x) => row(x, g)).join("")}</section>`).join("");
    const none = (t) => `<p class="flow-none">${t}${state.off.size ? " with these filters" : " on record"}.</p>`;
    $("#flow-left").innerHTML = boxes("left") || none("No family, powers or guilds");
    $("#flow-right").innerHTML = boxes("right") || none("No allies, rivals, enemies or shadows");
    $("#flow-centre").innerHTML = `<div class="fc sys" style="--c:${SLV.colorOf(c)}">
      <div class="fc-art">${SLV.artHTML(c, { eager: true })}</div>
      <p class="fc-type">${esc(S.typeLabel(c))}</p><h2>${esc(S.name(c))}</h2><p class="fc-sub">${esc(S.subtitle(c))}</p>
      <p class="fc-count"><b>${people}</b> connection${people === 1 ? "" : "s"}${hidden > 0 ? `<br><span class="fc-hidden">${hidden} more hidden as manhwa spoilers</span>` : ""}</p>
      <button type="button" class="btn primary sm" data-profile="${c.id}">Open profile</button></div>`;
    const all = connections(state.focus, { all: true });
    $("#flow-groups").innerHTML = GROUPS.filter((g) => all.some((x) => x.g === g.key)).map((g) => {
      const on = !state.off.has(g.key);
      return `<button type="button" class="chip flow-chip${on ? " active" : ""}" data-group="${g.key}" aria-pressed="${on}" style="--c:${g.color}"><i class="sw"></i>${esc(g.label)} <span class="count">${all.filter((x) => x.g === g.key).length}</span></button>`;
    }).join("");
    $("#flow-trail").innerHTML = state.trail.length > 1
      ? "<span>Path:</span>" + state.trail.map((id, i) => `${i ? '<span aria-hidden="true">›</span>' : ""}<button type="button" data-goto="${id}"${id === state.focus ? ' aria-current="true"' : ""}>${esc(S.name(SLV.get(id)))}</button>`).join("")
      : "<span>Click any name to put them in the centre.</span>";
    const st = $("#net-status"); if (st) st.textContent = `${S.name(c)} in the centre: ${people} connection${people === 1 ? "" : "s"}.`;
    flow.classList.remove("enter"); void flow.offsetWidth; flow.classList.add("enter");
    requestAnimationFrame(drawLines);
  }
  function curve(sx, sy, ex, ey, vertical) {
    if (vertical) { const my = (sy + ey) / 2; return `M${sx.toFixed(1)} ${sy.toFixed(1)}C${sx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`; }
    const mx = (sx + ex) / 2; return `M${sx.toFixed(1)} ${sy.toFixed(1)}C${mx.toFixed(1)} ${sy.toFixed(1)} ${mx.toFixed(1)} ${ey.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  }
  function drawLines() {
    if (state.view === "flow") {
      const card = $("#flow-centre .fc");
      if (!card || getComputedStyle(lines).display === "none") { lines.innerHTML = ""; return; }
      const b = flow.getBoundingClientRect(), cr = card.getBoundingClientRect();
      lines.setAttribute("viewBox", `0 0 ${b.width} ${b.height}`);
      lines.innerHTML = [...flow.querySelectorAll(".fr")].map((r) => {
        const rr = r.getBoundingClientRect(), left = !!r.closest("#flow-left"), col = r.closest(".fg").style.getPropertyValue("--c");
        return `<path class="fl" data-for="${r.dataset.row}" style="stroke:${col}" d="${curve((left ? cr.left : cr.right) - b.left, cr.top + cr.height / 2 - b.top, (left ? rr.right : rr.left) - b.left, rr.top + rr.height / 2 - b.top)}"/>`;
      }).join("");
    } else {
      const svg = $("#army-lines"), wrap = $("#army"), top = $("#army .ac-lead");
      if (!top) { svg.innerHTML = ""; return; }
      const b = wrap.getBoundingClientRect(), t = top.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${b.width} ${b.height}`);
      svg.innerHTML = [...wrap.querySelectorAll(".army-row")].map((r) => {
        const rr = r.getBoundingClientRect();
        return `<path class="fl" style="stroke:#b06bff" d="${curve(t.left + t.width / 2 - b.left, t.bottom - b.top, rr.left + rr.width / 2 - b.left, rr.top - b.top, true)}"/>`;
      }).join("");
    }
  }

  /* ----------------------------------------------------- Shadow Army chart */
  function drawArmy() {
    const jin = SLV.get("sung_jinwoo"), ash = SLV.get("ashborn");
    const shadows = SLV.ofType("shadow").filter(inMap);
    const lead = (e, cls) => `<button type="button" class="ac ${cls} sys" data-profile="${e.id}" style="--c:${SLV.colorOf(e)}"><span class="ac-art">${SLV.artHTML(e, { eager: true })}</span><span><small>${esc(S.typeLabel(e))}</small><b>${esc(S.name(e))}</b><em>${esc(S.subtitle(e))}</em></span></button>`;
    const rows = GRADES.map((g) => [g, shadows.filter((s) => S.grade(s) === g)]).filter(([, l]) => l.length);
    const other = shadows.filter((s) => !GRADES.includes(S.grade(s)));
    if (other.length) rows.push(["Other", other]);
    const hidden = SLV.ofType("shadow").filter((s) => !SLV.visible(s)).length;
    $("#army-body").innerHTML = `<div class="army-top">${inMap(jin) ? lead(jin, "ac-lead") : ""}${inMap(ash) ? lead(ash, "ac-side") : ""}</div>
      ${rows.map(([g, l], i) => `<section class="army-row sys" style="--i:${i}"><h3>${esc(g === "Other" ? (SLV.spoilers.on ? "Grade not recorded" : "Grade not shown in the anime") : g + "-grade")}<span>${l.length}</span></h3>
        <div class="army-grid">${l.sort((a, b) => S.name(a).localeCompare(S.name(b))).map((s) => `<div class="fr" data-row="${s.id}"><button type="button" class="fr-go" data-profile="${s.id}">${SLV.artHTML(s)}<span><b>${esc(S.name(s))}</b><small>${esc(s.origin ? "In life: " + s.origin : S.subtitle(s))}</small></span></button>
          <button type="button" class="fr-open" data-goto="${s.id}" aria-label="See ${esc(S.name(s))}'s relationships" title="See relationships">⇄</button></div>`).join("")}</div></section>`).join("")}
      ${hidden ? `<p class="flow-none">${hidden} more shadow${hidden === 1 ? "" : "s"} hidden as manhwa spoilers.</p>` : ""}`;
    const st = $("#net-status"); if (st) st.textContent = `Shadow Army chart: ${shadows.length} shadow${shadows.length === 1 ? "" : "s"} by grade.`;
    $("#army").classList.remove("enter"); void $("#army").offsetWidth; $("#army").classList.add("enter");
    requestAnimationFrame(drawLines);
  }

  /* ------------------------------------------------------------ side list */
  function drawList() {
    const terms = norm(state.q).split(/\s+/).filter(Boolean);
    const items = SLV.all.filter(inMap).filter((e) => !terms.length || terms.every((t) => norm(S.name(e)).includes(t)));
    $("#rel-list").innerHTML = TYPES.map((t) => {
      const l = items.filter((e) => e._type === t).sort((a, b) => S.name(a).localeCompare(S.name(b)));
      return l.length ? `<h3>${esc(t === "org" ? "Guilds & associations" : SLV.types[t].plural)} <span>${l.length}</span></h3>` + l.map((e) => `<button type="button" class="rel-item" data-goto="${e.id}"${e.id === state.focus && state.view === "flow" ? ' aria-current="true"' : ""}>${SLV.artHTML(e)}<span class="ri-name">${esc(S.name(e))}</span><small>${degree(e.id)}</small></button>`).join("") : "";
    }).join("") || '<p class="flow-none">No one matches.</p>';
    const cur = $("#rel-list [aria-current]"), L = $("#rel-list");
    if (cur && !state.q) L.scrollTop = cur.offsetTop - L.offsetTop - L.clientHeight / 2;
  }

  /* ----------------------------------------------------------- navigation */
  const setUrl = () => {
    try {
      const u = new URL(location.href);
      if (state.view === "army") { u.searchParams.set("layout", "army"); u.searchParams.delete("focus"); }
      else { u.searchParams.delete("layout"); u.searchParams.set("focus", state.focus); }
      history.replaceState(null, "", u.pathname + u.search);
    } catch (_) { /* cosmetic */ }
  };
  function setView(v) {
    state.view = v;
    document.querySelectorAll("#views [data-view]").forEach((b) => { b.setAttribute("aria-checked", String(b.dataset.view === v)); b.tabIndex = b.dataset.view === v ? 0 : -1; });
    $("#flow-wrap").hidden = v !== "flow";
    $("#army").hidden = v !== "army";
    if (v === "flow") drawFlow(); else drawArmy();
    drawList(); setUrl();
  }
  function focus(id, { push = true } = {}) {
    if (!inMap(SLV.get(id))) return false;
    state.focus = id;
    state.trail = state.trail.filter((x) => inMap(SLV.get(x)));
    if (push) { state.trail = state.trail.filter((x) => x !== id); state.trail.push(id); state.trail = state.trail.slice(-6); }
    if (state.view !== "flow") setView("flow"); else { drawFlow(); drawList(); setUrl(); }
    return true;
  }
  const fallback = () => (inMap(SLV.get("sung_jinwoo")) ? "sung_jinwoo" : (SLV.all.filter(inMap).sort((a, b) => degree(b.id) - degree(a.id))[0] || {}).id);

  document.addEventListener("click", (ev) => {
    if (ev.target.closest(".viewer, .palette")) return;
    const g = ev.target.closest("[data-goto]");
    if (g) {
      const fromList = !!g.closest("#rel-list");
      focus(g.dataset.goto);
      const target = fromList && matchMedia("(max-width: 980px)").matches ? $("#rel-main") : !fromList && !g.closest("#flow-trail") ? $("#flow-trail") : null;
      if (target) target.scrollIntoView({ behavior: SLV.util.reducedMotion() ? "auto" : "smooth", block: "start" });
      return;
    }
    const p = ev.target.closest("[data-profile]");
    if (p) {
      const list = state.view === "flow" ? [state.focus, ...connections(state.focus).map((x) => x.e.id)] : [...document.querySelectorAll("#army [data-profile]")].map((x) => x.dataset.profile);
      SLV.viewer.open(p.dataset.profile, { list: [...new Set(list)] });
      return;
    }
    const gr = ev.target.closest("#flow-groups [data-group]");
    if (gr) { const k = gr.dataset.group; state.off.has(k) ? state.off.delete(k) : state.off.add(k); drawFlow(); return; }
    const v = ev.target.closest("#views [data-view]");
    if (v) setView(v.dataset.view);
  });
  const hot = (id) => {
    flow.classList.toggle("hot", !!id);
    flow.querySelectorAll(".fr").forEach((x) => x.classList.toggle("on", x.dataset.row === id));
    lines.querySelectorAll(".fl").forEach((x) => x.classList.toggle("on", x.dataset.for === id));
  };
  flow.addEventListener("mouseover", (ev) => { const r = ev.target.closest(".fr"); hot(r ? r.dataset.row : null); });
  flow.addEventListener("mouseleave", () => hot(null));
  flow.addEventListener("focusin", (ev) => { const r = ev.target.closest(".fr"); hot(r ? r.dataset.row : null); });
  /* radiogroup keyboard: arrows move the selection */
  $("#views").addEventListener("keydown", (ev) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(ev.key)) return;
    ev.preventDefault();
    const v = state.view === "flow" ? "army" : "flow";
    setView(v); const b = $(`#views [data-view="${v}"]`); if (b) b.focus();
  });
  $("#rel-q").addEventListener("input", SLV.util.debounce((ev) => { state.q = ev.target.value; drawList(); }, 100));
  $("#rel-q").addEventListener("keydown", (ev) => { if (ev.key === "Enter") { const b = $("#rel-list [data-goto]"); if (b) { ev.preventDefault(); b.click(); } } });
  SLV.spoilers.onChange(() => {
    if (!inMap(SLV.get(state.focus))) state.focus = fallback();
    state.trail = state.trail.filter((x) => inMap(SLV.get(x)));
    setView(state.view);
  });
  const ro = () => requestAnimationFrame(drawLines);
  if ("ResizeObserver" in window) { new ResizeObserver(ro).observe(flow); new ResizeObserver(ro).observe($("#army")); }
  else addEventListener("resize", SLV.util.debounce(drawLines, 120));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawLines);

  const q = new URLSearchParams(location.search), want = q.get("focus");
  state.focus = fallback();
  if (want && SLV.get(want) && !inMap(SLV.get(want))) {
    setTimeout(() => SLV.notify && SLV.notify(`${S.name(SLV.get(want))} isn't on the map in anime-safe mode.`, { title: "Hidden by spoilers" }), 300);
  }
  if (want && inMap(SLV.get(want))) state.focus = want;
  state.trail = [state.focus];
  setView(q.get("layout") === "army" ? "army" : "flow");
})();
