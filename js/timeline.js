/* ==========================================================================
   SOLO LEVELING VERSE: interactive timeline (html/timeline.html)
   Arc rail with scroll-spy, event-type filters, a glowing progress spine,
   spoiler-sealed events (reveal one or all) and entity chips that open the
   viewer. Deep link: html/timeline.html#<event id>.
   ========================================================================== */

(() => {
  "use strict";
  const SLV = window.SLV;
  if (!SLV.ready) return;
  const { $, esc } = SLV.util;
  const W = SLV.data.world;
  const EVENTS = SLV.data.timeline || [];
  const KINDS = {
    world: ["World", "#5ec8ff"], milestone: ["Milestone", "#3ed598"], battle: ["Battle", "#ff5d6c"],
    shadow: ["Shadow", "#b06bff"], loss: ["Loss", "#f59e0b"]
  };
  const state = { kinds: new Set(Object.keys(KINDS)), revealed: new Set() };

  const sealed = (t) => t.sp === "m" && !SLV.spoilers.on && !state.revealed.has(t.id);
  const shown = () => EVENTS.filter((t) => state.kinds.has(t.kind));

  function renderArcs() {
    const list = shown();
    $("#arcs").innerHTML = W.arcs.map((a) => {
      const n = list.filter((t) => t.arc === a.id).length;
      if (!n) return "";
      return `<li><a href="#arc-${a.id}" data-arc="${a.id}"><span class="arc-dot"></span><span class="arc-name">${esc(a.label)}</span>
        <span class="arc-short${a.sp ? " m" : ""}">${esc(a.short)}</span><span class="arc-n">${n}</span></a></li>`;
    }).join("");
  }
  function renderKinds() {
    $("#kinds").innerHTML = Object.entries(KINDS).map(([k, [l, c]]) =>
      `<button type="button" class="chip" data-kind="${k}" aria-pressed="${state.kinds.has(k)}" style="--kc:${c}"><span class="k-dot" style="background:${c}"></span>${l}</button>`).join("");
  }

  function chips(ids) {
    return ids.map(SLV.get).filter((e) => e && SLV.visible(e)).map((e) =>
      `<button type="button" class="rel-chip" data-open="${e.id}" style="--c:${SLV.colorOf(e)}">${SLV.artHTML(e)}<span>${esc(SLV.show.name(e))}</span></button>`).join("");
  }

  function render() {
    const list = shown();
    let html = "", i = 0;
    W.arcs.forEach((a) => {
      const evs = list.filter((t) => t.arc === a.id);
      if (!evs.length) return;
      html += `<h2 class="tl-arc" id="arc-${a.id}" data-arc-head="${a.id}"><span>${esc(a.label)}</span>${a.sp ? '<span class="badge spoiler">Manhwa</span>' : `<span class="badge" style="--c:#5ec8ff">${esc(a.short)}</span>`}</h2>`;
      evs.forEach((t) => {
        const [kl, kc] = KINDS[t.kind] || ["Event", "#5ec8ff"];
        const side = i++ % 2 ? "right" : "left";
        if (sealed(t)) {
          html += `<article class="tl-event ${side} sealed reveal" id="${t.id}" style="--kc:${kc}">
            <span class="tl-node" aria-hidden="true"></span>
            <div class="sys tl-card"><div class="sys-head" style="color:var(--danger)"><span class="bang">!</span>Sealed record · ${esc(t.when)}</div>
              <div class="tl-body"><h3>Manhwa event</h3><p>This event happens beyond the anime's Season 2.</p>
              <button type="button" class="btn sm" data-reveal="${t.id}">Reveal this event</button></div></div></article>`;
          return;
        }
        html += `<article class="tl-event ${side} reveal" id="${t.id}" style="--kc:${kc}">
          <span class="tl-node" aria-hidden="true"></span>
          <div class="sys tl-card">
            <div class="sys-head"><span class="bang" style="color:${kc};border-color:${kc}">◆</span><span style="color:${kc}">${kl}</span><span class="tl-when">${esc(t.when)}</span>
              ${t.sp === "m" ? '<span class="badge spoiler" style="margin-left:auto">Manhwa</span>' : ""}</div>
            <div class="tl-body"><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p>
              <div class="rel-chips">${chips(t.ids || [])}</div>
              <a class="tl-link" href="#${t.id}" aria-label="Link to this event">#</a></div>
          </div></article>`;
      });
    });
    $("#timeline").innerHTML = html;
    $("#tl-empty").hidden = list.length > 0;
    $("#tl-empty").innerHTML = list.length ? "" : SLV.stateHTML("empty", "No events", "Every event type is filtered out.", '<button type="button" class="btn" data-all-kinds>Show all types</button>');
    SLV.observeReveals($("#timeline"));
    spy();
    progress();
  }

  /* -------------------------------------------------------- scroll spy */
  let io;
  function spy() {
    if (io) io.disconnect();
    if (!("IntersectionObserver" in window)) return;
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.dataset.arcHead || (EVENTS.find((t) => t.id === en.target.id) || {}).arc;
        document.querySelectorAll("#arcs a").forEach((a) => a.classList.toggle("active", a.dataset.arc === id));
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    document.querySelectorAll(".tl-arc, .tl-event").forEach((el) => io.observe(el));
  }
  function progress() {
    const main = $(".tl-main");
    const r = main.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.5 - r.top) / Math.max(1, r.height)));
    $("#tl-fill").style.height = (p * 100).toFixed(1) + "%";
  }

  function focusHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const t = EVENTS.find((x) => x.id === id);
    if (t && !state.kinds.has(t.kind)) { state.kinds.add(t.kind); renderKinds(); renderArcs(); render(); }
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add("in");
    el.scrollIntoView({ behavior: SLV.util.reducedMotion() ? "auto" : "smooth", block: "center" });
    el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
  }

  function bind() {
    $("#kinds").addEventListener("click", (e) => {
      const b = e.target.closest("[data-kind]"); if (!b) return;
      const k = b.dataset.kind;
      if (state.kinds.has(k) && state.kinds.size === 1) return;
      state.kinds.has(k) ? state.kinds.delete(k) : state.kinds.add(k);
      renderKinds(); renderArcs(); render();
    });
    $("#timeline").addEventListener("click", (e) => {
      const r = e.target.closest("[data-reveal]");
      if (r) { state.revealed.add(r.dataset.reveal); render(); const el = document.getElementById(r.dataset.reveal); if (el) el.classList.add("in", "flash"); return; }
      const o = e.target.closest("[data-open]");
      if (o) { const ids = [...o.parentNode.querySelectorAll("[data-open]")].map((x) => x.dataset.open); SLV.viewer.open(o.dataset.open, { list: ids }); }
    });
    document.addEventListener("click", (e) => { if (e.target.closest("[data-all-kinds]")) { state.kinds = new Set(Object.keys(KINDS)); renderKinds(); renderArcs(); render(); } });
    window.addEventListener("scroll", progress, { passive: true });
    window.addEventListener("resize", SLV.util.debounce(progress, 100));
    window.addEventListener("hashchange", focusHash);
    SLV.spoilers.onChange(() => { renderArcs(); render(); });
  }

  bind(); renderKinds(); renderArcs(); render();
  if (location.hash) requestAnimationFrame(focusHash);
})();
