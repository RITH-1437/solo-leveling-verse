/* ==========================================================================
   SOLO LEVELING VERSE: skills & abilities
   --------------------------------------------------------------------------
   type: "Active" | "Passive" | "Command" | "Authority" | "Class"
   users[] = entity ids who use the skill.
   ========================================================================== */

window.SLV = window.SLV || {};
SLV.data = SLV.data || {};

SLV.data.skills = [
  { id: "shadow_extraction", name: "Shadow Extraction", alt: [], type: "Class", users: ["sung_jinwoo", "ashborn"],
    first: "Anime S1 finale", arc: "jobchange", color: "#8b5cf6", featured: true,
    bio: "Pulls the shadow out of a dead body and binds it to Jinwoo as a soldier. The stronger the target, and the longer it has been dead, the more likely the extraction is to fail. A failed shadow can be tried again only a few times before the body is lost for good." },
  { id: "arise", name: "Arise", alt: ["일어나라"], type: "Command", users: ["sung_jinwoo"],
    first: "Anime S1 finale", arc: "jobchange", color: "#a78bfa", featured: true,
    bio: "The command Jinwoo speaks to trigger Shadow Extraction. Black smoke rises from the corpse and the reborn soldier kneels before him." },
  { id: "shadow_preservation", name: "Shadow Storage", alt: ["Shadow Preservation"], type: "Class", users: ["sung_jinwoo"],
    first: "Anime S1 finale", arc: "jobchange", color: "#6d28d9",
    bio: "Stores his shadow soldiers inside his own shadow, so his whole army travels with him and can be summoned in an instant. Destroyed shadows reform as long as he has mana." },
  { id: "shadow_exchange", name: "Shadow Exchange", alt: [], type: "Class", users: ["sung_jinwoo"],
    first: "Manhwa", arc: "jeju", sp: "m", color: "#7c3aed", featured: true,
    bio: "Swaps Jinwoo's position with any of his shadows, wherever it is, effectively teleporting him to a shadow stationed anywhere in the world." },
  { id: "rulers_authority", name: "Ruler's Authority", alt: [], type: "Authority", users: ["sung_jinwoo"],
    first: "Anime Season 2", arc: "reawakening", color: "#38bdf8", featured: true,
    bio: "An invisible telekinetic force that lets Jinwoo grab, push and crush things at a distance, or pull objects to his hand." },
  { id: "stealth", name: "Stealth", alt: [], type: "Active", users: ["sung_jinwoo"],
    first: "Anime Season 1", arc: "awakening", color: "#475569",
    bio: "Makes Jinwoo invisible and silent while it drains his mana, perfect for ambushes and escapes." },
  { id: "bloodlust", name: "Bloodlust", alt: [], type: "Active", users: ["sung_jinwoo"],
    first: "Anime Season 1", arc: "awakening", color: "#dc2626",
    bio: "Releases a terrifying aura of killing intent that weakens and frightens the enemies around him." },
  { id: "dash", name: "Dash", alt: ["Sprint"], type: "Active", users: ["sung_jinwoo"],
    first: "Anime Season 1", arc: "awakening", color: "#22d3ee",
    bio: "Sharply raises Jinwoo's movement speed for as long as he spends mana on it." },
  { id: "mutilation", name: "Mutilation", alt: [], type: "Active", users: ["sung_jinwoo"],
    first: "Anime Season 1", arc: "awakening", color: "#f43f5e",
    bio: "A rapid flurry of dagger strikes against a single target." },
  { id: "vital_strike", name: "Vital Strike", alt: [], type: "Passive", users: ["sung_jinwoo"],
    first: "Anime Season 1", arc: "awakening", color: "#fb7185",
    bio: "Greatly increases the damage of hits that land on an enemy's weak points." },
  { id: "dragons_fear", name: "Dragon's Fear", alt: [], type: "Active", users: ["sung_jinwoo"],
    first: "Manhwa", arc: "ahjin", sp: "m", color: "#b91c1c", featured: true,
    bio: "A roar of overwhelming draconic pressure that freezes weaker enemies in terror. It is a far stronger version of Bloodlust." },
  { id: "monarchs_domain", name: "Monarch's Domain", alt: ["Domain of the Monarch"], type: "Authority", users: ["sung_jinwoo", "ashborn"],
    first: "Manhwa", arc: "ahjin", sp: "m", color: "#8b5cf6",
    bio: "Spreads Jinwoo's shadow across the battlefield. Every shadow soldier fighting inside it grows stronger." }
];
