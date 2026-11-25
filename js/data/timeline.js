/* ==========================================================================
   SOLO LEVELING VERSE — timeline & relationships
   --------------------------------------------------------------------------
   timeline[]  { id, arc, when, title, text, ids[] (entities involved), kind, sp }
               kind: world | battle | milestone | shadow | loss
   links[]     { a, b, t, label, sp }
               t: family | spouse | ally | rival | enemy | shadow | origin | vessel |
                  successor | creator | command | mount
               Guild membership is drawn from each character's `orgs` instead.
   ========================================================================== */

window.SLV = window.SLV || {};
SLV.data = SLV.data || {};

SLV.data.timeline = [
  { id: "t_gates", arc: "pre", when: "≈10 years before", kind: "world", title: "The gates open",
    text: "Gates begin appearing across the world, and some people awaken with mana and abilities. They become hunters, graded E to S by the Hunter Association.",
    ids: ["standard_gate", "kha"] },
  { id: "t_ilhwan", arc: "pre", when: "Years before", kind: "loss", title: "Sung Il-hwan disappears",
    text: "Jinwoo's father, a hunter, vanishes, leaving his family to struggle on without him.",
    ids: ["sung_ilhwan", "sung_jinwoo"] },
  { id: "t_kamish", arc: "pre", when: "Years before", kind: "battle", sp: "m", title: "The dragon Kamish",
    text: "The dragon Kamish devastates the world until hunters bring it down at a terrible cost. Its remains become legendary crafting material.",
    ids: ["kamish", "kamishs_wrath"] },
  { id: "t_jeju_break", arc: "pre", when: "Years before", kind: "world", title: "Jeju Island falls",
    text: "An S-class gate on Jeju Island breaks. Giant ants overrun the island, and repeated raids fail to retake it.",
    ids: ["jeju_island", "dungeon_break", "jeju_ants"] },
  { id: "t_mother", arc: "pre", when: "Before the story", kind: "loss", title: "The Eternal Sleep",
    text: "Jinwoo's mother falls into the incurable Eternal Sleep Disease. Jinwoo works as an E-rank hunter to pay her hospital bills.",
    ids: ["park_kyunghye", "sung_jinwoo"] },

  { id: "t_double", arc: "double", when: "Anime S1 E1–E2", kind: "battle", title: "The Double Dungeon",
    text: "A low-grade raid hides a second dungeon, the Cartenon Temple. Its statues massacre the party; Jinwoo stays behind so the survivors can escape.",
    ids: ["double_dungeon", "statue_of_god", "sung_jinwoo", "lee_joohee", "song_chiyul"] },
  { id: "t_player", arc: "awakening", when: "Anime Season 1", kind: "milestone", title: "The Player awakens",
    text: "Jinwoo wakes in hospital to a System only he can see. It assigns a Daily Quest, and failing it sends him to the Penalty Zone.",
    ids: ["sung_jinwoo", "penalty_zone", "instant_dungeon"] },
  { id: "t_dongsuk", arc: "awakening", when: "Anime Season 1", kind: "battle", title: "Betrayal in the dungeon",
    text: "Raid leader Hwang Dongsuk turns on his own party, Yoo Jinho among them. Jinwoo kills the attackers, and Jinho becomes his devoted partner.",
    ids: ["hwang_dongsuk", "yoo_jinho", "sung_jinwoo"] },
  { id: "t_jobchange", arc: "jobchange", when: "Anime S1 finale", kind: "shadow", title: "\"Arise\"",
    text: "The Job Change quest pits Jinwoo against waves of undead and the Blood-Red Commander Igris. He wins, gains the hidden class tied to shadows, and raises his first soldiers.",
    ids: ["job_change_dungeon", "igris", "shadow_extraction", "arise", "ashborn"] },

  { id: "t_reassess", arc: "reawakening", when: "Anime Season 2", kind: "milestone", title: "Reassessed as S-Rank",
    text: "Jinwoo asks the Association to re-measure him. The results shock Korea: the former E-rank is now an S-rank, and guilds rush to recruit him.",
    ids: ["sung_jinwoo", "go_gunhee", "choi_jongin", "kha"] },
  { id: "t_tusk", arc: "reawakening", when: "Anime Season 2", kind: "shadow", title: "The orc gate",
    text: "Jinwoo destroys an army of high orcs and raises their shaman Kargalgan as Tusk.",
    ids: ["orc_gate", "kargalgan", "tusk"] },
  { id: "t_redgate", arc: "redgate", when: "Anime Season 2", kind: "battle", title: "Trapped in the Red Gate",
    text: "A Red Gate traps Jinwoo with a group of trainees and the A-rank Kim Chul. He survives the ice elves, kills Kim Chul and Baruka, and raises Iron and Tank.",
    ids: ["red_gate_incident", "red_gate", "kim_chul", "baruka", "iron", "tank"] },
  { id: "t_castle", arc: "demoncastle", when: "Anime Season 2", kind: "battle", title: "Climbing the Demon Castle",
    text: "In search of the Holy Water of Life, Jinwoo climbs the Demon Castle, meets Esil Radiru and defeats Demon King Baran at the summit, taking his weapons and his wyvern.",
    ids: ["demon_castle", "esil_radiru", "baran", "kaisel", "holy_water_of_life", "demon_kings_daggers"] },
  { id: "t_wake", arc: "demoncastle", when: "After the castle", kind: "milestone", sp: "m", title: "His mother wakes",
    text: "The Elixir of Life wakes Park Kyung-hye from the Eternal Sleep.",
    ids: ["park_kyunghye", "holy_water_of_life"] },
  { id: "t_jeju", arc: "jeju", when: "Anime S2 finale", kind: "shadow", title: "The Jeju Island raid",
    text: "Korea's S-ranks and a Japanese team strike the ant nest. The newborn Ant King devours Min Byung-gu and overwhelms the raid until Jinwoo arrives, kills him and raises him as Beru, along with an army of ants.",
    ids: ["jeju_island", "ant_king", "beru", "cha_haein", "choi_jongin", "baek_yoonho", "min_byunggu"] },

  { id: "t_ahjin", arc: "ahjin", when: "Manhwa", kind: "milestone", sp: "m", title: "The Ahjin Guild",
    text: "Jinwoo founds the Ahjin Guild, with Yoo Jinho as his vice guild master.",
    ids: ["ahjin", "sung_jinwoo", "yoo_jinho"] },
  { id: "t_thomas", arc: "ahjin", when: "Manhwa", kind: "battle", sp: "m", title: "Jinwoo vs. Thomas Andre",
    text: "Hwang Dongsoo's grudge drags the Scavenger Guild into a clash with Jinwoo. Jinwoo kills Dongsoo, raising him as Greed, and fights Thomas Andre, who later gives him Kamish's Wrath.",
    ids: ["hwang_dongsoo", "greed", "thomas_andre", "kamishs_wrath"] },
  { id: "t_japan", arc: "japan", when: "Manhwa", kind: "battle", sp: "m", title: "The giants invade Japan",
    text: "An S-class catastrophe in Japan unleashes giants. Jinwoo intervenes and kills their king, the Monarch of the Beginning Legia.",
    ids: ["legia"] },
  { id: "t_monarch", arc: "monarchs", when: "Manhwa", kind: "shadow", sp: "m", title: "The true Shadow Monarch",
    text: "The truth behind the System comes out: Jinwoo was Ashborn's chosen vessel. He inherits the Monarch's full power and his old army under Grand Marshal Bellion.",
    ids: ["ashborn", "architect", "bellion", "sung_jinwoo"] },
  { id: "t_war", arc: "monarchs", when: "Manhwa", kind: "loss", sp: "m", title: "The Monarchs War begins",
    text: "The Monarchs move on Earth. The Frost Monarch kills Christopher Reed and Go Gunhee; Sung Il-hwan, a Ruler's vessel, stands against the Frost and Beast Monarchs.",
    ids: ["sillad", "rakan", "christopher_reed", "go_gunhee", "sung_ilhwan", "the_rulers"] },
  { id: "t_antares", arc: "monarchs", when: "Manhwa", kind: "battle", sp: "m", title: "Shadow against Destruction",
    text: "Jinwoo and the Shadow Army face Antares, Monarch of Destruction, and his dragons, and Jinwoo defeats the King of Dragons.",
    ids: ["antares", "sung_jinwoo", "igris", "beru", "bellion"] },
  { id: "t_reset", arc: "epilogue", when: "Manhwa", kind: "world", sp: "m", title: "The Cup of Reincarnation",
    text: "Jinwoo turns back time ten years so the gates never open on Earth, then fights the war's remnants alone for 27 years before returning.",
    ids: ["cup_of_reincarnation", "sung_jinwoo"] },
  { id: "t_epilogue", arc: "epilogue", when: "Manhwa", kind: "milestone", sp: "m", title: "Home",
    text: "Back in a world without gates, Jinwoo finds Cha Hae-In again. They marry and have a son, Sung Suho.",
    ids: ["sung_jinwoo", "cha_haein", "sung_suho"] }
];

SLV.data.links = [
  /* family */
  { a: "sung_ilhwan", b: "sung_jinwoo", t: "family", label: "Father" },
  { a: "park_kyunghye", b: "sung_jinwoo", t: "family", label: "Mother" },
  { a: "sung_ilhwan", b: "park_kyunghye", t: "spouse", label: "Married" },
  { a: "sung_jinwoo", b: "sung_jinah", t: "family", label: "Siblings" },
  { a: "sung_ilhwan", b: "sung_jinah", t: "family", label: "Father" },
  { a: "park_kyunghye", b: "sung_jinah", t: "family", label: "Mother" },
  { a: "sung_jinwoo", b: "cha_haein", t: "spouse", label: "Married", sp: "m" },
  { a: "sung_jinwoo", b: "sung_suho", t: "family", label: "Father", sp: "m" },
  { a: "cha_haein", b: "sung_suho", t: "family", label: "Mother", sp: "m" },
  { a: "hwang_dongsoo", b: "hwang_dongsuk", t: "family", label: "Brothers", sp: "m" },

  /* allies & rivals */
  { a: "sung_jinwoo", b: "yoo_jinho", t: "ally", label: "Partner · \"hyung-nim\"" },
  { a: "sung_jinwoo", b: "lee_joohee", t: "ally", label: "Double Dungeon survivors" },
  { a: "sung_jinwoo", b: "song_chiyul", t: "ally", label: "Double Dungeon party" },
  { a: "sung_jinwoo", b: "go_gunhee", t: "ally", label: "Patron" },
  { a: "sung_jinwoo", b: "woo_jinchul", t: "ally", label: "Ally in the Association" },
  { a: "sung_jinwoo", b: "cha_haein", t: "ally", label: "Comrades on Jeju" },
  { a: "sung_jinwoo", b: "esil_radiru", t: "ally", label: "Bargain in the Demon Castle" },
  { a: "sung_jinwoo", b: "choi_jongin", t: "ally", label: "Jeju raid" },
  { a: "sung_jinwoo", b: "baek_yoonho", t: "ally", label: "Jeju raid" },
  { a: "go_gunhee", b: "woo_jinchul", t: "command", label: "Chairman and subordinate" },
  { a: "sung_jinwoo", b: "thomas_andre", t: "rival", label: "Fought, then respected", sp: "m" },

  /* enemies */
  { a: "sung_jinwoo", b: "hwang_dongsuk", t: "enemy", label: "Killed the traitor" },
  { a: "sung_jinwoo", b: "kim_chul", t: "enemy", label: "Killed in the Red Gate" },
  { a: "sung_jinwoo", b: "baran", t: "enemy", label: "Defeated in the Demon Castle" },
  { a: "sung_jinwoo", b: "hwang_dongsoo", t: "enemy", label: "Revenge, then death", sp: "m" },
  { a: "sung_jinwoo", b: "antares", t: "enemy", label: "Final battle", sp: "m" },
  { a: "sung_jinwoo", b: "legia", t: "enemy", label: "Slain in Japan", sp: "m" },
  { a: "sung_jinwoo", b: "sillad", t: "enemy", label: "Monarchs War", sp: "m" },
  { a: "sung_jinwoo", b: "rakan", t: "enemy", label: "Monarchs War", sp: "m" },
  { a: "sillad", b: "go_gunhee", t: "enemy", label: "Killed him", sp: "m" },
  { a: "sillad", b: "christopher_reed", t: "enemy", label: "Killed him", sp: "m" },
  { a: "sung_ilhwan", b: "sillad", t: "enemy", label: "Fought to protect Jinwoo", sp: "m" },
  { a: "sung_ilhwan", b: "rakan", t: "enemy", label: "Fought to protect Jinwoo", sp: "m" },
  { a: "ashborn", b: "baran", t: "enemy", label: "Rebelled against him", sp: "m" },
  { a: "ashborn", b: "rakan", t: "enemy", label: "Rebelled against him", sp: "m" },
  { a: "the_rulers", b: "antares", t: "enemy", label: "Eternal war", sp: "m" },
  { a: "beru", b: "min_byunggu", t: "enemy", label: "Devoured, took his healing" },

  /* monarch hierarchy */
  { a: "antares", b: "sillad", t: "command", label: "Leads the Monarchs' war", sp: "m" },
  { a: "antares", b: "rakan", t: "command", label: "Leads the Monarchs' war", sp: "m" },
  { a: "antares", b: "querehsha", t: "command", label: "Leads the Monarchs' war", sp: "m" },
  { a: "antares", b: "tarnak", t: "command", label: "Leads the Monarchs' war", sp: "m" },
  { a: "antares", b: "yogumunt", t: "command", label: "Leads the Monarchs' war", sp: "m" },
  { a: "absolute_being", b: "the_rulers", t: "creator", label: "Created", sp: "m" },
  { a: "the_rulers", b: "legia", t: "enemy", label: "Held him captive", sp: "m" },

  /* rulers, vessels, the System */
  { a: "the_rulers", b: "sung_ilhwan", t: "vessel", label: "Ruler's vessel", sp: "m" },
  { a: "the_rulers", b: "go_gunhee", t: "vessel", label: "Ruler's vessel", sp: "m" },
  { a: "ashborn", b: "sung_jinwoo", t: "successor", label: "Chose him as vessel", sp: "m" },
  { a: "architect", b: "sung_jinwoo", t: "creator", label: "Built the System", sp: "m" },

  /* shadow army: Jinwoo → shadows, origins */
  { a: "sung_jinwoo", b: "igris", t: "shadow", label: "Knight → Marshal" },
  { a: "sung_jinwoo", b: "beru", t: "shadow", label: "Ant King → Marshal" },
  { a: "sung_jinwoo", b: "bellion", t: "shadow", label: "Grand Marshal", sp: "m" },
  { a: "sung_jinwoo", b: "iron", t: "shadow", label: "Shadow soldier" },
  { a: "sung_jinwoo", b: "tank", t: "shadow", label: "Shadow soldier" },
  { a: "sung_jinwoo", b: "tusk", t: "shadow", label: "Shadow mage" },
  { a: "sung_jinwoo", b: "kaisel", t: "shadow", label: "Flying mount" },
  { a: "sung_jinwoo", b: "greed", t: "shadow", label: "Shadow soldier", sp: "m" },
  { a: "sung_jinwoo", b: "shadow_infantry", t: "shadow", label: "The army" },
  { a: "ashborn", b: "bellion", t: "command", label: "His old Grand Marshal", sp: "m" },
  { a: "kim_chul", b: "iron", t: "origin", label: "Became Iron" },
  { a: "hwang_dongsoo", b: "greed", t: "origin", label: "Became Greed", sp: "m" },
  { a: "baran", b: "kaisel", t: "mount", label: "His wyvern" }
];
