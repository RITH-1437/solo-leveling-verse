/* ==========================================================================
   SOLO LEVELING VERSE: the Shadow Army
   --------------------------------------------------------------------------
   grade      starting grade when first raised (world.shadowGrades), if known
   gradeTop   highest grade the story shows, if known
   origin     what the shadow was in life; originId links to another entity
   source     where Jinwoo extracted it (gates.js id)
   evolution  [{ grade, note, m }] the shadow's growth, in order
   canon      "unverified" marks a record whose place in the story isn't confirmed (badged in the UI)
   Artwork: assets/shadows/<id>.webp
   ========================================================================== */

window.SLV = window.SLV || {};
SLV.data = SLV.data || {};

SLV.data.shadows = [
  {
    id: "igris", name: "Igris", alt: ["Blood-Red Commander Igris"],
    titles: ["Blood-Red Commander", "Knight of the Shadow Army"], titlesM: ["Marshal of the Shadow Army"],
    grade: "Knight", gradeTop: "Marshal", origin: "The Blood-Red Commander, boss of the Job Change dungeon",
    source: "job_change_dungeon", first: "Anime S1 finale", arc: "jobchange", featured: true, color: "#ef4444",
    bio: "A crimson-plumed knight who guarded the Job Change dungeon and nearly killed Jinwoo. After his defeat he became the first great shadow of the army: a silent, absolutely loyal swordsman and Jinwoo's right hand.",
    bioM: "Igris rises to Marshal and wields the Demon King's Longsword, which Jinwoo hands to his best swordsman.",
    abilities: ["Master swordsmanship", "Knight commander"],
    evolution: [
      { grade: "Knight", note: "Raised after the Job Change quest." },
      { grade: "Marshal", note: "Promoted as the army grows into its full power.", m: 1 }
    ]
  },
  {
    id: "beru", name: "Beru", alt: ["The Ant King"],
    titles: ["Former Ant King of Jeju Island"], titlesM: ["Marshal of the Shadow Army"],
    grade: "", gradeTop: "Marshal", origin: "The Ant King born on Jeju Island", source: "jeju_island",
    first: "Anime S2 finale", arc: "jeju", featured: true, color: "#a78bfa",
    bio: "The Ant King, a monster that crushed S-rank hunters and devoured the healer Min Byung-gu to steal his healing magic. Jinwoo kills him and raises him with \"Arise\"; Beru swears loyalty to his new king. Fast, flying and fanatical, he can heal his allies.",
    bioM: "Beru reaches Marshal and becomes one of the army's two strongest commanders after Bellion.",
    abilities: ["Flight", "Extreme speed and claws", "Healing magic (from Min Byung-gu)", "Regeneration"],
    evolution: [
      { grade: "", note: "Raised after the Jeju Island raid." },
      { grade: "Marshal", note: "One of the army's top commanders.", m: 1 }
    ]
  },
  {
    id: "bellion", name: "Bellion", alt: [],
    titles: ["Grand Marshal of the Shadow Army"],
    grade: "Grand Marshal", gradeTop: "Grand Marshal", origin: "Ashborn's own commander", source: "",
    first: "Manhwa", arc: "monarchs", sp: "m", featured: true, color: "#c4b5fd",
    bio: "The strongest of all shadows and the only Grand Marshal, who served the Shadow Monarch Ashborn long before Jinwoo. When Ashborn's power passes to Jinwoo, Bellion and the old army kneel to their new king.",
    abilities: ["Swordsmanship", "Overwhelming strength", "Army command"],
    evolution: [{ grade: "Grand Marshal", note: "Already the army's highest-ranking shadow under Ashborn." }]
  },
  {
    id: "iron", name: "Iron", alt: [],
    titles: ["Shadow of Kim Chul"],
    grade: "Elite", gradeTop: "", origin: "Kim Chul, A-rank of the White Tiger Guild", originId: "kim_chul",
    source: "red_gate", first: "Anime Season 2", arc: "redgate", featured: true, color: "#9ca3af",
    bio: "The shadow of the A-rank hunter Kim Chul, raised in the Red Gate. As a shadow he keeps Kim Chul's heavy-armored fighting style and becomes a sturdy frontliner.",
    abilities: ["Heavy armor", "Frontline tanking"],
    evolution: [{ grade: "Elite", note: "Raised in the Red Gate." }]
  },
  {
    id: "tank", name: "Tank", alt: [],
    titles: ["Shadow of the Alpha Ice Bear"],
    grade: "Elite", gradeTop: "Knight", origin: "Leader of the ice bears in the Red Gate", source: "red_gate",
    first: "Anime Season 2", arc: "redgate", featured: true, color: "#bae6fd",
    bio: "The leader of the ice bears Jinwoo slew in the Red Gate. Jinwoo named him for his ability to soak up damage like a war tank.",
    abilities: ["Massive durability", "Crushing strength"],
    evolution: [
      { grade: "Elite", note: "Raised in the Red Gate." },
      { grade: "Knight", note: "Grows to Knight grade by the end of the series.", m: 1 }
    ]
  },
  {
    id: "tusk", name: "Tusk", alt: ["Kargalgan"],
    titles: ["Shadow of the High Orc Shaman"],
    grade: "", gradeTop: "", origin: "Kargalgan, a High Orc shaman", source: "orc_gate",
    first: "Anime Season 2", arc: "reawakening", featured: true, color: "#22c55e",
    bio: "Kargalgan, the High Orc shaman who led an orc gate's army. Jinwoo couldn't remember his name, so he called him Tusk for his huge tusks. Tusk is the army's mage, casting powerful magic from the back line.",
    abilities: ["Orc shamanic magic", "Buffs and area magic"],
    evolution: []
  },
  {
    id: "kaisel", name: "Kaisel", alt: ["Kaisellin"],
    titles: ["Shadow wyvern"],
    grade: "", gradeTop: "", origin: "Kaisellin, Demon King Baran's wyvern (the mount, not Baran himself)",
    source: "demon_castle", first: "Anime Season 2", arc: "demoncastle", featured: true, color: "#64748b",
    bio: "Baran's wyvern, raised as a shadow after Jinwoo defeated its master in the Demon Castle. Jinwoo wasn't sure of its original name, so he named it Kaisel. It is his flying mount, carrying him across the sky at high speed.",
    abilities: ["Flight", "Mount"],
    evolution: [{ grade: "", note: "Raised in the Demon Castle." }]
  },
  {
    id: "greed", name: "Greed", alt: [],
    titles: ["Shadow of Hwang Dongsoo"],
    grade: "", gradeTop: "", origin: "Hwang Dongsoo, S-rank of the Scavenger Guild", originId: "hwang_dongsoo",
    source: "", first: "Manhwa", arc: "ahjin", sp: "m", color: "#f43f5e",
    bio: "The shadow of the S-rank Hwang Dongsoo, raised after Jinwoo kills him. Jinwoo named him Greed.",
    abilities: ["S-rank combat strength"],
    evolution: []
  },
  {
    id: "kamish_shadow", name: "Kamish", alt: ["Khamish", "Shadow of Kamish"],
    titles: ["The dragon's shadow"],
    grade: "", gradeTop: "", origin: "Kamish, the dragon slain years before the story",
    source: "", first: "Unverified", arc: "japan", sp: "m", color: "#b91c1c", canon: "unverified",
    bio: "Unverified. This record says Jinwoo raised the long-dead dragon Kamish as a short-lived shadow, but no reliable source confirms that the scene happens in the manhwa, and Shadow Extraction is known to fail on bodies that have been dead too long. It stays as a marked placeholder until a source confirms it. Edit or remove it in js/data/shadows.js.",
    abilities: ["Dragon (in life)"],
    evolution: []
  },
  {
    id: "shadow_knights", name: "Shadow Knights", alt: ["The first shadows"],
    titles: ["The army's first soldiers"],
    grade: "", gradeTop: "", origin: "The knights who fought Jinwoo in the Job Change dungeon",
    source: "job_change_dungeon", first: "Anime S1 finale", arc: "jobchange", color: "#94a3b8",
    bio: "The armored knights who attacked Jinwoo wave after wave during his Job Change quest. Raised together with their commander Igris, they are the very first soldiers of the Shadow Army.",
    abilities: ["Swordsmanship", "Heavy armor"],
    evolution: [{ grade: "", note: "Raised at the end of the Job Change quest." }]
  },
  {
    id: "shadow_orcs", name: "Shadow High Orcs", alt: ["Orc shadows"],
    titles: ["The orc legion"],
    grade: "", gradeTop: "", origin: "The high orc army of Kargalgan's gate",
    source: "orc_gate", first: "Anime Season 2", arc: "reawakening", color: "#16a34a",
    bio: "The high orc warriors Jinwoo cut down along with their shaman Kargalgan. Raised as shadows, the orcs, far tougher than ordinary orcs, become a large part of his army, with Tusk as their mage.",
    abilities: ["Brute strength", "Numbers"],
    evolution: [{ grade: "", note: "Raised in the high orc gate." }]
  },
  {
    id: "shadow_ants", name: "Shadow Ants", alt: ["Ant shadows"],
    titles: ["The swarm of Jeju Island"],
    grade: "", gradeTop: "", origin: "The giant ants of the Jeju Island nest",
    source: "jeju_island", first: "Anime S2 finale", arc: "jeju", color: "#ca8a04",
    bio: "After the Jeju Island raid Jinwoo raises the nest's giant ants by the hundreds. The swarm that had held the island for years becomes one of the biggest units of his army, alongside its former king, Beru.",
    abilities: ["Numbers", "Hard carapaces"],
    evolution: [{ grade: "", note: "Raised after the Jeju Island raid." }]
  },
  {
    id: "shadow_infantry", name: "Shadow Infantry", alt: ["Shadow soldiers"],
    titles: ["The rank and file"],
    grade: "Normal", gradeTop: "", origin: "Monsters and soldiers Jinwoo has slain: knights, high orcs, ants and more", source: "",
    first: "Anime S1 finale", arc: "jobchange", color: "#6d28d9",
    bio: "The bulk of the army: hundreds, and later thousands, of soldiers raised from slain monsters. It began with the Job Change knights, grew with the high orcs and swelled above all on Jeju Island, where Jinwoo raised ants by the hundreds. Destroyed soldiers reform inside his shadow as long as he has mana.",
    abilities: ["Numbers", "Regenerate inside Jinwoo's shadow"],
    evolution: []
  }
];
