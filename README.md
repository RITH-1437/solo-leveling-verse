# Solo Leveling Verse: The Hunter & Monarch Archive

A static, interactive Solo Leveling encyclopedia: hunters, Monarchs & Rulers, the Shadow Army,
gates & dungeons, monsters, weapons, skills, a world timeline and the **Shadow Network**
relationship map. It is built on the same architecture as `../naruto-verse`, with its own
"System window" identity.

Currently **126 records**: 29 characters, 9 Monarchs + 3 Rulers/cosmic beings, 13 shadows,
12 gates & dungeons, 22 monsters, 11 items, 16 skills and 11 guilds/organisations, plus 28 timeline events
and 86 explicit relationships. In the default anime-safe mode 20 characters, 10 shadows and 45 relationships are visible.

## Run it

No build step, no dependencies, no backend.

- Double-click `index.html`, **or**
- serve the folder (VS Code Live Server, or `python -m http.server`) and open `index.html`.

`index.html` is the only page at the root; every other page lives in `html/`.

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
| `html/archive.html` | 7 collections behind tabs (`#characters`, `#monarchs`, `#shadows`, `#gates`, `#monsters`, `#items`, `#skills`), with search, per-tab facets, sort, anime/manhwa filter and pagination (`html/archive.html#shadows/2`) |
| `html/hunters.html` | Hunter Database: rank distribution, national-level & S-rank spotlight, sortable registry table, guild directory, hunters by country |
| `html/timeline.html` | Arc rail with scroll-spy, event-type filters, glowing progress spine, sealed manhwa events, deep links (`html/timeline.html#t_redgate`) |
| `html/network.html` | Shadow Network: pick anyone to put them in the centre, with their connections grouped into boxes (family, powers & origins, guilds, allies, rivals, enemies, Shadow Army) and curved lines to each; group toggles, a path trail, a find-anyone list, and a *Shadow Army* chart by grade (`html/network.html?focus=igris`, `html/network.html?layout=army`) |

On every page: **Ctrl/⌘ + K** or **/** opens the global search. Any record opens in the **status window**
(Overview / Abilities / Relations / History / Transformations), and **⛶ Full screen** shows its artwork
(shadows enter with an *ARISE* effect). `?view=<id>` deep-links any record on any page (`index.html?view=igris`, `html/hunters.html?view=cha_haein`).
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
├── index.html     the only page at the root
├── html/          archive.html  hunters.html  timeline.html  network.html  (they load ../css, ../js, ../assets)
├── css/
│   ├── system.css     design tokens, System window, buttons, cards, nav, search palette, viewer, lightbox, states
│   ├── home.css       dashboard          ├── archive.css   archive + hunter database
│   ├── timeline.css   timeline           └── network.css   Shadow Network
├── js/
│   ├── data/          world.js (ranks, grades, gate classes, orgs, arcs, changelog), characters.js,
│   │                  monarchs.js, shadows.js, gates.js (+ monsters), items.js, skills.js, timeline.js (+ links)
│   ├── media-index.js GENERATED list of files in assets/
│   ├── core.js        base path (SLV.base / SLV.path / SLV.page), registry, spoilers, relations graph, search, media lookup, sigil art, data validation
│   ├── viewer.js      status window + full-screen artwork
│   ├── shell.js       skip link, nav, global search, spoiler switch, toasts, cards, ?view= deep links
│   └── home.js  archive.js  hunters.js  timeline.js  network.js
├── assets/            characters/ hunters/ monarchs/ shadows/ weapons/ monsters/ backgrounds/ skills/ guilds/ videos/ icons/
└── tools/
    ├── build_media_index.py   rebuild js/media-index.js after changing assets/
    └── check_site.py          checks folder layout, links, script order, JS page links, media paths and data references
```

### Links and paths

Pages in `html/` sit one folder below the root, so `core.js` works out `SLV.base` (empty on `index.html`,
`../` in `html/`) from its own script URL. Build page links with `SLV.page("archive.html#shadows")`
(gives `html/archive.html#shadows`, or `index.html` for the dashboard) and root files with `SLV.path("assets/...")`.
Artwork paths in `js/media-index.js` stay root-relative and get the prefix automatically, over `http://` and `file://`.

`html/network.html` replaces the Naruto project's `scroll.html`: a parchment "scroll" doesn't fit this universe, and the
page is a network map, not a family tree.

## Adding or editing content

- **New record:** add an object to the matching file in `js/data/` with a unique `id`. A hunter whose grade the story
  never gives uses `rank: "?"` ("Rank not stated"); `"-"` is for people with no hunter grade. Cards, search, filters, the viewer,
  the network (for characters / Monarchs / shadows / guilds) and the hunter database pick it up automatically.
- **Relationships:** add `{ a, b, t, label, sp }` to `SLV.data.links` in `timeline.js`
  (`t`: family, spouse, ally, rival, enemy, shadow, origin, vessel, successor, creator, command, mount).
  Guild membership comes from each character's `orgs`, item ownership from `owners`, and skill users from `users`.
- **Timeline:** add `{ id, arc, when, kind, title, text, ids, sp }` to `SLV.data.timeline`.
- Run `python tools/check_site.py` afterwards. It reports any id that points at nothing. The browser console reports the same issues.

## Accuracy notes

Content keeps to facts from the anime and manhwa. Where the source was uncertain, details were left out
(for example unstated shadow grades show "Not stated"; Yogumunt has no epithet row).
Hunters whose grade or fate isn't given show "Rank not stated" / "Not stated" instead of a guess.
Two records are kept but marked **Unverified** (badged on cards and in the status window):

- **Shadow Scythe** (`js/data/items.js`): it isn't among the weapons Jinwoo uses in the original story.
- **Kamish (shadow)** (`js/data/shadows.js`): no reliable source confirms Jinwoo raising the long-dead dragon, and Shadow
  Extraction is known to fail on bodies that have been dead too long.

Lower-confidence details from the first release, worth checking against the source: Lennart Niermann's world ranking
and guild, the name of Goto Ryuji's guild (Draw Sword) and the shadow grades of Iron and Tank.

## Testing done

Last full run: 2026-11-27.

- `python tools/build_media_index.py` and `python tools/check_site.py`: folder layout (only `index.html` at the root),
  every local link and script resolved from each page's own folder, JS page links, 100 media files and 126 records'
  cross-references.
- Headless Chrome (cache disabled) on all 5 pages plus archive / network deep links, at 1440, 820, 390 and 320 px, in
  both spoiler modes: no console errors or warnings, no failed requests, no horizontal overflow.
- 128 automated checks: viewer tabs (incl. arrow / Home / End keys), prev / next, deep links, focus trap and focus return,
  lightbox (incl. focus trap), sealed text kept out of the DOM, global search incl. spoiler withholding and focus trap,
  skip link, archive search / facets / sort / pagination / tab keys / empty state, spoiler switch + persistence, hunter
  table sort / tier / country filters / keyboard rows, timeline reveal / filters / deep links, network focus / group
  toggles / Shadow Army chart / find / `?focus=` / `?layout=army` / radiogroup keys, reduced motion (static notification,
  idle particle canvas), and the mobile menu, viewer and network.
- Every link on `index.html` and on each `html/` page, the search palette's quick links and the viewer's timeline and
  network links, followed over both `http://` and `file://`: all load with no 404s, and artwork renders on `html/` pages.

Fan-made and non-commercial. *Solo Leveling* belongs to Chugong, DUBU (REDICE Studio) and the anime to A-1 Pictures.
