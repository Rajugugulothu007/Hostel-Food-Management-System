import { Pencil, Trash2, Leaf } from "lucide-react";
import type { MenuItemDTO } from "../../types/menu";
import { getFoodStyle, getFoodImage } from "../../utils/foodEmoji";

interface Props {
  item: MenuItemDTO;
  onEdit: (item: MenuItemDTO) => void;
  onDelete: (item: MenuItemDTO) => void;
}

const mealBadge: Record<string, { bg: string; text: string }> = {
  BREAKFAST: { bg: "bg-amber-100", text: "text-amber-700" },
  LUNCH: { bg: "bg-blue-100", text: "text-blue-700" },
  DINNER: { bg: "bg-green-100", text: "text-green-700" },
};

export default function MenuItemCard({ item, onEdit, onDelete }: Props) {
  const { emoji, gradient, bg } = getFoodStyle(item.itemName, item.mealType);
  const badge = mealBadge[item.mealType] || mealBadge.BREAKFAST;

  // Priority: user-uploaded URL → local image → emoji fallback
  const imageSrc = item.imageUrl || getFoodImage(item.id);

  const tags = (item.dietaryTags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* ---------- IMAGE / PLACEHOLDER ---------- */}
      <div
        className={`relative h-40 ${bg} flex items-center justify-center overflow-hidden`}
      >
        {/* Emoji fallback (always rendered behind image) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40`}
          />
          <div className="relative text-6xl sm:text-7xl drop-shadow-md">
            {emoji}
          </div>
        </div>

        {/* Real image (covers emoji when it loads) */}
        {imageSrc && (
          <img
            src={imageSrc}
            alt={item.itemName}
            className="relative w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // If image fails to load, hide it — emoji behind shows through
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}

        {/* ID chip */}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-[10px] font-mono font-semibold text-slate-700 shadow-sm z-10">
          {item.id}
        </span>

        {/* Meal type badge */}
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full ${badge.bg} ${badge.text} text-[10px] font-semibold z-10`}
        >
          {item.mealType.charAt(0) + item.mealType.slice(1).toLowerCase()}
        </span>

        {/* Hover actions */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition z-10">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg bg-white/95 backdrop-blur shadow-sm hover:bg-teal hover:text-white text-teal transition"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-1.5 rounded-lg bg-white/95 backdrop-blur shadow-sm hover:bg-red-500 hover:text-white text-red-500 transition"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* ---------- DESCRIPTION ---------- */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
          {item.itemName}
        </h3>

        {item.quantity && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            {item.quantity}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1"
              >
                {tag.includes("veg") && (
                  <Leaf size={8} className="text-green-600" />
                )}
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}