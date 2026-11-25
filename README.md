# Solo Leveling Verse — The Hunter & Monarch Archive

A static, interactive Solo Leveling encyclopedia: hunters, Monarchs & Rulers, the Shadow Army,
gates & dungeons, monsters, weapons, skills, a world timeline and the **Shadow Network**
relationship map. It is built on the same architecture as `../naruto-verse`, with its own
"System window" identity.

Currently **103 records**: 25 characters, 9 Monarchs + 3 Rulers/cosmic beings, 10 shadows,
11 gates & dungeons, 16 monsters, 9 items, 12 skills, 23 timeline events and 65 explicit relationships.

## Run it

No build step, no dependencies, no backend.

- Double-click `index.html`, **or**
- serve the folder (VS Code Live Server, or `python -m http.server`) and open `index.html`.

Only Google Fonts load from a CDN. Everything else is local, and the site works offline and from `file://`.

## Spoilers: anime vs manhwa

The site is **anime-safe by default** (Season 1 + Season 2 *Arise from the Shadow*, i.e. the
Double Dungeon through the Jeju Island raid, roughly manhwa ch. 1–110).
The **Manhwa spoilers** switch in the top bar (remembered per browser) unseals the rest:

- whole records marked `sp: "m"` show as locked "Classified" cards until then, and never appear in search results;
- text fields have manhwa twins (`bioM`, `titlesM`, `statusM`, `forms[].m`, `evolution[].m`), shown as a sealed block with a *Reveal this once* button (the text isn't added to the page until revealed, so screen readers and find-in-page can't read it);
- search uses an anime-safe index in anime mode: manhwa-only names, titles and guilds don't match, and are counted as withheld instead;
- relationships and timeline events with `sp: "m"` are hidden or sealed;
- Ashborn appears as "The Shadow Monarch" (`nameA`) until spoilers are on.

## Pages

| Page | What it does |
|---|---|
| `index.html` | Dashboard: hero with typed System notifications and mana particles, world stats, featured hunters, Monarchs, top-hunter ladder, Shadow Army rail, explore grid, latest additions |
| `archive.html` | 7 collections behind tabs (`#characters`, `#monarchs`, `#shadows`, `#gates`, `#monsters`, `#items`, `#skills`), with search, per-tab facets, sort, anime/manhwa filter and pagination (`#shadows/2`) |
| `hunters.html` | Hunter Database: rank distribution, national-level & S-rank spotlight, sortable registry table, guild directory, hunters by country |
| `timeline.html` | Arc rail with scroll-spy, event-type filters, glowing progress spine, sealed manhwa events, deep links (`timeline.html#t_redgate`) |
| `network.html` | Shadow Network: SVG map with 5 toggleable layers, *Universe* vs *Shadow Army hierarchy* layouts, pan / wheel / pinch zoom, detail panel, find-a-node (`?focus=igris&layout=army`) |

On every page: **Ctrl/⌘ + K** or **/** opens the global search. Any record opens in the **status window**
(Overview / Abilities / Relations / History / Transformations), and **⛶ Full screen** shows its artwork
(shadows enter with an *ARISE* effect). `?view=<id>` deep-links any record on any page.
**Esc** closes, and **← / →** step through the current list.

## Adding artwork (character / hunter / Monarch / shadow pictures)

The site has no bundled artwork, and nothing is hotlinked. Until you add a picture, each record shows a
generated "sigil" (rank- or faction-coloured emblem). To add real art:

1. Save the image as **`<id>.webp`** (`.png`, `.jpg`, `.avif` also work) in the folder for its type:

   | Record type | Folder | Example |
   |---|---|---|
   | Characters & hunters | `assets/characters/` (or `assets/hunters/`) | `assets/characters/sung_jinwoo.webp` |
   | Monarchs & Rulers | `assets/monarchs/` | `assets/monarchs/antares.webp` |
   | Shadows | `assets/shadows/` | `assets/shadows/igris.webp` |
   | Weapons & items | `assets/weapons/` | `assets/weapons/kamishs_wrath.webp` |
   | Monsters & bosses | `assets/monsters/` | `assets/monsters/ant_king.webp` |
   | Gates & dungeons | `assets/backgrounds/` | `assets/backgrounds/jeju_island.webp` |
   | Skills | `assets/skills/` | `assets/skills/shadow_extraction.webp` |
   | Guild logos (square, transparent) | `assets/guilds/` | `assets/guilds/white_tiger.webp` |

   The `id` is the `id:` field in `js/data/*.js` (lowercase, underscores). Portrait images (3:4, about 900×1200,
   under ~300 KB) look best.
2. Run **`python tools/build_media_index.py`**. A new file stays invisible until you rebuild the index. The script
   also warns about files whose name matches no id.
3. Reload. The picture now appears on cards, in the status window, in full screen and as the node image on the Shadow Network.

To use a different filename, set `image: "assets/…"` on the record instead.

## Project structure

```text
solo-leveling-verse/
├── index.html  archive.html  hunters.html  timeline.html  network.html
├── css/
│   ├── system.css     design tokens, System window, buttons, cards, nav, search palette, viewer, lightbox, states
│   ├── home.css       dashboard          ├── archive.css   archive + hunter database
│   ├── timeline.css   timeline           └── network.css   Shadow Network
├── js/
│   ├── data/          world.js (ranks, grades, gate classes, orgs, arcs, changelog), characters.js,
│   │                  monarchs.js, shadows.js, gates.js (+ monsters), items.js, skills.js, timeline.js (+ links)
│   ├── media-index.js GENERATED list of files in assets/
│   ├── core.js        registry, spoilers, relations graph, search, media lookup, sigil art, data validation
│   ├── viewer.js      status window + full-screen artwork
│   ├── shell.js       nav, footer, global search, spoiler switch, toasts, cards, ?view= deep links
│   └── home.js  archive.js  hunters.js  timeline.js  network.js
├── assets/            characters/ hunters/ monarchs/ shadows/ weapons/ monsters/ backgrounds/ skills/ guilds/ videos/ icons/
└── tools/
    ├── build_media_index.py   rebuild js/media-index.js after changing assets/
    └── check_site.py          checks links, script order, media paths and every data reference
```

`network.html` replaces the Naruto project's `scroll.html`: a parchment "scroll" doesn't fit this universe, and the
page is a network map, not a family tree.

## Adding or editing content

- **New record:** add an object to the matching file in `js/data/` with a unique `id`. Cards, search, filters, the viewer,
  the network (for characters / Monarchs / shadows / guilds) and the hunter database pick it up automatically.
- **Relationships:** add `{ a, b, t, label, sp }` to `SLV.data.links` in `timeline.js`
  (`t`: family, spouse, ally, rival, enemy, shadow, origin, vessel, successor, creator, command, mount).
  Guild membership comes from each character's `orgs`, item ownership from `owners`, and skill users from `users`.
- **Timeline:** add `{ id, arc, when, kind, title, text, ids, sp }` to `SLV.data.timeline`.
- Run `python tools/check_site.py` afterwards. It reports any id that points at nothing. The browser console reports the same issues.

## Accuracy notes

Content keeps to facts from the anime and manhwa. Where the source was uncertain, details were left out
(for example unstated shadow grades show "Not stated"; Yogumunt's epithet is "—").
**Shadow Scythe** is kept on request but marked **Unverified**: it isn't among the weapons Jinwoo uses in the original story.
Edit or remove it in `js/data/items.js`.

## Testing done

- `tools/check_site.py`: all local links, script order and 103 records' cross-references resolve.
- Headless Chrome on all 5 pages at desktop (1440), tablet (820) and mobile (390): no console errors, no failed
  requests, no horizontal overflow.
- 68 automated interaction checks: viewer tabs, deep links, keyboard, lightbox, global search incl. spoiler
  withholding, archive search / facets / sort / pagination / empty state, spoiler switch + persistence, hunter table
  sort and filters, timeline reveal / filters / deep link, network zoom / pan / select / layers / army layout / find /
  `?focus=`, and the mobile menu, viewer and network.
- Artwork pipeline verified over `http://` and `file://` with a test image (removed afterwards).

Fan-made and non-commercial. *Solo Leveling* belongs to Chugong, DUBU (REDICE Studio) and the anime to A-1 Pictures.
