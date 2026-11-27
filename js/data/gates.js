/* ==========================================================================
   SOLO LEVELING VERSE: gates, dungeons & monsters
   --------------------------------------------------------------------------
   gates[]     kind: "type" (a category of gate) | "dungeon" (a specific place/event)
               cls = gate class (world.gateClasses) when known
               bosses[] / monsters[] = monster ids below; shadows[] raised there
   monsters[]  kind: "boss" | "monster" | "race"; home = gate id
   Artwork: assets/backgrounds/<gate id>.webp, assets/monsters/<monster id>.webp
   ========================================================================== */

window.SLV = window.SLV || {};
SLV.data = SLV.data || {};

SLV.data.gates = [
  /* ------------------------------------------------------- gate categories */
  {
    id: "standard_gate", kind: "type", name: "Gates", alt: ["Blue gates"], cls: "",
    titles: ["Portals to the dungeons"], first: "Anime S1 E1", arc: "pre", color: "#22d3ee",
    bio: "Rifts that began appearing around the world about ten years before the story, linking Earth to dungeons full of monsters. The Hunter Association grades each gate from E to S by the mana it gives off, and hunters clear them by killing the dungeon's boss, which closes the gate."
  },
  {
    id: "dungeon_break", kind: "type", name: "Dungeon Break", alt: [], cls: "",
    titles: ["When a gate is left uncleared"], first: "Anime Season 1", arc: "pre", color: "#f97316",
    bio: "If a gate is not cleared in time, its monsters pour out into the world. A dungeon break from a high-grade gate is a disaster: the S-class break on Jeju Island cost Korea the entire island."
  },
  {
    id: "red_gate", kind: "type", name: "Red Gate", alt: [], cls: "",
    titles: ["A gate that will not let you leave"], first: "Anime Season 2", arc: "redgate", color: "#ef4444", featured: true,
    bio: "A rare, dangerous gate whose entrance turns red after hunters enter, cutting them off from the outside. No help can come in and no one can get out until the dungeon is cleared, and its true grade may be far above what was measured.",
    monsters: ["ice_elves", "alpha_ice_bear"], bosses: ["baruka"], shadows: ["iron", "tank"]
  },
  {
    id: "instant_dungeon", kind: "type", name: "Instant Dungeons", alt: ["System dungeons"], cls: "",
    titles: ["Dungeons only the Player can enter"], first: "Anime Season 1", arc: "awakening", color: "#38bdf8",
    bio: "Dungeons created by the System for Jinwoo alone, entered with keys he earns or buys. They let him train and level in secret. The Demon Castle is one of them."
  },
  {
    id: "penalty_zone", kind: "type", name: "Penalty Zone", alt: [], cls: "",
    titles: ["Punishment for an incomplete Daily Quest"], first: "Anime Season 1", arc: "awakening", color: "#eab308",
    bio: "Where the System sends Jinwoo when he fails his Daily Quest: a desert where he must survive for four hours while giant centipedes hunt him. Fear of it is why he never skips his push-ups, sit-ups, squats and run again.",
    monsters: ["giant_centipedes"]
  },

  /* ----------------------------------------------------- specific dungeons */
  {
    id: "double_dungeon", kind: "dungeon", name: "The Double Dungeon", alt: ["Cartenon Temple"], cls: "",
    titles: ["A hidden dungeon within a dungeon"], first: "Anime S1 E1–E2", arc: "double", color: "#22d3ee", featured: true,
    bio: "A low-grade raid hid a second dungeon: the Cartenon Temple, ruled by a giant statue and stone guardians, with three commandments carved at its gate: worship the god, praise the god, prove your faith. Most of the party died there. Jinwoo, offered a choice at death's door, woke up in hospital as the Player.",
    bosses: ["statue_of_god"], monsters: ["stone_statues"]
  },
  {
    id: "job_change_dungeon", kind: "dungeon", name: "Job Change Dungeon", alt: [], cls: "",
    titles: ["The trial for Jinwoo's class"], first: "Anime S1 finale", arc: "jobchange", color: "#ef4444",
    bio: "The System's Job Change quest drops Jinwoo into an endless wave of undead knights and mages, and finally into a duel with the Blood-Red Commander Igris. Surviving earns him the hidden class bound to shadows and his first Shadow Extraction.",
    bosses: ["igris_knight"], monsters: ["job_change_knights"], shadows: ["igris", "shadow_knights", "shadow_infantry"]
  },
  {
    id: "orc_gate", kind: "dungeon", name: "High Orc Gate", alt: [], cls: "",
    titles: ["Home of Kargalgan"], first: "Anime Season 2", arc: "reawakening", color: "#22c55e",
    bio: "A gate full of high orcs under the shaman Kargalgan. Jinwoo slays the orc army and raises Kargalgan as his shadow mage, Tusk.",
    bosses: ["kargalgan"], monsters: ["high_orcs"], shadows: ["tusk", "shadow_orcs"]
  },
  {
    id: "red_gate_incident", kind: "dungeon", name: "The Red Gate Incident", alt: [], cls: "",
    titles: ["Trapped in a frozen world"], first: "Anime Season 2", arc: "redgate", color: "#ef4444",
    bio: "A group of hunter trainees, led by the A-rank Kim Chul, is trapped with Jinwoo in a Red Gate: a frozen land of ice elves and ice bears. When Kim Chul turns on the others, Jinwoo kills him, then defeats the elf chief Baruka to clear the gate.",
    bosses: ["baruka"], monsters: ["ice_elves", "alpha_ice_bear"], shadows: ["iron", "tank"]
  },
  {
    id: "demon_castle", kind: "dungeon", name: "Demon Castle", alt: ["Demon's Castle"], cls: "",
    titles: ["A hundred floors to the Demon King"], first: "Anime Season 2", arc: "demoncastle", color: "#a855f7", featured: true,
    bio: "A huge instant dungeon Jinwoo climbs floor by floor to collect the Holy Water of Life that can cure his mother. Its guardian Cerberus, the demon noble Vulcan, and finally Demon King Baran at the summit stand in his way.",
    bosses: ["cerberus", "vulcan", "baran"], monsters: ["demons", "kaisellin"], shadows: ["kaisel"]
  },
  {
    id: "jeju_island", kind: "dungeon", name: "Jeju Island", alt: ["The Ant Nest"], cls: "S",
    titles: ["The S-class gate that took an island"], first: "Anime Season 2", arc: "jeju", color: "#f6c453", featured: true,
    bio: "Years before the story an S-class gate on Jeju Island broke, and giant ants overran the island. Raids failed and the island was abandoned until Korea's top hunters and a Japanese team launched a new raid. The Ant Queen's newborn king, the Ant King, slaughtered hunters until Jinwoo arrived and turned the ants into his army.",
    bosses: ["ant_queen", "ant_king"], monsters: ["jeju_ants"], shadows: ["beru", "shadow_ants", "shadow_infantry"]
  },
  {
    id: "japan_gate", kind: "dungeon", name: "The Giants' Gate in Japan", alt: ["Japan Crisis"], cls: "S",
    titles: ["The gate that nearly took Japan"], first: "Manhwa", arc: "japan", sp: "m", color: "#d6a35c",
    bio: "An S-class gate in Japan releases an army of giants. With Goto Ryuji and many of Japan's top hunters already lost on Jeju Island, the country cannot hold them back alone. Sung Jinwoo and his army step in, and the crisis ends with the death of the giants' king, Legia.",
    bosses: ["legia"], monsters: ["giants"]
  }
];

SLV.data.monsters = [
  { id: "statue_of_god", kind: "boss", name: "Statue of God", alt: ["The God Statue"], home: "double_dungeon",
    first: "Anime S1 E1–E2", arc: "double", color: "#e2e8f0", featured: true,
    bio: "The giant smiling statue on the throne of the Cartenon Temple. Its eyes fire beams that slaughter hunters who break the temple's commandments.",
    bioM: "The statues of the Double Dungeon were the Architect's work, built to test candidates for the Shadow Monarch's power." },
  { id: "stone_statues", kind: "monster", name: "Stone Statues", alt: [], home: "double_dungeon",
    first: "Anime S1 E1–E2", arc: "double", color: "#94a3b8",
    bio: "The temple's carved guardians (musicians, a sword-bearer and more) that come alive and kill anyone who doesn't follow the commandments." },
  { id: "steel_fanged_lycan", kind: "monster", name: "Steel-Fanged Lycans", alt: ["Lycans"], home: "instant_dungeon",
    first: "Anime Season 1", arc: "awakening", color: "#64748b",
    bio: "Wolf-like beasts with steel-hard fangs that fill the first instant dungeon Jinwoo enters, an early hunting ground where he levels up in secret." },
  { id: "giant_centipedes", kind: "monster", name: "Giant Centipedes", alt: [], home: "penalty_zone",
    first: "Anime Season 1", arc: "awakening", color: "#eab308",
    bio: "Enormous centipedes that burrow through the Penalty Zone's sand, hunting Jinwoo for four hours." },
  { id: "kasaka", kind: "boss", name: "Kasaka", alt: ["Rasaka"], home: "", first: "Anime Season 1", arc: "awakening", color: "#0ea5e9",
    bio: "A giant blue serpent and one of the first bosses Jinwoo defeated alone. Its fang became his dagger, Kasaka's Venom Fang." },
  { id: "job_change_knights", kind: "race", name: "Knights of the Job Change", alt: ["Undead knights"], home: "job_change_dungeon",
    first: "Anime S1 finale", arc: "jobchange", color: "#94a3b8",
    bio: "The armored soldiers and knights the Job Change quest throws at Jinwoo wave after wave before their commander Igris takes the field. Afterwards they rise again as his first shadows.", becameShadow: "shadow_knights" },
  { id: "igris_knight", kind: "boss", name: "Blood-Red Commander Igris", alt: ["Igris (boss)"], home: "job_change_dungeon",
    first: "Anime S1 finale", arc: "jobchange", color: "#ef4444",
    bio: "The crimson-plumed knight commander at the end of the Job Change quest: a swordsman fast and strong enough to push Jinwoo to his limit. Defeating him completes the quest, and he rises as the shadow Igris.", becameShadow: "igris" },
  { id: "high_orcs", kind: "race", name: "High Orcs", alt: [], home: "orc_gate", first: "Anime Season 2", arc: "reawakening", color: "#16a34a",
    bio: "Far tougher than ordinary orcs, organised into an army with warriors and shamans. Jinwoo turns many of them into shadow soldiers." },
  { id: "kargalgan", kind: "boss", name: "Kargalgan", alt: [], home: "orc_gate", first: "Anime Season 2", arc: "reawakening", color: "#22c55e",
    bio: "The High Orc shaman who commanded the orc gate. Raised by Jinwoo as the shadow mage Tusk.", becameShadow: "tusk" },
  { id: "ice_elves", kind: "race", name: "Ice Elves", alt: [], home: "red_gate_incident", first: "Anime Season 2", arc: "redgate", color: "#7dd3fc",
    bio: "Hunters of the frozen Red Gate world, who prey on the trapped trainees." },
  { id: "alpha_ice_bear", kind: "monster", name: "Ice Bears", alt: ["Alpha Ice Bear"], home: "red_gate_incident", first: "Anime Season 2", arc: "redgate", color: "#bae6fd",
    bio: "Huge bears of the Red Gate. Their alpha is raised as the shadow Tank.", becameShadow: "tank" },
  { id: "baruka", kind: "boss", name: "Baruka", alt: [], home: "red_gate_incident", first: "Anime Season 2", arc: "redgate", color: "#38bdf8", featured: true,
    bio: "The ice elf chieftain and the Red Gate's boss, an extremely fast assassin. Jinwoo kills him and takes his dagger." },
  { id: "cerberus", kind: "boss", name: "Cerberus", alt: ["Keeper of Hell's Gate"], home: "demon_castle", first: "Anime Season 2", arc: "demoncastle", color: "#dc2626",
    bio: "The three-headed hound guarding the Demon Castle's entrance." },
  { id: "vulcan", kind: "boss", name: "Vulcan", alt: [], home: "demon_castle", first: "Anime Season 2", arc: "demoncastle", color: "#f97316",
    bio: "A giant demon lord who blocks Jinwoo's way in the Demon Castle." },
  { id: "kaisellin", kind: "monster", name: "Kaisellin", alt: ["Baran's wyvern"], home: "demon_castle", first: "Anime Season 2", arc: "demoncastle", color: "#64748b",
    bio: "The wyvern Demon King Baran rides into battle at the top of the Demon Castle. After Baran falls, Jinwoo raises it as his flying mount, Kaisel.", becameShadow: "kaisel" },
  { id: "demons", kind: "race", name: "Demons", alt: [], home: "demon_castle", first: "Anime Season 2", arc: "demoncastle", color: "#a855f7",
    bio: "The inhabitants of the Demon Castle, from soldiers to nobles. Hunting them is the only way up the castle's floors." },
  { id: "ant_queen", kind: "boss", name: "Ant Queen", alt: [], home: "jeju_island", first: "Anime Season 2", arc: "jeju", color: "#f59e0b",
    bio: "The mother of Jeju Island's ant hordes, buried deep in the nest. Killing her is the raid's objective, but she has already given birth to the Ant King." },
  { id: "jeju_ants", kind: "race", name: "Jeju Ants", alt: [], home: "jeju_island", first: "Anime Season 2", arc: "jeju", color: "#ca8a04",
    bio: "Giant ants that overran Jeju Island after its dungeon break. After the raid, many of them rise again in Jinwoo's army." },
  { id: "ant_king", kind: "boss", name: "Ant King", alt: [], home: "jeju_island", first: "Anime Season 2", arc: "jeju", color: "#a78bfa", featured: true,
    bio: "The Ant Queen's offspring, born to be king: fast, flying, and hungry for strong opponents. He nearly wipes out the Jeju raid before Jinwoo kills him and raises him as Beru.", becameShadow: "beru" },
  { id: "kamish", kind: "boss", name: "Kamish", alt: ["Khamish"], home: "", first: "Manhwa", arc: "pre", sp: "m", color: "#b91c1c",
    bio: "A dragon whose rampage years before the story is one of the worst disasters of the gate era, overcome only at the cost of many hunters' lives. A fang from its body was forged into the daggers Kamish's Wrath. (A shadow of Kamish is listed in the Shadow Army but marked Unverified.)", becameShadow: "kamish_shadow" },
  { id: "giants", kind: "race", name: "Giants", alt: [], home: "japan_gate", first: "Manhwa", arc: "japan", sp: "m", color: "#d6a35c",
    bio: "The colossal race ruled by Legia, the Monarch of the Beginning. They pour out of an S-class gate in Japan and rampage across the country until Sung Jinwoo's army stops them." },
  { id: "dragons", kind: "race", name: "Dragons", alt: ["Dragon army"], home: "", first: "Manhwa", arc: "monarchs", sp: "m", color: "#e0443e",
    bio: "The army of Antares, the Monarch of Destruction and King of Dragons. He leads them against Sung Jinwoo and the Shadow Army in the final battle of the Monarchs War." }
];
