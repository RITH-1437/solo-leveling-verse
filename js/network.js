/* ==========================================================================
   SOLO LEVELING VERSE: Shadow Network (network.html)
   --------------------------------------------------------------------------
   An SVG relationship map adapted from the Naruto Verse lineage scroll.
   Nodes:  characters, Monarchs & Rulers, shadows, guilds / associations.
   Layers: family & allies · enemies · Monarchs & Rulers · guild affiliations ·
           Shadow Army (each toggleable).
   Layouts: "universe" (clustered by faction / guild / family) and "army"
           (Shadow Army hierarchy by grade); switching tweens every node.
   Input:  drag to pan, wheel / pinch to zoom, +/−/0 keys, click for the
           detail panel, double-click or "Open profile" for the viewer.
   Deep link: network.html?focus=<id>&layout=army
   ========================================================================== */

(() => {
  "use strict";
  const SLV = window.SLV;
  if (!SLV.ready) return;
  const { $, esc, norm } = SLV.util;
  const S = SLV.show;
  const NS = "http://www.w3.org/2000/svg";

  const svg = $("#net"), vp = $("#vp"), gEdges = $("#edges"), gNodes = $("#nodes"), gBands = $("#bands");
  const stage = $("#stage"), panel = $("#panel");

  const LAYERS = {
    personal: { label: "Family & allies", types: ["family", "spouse", "ally", "rival"], color: "#5ec8ff" },
    conflict: { label: "Enemies", types: ["enemy"], color: "#ff4d6a" },
    power: { label: "Monarchs & Rulers", types: ["command", "creator", "vessel", "successor"], color: "#f6c453" },
    guild: { label: "Guild affiliations", types: ["member"], color: "#8f7bff" },
    shadow: { label: "Shadow Army", types: ["shadow", "origin", "mount"], color: "#b06bff" }
  };
  const on = { personal: true, conflict: true, power: true, guild: true, shadow: true };
  const state = { layout: "universe", tx: 0, ty: 0, k: 1, selected: null, hover: null };

  const FAMILY = new Set(["sung_jinah", "park_kyunghye", "sung_ilhwan", "sung_suho"]);
  const CENTERS = {
    monarchs: [1200, 170, "Monarchs & Rulers"], family: [1620, 520, "The Sung family"], ahjin: [880, 470, "Ahjin Guild"],
    hunters_guild: [470, 600, "Hunters Guild"], white_tiger: [430, 990, "White Tiger Guild"], kha: [830, 1120, "Hunter Association"],
    korea: [740, 800, "Korean hunters"], scavenger: [2000, 640, "Scavenger Guild"], intl: [1980, 990, "National-level hunters"],
    shadows: [1200, 1360, "The Shadow Army"], other: [1660, 1150, "Beyond the gates"]
  };
  const GRADE_ROWS = ["Grand Marshal", "Marshal", "Elite Knight", "Knight", "Elite", "", "Normal"];

  let nodes = [], edges = [], byNode = new Map(), pos = new Map();

  /* ------------------------------------------------------------- graph */
  const isNodeEnt = (e) => SLV.visible(e) && (["character", "monarch", "shadow"].includes(e._type) || (e._type === "org" && e.kind !== "faction"));
  function edgeLayer(l) {
    const a = SLV.get(l.a), b = SLV.get(l.b);
    if (l.t === "command" && (a._type === "shadow" || b._type === "shadow")) return "shadow";
    return Object.keys(LAYERS).find((k) => LAYERS[k].types.includes(l.t)) || "personal";
  }
  function buildGraph() {
    nodes = SLV.all.filter(isNodeEnt);
    byNode = new Map(nodes.map((n) => [n.id, n]));
    edges = [];
    (SLV.data.links || []).forEach((l) => {
      if (!SLV.linkVisible(l) || !byNode.has(l.a) || !byNode.has(l.b)) return;
      edges.push({ a: l.a, b: l.b, t: l.t, label: l.label, layer: edgeLayer(l) });
    });
    nodes.forEach((n) => (n.orgs || []).forEach((o) => {
      if (byNode.has(o)) edges.push({ a: n.id, b: o, t: "member", label: "Member", layer: "guild" });
    }));
    /* spread parallel edges between the same pair */
    const pairN = new Map();
    edges.forEach((e) => { const k = [e.a, e.b].sort().join("|"); const i = pairN.get(k) || 0; pairN.set(k, i + 1); e.bend = 0.12 + i * 0.16; });
  }

  /* ----------------------------------------------------------- layouts */
  function clusterOf(e) {
    if (e._type === "monarch") return "monarchs";
    if (e._type === "shadow") return "shadows";
    if (e._type === "org") return CENTERS[e.id] ? e.id : "korea";
    if (FAMILY.has(e.id)) return "family";
    const org = (e.orgs || []).find((o) => CENTERS[o] && byNode.has(o));
    if (org) return org;
    if (e.country === "Other world") return "other";
    if (e.country && e.country !== "South Korea") return "intl";
    return "korea";
  }
  function universe() {
    const out = new Map();
    out.set("sung_jinwoo", [1200, 770]);
    const groups = {};
    nodes.forEach((n) => { if (n.id !== "sung_jinwoo") (groups[clusterOf(n)] = groups[clusterOf(n)] || []).push(n); });
    Object.entries(groups).forEach(([c, list]) => {
      const [cx, cy] = CENTERS[c];
      if (c === "monarchs" || c === "shadows") {
        const step = c === "monarchs" ? 150 : 165, mid = (list.length - 1) / 2;
        list.forEach((n, i) => { const o = i - mid; out.set(n.id, [cx + o * step, cy + (c === "monarchs" ? 1 : -1) * o * o * 6]); });
        return;
      }
      const hub = list.find((n) => n.id === c);
      const ring = list.filter((n) => n !== hub);
      if (hub) out.set(hub.id, [cx, cy]);
      if (!hub && ring.length === 1) { out.set(ring[0].id, [cx, cy]); return; }
      const r = 92 + ring.length * 11;
      ring.forEach((n, i) => {
        const a = -Math.PI / 2 + (i / ring.length) * Math.PI * 2 + (hub ? 0 : 0.4);
        out.set(n.id, [cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.8]);
      });
    });
    return out;
  }
  function armyMembers() {
    return nodes.filter((n) => n._type === "shadow" || n.id === "sung_jinwoo" || n.id === "ashborn");
  }
  function army() {
    const out = new Map();
    const members = armyMembers();
    const rows = GRADE_ROWS.filter((g) => members.some((n) => n._type === "shadow" && (S.grade(n) || "") === g));
    out.set("sung_jinwoo", [1200, 150]);
    if (byNode.has("ashborn")) out.set("ashborn", [880, 150]);
    rows.forEach((g, ri) => {
      const list = members.filter((n) => n._type === "shadow" && (S.grade(n) || "") === g);
      const mid = (list.length - 1) / 2;
      list.forEach((n, i) => out.set(n.id, [1200 + (i - mid) * 230, 380 + ri * 210]));
    });
    out.rows = rows;
    return out;
  }
  const inLayout = (id) => state.layout === "universe" || armyMembers().some((n) => n.id === id);

  /* ----------------------------------------------------------- drawing */
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const radius = (n) => n.id === "sung_jinwoo" ? 36 : n._type === "org" ? 26 : n._type === "monarch" ? 28 : 23;
  function shape(n, r, attrs, parent) {
    if (n._type === "monarch") {
      const pts = Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 6 + i * Math.PI / 3; return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; }).join(" ");
      return el("polygon", { points: pts, ...attrs }, parent);
    }
    if (n._type === "shadow") return el("rect", { x: -r * .86, y: -r * .86, width: r * 1.72, height: r * 1.72, rx: 6, transform: "rotate(45)", ...attrs }, parent);
    if (n._type === "org") return el("rect", { x: -r, y: -r * .8, width: r * 2, height: r * 1.6, rx: 5, ...attrs }, parent);
    return el("circle", { r, ...attrs }, parent);
  }
  function subtitle(n) {
    if (n._type === "character" && n.rank && n.rank !== "-") return `${SLV.rank(n.rank).label}`;
    if (n._type === "shadow") return S.grade(n) ? `${S.grade(n)} shadow` : "Shadow";
    return S.typeLabel(n);
  }
  function draw() {
    gNodes.textContent = ""; gEdges.textContent = "";
    edges.forEach((e) => {
      e.el = el("path", { class: `edge l-${e.layer} t-${e.t}`, "data-a": e.a, "data-b": e.b }, gEdges);
      el("title", {}, e.el).textContent = `${S.name(SLV.get(e.a))} and ${S.name(SLV.get(e.b))}: ${e.label}`;
    });
    nodes.forEach((n) => {
      const r = radius(n), col = SLV.colorOf(n);
      const g = el("g", { class: `node n-${n._type}${n.id === "sung_jinwoo" ? " n-core" : ""}`, "data-id": n.id, tabindex: "0", role: "button",
        "aria-label": `${S.name(n)}, ${subtitle(n)}` }, gNodes);
      g.style.setProperty("--c", col);
      el("circle", { class: "halo", r: r + 12, fill: col }, g);
      shape(n, r, { class: "disc", fill: "url(#node-core)", stroke: col }, g);
      const art = SLV.media.art(n);
      if (art) {
        const cid = "clip-" + n.id;
        const cp = el("clipPath", { id: cid }, g);
        shape(n, r - 3, {}, cp);
        const logo = n._type === "org", s = logo ? r * .68 : r;   // guild logos: whole emblem, padded
        el("image", { href: art, x: -s, y: -s, width: s * 2, height: s * 2, "clip-path": `url(#${cid})`, preserveAspectRatio: logo ? "xMidYMid meet" : "xMidYMid slice" }, g);
      } else {
        el("text", { class: "init", y: 1, fill: col }, g).textContent = SLV.util.initials(S.name(n));
      }
      el("text", { class: "lbl", y: r + 19 }, g).textContent = S.name(n);
      el("text", { class: "sub", y: r + 33 }, g).textContent = subtitle(n);
      n._g = g;
    });
  }
  function drawBands(target) {
    gBands.textContent = "";
    if (state.layout === "universe") {
      const used = new Set(nodes.filter((n) => n.id !== "sung_jinwoo").map(clusterOf));
      Object.entries(CENTERS).forEach(([k, [x, y, label]]) => {
        if (!used.has(k)) return;
        const members = nodes.filter((n) => n.id !== "sung_jinwoo" && clusterOf(n) === k);
        const ring = members.filter((n) => n.id !== k).length;
        const solo = ring === 1 && !members.some((n) => n.id === k);
        const ly = k === "monarchs" ? y - 70 : k === "shadows" ? y + 100 : y - (solo ? 0 : (92 + ring * 11) * 0.8) - 44;
        el("text", { class: "band", x, y: ly }, gBands).textContent = label.toUpperCase();
      });
    } else {
      el("text", { class: "band", x: 1200, y: 70 }, gBands).textContent = "THE SHADOW MONARCH";
      (target.rows || []).forEach((g, i) => {
        const y = 380 + i * 210;
        el("line", { class: "band-line", x1: 180, x2: 2220, y1: y, y2: y }, gBands);
        el("text", { class: "band grade", x: 1200, y: y - 50 }, gBands).textContent = (g ? g + " grade" : "Grade not stated").toUpperCase();
      });
    }
  }

  function edgePath(e) {
    const p = pos.get(e.a), q = pos.get(e.b);
    if (!p || !q) return "";
    const dx = q[0] - p[0], dy = q[1] - p[1];
    const cx = (p[0] + q[0]) / 2 - dy * e.bend, cy = (p[1] + q[1]) / 2 + dx * e.bend;
    return `M${p[0].toFixed(1)} ${p[1].toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
  }
  function place() {
    nodes.forEach((n) => { const p = pos.get(n.id); if (p) n._g.setAttribute("transform", `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)})`); });
    edges.forEach((e) => e.el.setAttribute("d", edgePath(e)));
  }
  function visibility() {
    nodes.forEach((n) => n._g.classList.toggle("off", !inLayout(n.id)));
    edges.forEach((e) => {
      const ok = on[e.layer] && inLayout(e.a) && inLayout(e.b) &&
        (state.layout === "universe" || ["shadow", "power"].includes(e.layer));
      e.el.classList.toggle("off", !ok);
    });
    highlight();
  }

  /* ------------------------------------------------------- layout tween */
  let tweenRaf;
  function applyLayout(animate) {
    const target = state.layout === "universe" ? universe() : army();
    drawBands(target);
    cancelAnimationFrame(tweenRaf);
    if (!animate || !pos.size || SLV.util.reducedMotion()) { pos = new Map(target); place(); visibility(); return; }
    const from = new Map(pos), t0 = performance.now(), D = 700;
    visibility();
    const ease = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const tick = (t) => {
      const k = ease(Math.min(1, (t - t0) / D));
      target.forEach((to, id) => { const f = from.get(id) || to; pos.set(id, [f[0] + (to[0] - f[0]) * k, f[1] + (to[1] - f[1]) * k]); });
      place();
      if (k < 1) tweenRaf = requestAnimationFrame(tick); else fit(true);
    };
    tweenRaf = requestAnimationFrame(tick);
  }

  /* ----------------------------------------------------------- pan/zoom */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function apply() { vp.setAttribute("transform", `translate(${state.tx.toFixed(1)} ${state.ty.toFixed(1)}) scale(${state.k.toFixed(4)})`); stage.dataset.zoom = state.k < .55 ? "far" : "near"; }
  let viewRaf;
  function animateView(to, D = 520) {
    cancelAnimationFrame(viewRaf);
    if (SLV.util.reducedMotion()) { Object.assign(state, to); apply(); return; }
    const from = { tx: state.tx, ty: state.ty, k: state.k }, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - p, 3);
      state.tx = from.tx + (to.tx - from.tx) * e; state.ty = from.ty + (to.ty - from.ty) * e; state.k = from.k + (to.k - from.k) * e;
      apply(); if (p < 1) viewRaf = requestAnimationFrame(tick);
    };
    viewRaf = requestAnimationFrame(tick);
  }
  function zoomAt(px, py, f) {
    const k = clamp(state.k * f, .18, 3);
    const wx = (px - state.tx) / state.k, wy = (py - state.ty) / state.k;
    state.tx = px - wx * k; state.ty = py - wy * k; state.k = k; apply();
  }
  function fit(animate = true) {
    const ids = nodes.filter((n) => inLayout(n.id)).map((n) => n.id);
    if (!ids.length) return;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    ids.forEach((id) => { const p = pos.get(id); if (!p) return; x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
    x0 -= 90; x1 += 90; y0 -= 110; y1 += 70;           // room for cluster titles and node labels
    const w = svg.clientWidth, h = svg.clientHeight, pad = 24;
    const panelW = !panel.hidden && w > 900 ? 360 : 0;
    const k = clamp(Math.min((w - panelW - pad * 2) / Math.max(1, x1 - x0), (h - pad * 2) / Math.max(1, y1 - y0)), .18, 1.4);
    const to = { k, tx: (w - panelW) / 2 - ((x0 + x1) / 2) * k, ty: h / 2 - ((y0 + y1) / 2) * k };
    animate ? animateView(to) : (Object.assign(state, to), apply());
  }
  function centerOn(id, k = Math.max(state.k, 1.05)) {
    const p = pos.get(id); if (!p) return;
    const w = svg.clientWidth, h = svg.clientHeight;
    const panelW = !panel.hidden && w > 900 ? 360 : 0;
    const offY = !panel.hidden && w <= 900 ? -h * .2 : 0;
    animateView({ k, tx: (w - panelW) / 2 - p[0] * k, ty: h / 2 + offY - p[1] * k });
  }

  /* ---------------------------------------------------------- highlight */
  function neighbours(id) {
    const s = new Set([id]);
    // !e.el: called mid-rebuild (focusout fires while the map is redrawn)
    edges.forEach((e) => { if (!e.el || e.el.classList.contains("off")) return; if (e.a === id) s.add(e.b); if (e.b === id) s.add(e.a); });
    return s;
  }
  function highlight() {
    const id = state.hover || state.selected;
    svg.classList.toggle("focus", !!id);
    if (!id) { nodes.forEach((n) => n._g?.classList.remove("hl", "sel")); edges.forEach((e) => e.el?.classList.remove("hl")); return; }
    const nb = neighbours(id);
    nodes.forEach((n) => { n._g?.classList.toggle("hl", nb.has(n.id)); n._g?.classList.toggle("sel", n.id === state.selected); });
    edges.forEach((e) => e.el?.classList.toggle("hl", e.a === id || e.b === id));
  }

  /* -------------------------------------------------------------- panel */
  function select(id, { center = true } = {}) {
    const n = byNode.get(id);
    if (!n) return;
    if (!inLayout(id)) { state.layout = "universe"; syncLayoutUI(); applyLayout(true); }
    state.selected = id;
    renderPanel(n);
    highlight();
    if (center) centerOn(id);
    const u = new URL(location.href); u.searchParams.set("focus", id);
    try { history.replaceState(null, "", u.pathname + u.search); } catch (e) { /* file:// */ }
  }
  function deselect() {
    state.selected = null; panel.hidden = true; highlight();
    const u = new URL(location.href); u.searchParams.delete("focus");
    try { history.replaceState(null, "", u.pathname + u.search); } catch (e) { /* file:// */ }
  }
  function renderPanel(n) {
    const conn = edges.filter((e) => !e.el.classList.contains("off") && (e.a === n.id || e.b === n.id));
    const groups = {};
    conn.forEach((e) => { (groups[e.layer] = groups[e.layer] || []).push([e.a === n.id ? e.b : e.a, e.label]); });
    const bio = (n.bio || n.note || "").split(/(?<=\.)\s/)[0];
    panel.hidden = false;
    panel.style.setProperty("--c", SLV.colorOf(n));
    panel.innerHTML = `
      <div class="sys-head"><span class="bang">!</span>${esc(S.typeLabel(n))}<button type="button" class="btn sm icon" data-close style="margin-left:auto" aria-label="Close details">✕</button></div>
      <div class="np-top">${SLV.artHTML(n, { eager: true })}<div><h2>${esc(S.name(n))}</h2><p>${esc(subtitle(n))}</p></div></div>
      <div class="np-body">
        <p class="np-bio">${esc(bio)}</p>
        ${Object.keys(LAYERS).filter((k) => groups[k]).map((k) => `<h4 style="--lc:${LAYERS[k].color}"><span></span>${esc(LAYERS[k].label)} <small>${groups[k].length}</small></h4>
          <div class="rel-chips">${groups[k].map(([id, label]) => { const o = SLV.get(id); return `<button type="button" class="rel-chip" data-go="${id}" style="--c:${SLV.colorOf(o)}">${SLV.artHTML(o)}<span>${esc(S.name(o))} <small>· ${esc(label)}</small></span></button>`; }).join("")}</div>`).join("")
          || '<p style="color:var(--text-faint)">No connections in the active layers.</p>'}
      </div>
      <div class="np-actions"><button type="button" class="btn primary sm" data-profile>Open full profile</button><button type="button" class="btn sm" data-center>Center</button></div>`;
  }
  panel.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) return deselect();
    const go = e.target.closest("[data-go]"); if (go) return select(go.dataset.go);
    if (e.target.closest("[data-profile]")) return SLV.viewer.open(state.selected, { list: nodes.filter((n) => inLayout(n.id)).map((n) => n.id) });
    if (e.target.closest("[data-center]")) return centerOn(state.selected, 1.3);
  });

  /* ------------------------------------------------------------- pointer */
  const pts = new Map();
  let drag = null, pinch = null;
  svg.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    svg.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    cancelAnimationFrame(viewRaf);
    const node = e.target.closest(".node:not(.off)");
    if (pts.size === 1) drag = { x: e.clientX, y: e.clientY, tx: state.tx, ty: state.ty, moved: false, node: node && node.dataset.id };
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), k: state.k, tx: state.tx, ty: state.ty, mx: (a[0] + b[0]) / 2, my: (a[1] + b[1]) / 2 };
      drag = null;
    }
    $("#hint").classList.add("gone");
  });
  svg.addEventListener("pointermove", (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    const r = svg.getBoundingClientRect();
    if (pinch && pts.size === 2) {
      const [a, b] = [...pts.values()];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      const k = clamp(pinch.k * d / pinch.d, .18, 3);
      const mx = (a[0] + b[0]) / 2 - r.left, my = (a[1] + b[1]) / 2 - r.top;
      const wx = (pinch.mx - r.left - pinch.tx) / pinch.k, wy = (pinch.my - r.top - pinch.ty) / pinch.k;
      state.k = k; state.tx = mx - wx * k; state.ty = my - wy * k; apply();
      return;
    }
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 5) { drag.moved = true; stage.classList.add("dragging"); }
    if (drag.moved) { state.tx = drag.tx + dx; state.ty = drag.ty + dy; apply(); }
  });
  const end = (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    if (drag && !drag.moved && e.type === "pointerup") { drag.node ? select(drag.node) : (state.selected && deselect()); }
    if (pts.size < 2) pinch = null;
    drag = null; stage.classList.remove("dragging");
  };
  svg.addEventListener("pointerup", end);
  svg.addEventListener("pointercancel", end);
  svg.addEventListener("wheel", (e) => {
    e.preventDefault();
    const r = svg.getBoundingClientRect();
    zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * (e.ctrlKey ? .01 : .0015)));
  }, { passive: false });
  svg.addEventListener("dblclick", (e) => {
    const node = e.target.closest(".node:not(.off)");
    if (node) SLV.viewer.open(node.dataset.id, { list: nodes.filter((n) => inLayout(n.id)).map((n) => n.id) });
  });
  gNodes.addEventListener("pointerover", (e) => { const n = e.target.closest(".node"); if (n && !n.classList.contains("off") && !drag?.moved) { state.hover = n.dataset.id; highlight(); } });
  gNodes.addEventListener("pointerout", (e) => { const n = e.target.closest(".node"); if (n && !n.contains(e.relatedTarget)) { state.hover = null; highlight(); } });
  gNodes.addEventListener("focusin", (e) => { const n = e.target.closest(".node"); if (n) { state.hover = n.dataset.id; highlight(); } });
  gNodes.addEventListener("focusout", () => { state.hover = null; highlight(); });
  gNodes.addEventListener("keydown", (e) => {
    const n = e.target.closest(".node"); if (!n) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (state.selected === n.dataset.id) SLV.viewer.open(n.dataset.id); else select(n.dataset.id);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (SLV.viewer.isOpen() || document.querySelector(".palette") || e.target.closest("input, select, textarea")) return;
    const w = svg.clientWidth / 2, h = svg.clientHeight / 2;
    if (e.key === "+" || e.key === "=") zoomAt(w, h, 1.25);
    else if (e.key === "-" || e.key === "_") zoomAt(w, h, 1 / 1.25);
    else if (e.key === "0") fit();
    else if (e.key === "Escape" && state.selected) deselect();
    else if (e.key.startsWith("Arrow") && !e.target.closest(".node, [role=radio]")) {
      const d = 60; state.tx += e.key === "ArrowLeft" ? d : e.key === "ArrowRight" ? -d : 0; state.ty += e.key === "ArrowUp" ? d : e.key === "ArrowDown" ? -d : 0; apply();
    } else return;
    e.preventDefault();
  });
  $("#z-in").addEventListener("click", () => zoomAt(svg.clientWidth / 2, svg.clientHeight / 2, 1.3));
  $("#z-out").addEventListener("click", () => zoomAt(svg.clientWidth / 2, svg.clientHeight / 2, 1 / 1.3));
  $("#z-fit").addEventListener("click", () => fit());

  /* ------------------------------------------------------------ toolbar */
  function syncLayoutUI() { document.querySelectorAll("#layouts [data-layout]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.layout === state.layout))); }
  $("#layouts").addEventListener("click", (e) => {
    const b = e.target.closest("[data-layout]"); if (!b || b.dataset.layout === state.layout) return;
    state.layout = b.dataset.layout; syncLayoutUI();
    if (state.selected && !inLayout(state.selected)) deselect();
    applyLayout(true);
  });
  $("#layers").innerHTML = Object.entries(LAYERS).map(([k, l]) => `<label class="switch blue layer-sw" style="--lc:${l.color}">
    <input type="checkbox" data-layer="${k}" checked><span class="track"></span><span class="lsw-line"></span>${esc(l.label)}</label>`).join("");
  $("#layers").addEventListener("change", (e) => {
    const k = e.target.dataset.layer; if (!k) return;
    on[k] = e.target.checked; visibility();
    if (state.selected) renderPanel(byNode.get(state.selected));
  });
  $("#legend").innerHTML = `<div class="lg-title">Legend</div>
    ${Object.values(LAYERS).map((l) => `<div class="lg-row"><span class="lg-line" style="--lc:${l.color}"></span>${esc(l.label)}</div>`).join("")}
    <div class="lg-row"><span class="lg-shape circle"></span>Character</div><div class="lg-row"><span class="lg-shape hex"></span>Monarch / Ruler</div>
    <div class="lg-row"><span class="lg-shape dia"></span>Shadow</div><div class="lg-row"><span class="lg-shape sq"></span>Guild</div>
    <button type="button" class="btn sm ghost lg-toggle" id="lg-toggle" aria-expanded="true">Hide</button>`;
  $("#lg-toggle").addEventListener("click", (e) => {
    const c = $("#legend").classList.toggle("collapsed");
    e.target.textContent = c ? "Legend" : "Hide"; e.target.setAttribute("aria-expanded", String(!c));
  });

  /* find-a-node */
  const find = $("#find"), fr = $("#find-results");
  let fsel = 0, fitems = [];
  function renderFind() {
    const q = norm(find.value).trim();
    if (!q) { fr.hidden = true; return; }
    fitems = nodes.filter((n) => n._name.includes(q) || norm(S.name(n)).includes(q)).slice(0, 8);
    fr.hidden = false;
    fr.innerHTML = fitems.length ? fitems.map((n, i) => `<button type="button" class="pr-item" role="option" data-find="${n.id}" aria-selected="${i === fsel}" style="--c:${SLV.colorOf(n)}">
      ${SLV.artHTML(n)}<span><span class="pr-name">${esc(S.name(n))}</span><br><span class="pr-sub">${esc(subtitle(n))}</span></span></button>`).join("")
      : `<div class="palette-note">No node matches. Spoiler entries appear once spoilers are on.</div>`;
  }
  find.addEventListener("input", () => { fsel = 0; renderFind(); });
  find.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); if (!fitems.length) return; fsel = (fsel + (e.key === "ArrowDown" ? 1 : -1) + fitems.length) % fitems.length; renderFind(); }
    else if (e.key === "Enter") { e.preventDefault(); const n = fitems[fsel]; if (n) { select(n.id); find.value = ""; fr.hidden = true; find.blur(); } }
    else if (e.key === "Escape") { e.stopPropagation(); find.value = ""; fr.hidden = true; }
  });
  fr.addEventListener("click", (e) => { const b = e.target.closest("[data-find]"); if (b) { select(b.dataset.find); find.value = ""; fr.hidden = true; } });
  document.addEventListener("click", (e) => { if (!e.target.closest(".net-find")) fr.hidden = true; });

  /* --------------------------------------------------------------- boot */
  function rebuild(animate) {
    const keep = state.selected;
    buildGraph(); draw();
    pos = new Map();
    applyLayout(false);
    if (keep && byNode.has(keep)) { state.selected = keep; renderPanel(byNode.get(keep)); highlight(); } else if (keep) deselect();
    if (!animate) fit(false);
  }
  SLV.spoilers.onChange(() => rebuild(true));
  window.addEventListener("resize", SLV.util.debounce(() => fit(), 200));

  try {
    const qs = new URLSearchParams(location.search);
    if (qs.get("layout") === "army") { state.layout = "army"; syncLayoutUI(); }
    rebuild(false);
    $("#net-loading").hidden = true;
    const focus = qs.get("focus");
    if (focus) {
      if (byNode.has(focus)) requestAnimationFrame(() => select(focus));
      else if (SLV.get(focus)) SLV.notify(SLV.visible(SLV.get(focus)) ? "That record isn't a node on the map." : "That node is a manhwa spoiler. Turn on spoilers to see it.", { title: "Node hidden" });
    }
  } catch (err) {
    console.error(err);
    $("#net-loading").innerHTML = SLV.stateHTML("error", "Network failed to load", "The relationship map couldn't be built. Reload the page to try again.");
  }
})();
