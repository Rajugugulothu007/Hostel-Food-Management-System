import { Check, Leaf } from "lucide-react";
import { getFoodImage } from "../../utils/foodEmoji";

interface Props {
  id: string;
  name: string;
  quantity?: string;
  dietaryTags?: string;
  imageUrl?: string;
  isSelected?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

export default function MenuItemCard({
  id,
  name,
  quantity,
  dietaryTags,
  imageUrl,
  isSelected,
  disabled,
  onSelect,
}: Props) {
  const img = imageUrl || getFoodImage(id);

  const tags = (dietaryTags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`w-full text-left p-3 rounded-2xl border-2 transition-all flex items-center gap-3
        ${
          isSelected
            ? "border-teal bg-teal/5 shadow-md shadow-teal/10"
            : disabled
            ? "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
            : "border-slate-100 bg-white hover:border-teal/40 hover:shadow-sm active:scale-[0.99]"
        }`}
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
        {img ? (
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            🍽
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] text-slate-400 font-mono">{id}</span>
          {isSelected && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal text-white font-medium">
              SELECTED
            </span>
          )}
        </div>

        <p className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
          {name}
        </p>

        {quantity && (
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
            {quantity}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1"
              >
                {tag.includes("veg") && (
                  <Leaf size={8} className="text-green-600" />
                )}
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Radio check */}
      <div
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
          isSelected ? "bg-teal border-teal" : "border-slate-300 bg-white"
        }`}
      >
        {isSelected && <Check size={14} className="text-white" />}
      </div>
    </button>
  );
}