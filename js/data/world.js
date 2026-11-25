/* ==========================================================================
   SOLO LEVELING VERSE — world taxonomy
   --------------------------------------------------------------------------
   Shared vocabularies every other data file refers to: hunter ranks, shadow
   grades, gate classes, organisations, countries, spoiler tiers and story arcs.
   The entity files (characters.js, monarchs.js, …) push into SLV.data.

   SPOILER TIERS
     anime  — covered by the anime, Season 1 + Season 2 "Arise from the Shadow"
              (Double Dungeon → Jeju Island raid, roughly manhwa ch. 1–110).
     manhwa — only in the manhwa / novel beyond that point.
   Any entity may carry `sp: "m"` (whole entry is a manhwa spoiler); text fields
   may have a `...M` twin (bioM, titlesM) holding manhwa-only details.
   ========================================================================== */

window.SLV = window.SLV || {};
SLV.data = SLV.data || {};

SLV.data.world = {
  title: "Solo Leveling Verse",
  tagline: "The Hunter & Monarch Archive",

  /* Hunter ranks, strongest first. `n` orders sorts. */
  ranks: [
    { id: "National", label: "National Level", n: 7, color: "#e8f1ff", note: "Hunters whose strength exceeds the S-rank scale; each is counted as a national asset." },
    { id: "S", label: "S-Rank", n: 6, color: "#f6c453", note: "The highest official grade of the Hunter Association." },
    { id: "A", label: "A-Rank", n: 5, color: "#ff5d6c", note: "Elite hunters who lead raids on high-grade gates." },
    { id: "B", label: "B-Rank", n: 4, color: "#b67cff", note: "Experienced raid members and specialists." },
    { id: "C", label: "C-Rank", n: 3, color: "#4f8dff", note: "Mid-grade hunters, the backbone of most raids." },
    { id: "D", label: "D-Rank", n: 2, color: "#3ed598", note: "Low-grade hunters." },
    { id: "E", label: "E-Rank", n: 1, color: "#8b95ad", note: "The weakest awakened grade." },
    { id: "-", label: "Unranked", n: 0, color: "#5b6478", note: "Not an awakened hunter, or no official grade." }
  ],

  /* Shadow soldier grades, lowest → highest. */
  shadowGrades: [
    { id: "Normal", n: 1 }, { id: "Elite", n: 2 }, { id: "Knight", n: 3 },
    { id: "Elite Knight", n: 4 }, { id: "Commander", n: 5 }, { id: "Marshal", n: 6 },
    { id: "Grand Marshal", n: 7 }
  ],

  /* Gate / dungeon classification (by measured mana output). */
  gateClasses: [
    { id: "S", label: "S-Class Gate", color: "#f6c453", note: "Catastrophic. A dungeon break at this grade can cost a city — Jeju Island fell to one." },
    { id: "A", label: "A-Class Gate", color: "#ff5d6c", note: "Raided by top guilds with A- and S-rank hunters." },
    { id: "B", label: "B-Class Gate", color: "#b67cff", note: "Dangerous; usually cleared by guild strike teams." },
    { id: "C", label: "C-Class Gate", color: "#4f8dff", note: "Mid-grade; cleared by mixed parties." },
    { id: "D", label: "D-Class Gate", color: "#3ed598", note: "Low-grade; often raided by small parties of low-rank hunters." },
    { id: "E", label: "E-Class Gate", color: "#8b95ad", note: "The weakest gates, yet still lethal to the unprepared." }
  ],

  /* Organisations. kind: guild | association | faction. */
  orgs: [
    { id: "ahjin", name: "Ahjin Guild", kind: "guild", country: "South Korea", color: "#7c5cff", sp: "m",
      note: "Sung Jinwoo's guild, with Yoo Jinho as vice guild master." },
    { id: "hunters_guild", name: "Hunters Guild", kind: "guild", country: "South Korea", color: "#ff7a45",
      note: "One of Korea's top guilds, led by Choi Jong-In with Cha Hae-In as vice guild master." },
    { id: "white_tiger", name: "White Tiger Guild", kind: "guild", country: "South Korea", color: "#e8e8f0",
      note: "A major Korean guild led by the beast-type S-rank Baek Yoonho." },
    { id: "kha", name: "Korean Hunters Association", kind: "association", country: "South Korea", color: "#4f8dff",
      note: "The national body that measures ranks, monitors gates and polices hunters. Chaired by Go Gunhee." },
    { id: "scavenger", name: "Scavenger Guild", kind: "guild", country: "United States", color: "#c9a24a", sp: "m",
      note: "America's strongest guild, led by Thomas Andre." },
    { id: "shadow_army", name: "Shadow Army", kind: "faction", country: "—", color: "#8b5cf6",
      note: "The soldiers of the Shadow Monarch, raised from the dead by Shadow Extraction." },
    { id: "monarchs", name: "The Monarchs", kind: "faction", country: "—", color: "#e0443e", sp: "m",
      note: "Nine kings of destruction, each ruling an army of their own kind." },
    { id: "rulers", name: "The Rulers", kind: "faction", country: "—", color: "#ffe9a8", sp: "m",
      note: "Beings of light who serve the Absolute Being and war against the Monarchs." }
  ],

  countries: [
    { id: "South Korea", flag: "KR" }, { id: "United States", flag: "US" }, { id: "China", flag: "CN" },
    { id: "India", flag: "IN" }, { id: "Japan", flag: "JP" }, { id: "Germany", flag: "DE" }, { id: "—", flag: "—" }
  ],

  /* Story arcs in order. `sp` marks arcs beyond the anime. */
  arcs: [
    { id: "pre", label: "Before the Story", short: "Pre-story" },
    { id: "double", label: "Double Dungeon", short: "S1" },
    { id: "awakening", label: "The Player Awakens", short: "S1" },
    { id: "jobchange", label: "Job Change", short: "S1 finale" },
    { id: "reawakening", label: "Reawakening", short: "S2" },
    { id: "redgate", label: "Red Gate", short: "S2" },
    { id: "demoncastle", label: "Demon Castle", short: "S2" },
    { id: "jeju", label: "Jeju Island Raid", short: "S2 finale" },
    { id: "ahjin", label: "Ahjin Guild", short: "Manhwa", sp: "m" },
    { id: "japan", label: "Japan Crisis", short: "Manhwa", sp: "m" },
    { id: "monarchs", label: "Monarchs War", short: "Manhwa", sp: "m" },
    { id: "epilogue", label: "Epilogue", short: "Manhwa", sp: "m" }
  ],

  /* Faction colours used for cards, nodes and sigil art. */
  palette: {
    character: "#4f8dff", hunter: "#4f8dff", monarch: "#e0443e", ruler: "#ffe9a8",
    shadow: "#8b5cf6", gate: "#22d3ee", monster: "#f97316", item: "#a78bfa", skill: "#38bdf8"
  },

  /* What changed on the site, newest first. "Latest additions" reads the top entry. */
  changelog: [
    { date: "2026-11-25", note: "Archive opened: Monarchs War spoilers, Shadow Army grades and the Shadow Network.",
      ids: ["antares", "bellion", "kamishs_wrath", "monarchs_domain", "thomas_andre", "legia", "jeju_island", "demon_castle"] }
  ]
};
