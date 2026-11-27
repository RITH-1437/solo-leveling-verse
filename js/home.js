/* ==========================================================================
   SOLO LEVELING VERSE: dashboard (index.html)
   Hero with mana-particle canvas and typed System notifications, world
   statistics, featured rails, Monarchs, the hunter ladder, latest additions
   and the explore grid. Everything re-renders when spoiler mode changes.
   ========================================================================== */

(() => {
  "use strict";
  const SLV = window.SLV;
  if (!SLV.ready) return;
  const { $, esc } = SLV.util;
  const S = SLV.show;

  /* ------------------------------------------------------- hero feature */
  function heroFeature() {
    const e = SLV.get("sung_jinwoo");
    const skills = (e.abilities || []).map(SLV.get).filter((s) => s && SLV.visible(s)).slice(0, 5);
    $("#hero-feature").innerHTML = `
      <button type="button" class="hf-card sys" data-id="${e.id}" style="--c:${SLV.colorOf(e)}" aria-label="Open Sung Jinwoo's status window">
        ${SLV.artHTML(e, { eager: true, cls: "hf-art" })}
        <span class="rank lg hf-rank" style="--c:${SLV.rank(e.rank).color}">${esc(e.rank)}</span>
        <span class="hf-body">
          <span class="card-type">Player · ${esc(S.status(e))}</span>
          <span class="hf-name">${esc(S.name(e))} <small>${esc(e.ko)}</small></span>
          <span class="hf-titles">${S.titles(e).slice(-3).map((t) => `<span class="badge" style="--c:var(--violet)">${esc(t)}</span>`).join("")}</span>
          <span class="hf-skills">${skills.map((s) => `<span>${esc(s.name)}</span>`).join("")}</span>
          <span class="hf-open">Open status window →</span>
        </span>
      </button>`;
  }

  /* -------------------------------------------------------------- stats */
  function stats() {
    const vis = (t) => SLV.ofType(t).filter(SLV.visible);
    const chars = vis("character");
    const hunters = chars.filter((c) => c.rank && c.rank !== "-");
    const top = hunters.filter((c) => SLV.rank(c.rank).n >= 6);
    const links = (SLV.data.links || []).filter((l) => SLV.linkVisible(l) && SLV.visible(SLV.get(l.a)) && SLV.visible(SLV.get(l.b)));
    const rows = [
      ["Characters", chars.length, "archive.html#characters"],
      ["Ranked hunters", hunters.length, "hunters.html"],
      ["S-rank & above", top.length, "hunters.html"],
      ["Monarchs & Rulers", vis("monarch").length, "archive.html#monarchs"],
      ["Shadows", vis("shadow").length, "archive.html#shadows"],
      ["Gates & monsters", vis("gate").length + vis("monster").length, "archive.html#gates"],
      ["Weapons & skills", vis("item").length + vis("skill").length, "archive.html#items"],
      ["Connections", links.length, "network.html"]
    ];
    $("#stats").innerHTML = rows.map(([k, v, h], i) => `<a class="stat" href="${esc(SLV.page(h))}" style="--i:${i}"><dt>${k}</dt><dd data-count="${v}">${v}</dd></a>`).join("");
    if (!SLV.util.reducedMotion()) countUp();
  }
  function countUp() {
    $("#stats").querySelectorAll("[data-count]").forEach((el) => {
      const to = Number(el.dataset.count); const t0 = performance.now();
      const tick = (t) => { const p = Math.min(1, (t - t0) / 900); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
  }

  /* -------------------------------------------------------------- rails */
  function rails() {
    const chars = SLV.ofType("character").filter((c) => c.featured);
    $("#rail-characters").innerHTML = chars.map((e, i) => SLV.cardHTML(e, i)).join("");
    const shadows = SLV.ofType("shadow").filter((s) => s.featured);
    $("#rail-shadows").innerHTML = shadows.map((e, i) => SLV.cardHTML(e, i)).join("");
  }

  /* ----------------------------------------------------------- monarchs */
  function monarchs() {
    const list = SLV.ofType("monarch").filter((m) => m.featured);
    const hidden = list.filter((m) => !SLV.visible(m)).length;
    $("#monarch-sub").textContent = hidden
      ? `${hidden} of these records are manhwa spoilers. Turn on spoilers in the top bar to unseal them.`
      : "The nine kings and the beings of light whose war spills into the human world.";
    $("#monarchs").innerHTML = list.map((e, i) => SLV.cardHTML(e, i)).join("");
  }

  /* ------------------------------------------------------------- ladder */
  function ladder() {
    const list = SLV.ofType("character").filter((c) => SLV.visible(c) && SLV.rank(c.rank).n >= 5)
      .sort((a, b) => SLV.rank(b.rank).n - SLV.rank(a.rank).n || (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a._order - b._order)
      .slice(0, 9);
    $("#ladder").innerHTML = list.map((c, i) => {
      const r = SLV.rank(c.rank);
      const org = (c.orgs || []).map(SLV.org).filter((o) => o && SLV.visible(o))[0];
      return `<li><button type="button" class="ladder-row" data-id="${c.id}" style="--c:${r.color}">
        <span class="ladder-n">${String(i + 1).padStart(2, "0")}</span>
        <span class="rank${r.id === "National" ? " nat" : ""}" style="--c:${r.color}">${r.id === "National" ? "NAT" : r.id}</span>
        <span class="ladder-name">${esc(S.name(c))}<small>${esc(org ? org.name : c.country)}</small></span>
        <span class="ladder-role">${esc(c.role)}</span></button></li>`;
    }).join("");
  }

  /* ------------------------------------------------------------ explore */
  const TILES = [
    ["archive.html#characters", "Character Archive", "Profiles, ranks, abilities, history", "character"],
    ["hunters.html", "Hunter Database", "Rankings, guilds and countries", "character"],
    ["archive.html#monarchs", "Monarchs & Rulers", "The nine kings and the light", "monarch"],
    ["archive.html#shadows", "Shadow Army", "Grades, origins and evolution", "shadow"],
    ["archive.html#gates", "Gates & Dungeons", "Classes, red gates and raids", "gate"],
    ["archive.html#monsters", "Monsters & Bosses", "What waits beyond the gate", "monster"],
    ["archive.html#items", "Weapons & Equipment", "Daggers, swords and artifacts", "item"],
    ["archive.html#skills", "Skills & Abilities", "Arise, Stealth, Ruler's Authority", "skill"],
    ["timeline.html", "Timeline", "The history of the gate era", "timeline"],
    ["network.html", "Shadow Network", "The relationship map", "network"]
  ];
  function explore() {
    const count = (t) => t === "timeline" ? (SLV.data.timeline || []).filter((x) => x.sp !== "m" || SLV.spoilers.on).length
      : t === "network" ? SLV.all.filter((e) => ["character", "monarch", "shadow"].includes(e._type) && SLV.visible(e)).length
        : SLV.ofType(t).filter(SLV.visible).length;
    $("#explore").innerHTML = TILES.map(([href, name, sub, t], i) => {
      const col = t === "timeline" ? "#5ec8ff" : t === "network" ? "#b06bff" : (SLV.types[t] || {}).color;
      const n = href === "hunters.html" ? SLV.ofType("character").filter((c) => SLV.visible(c) && c.rank !== "-").length : count(t);
      return `<a class="tile sys reveal" href="${esc(SLV.page(href))}" style="--c:${col};--i:${i}">
        <span class="tile-n">${n}</span><span class="tile-name">${esc(name)}</span><span class="tile-sub">${esc(sub)}</span><span class="tile-go">→</span></a>`;
    }).join("");
    SLV.observeReveals($("#explore"));
  }

  /* ------------------------------------------------------------- latest */
  function latest() {
    const c = (SLV.data.world.changelog || [])[0];
    if (!c) { $(".latest").hidden = true; return; }
    $("#latest-date").textContent = c.date;
    $("#latest-note").textContent = c.note;
    $("#latest").innerHTML = c.ids.map(SLV.get).filter(Boolean).map((e) => `<button type="button" class="latest-item" data-id="${e.id}" style="--c:${SLV.colorOf(e)}">
      ${SLV.artHTML(e)}<span><b>${esc(S.name(e))}</b><small>${esc(SLV.visible(e) ? S.typeLabel(e) : "Manhwa spoiler")}</small></span></button>`).join("");
  }

  /* ---------------------------------------------------- typed System lines */
  const LINES = [
    "You have acquired the qualifications to be a Player. Will you accept?",
    "Daily Quest: Strength Training has arrived.",
    "Welcome, Player. The archive is ready for you."
  ];
  function typer() {
    const el = $("#sys-line");
    if (SLV.util.reducedMotion()) { el.textContent = LINES[0]; return; }
    let li = 0, ci = 0, del = false;
    const tick = () => {
      /* pause while the tab is hidden or the hero is scrolled away */
      if (document.hidden || window.scrollY > innerHeight * 1.5) return setTimeout(tick, 600);
      const line = LINES[li];
      if (!del) { ci++; el.textContent = line.slice(0, ci); if (ci >= line.length) { del = true; return setTimeout(tick, 2600); } }
      else { ci -= 3; el.textContent = line.slice(0, Math.max(0, ci)); if (ci <= 0) { del = false; li = (li + 1) % LINES.length; return setTimeout(tick, 350); } }
      setTimeout(tick, del ? 14 : 34);
    };
    tick();
  }

  /* -------------------------------------------------------- mana canvas */
  function mana() {
    const cv = $("#mana");
    const ctx = cv.getContext && cv.getContext("2d");
    if (!ctx || SLV.util.reducedMotion()) return;
    let w, h, dpr, parts = [], running = true, raf;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(120, (w * h) / 11000));
      parts = Array.from({ length: n }, () => spawn(true));
    };
    const spawn = (any) => ({
      x: Math.random() * w, y: any ? Math.random() * h : h + 10, r: Math.random() * 1.8 + .4,
      vy: -(Math.random() * .45 + .15), vx: (Math.random() - .5) * .15, a: Math.random() * .6 + .2,
      hue: Math.random() < .55 ? "94,200,255" : "176,107,255"
    });
    /* Pre-rendered glow sprites: one per hue, instead of a shadowBlur on
       every particle every frame (much cheaper on low-end phones). */
    const sprites = {};
    ["94,200,255", "176,107,255"].forEach((hue) => {
      const s = document.createElement("canvas"); s.width = s.height = 32;
      const g = s.getContext("2d"), grd = g.createRadialGradient(16, 16, 0, 16, 16, 16);
      grd.addColorStop(0, `rgba(${hue},1)`); grd.addColorStop(0.18, `rgba(${hue},.95)`); grd.addColorStop(0.45, `rgba(${hue},.28)`); grd.addColorStop(1, `rgba(${hue},0)`);
      g.fillStyle = grd; g.fillRect(0, 0, 32, 32); sprites[hue] = s;
    });
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      parts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) parts[i] = spawn(false);
        const d = p.r * 9;
        ctx.globalAlpha = p.a; ctx.drawImage(sprites[p.hue], p.x - d / 2, p.y - d / 2, d, d);
      });
      ctx.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener("resize", SLV.util.debounce(resize, 150));
    let onScreen = true;
    const sync = () => { running = onScreen && !document.hidden; cancelAnimationFrame(raf); if (running) draw(); };
    if ("IntersectionObserver" in window) new IntersectionObserver(([en]) => { onScreen = en.isIntersecting; sync(); }).observe(cv);
    document.addEventListener("visibilitychange", sync);
  }

  /* -------------------------------------------------------------- events */
  function bind() {
    document.addEventListener("click", (e) => {
      const card = e.target.closest("[data-id]");
      if (card && !e.target.closest(".viewer, .palette, .lightbox")) {
        const scope = card.closest(".rail, .monarch-grid, #ladder, #latest, #hero-feature");
        const list = scope ? [...scope.querySelectorAll("[data-id]")].map((x) => x.dataset.id) : [card.dataset.id];
        SLV.viewer.open(card.dataset.id, { list });
      }
      const rb = e.target.closest("[data-rail]");
      if (rb) {
        const rail = rb.closest(".section").querySelector(".rail");
        rail.scrollBy({ left: Number(rb.dataset.rail) * rail.clientWidth * .8, behavior: SLV.util.reducedMotion() ? "auto" : "smooth" });
      }
    });
    $("#random").addEventListener("click", () => {
      const pool = SLV.all.filter((e) => SLV.visible(e) && e._type !== "org");
      const pick = pool[Math.floor(Math.random() * pool.length)];
      SLV.viewer.open(pick.id);
    });
  }

  function renderAll() { heroFeature(); stats(); rails(); monarchs(); ladder(); explore(); latest(); }
  renderAll(); typer(); mana(); bind();
  SLV.spoilers.onChange(renderAll);
})();
