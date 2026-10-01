interface FoodStyle {
  emoji: string;
  gradient: string;
  bg: string;
}

export function getFoodStyle(itemName: string, mealType: string): FoodStyle {
  const name = itemName.toLowerCase();

  // ---------- South Indian ----------
  if (name.includes("idli")) return { emoji: "🥟", gradient: "from-amber-200 to-orange-300", bg: "bg-amber-50" };
  if (name.includes("dosa")) return { emoji: "🥞", gradient: "from-yellow-200 to-amber-300", bg: "bg-yellow-50" };
  if (name.includes("upma")) return { emoji: "🍚", gradient: "from-lime-200 to-green-300", bg: "bg-lime-50" };
  if (name.includes("pongal")) return { emoji: "🥣", gradient: "from-orange-200 to-amber-300", bg: "bg-orange-50" };
  if (name.includes("uttapam")) return { emoji: "🥞", gradient: "from-yellow-200 to-orange-300", bg: "bg-yellow-50" };
  if (name.includes("idiyappam")) return { emoji: "🍜", gradient: "from-orange-100 to-amber-200", bg: "bg-orange-50" };
  if (name.includes("vada")) return { emoji: "🍩", gradient: "from-amber-200 to-yellow-300", bg: "bg-amber-50" };

  // ---------- Rice dishes ----------
  if (name.includes("biryani")) return { emoji: "🍛", gradient: "from-orange-300 to-red-400", bg: "bg-orange-50" };
  if (name.includes("pulao")) return { emoji: "🍚", gradient: "from-amber-200 to-orange-300", bg: "bg-amber-50" };
  if (name.includes("fried rice")) return { emoji: "🍚", gradient: "from-yellow-200 to-amber-300", bg: "bg-yellow-50" };
  if (name.includes("lemon rice")) return { emoji: "🍋", gradient: "from-yellow-200 to-lime-300", bg: "bg-yellow-50" };
  if (name.includes("tomato rice")) return { emoji: "🍅", gradient: "from-red-200 to-orange-300", bg: "bg-red-50" };
  if (name.includes("curd rice")) return { emoji: "🥛", gradient: "from-slate-100 to-blue-200", bg: "bg-slate-50" };
  if (name.includes("sambar rice")) return { emoji: "🍲", gradient: "from-orange-200 to-amber-300", bg: "bg-orange-50" };
  if (name.includes("rice")) return { emoji: "🍚", gradient: "from-slate-200 to-slate-300", bg: "bg-slate-50" };

  // ---------- Breads ----------
  if (name.includes("chapati") || name.includes("roti")) return { emoji: "🫓", gradient: "from-amber-200 to-yellow-300", bg: "bg-amber-50" };
  if (name.includes("paratha")) return { emoji: "🫓", gradient: "from-yellow-200 to-amber-300", bg: "bg-yellow-50" };
  if (name.includes("puri")) return { emoji: "🫓", gradient: "from-orange-200 to-amber-300", bg: "bg-orange-50" };
  if (name.includes("bhature")) return { emoji: "🫓", gradient: "from-amber-200 to-orange-300", bg: "bg-amber-50" };
  if (name.includes("naan")) return { emoji: "🫓", gradient: "from-amber-200 to-yellow-200", bg: "bg-amber-50" };
  if (name.includes("pav")) return { emoji: "🍞", gradient: "from-red-200 to-orange-300", bg: "bg-red-50" };

  // ---------- Curries / Gravies ----------
  if (name.includes("paneer")) return { emoji: "🧀", gradient: "from-yellow-200 to-amber-300", bg: "bg-yellow-50" };
  if (name.includes("dal") || name.includes("rajma") || name.includes("chole") || name.includes("chana")) return { emoji: "🍲", gradient: "from-orange-200 to-red-300", bg: "bg-orange-50" };
  if (name.includes("kurma") || name.includes("kootu") || name.includes("sabzi") || name.includes("bhindi")) return { emoji: "🥘", gradient: "from-green-200 to-emerald-300", bg: "bg-green-50" };
  if (name.includes("sambar") || name.includes("rasam")) return { emoji: "🍲", gradient: "from-red-200 to-orange-300", bg: "bg-red-50" };
  if (name.includes("aloo gobi")) return { emoji: "🥘", gradient: "from-yellow-200 to-amber-300", bg: "bg-amber-50" };

  // ---------- Chinese / Noodles ----------
  if (name.includes("noodle")) return { emoji: "🍜", gradient: "from-orange-200 to-red-300", bg: "bg-orange-50" };
  if (name.includes("manchurian")) return { emoji: "🥟", gradient: "from-red-200 to-orange-300", bg: "bg-red-50" };

  // ---------- Snacks ----------
  if (name.includes("omelette") || name.includes("egg")) return { emoji: "🍳", gradient: "from-yellow-200 to-amber-300", bg: "bg-yellow-50" };
  if (name.includes("bread")) return { emoji: "🍞", gradient: "from-amber-200 to-orange-200", bg: "bg-amber-50" };
  if (name.includes("poha")) return { emoji: "🥣", gradient: "from-yellow-200 to-orange-300", bg: "bg-yellow-50" };
  if (name.includes("kesari")) return { emoji: "🍮", gradient: "from-amber-200 to-orange-300", bg: "bg-amber-50" };
  if (name.includes("khichdi")) return { emoji: "🍚", gradient: "from-yellow-200 to-amber-200", bg: "bg-yellow-50" };

  // ---------- Sides / Extras ----------
  if (name.includes("pickle")) return { emoji: "🥒", gradient: "from-green-200 to-lime-300", bg: "bg-green-50" };
  if (name.includes("papad") || name.includes("vadam") || name.includes("appalam")) return { emoji: "🫓", gradient: "from-amber-100 to-yellow-200", bg: "bg-amber-50" };
  if (name.includes("curd") || name.includes("raita")) return { emoji: "🥛", gradient: "from-slate-100 to-slate-200", bg: "bg-slate-50" };
  if (name.includes("salad")) return { emoji: "🥗", gradient: "from-green-200 to-lime-300", bg: "bg-green-50" };

  // ---------- Meal-type fallback ----------
  if (mealType === "BREAKFAST") return { emoji: "🍳", gradient: "from-amber-200 to-orange-300", bg: "bg-amber-50" };
  if (mealType === "LUNCH") return { emoji: "🍛", gradient: "from-orange-200 to-red-300", bg: "bg-orange-50" };
  if (mealType === "DINNER") return { emoji: "🍽", gradient: "from-teal-200 to-cyan-300", bg: "bg-teal-50" };

  return { emoji: "🍽", gradient: "from-slate-200 to-slate-300", bg: "bg-slate-50" };
}

/**
 * Maps a menu item ID (e.g., MEAL001) to its local image path (/food/meal001.jpg).
 * Returns null if the ID is invalid.
 */
export function getFoodImage(itemId: string | undefined): string | null {
  if (!itemId) return null;
  const num = itemId.replace(/[^0-9]/g, "");
  if (!num) return null;
  const padded = num.padStart(3, "0");
  return `/food/meal${padded}.jpg`;
}