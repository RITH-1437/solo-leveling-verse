/* ==========================================================================
   SOLO LEVELING VERSE: core
   --------------------------------------------------------------------------
   Loaded on every page after js/data/*.js and js/media-index.js.
   Provides:
     SLV.util      escaping, accent-folding, storage, DOM helpers
     SLV.types     entity type registry (labels, asset folders, archive tabs)
     SLV.all/get   every entity, by id (ids are unique across the whole verse)
     SLV.spoilers  anime-safe vs manhwa mode, persisted per browser
     SLV.show      spoiler-aware display helpers (name, titles, bio, status)
     SLV.relations relationship graph derived from links, orgs, owners, users
     SLV.search    ranked global search
     SLV.media     artwork lookup through the generated media index
     SLV.sigil     generated "System" artwork for entries without a picture
     SLV.base      relative path from the current page to the site root
                   ("" for index.html, "../" for pages in html/)
     SLV.path(p)   root-relative path (assets/…, index.html) → usable href
     SLV.page(n)   page file name (archive.html#shadows) → href to html/<n>
   ========================================================================== */

(() => {
  "use strict";
  const SLV = (window.SLV = window.SLV || {});
  const D = SLV.data || {};

  /* ----------------------------------------------------------- base path */
  /* Worked out from where core.js itself was loaded (always <root>/js/core.js),
     so a page in any folder finds assets and other pages without a per-page
     setting. Works over http:// and file://. */
  SLV.base = (() => {
    try {
      const me = document.currentScript || [...document.scripts].find((s) => /js\/core\.js(\?|$)/.test(s.src));
      const root = new URL("../", me.src).href;
      const dir = new URL(".", location.href).href;
      if (!dir.startsWith(root)) return root;
      const depth = dir.slice(root.length).split("/").filter(Boolean).length;
      return "../".repeat(depth);
    } catch (e) { return typeof location !== "undefined" && /\/html\/[^/]*$/.test(location.pathname) ? "../" : ""; }
  })();
  const isAbs = (p) => /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(p);
  SLV.path = (p) => (!p || isAbs(p) ? p : SLV.base + p);
  SLV.page = (name) => {
    if (!name || isAbs(name)) return name;
    const file = name.split(/[?#]/)[0];
    return SLV.path(file === "index.html" ? name : "html/" + name);
  };

  /* ------------------------------------------------------------------ util */
  const util = {
    $: (sel, root = document) => root.querySelector(sel),
    $$: (sel, root = document) => [...root.querySelectorAll(sel)],
    esc: (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])),
    norm: (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/[-'’]/g, ""),
    debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; },
    hash(str) { let h = 2166136261; for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; },
    rng(seed) { let s = seed || 1; return () => ((s = Math.imul(s ^ (s >>> 15), 1 | s) + 0x6d2b79f5, ((s ^ (s >>> 14)) >>> 0) / 4294967296)); },
    store: {
      get(k, d = null) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
      set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked: keep in-memory only */ } }
    },
    initials(name) {
      const w = String(name).replace(/^The\s+/i, "").replace(/[^\p{L}\p{N} -]/gu, "").split(/[\s-]+/).filter(Boolean);
      return ((w[0] || "?")[0] + (w.length > 1 ? w[w.length - 1][0] : (w[0] || "")[1] || "")).toUpperCase();
    },
    reducedMotion: () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches
  };
  SLV.util = util;
  const { esc, norm } = util;

  /* ----------------------------------------------------------------- types */
  const P = (D.world && D.world.palette) || {};
  SLV.types = {
    character: { label: "Character", plural: "Characters", tab: "characters", folders: ["characters", "hunters"], color: P.character, glyph: "H" },
    monarch: { label: "Monarch", plural: "Monarchs & Rulers", tab: "monarchs", folders: ["monarchs"], color: P.monarch, glyph: "M" },
    shadow: { label: "Shadow", plural: "Shadow Army", tab: "shadows", folders: ["shadows"], color: P.shadow, glyph: "S" },
    gate: { label: "Gate", plural: "Gates & Dungeons", tab: "gates", folders: ["backgrounds"], color: P.gate, glyph: "G" },
    monster: { label: "Monster", plural: "Monsters & Bosses", tab: "monsters", folders: ["monsters"], color: P.monster, glyph: "B" },
    item: { label: "Equipment", plural: "Weapons & Equipment", tab: "items", folders: ["weapons"], color: P.item, glyph: "W" },
    skill: { label: "Skill", plural: "Skills & Abilities", tab: "skills", folders: ["skills"], color: P.skill, glyph: "K" },
    org: { label: "Organisation", plural: "Guilds & Factions", tab: "", folders: ["guilds"], color: "#7c5cff", glyph: "O" }
  };

  /* -------------------------------------------------------------- registry */
  const SOURCES = [
    ["character", D.characters], ["monarch", D.monarchs], ["shadow", D.shadows], ["gate", D.gates],
    ["monster", D.monsters], ["item", D.items], ["skill", D.skills],
    ["org", D.world && D.world.orgs]
  ];
  const all = [];
  const byId = new Map();
  const problems = [];
  SOURCES.forEach(([type, list]) => (list || []).forEach((e, i) => {
    e._type = type; e._order = i;
    if (byId.has(e.id)) problems.push(`duplicate id "${e.id}"`);
    byId.set(e.id, e); all.push(e);
  }));
  SLV.all = all;
  SLV.get = (id) => byId.get(id) || null;
  SLV.ofType = (type) => all.filter((e) => e._type === type);
  SLV.ready = all.length > 0 && !!D.world;

  /* ------------------------------------------------------------- spoilers */
  const listeners = [];
  SLV.spoilers = {
    on: util.store.get("slv-spoilers") === "on",
    set(on) {
      this.on = !!on;
      util.store.set("slv-spoilers", on ? "on" : "off");
      document.documentElement.classList.toggle("spoilers-on", this.on);
      listeners.forEach((fn) => { try { fn(this.on); } catch (e) { console.error(e); } });
    },
    onChange(fn) { listeners.push(fn); }
  };
  document.documentElement.classList.toggle("spoilers-on", SLV.spoilers.on);

  const isSpoiler = (e) => !!e && e.sp === "m";
  const visible = (e) => !!e && (!isSpoiler(e) || SLV.spoilers.on);
  const linkVisible = (l) => l.sp !== "m" || SLV.spoilers.on;
  SLV.isSpoiler = isSpoiler;
  SLV.visible = visible;
  SLV.linkVisible = linkVisible;

  /* Spoiler-aware display helpers. */
  const arcLabel = (id) => ((D.world.arcs || []).find((a) => a.id === id) || {}).label || "";
  SLV.show = {
    name: (e) => (!e ? "" : !visible(e) ? "Classified Entry" : (!SLV.spoilers.on && e.nameA) || e.name),
    alt: (e) => (!SLV.spoilers.on && e.altM) ? [] : (e.alt || []),
    titles: (e) => [...(e.titles || []), ...(SLV.spoilers.on ? e.titlesM || [] : [])],
    status: (e) => (SLV.spoilers.on && e.statusM) || e.status || "",
    hasHidden: (e) => !SLV.spoilers.on && !!(e.bioM || (e.titlesM && e.titlesM.length) || e.statusM ||
      (e.forms || []).some((f) => f.m) || (e.evolution || []).some((f) => f.m)),
    arc: arcLabel,
    typeLabel: (e) => (e._type === "monarch" && e.kind === "ruler") ? "Ruler" :
      (e._type === "character" && e.rank && e.rank !== "-") ? "Hunter" : (SLV.types[e._type] || {}).label || "",
    subtitle(e) {
      if (!visible(e)) return "Manhwa spoiler";
      switch (e._type) {
        case "character": return e.role || "";
        case "monarch": return SLV.spoilers.on || !isSpoiler(e) ? (SLV.spoilers.on ? e.domain : (e.titles || [])[0]) : "";
        case "shadow": return e.gradeTop && (SLV.spoilers.on || !(e.evolution || []).some((x) => x.m && x.grade === e.gradeTop))
          ? `${e.gradeTop}-grade shadow` : e.grade ? `${e.grade}-grade shadow` : "Shadow soldier";
        case "gate": return e.kind === "type" ? "Gate classification" : "Dungeon";
        case "monster": return { boss: "Dungeon boss", monster: "Monster", race: "Monster race" }[e.kind] || "Monster";
        case "item": return e.type || "";
        case "skill": return `${e.type} skill`;
        case "org": return e.kind === "guild" ? "Guild" : e.kind === "association" ? "Association" : "Faction";
        default: return "";
      }
    },
    /* Highest grade the viewer may see (Igris: Knight in anime mode, Marshal with spoilers). */
    grade(e) {
      if (e._type !== "shadow") return "";
      const evo = (e.evolution || []).filter((x) => x.grade && (!x.m || SLV.spoilers.on));
      return (evo.length ? evo[evo.length - 1].grade : e.grade) || "";
    }
  };

  /* ---------------------------------------------------------------- ranks */
  const W = D.world || {};
  SLV.rank = (id) => (W.ranks || []).find((r) => r.id === id) || (W.ranks || [])[W.ranks.length - 1] || { id: "-", label: "Unranked", n: 0, color: "#5b6478" };
  SLV.gradeN = (g) => ((W.shadowGrades || []).find((x) => x.id === g) || { n: 0 }).n;
  SLV.org = (id) => (W.orgs || []).find((o) => o.id === id) || null;
  SLV.colorOf = (e) => {
    if (!e) return "#7c5cff";
    if (e._type === "character") return SLV.rank(e.rank).n >= 6 ? SLV.rank(e.rank).color : (e.color || P.character);
    return e.color || (SLV.types[e._type] || {}).color || "#7c5cff";
  };

  /* ------------------------------------------------------------ relations */
  /* Every connection of one entity: explicit links plus everything implied by
     data (guild membership, item owners, skill users, shadow sources, homes). */
  const LINK_LABEL = {
    family: "Family", spouse: "Spouse", ally: "Ally", rival: "Rival", enemy: "Enemy", shadow: "Shadow soldier",
    origin: "Shadow origin", vessel: "Vessel", successor: "Successor", creator: "Creator", command: "Command", mount: "Mount"
  };
  function relations(id, { includeHidden = false } = {}) {
    const e = SLV.get(id);
    const out = [];
    const push = (other, t, label, sp) => {
      const o = SLV.get(other);
      if (!o || other === id) return;
      if (!includeHidden && (sp === "m" && !SLV.spoilers.on)) return;
      if (!includeHidden && !visible(o)) return;
      out.push({ id: other, t, label, sp: sp || o.sp || "" });
    };
    (D.links || []).forEach((l) => {
      if (l.a === id) push(l.b, l.t, l.label, l.sp);
      else if (l.b === id) push(l.a, l.t, l.label, l.sp);
    });
    if (e) {
      (e.orgs || []).forEach((o) => push(o, "member", "Member", (SLV.org(o) || {}).sp));
      if (e._type === "org") SLV.ofType("character").forEach((c) => (c.orgs || []).includes(id) && push(c.id, "member", "Member", c.sp));
      if (e._type === "org" && id === "shadow_army") SLV.ofType("shadow").forEach((s) => push(s.id, "member", "Shadow soldier", s.sp));
      if (e._type === "shadow") push("shadow_army", "member", "Faction");
      (e.weapons || []).forEach((w) => push(w, "wields", "Wields"));
      (e.abilities || e.powers || []).forEach((a) => typeof a === "string" && SLV.get(a) && push(a, "skill", "Skill"));
      if (e._type === "item") { (e.owners || []).forEach((o) => push(o, "wields", "Wielder")); if (e.from) push(e.from, "source", "Obtained from"); }
      if (e._type === "skill") (e.users || []).forEach((u) => push(u, "skill", "User"));
      if (e._type === "shadow") { if (e.originId) push(e.originId, "origin", "In life"); if (e.source) push(e.source, "source", "Raised at"); }
      if (e._type === "monster") { if (e.home) push(e.home, "source", "Found in"); if (e.becameShadow) push(e.becameShadow, "origin", "Became"); }
      if (e._type === "gate") ["bosses", "monsters", "shadows"].forEach((k) => (e[k] || []).forEach((m) => push(m, "source", k === "shadows" ? "Shadow raised here" : k === "bosses" ? "Boss" : "Inhabitant")));
      if (e._type === "monarch") (e.powers || []).forEach((p) => SLV.get(p) && push(p, "skill", "Power"));
      /* reverse lookups: who wields me, where am I from */
      all.forEach((o) => {
        if (o === e) return;
        if ((o.weapons || []).includes(id) && e._type === "item") return; // already via owners
        if (o._type === "item" && o.from === id) push(o.id, "source", "Yields");
        if (o._type === "shadow" && o.source === id && e._type !== "gate") push(o.id, "source", "Shadow raised here");
        if (o._type === "shadow" && o.originId === id) push(o.id, "origin", "Became");
        if (o._type === "monster" && o.becameShadow === id) push(o.id, "origin", "In life");
        if (o._type === "monster" && o.home === id && e._type !== "gate") push(o.id, "source", "Inhabitant");
        if (o._type === "item" && (o.owners || []).includes(id) && !(e.weapons || []).includes(o.id)) push(o.id, "wields", "Wields");
        if (o._type === "skill" && (o.users || []).includes(id) && !(e.abilities || e.powers || []).includes(o.id)) push(o.id, "skill", "Skill");
      });
    }
    const seen = new Set();
    return out.filter((r) => { const k = r.id + "|" + r.t; if (seen.has(k)) return false; seen.add(k); return true; });
  }
  SLV.relations = relations;
  SLV.linkLabel = (t) => LINK_LABEL[t] || ({ member: "Affiliation", wields: "Equipment", skill: "Skills", source: "Places & sources" }[t] || t);

  /* --------------------------------------------------------------- search */
  /* Two indexes per entity: `m` (everything) and `a` (anime-safe). The anime
     one leaves out manhwa-only names, titles and guilds, so a search such as
     "white flames" can't confirm a spoiler on an entry that is itself visible. */
  function haystack(e, m) {
    const anime = !m && !isSpoiler(e);
    return norm([anime && e.nameA ? "" : e.name, e.nameA, ...(anime && e.altM ? [] : e.alt || []), e.ko, ...(e.titles || []),
      ...(anime ? [] : [...(e.titlesM || []), e.domain, e.king]), e.role,
      e.type, e.kind, e.country, e.rank && SLV.rank(e.rank).label, e.origin, e.ability, e.bio,
      ...(e.orgs || []).map((o) => SLV.org(o) || {}).filter((o) => !anime || !isSpoiler(o)).map((o) => o.name)].filter(Boolean).join(" "));
  }
  const nameKey = (e, m) => {
    const anime = !m && !isSpoiler(e);
    return norm([anime && e.nameA ? "" : e.name, e.nameA, ...(anime && e.altM ? [] : e.alt || []), e.ko].filter(Boolean).join(" "));
  };
  all.forEach((e) => {
    const hay = { a: haystack(e, false), m: haystack(e, true) }, nm = { a: nameKey(e, false), m: nameKey(e, true) };
    e._hayAll = hay.m;
    Object.defineProperty(e, "_hay", { get: () => SLV.spoilers.on ? hay.m : hay.a, configurable: true });
    Object.defineProperty(e, "_name", { get: () => SLV.spoilers.on ? nm.m : nm.a, configurable: true });
  });
  /* Returns { results:[entity], hidden:Number }; hidden = spoiler matches withheld. */
  SLV.search = (q, { limit = 30, types = null } = {}) => {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return { results: [], hidden: 0 };
    let hidden = 0;
    const scored = [];
    all.forEach((e) => {
      if (types && !types.includes(e._type)) return;
      if (!terms.every((t) => e._hay.includes(t))) {
        /* matches only on manhwa details: count it as withheld, don't show it */
        if (terms.every((t) => e._hayAll.includes(t))) hidden++;
        return;
      }
      if (!visible(e)) { hidden++; return; }
      let s = 0;
      terms.forEach((t) => {
        if (e._name.startsWith(t)) s += 12;
        else if (new RegExp("(^|\\s)" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(e._name)) s += 8;
        else if (e._name.includes(t)) s += 5;
        else s += 1;
      });
      if (e.featured) s += 1.5;
      scored.push([s, e]);
    });
    scored.sort((a, b) => b[0] - a[0] || a[1].name.localeCompare(b[1].name));
    return { results: scored.slice(0, limit).map((x) => x[1]), hidden };
  };

  /* ---------------------------------------------------------------- media */
  const INDEX = Array.isArray(window.MEDIA_INDEX) ? new Set(window.MEDIA_INDEX) : null;
  const EXTS = ["webp", "png", "jpg", "jpeg", "avif"];
  SLV.media = {
    index: INDEX,
    /* Path of the entity's artwork if one exists in assets/, else null. */
    art(e) {
      if (!e) return null;
      if (e.image) return SLV.path(e.image);
      if (!INDEX) return null;
      for (const f of (SLV.types[e._type] || {}).folders || []) {
        for (const x of EXTS) { const p = `assets/${f}/${e.id}.${x}`; if (INDEX.has(p)) return SLV.path(p); }
      }
      return null;
    },
    video(e) {
      if (!e || !INDEX) return null;
      if (e.video && INDEX.has(e.video)) return SLV.path(e.video);
      for (const x of ["mp4", "webm"]) { const p = `assets/videos/${e.id}.${x}`; if (INDEX.has(p)) return SLV.path(p); }
      return null;
    }
  };

  /* ---------------------------------------------------------------- sigil */
  /* Generated artwork: a dark mana field, a rotating rune ring, an emblem for
     the entity type and its monogram. Deterministic per id. */
  const EMBLEM = {
    character: '<circle cx="150" cy="168" r="34"/><path d="M84 286c4-46 32-74 66-74s62 28 66 74z"/>',
    shadow: '<path d="M150 120c-34 0-52 26-52 58 0 20 6 34 14 44l-4 22h84l-4-22c8-10 14-24 14-44 0-32-18-58-52-58z"/><path d="M90 290c6-34 30-52 60-52s54 18 60 52z"/><path class="sg-eye" d="M128 178l14 6-14 4zM172 178l-14 6 14 4z"/>',
    monarch: '<path d="M88 250l-10-92 40 38 32-62 32 62 40-38-10 92z"/><rect x="88" y="258" width="124" height="16" rx="3"/>',
    ruler: '<circle cx="150" cy="200" r="30"/><path d="M150 120v30M150 250v30M70 200h30M200 200h30M93 143l21 21M186 236l21 21M93 257l21-21M186 164l21-21" stroke-width="8" stroke-linecap="round"/>',
    gate: '<ellipse cx="150" cy="200" rx="56" ry="86" fill="none" stroke-width="10"/><ellipse cx="150" cy="200" rx="34" ry="58" fill="none" stroke-width="5" opacity=".7"/><ellipse cx="150" cy="200" rx="14" ry="26" opacity=".85"/>',
    monster: '<path d="M96 128c22 40 30 92 18 150l14 2c10-60 2-112-20-154zM142 118c18 46 22 102 8 166h14c12-64 8-120-10-168zM190 128c16 44 16 96 2 150l14 4c14-56 14-110-4-156z"/>',
    item: '<path d="M150 104l14 116h-28z"/><rect x="112" y="220" width="76" height="12" rx="4"/><rect x="143" y="232" width="14" height="44" rx="3"/><circle cx="150" cy="286" r="9"/>',
    skill: '<path d="M150 112l56 88-56 88-56-88z" fill="none" stroke-width="8"/><path d="M150 150l26 50-26 50-26-50z"/>',
    org: '<path d="M150 112l72 30v52c0 46-32 78-72 94-40-16-72-48-72-94v-52z" fill="none" stroke-width="9"/><path d="M150 152l34 14v26c0 22-16 38-34 46-18-8-34-24-34-46v-26z"/>'
  };
  let sigilCount = 0;
  SLV.sigil = (e, { label = true } = {}) => {
    const type = e._type === "monarch" && e.kind === "ruler" ? "ruler" : e._type;
    const col = SLV.colorOf(e);
    const r = util.rng(util.hash(e.id));
    /* unique per drawing: the same entity can appear twice on a page, and
       duplicate gradient ids break when the first copy is hidden */
    const uid = "sg" + util.hash(e.id).toString(36) + "-" + (++sigilCount).toString(36);
    const ticks = Array.from({ length: 36 }, (_, i) => {
      const a = (i / 36) * Math.PI * 2, l = r() > 0.6 ? 14 : 6;
      const x1 = 150 + Math.cos(a) * 118, y1 = 200 + Math.sin(a) * 118;
      const x2 = 150 + Math.cos(a) * (118 - l), y2 = 200 + Math.sin(a) * (118 - l);
      return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
    }).join("");
    const rays = Array.from({ length: 5 }, () => {
      const x = 20 + r() * 260, w = 6 + r() * 26;
      return `<rect x="${x.toFixed(0)}" y="-20" width="${w.toFixed(0)}" height="440" opacity="${(0.04 + r() * 0.07).toFixed(2)}"/>`;
    }).join("");
    const dash = `${(4 + r() * 10).toFixed(0)} ${(3 + r() * 8).toFixed(0)}`;
    const mono = esc(util.initials(visible(e) ? SLV.show.name(e) : "??"));
    const emblem = visible(e) ? EMBLEM[type] || EMBLEM.character : '<text x="150" y="228" text-anchor="middle" font-size="92" font-weight="700">?</text>';
    return `<svg class="sigil" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="${uid}b" cx="50%" cy="46%" r="70%"><stop offset="0" stop-color="${col}" stop-opacity=".55"/><stop offset=".45" stop-color="${col}" stop-opacity=".12"/><stop offset="1" stop-color="#05050c" stop-opacity="0"/></radialGradient>
        <linearGradient id="${uid}f" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#05050c" stop-opacity="0"/><stop offset="1" stop-color="#05050c" stop-opacity=".92"/></linearGradient>
      </defs>
      <rect width="300" height="400" fill="#07071a"/>
      <rect width="300" height="400" fill="url(#${uid}b)"/>
      <g fill="${col}" transform="rotate(-12 150 200)">${rays}</g>
      <g class="sg-grid" stroke="${col}" stroke-opacity=".08">${Array.from({ length: 9 }, (_, i) => `<path d="M0 ${i * 50}H300M${i * 40} 0V400"/>`).join("")}</g>
      <g class="sg-ring" stroke="${col}" fill="none"><circle cx="150" cy="200" r="124" stroke-opacity=".5" stroke-dasharray="${dash}"/><path d="${ticks}" stroke-opacity=".6"/><circle cx="150" cy="200" r="98" stroke-opacity=".25"/></g>
      <g class="sg-emblem" fill="${col}" stroke="${col}" fill-opacity=".9" stroke-opacity=".9" style="filter:drop-shadow(0 0 10px ${col})">${emblem}</g>
      <rect width="300" height="400" fill="url(#${uid}f)"/>
      ${label ? `<text class="sg-mono" x="22" y="380" fill="${col}" font-size="34" font-weight="700" letter-spacing="3">${mono}</text>` : ""}
    </svg>`;
  };

  /* Artwork markup: real image when indexed, otherwise the sigil. */
  SLV.artHTML = (e, { cls = "", eager = false } = {}) => {
    const src = visible(e) ? SLV.media.art(e) : null;
    return `<span class="art ${cls}${src ? " has-img" : ""}" style="--c:${SLV.colorOf(e)}">${SLV.sigil(e)}${src
      ? `<img src="${esc(src)}" alt="" decoding="async" ${eager ? "" : 'loading="lazy"'} onload="this.parentNode.classList.add('img-ready')" onerror="this.remove()">` : ""}</span>`;
  };

  /* -------------------------------------------------------------- validate */
  /* Data-integrity check; reports broken references once in the console. */
  function validate() {
    const need = (id, where) => { if (id && !byId.has(id)) problems.push(`${where} → unknown id "${id}"`); };
    all.forEach((e) => {
      (e.abilities || []).forEach((a) => typeof a === "string" && /^[a-z_]+$/.test(a) && need(a, e.id + ".abilities"));
      (e.weapons || []).forEach((w) => need(w, e.id + ".weapons"));
      (e.orgs || []).forEach((o) => need(o, e.id + ".orgs"));
      (e.owners || []).forEach((o) => need(o, e.id + ".owners"));
      (e.users || []).forEach((o) => need(o, e.id + ".users"));
      ["bosses", "monsters", "shadows"].forEach((k) => (e[k] || []).forEach((m) => need(m, e.id + "." + k)));
      ["source", "originId", "home", "becameShadow", "from"].forEach((k) => e[k] && need(e[k], e.id + "." + k));
      if (e.arc && !(W.arcs || []).some((a) => a.id === e.arc)) problems.push(`${e.id}.arc → unknown arc "${e.arc}"`);
    });
    (D.links || []).forEach((l, i) => { need(l.a, `links[${i}].a`); need(l.b, `links[${i}].b`); });
    (D.timeline || []).forEach((t) => (t.ids || []).forEach((id) => need(id, t.id + ".ids")));
    if (problems.length) console.warn("[Solo Leveling Verse] data problems:\n" + problems.join("\n"));
    return problems;
  }
  SLV.validate = validate;
  if (SLV.ready) validate();

  /* ------------------------------------------------------------------ urls */
  SLV.url = {
    view: (id) => { const u = new URL(location.href); u.searchParams.set("view", id); return u.pathname.split("/").pop() + u.search + u.hash; },
    archive: (tab) => SLV.page(`archive.html#${tab}`),
    network: (id) => SLV.page(`network.html${id ? "?focus=" + encodeURIComponent(id) : ""}`),
    timeline: (id) => SLV.page(`timeline.html${id ? "#" + encodeURIComponent(id) : ""}`)
  };
})();
