/* ==========================================================================
   SOLO LEVELING VERSE — characters & hunters
   --------------------------------------------------------------------------
   Fields
     id, name, ko (Korean), alt[]          names
     titles[], titlesM[]                   epithets (M = manhwa spoiler)
     rank, orgs[], role, country           hunter record (see world.js)
     status                                "Active" / "Deceased" … (statusM overrides when spoilers on)
     first                                 debut, as precisely as is certain
     bio, bioM                             anime-safe history / manhwa-only history
     abilities[]                           skill ids (skills.js) or plain names; {n, m:1} = spoiler
     weapons[]                             item ids (items.js)
     forms[]                               transformations {name, desc, m}
     sp: "m"                               the whole entry is a manhwa spoiler
     featured                              shown on the home dashboard
   Artwork: assets/characters/<id>.webp (png/jpg also work).
   ========================================================================== */

window.SLV = window.SLV || {};
SLV.data = SLV.data || {};

SLV.data.characters = [
  {
    id: "sung_jinwoo", name: "Sung Jinwoo", ko: "성진우", alt: ["Jinwoo Sung", "Sung Jin-Woo"],
    titles: ["The World's Weakest Hunter (former)", "The Player", "Shadow Monarch (class)"],
    titlesM: ["Monarch of Shadows", "King of the Dead", "Guild Master of Ahjin"],
    rank: "S", rankNote: "Officially E-rank until his reassessment, then registered as S-rank.",
    orgs: ["ahjin", "shadow_army"], role: "Player · Shadow Monarch", country: "South Korea", status: "Active",
    first: "Anime S1 E1 · Manhwa ch. 1", arc: "double", featured: true,
    bio: "Once ridiculed as the weakest hunter in the world, Jinwoo survived the Double Dungeon and woke up as the System's only Player. Daily quests, instant dungeons and level-ups turned him from an E-rank into an S-rank, and his Job Change bound him to the power of shadows: the dead he defeats rise as his soldiers. He raids to pay for his mother's care and, later, to cure her Eternal Sleep.",
    bioM: "Jinwoo learns he was chosen as the vessel of Ashborn, the original Shadow Monarch, and inherits his full power and army. He leads humanity against the Monarchs, defeats Antares, then uses the Cup of Reincarnation to rewind time so the war never reaches Earth, fighting the remaining enemies alone for 27 years before returning home to marry Cha Hae-In.",
    abilities: ["shadow_extraction", "arise", "shadow_preservation", "shadow_exchange", "rulers_authority", "stealth", "bloodlust", "dash", "mutilation", "vital_strike", "dragons_fear", "monarchs_domain"],
    weapons: ["kasakas_venom_fang", "knight_killer", "barukas_dagger", "demon_kings_daggers", "demon_kings_longsword", "kamishs_wrath"],
    forms: [
      { name: "E-Rank Hunter", desc: "His original awakening: barely stronger than an ordinary person." },
      { name: "The Player", desc: "After the Double Dungeon the System grants him quests, levels, stats and a shop." },
      { name: "Shadow Monarch class", desc: "The hidden class from his Job Change quest, which grants Shadow Extraction." },
      { name: "Re-registered S-Rank", desc: "The Association's reassessment records him as S-rank." },
      { name: "True Shadow Monarch", desc: "Ashborn's power fully transferred; his eyes glow purple and his army answers only to him.", m: 1 }
    ]
  },
  {
    id: "cha_haein", name: "Cha Hae-In", ko: "차해인", alt: ["Hae-In Cha"],
    titles: ["Vice Guild Master of the Hunters Guild", "S-Rank Swordswoman"], titlesM: ["Wife of Sung Jinwoo"],
    rank: "S", orgs: ["hunters_guild"], role: "Melee · Swordswoman", country: "South Korea", status: "Active",
    first: "Anime Season 1", arc: "awakening", featured: true,
    bio: "Korea's top swordswoman and the Hunters Guild's vice guild master. Her ability lets her smell mana, which makes most hunters unpleasant to be near — except Sung Jinwoo, whose scent she finds strangely calming. She fights on the front line of the Jeju Island raid.",
    bioM: "She grows close to Jinwoo and, after time is rewound and he returns from the war, they marry; their son is Sung Suho.",
    abilities: ["Swordsmanship", "Mana sense (smell)", "Sword aura"], weapons: [],
    forms: []
  },
  {
    id: "yoo_jinho", name: "Yoo Jinho", ko: "유진호", alt: ["Jinho Yoo"],
    titles: ["Jinwoo's loyal follower"], titlesM: ["Vice Guild Master of Ahjin"],
    rank: "D", orgs: ["ahjin"], role: "Tank · Support", country: "South Korea", status: "Active",
    first: "Anime Season 1", arc: "awakening", featured: true,
    bio: "Son of the chairman of Yoojin Construction. After Jinwoo saves him from a deadly ambush in a raid, Jinho hires him to clear dungeons in his name and becomes fiercely loyal, calling him \"hyung-nim\".",
    bioM: "He becomes vice guild master of the Ahjin Guild, handling its paperwork, finances and public face.",
    abilities: ["Tanking", "Expensive gear"], weapons: [], forms: []
  },
  {
    id: "go_gunhee", name: "Go Gunhee", ko: "고건희", alt: ["Chairman Go"],
    titles: ["Chairman of the Korean Hunters Association"], titlesM: ["Vessel of a Ruler"],
    rank: "S", orgs: ["kha"], role: "Association Chairman", country: "South Korea", status: "Active", statusM: "Deceased",
    first: "Anime Season 2", arc: "reawakening", featured: true,
    bio: "The aging head of the Korean Hunters Association and one of the country's strongest hunters. He recognises Jinwoo's potential early and tries to bring him under the Association's protection.",
    bioM: "He was chosen as one of the Rulers' human vessels. The Frost Monarch kills him at the opening of the Monarchs War, and Woo Jinchul succeeds him as chairman.",
    abilities: ["Hand-to-hand combat", { n: "Ruler's power (vessel)", m: 1 }], weapons: [], forms: []
  },
  {
    id: "choi_jongin", name: "Choi Jong-In", ko: "최종인", alt: ["Jong-In Choi"],
    titles: ["Guild Master of the Hunters Guild", "The Ultimate Hunter"],
    rank: "S", orgs: ["hunters_guild"], role: "Mage · Fire", country: "South Korea", status: "Active",
    first: "Anime Season 2", arc: "reawakening", featured: true,
    bio: "Head of the Hunters Guild and a powerful fire mage. He is known for wanting the best hunters in his guild and tries to recruit Jinwoo after the reassessment. He is part of Korea's strike force on Jeju Island.",
    abilities: ["Fire magic", "Raid command"], weapons: [], forms: []
  },
  {
    id: "baek_yoonho", name: "Baek Yoonho", ko: "백윤호", alt: ["Yoonho Baek"],
    titles: ["Guild Master of the White Tiger Guild"],
    rank: "S", orgs: ["white_tiger"], role: "Beast-type", country: "South Korea", status: "Active",
    first: "Anime Season 2", arc: "reawakening", featured: true,
    bio: "Master of the White Tiger Guild. As a beast-type hunter he can take on the form and strength of a white tiger. He is one of the S-ranks who joins the Jeju Island raid.",
    abilities: ["Beast transformation (white tiger)", "Mana perception"], weapons: [],
    forms: [{ name: "White Tiger form", desc: "His beast-type awakening: a tiger's body, claws and speed." }]
  },
  {
    id: "woo_jinchul", name: "Woo Jinchul", ko: "우진철", alt: ["Jinchul Woo"],
    titles: ["Chief of the Association's Surveillance Team"], titlesM: ["Chairman of the Korean Hunters Association"],
    rank: "A", orgs: ["kha"], role: "Inspector", country: "South Korea", status: "Active",
    first: "Anime Season 1", arc: "awakening", featured: true,
    bio: "A stern, sunglassed A-rank who heads the Association's surveillance team, investigating crimes committed by hunters. He keeps a close eye on Jinwoo's sudden rise and becomes one of his more reliable allies.",
    bioM: "After Go Gunhee's death he becomes the new chairman of the Association.",
    abilities: ["Investigation", "Close combat"], weapons: [], forms: []
  },
  {
    id: "thomas_andre", name: "Thomas Andre", ko: "토마스 안드레", alt: ["The Goliath"],
    titles: ["Guild Master of the Scavenger Guild", "The Goliath"],
    rank: "National", orgs: ["scavenger"], role: "Fighter · Strength", country: "United States", status: "Active",
    first: "Manhwa", arc: "ahjin", sp: "m", featured: true,
    bio: "The strongest hunter in America and one of the world's national-level hunters, famous for overwhelming physical power. A clash with Jinwoo over Hwang Dongsoo ends in a hard-earned respect between them, and he hands Jinwoo the daggers Kamish's Wrath.",
    abilities: ["Superhuman strength and durability", "Grappling"], weapons: [], forms: []
  },
  {
    id: "liu_zhigang", name: "Liu Zhigang", ko: "류즈강", alt: ["Liu Zhi Gang"],
    titles: ["China's strongest hunter"],
    rank: "National", orgs: [], role: "National-level Hunter", country: "China", status: "Active",
    first: "Manhwa", arc: "ahjin", sp: "m", featured: true,
    bio: "China's top hunter and one of the handful of national-level hunters. He takes part in the international response once the Monarchs reveal themselves.",
    abilities: ["National-level combat power"], weapons: [], forms: []
  },
  {
    id: "christopher_reed", name: "Christopher Reed", alt: [],
    titles: ["National-level Hunter"],
    rank: "National", orgs: [], role: "National-level Hunter", country: "United States", status: "Deceased",
    first: "Manhwa", arc: "monarchs", sp: "m",
    bio: "One of America's national-level hunters. He becomes one of the first great casualties of the Monarchs War, killed by the Frost Monarch.",
    abilities: [], weapons: [], forms: []
  },
  {
    id: "siddharth_bachchan", name: "Siddharth Bachchan", alt: [],
    titles: ["National-level Hunter"],
    rank: "National", orgs: [], role: "National-level Hunter", country: "India", status: "Active",
    first: "Manhwa", arc: "ahjin", sp: "m",
    bio: "India's national-level hunter, counted among the strongest awakened humans on Earth.",
    abilities: [], weapons: [], forms: []
  },
  {
    id: "lennart_niermann", name: "Lennart Niermann", alt: ["Lennart"],
    titles: ["Germany's strongest hunter", "Master of the Richter Guild"],
    rank: "S", rankNote: "Ranked 12th in the world.", orgs: [], role: "Guild master", country: "Germany", status: "Active",
    first: "Manhwa", arc: "monarchs", sp: "m",
    bio: "Germany's strongest hunter and master of the Richter Guild, ranked 12th in the world. He appears in the manhwa as the Monarchs War spreads beyond Korea.",
    abilities: ["Mana-based combat"], weapons: [], forms: []
  },
  {
    id: "hwang_dongsoo", name: "Hwang Dongsoo", ko: "황동수", alt: [],
    titles: ["S-Rank of the Scavenger Guild"],
    rank: "S", orgs: ["scavenger"], role: "Fighter", country: "United States", status: "Deceased",
    first: "Manhwa", arc: "ahjin", sp: "m",
    bio: "A Korean-born S-rank working for America's Scavenger Guild and the older brother of Hwang Dongsuk. He blames Jinwoo for his brother's death and seeks revenge, which brings Thomas Andre into conflict with Jinwoo. Jinwoo kills him and raises his shadow as Greed.",
    abilities: ["Close combat"], weapons: [], forms: []
  },
  {
    id: "hwang_dongsuk", name: "Hwang Dongsuk", ko: "황동석", alt: [],
    titles: ["Leader of a hunter strike squad"],
    rank: "-", orgs: [], role: "Raid leader", country: "South Korea", status: "Deceased",
    first: "Anime Season 1", arc: "awakening",
    bio: "A hunter who leads the raid party Yoo Jinho joins. Inside the dungeon he turns on the party to rob and kill them, and Jinwoo kills him and his accomplices.",
    bioM: "His older brother is the S-rank Hwang Dongsoo, who later comes for revenge.",
    abilities: [], weapons: [], forms: []
  },
  {
    id: "sung_jinah", name: "Sung Jinah", ko: "성진아", alt: ["Jinah Sung"],
    titles: ["Jinwoo's younger sister"],
    rank: "-", orgs: [], role: "Student", country: "South Korea", status: "Active",
    first: "Anime S1 E1", arc: "double",
    bio: "Jinwoo's high-school sister, who worries about her brother's dangerous work. Protecting her and their mother is one of the reasons he keeps fighting.",
    abilities: [], weapons: [], forms: []
  },
  {
    id: "park_kyunghye", name: "Park Kyung-hye", ko: "박경혜", alt: [],
    titles: ["Jinwoo's mother"],
    rank: "-", orgs: [], role: "Civilian", country: "South Korea", status: "Hospitalised", statusM: "Recovered",
    first: "Anime Season 1", arc: "double",
    bio: "Jinwoo's mother, who has fallen into the incurable Eternal Sleep Disease. Paying for her hospital care is why Jinwoo became a hunter, and curing her is why he climbs the Demon Castle for the Holy Water of Life.",
    bioM: "The Elixir of Life brewed from the Holy Water wakes her from the Eternal Sleep.",
    abilities: [], weapons: [], forms: []
  },
  {
    id: "sung_ilhwan", name: "Sung Il-hwan", ko: "성일환", alt: [],
    titles: ["Jinwoo's father"], titlesM: ["Vessel of a Ruler"],
    rank: "-", orgs: [], role: "Hunter", country: "South Korea", status: "Missing", statusM: "Deceased",
    first: "Mentioned in Anime S1", arc: "pre",
    bio: "A hunter who disappeared years before the story, leaving his family behind.",
    bioM: "He was trapped beyond a gate and returned as one of the Rulers' vessels. Ordered to kill his son, he cannot bring himself to do it, and he fights the Frost and Beast Monarchs to protect Jinwoo.",
    abilities: [{ n: "Ruler's power (vessel)", m: 1 }], weapons: [], forms: []
  },
  {
    id: "lee_joohee", name: "Lee Joohee", ko: "이주희", alt: ["Joohee Lee"],
    titles: ["Healer of the Double Dungeon party"],
    rank: "B", orgs: [], role: "Healer", country: "South Korea", status: "Active",
    first: "Anime S1 E1", arc: "double",
    bio: "A B-rank healer and one of Jinwoo's few friends among hunters. She survives the Double Dungeon with him, and the experience shakes her badly.",
    abilities: ["Healing magic"], weapons: [], forms: []
  },
  {
    id: "song_chiyul", name: "Song Chiyul", ko: "송치열", alt: ["Mr. Song"],
    titles: ["Leader of the Double Dungeon party"],
    rank: "-", orgs: [], role: "Raid leader", country: "South Korea", status: "Deceased",
    first: "Anime S1 E1", arc: "double",
    bio: "A veteran hunter who leads the raid party into the dungeon that turns out to be the Double Dungeon, and tries to keep the survivors alive inside the Cartenon Temple.",
    abilities: [], weapons: [], forms: []
  },
  {
    id: "min_byunggu", name: "Min Byung-gu", ko: "민병구", alt: [],
    titles: ["Korea's top healer"],
    rank: "A", orgs: [], role: "Healer", country: "South Korea", status: "Deceased",
    first: "Anime Season 2", arc: "jeju",
    bio: "An A-rank healer on the Jeju Island raid. He is killed and devoured by the Ant King, which takes his healing abilities for itself.",
    abilities: ["Healing magic"], weapons: [], forms: []
  },
  {
    id: "kim_chul", name: "Kim Chul", ko: "김철", alt: [],
    titles: ["A-Rank of the White Tiger Guild"],
    rank: "A", orgs: ["white_tiger"], role: "Tank", country: "South Korea", status: "Deceased",
    first: "Anime Season 2", arc: "redgate",
    bio: "An arrogant A-rank who enters the Red Gate with a group of trainees. When he turns on the others, Jinwoo kills him and extracts his shadow, which becomes the shadow soldier Iron.",
    abilities: ["Heavy armor combat"], weapons: [], forms: []
  },
  {
    id: "kang_taeshik", name: "Kang Taeshik", ko: "강태식", alt: ["Kang Tae-shik"],
    titles: ["B-Rank assassin of the Association"],
    rank: "B", orgs: ["kha"], role: "Assassin", country: "South Korea", status: "Deceased",
    first: "Anime S1 E3", arc: "awakening",
    bio: "A B-rank assassin-type hunter from the Hunters Association's surveillance division, assigned to escort a raid of convict hunters. He is secretly a contract killer: inside the dungeon he murders the prisoners he was sent to watch, then turns on Jinwoo, who kills him in their fight (S1 E9).",
    bioM: "In the manhwa, defeating him earns Jinwoo a rune stone holding his Stealth ability.",
    abilities: ["Assassin-type combat", "Stealth"], weapons: [], forms: []
  },
  {
    id: "esil_radiru", name: "Esil Radiru", alt: ["Esil"],
    titles: ["Demon noble of the Radiru house"],
    rank: "-", orgs: [], role: "Demon noble", country: "—", status: "Active",
    first: "Anime Season 2", arc: "demoncastle",
    bio: "A demon noblewoman Jinwoo meets while climbing the Demon Castle. Rather than fight to the death, she bargains with him and guides him through the castle's politics.",
    abilities: ["Demon magic"], weapons: [], forms: []
  },
  {
    id: "sung_suho", name: "Sung Suho", ko: "성수호", alt: [],
    titles: ["Son of Sung Jinwoo and Cha Hae-In"],
    rank: "-", orgs: [], role: "Heir", country: "South Korea", status: "Active",
    first: "Manhwa epilogue", arc: "epilogue", sp: "m",
    bio: "Born after Jinwoo returns from the war and marries Cha Hae-In. He is the protagonist of the sequel, Solo Leveling: Ragnarok.",
    abilities: [], weapons: [], forms: []
  }
];
