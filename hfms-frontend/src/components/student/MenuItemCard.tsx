import { Check, Flame, Leaf } from "lucide-react";

interface Props {
  id: string;
  name: string;
  quantity?: string;
  dietaryTags?: string;
  isSelected?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

export default function MenuItemCard({
  id,
  name,
  quantity,
  dietaryTags,
  isSelected,
  disabled,
  onSelect,
}: Props) {
  const tags = (dietaryTags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all
        ${
          isSelected
            ? "border-teal bg-teal/5 shadow-md shadow-teal/10"
            : disabled
            ? "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
            : "border-slate-100 bg-white hover:border-teal/40 hover:shadow-sm active:scale-[0.99]"
        }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-400 font-mono">{id}</span>
            {isSelected && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal text-white font-medium">
                SELECTED
              </span>
            )}
          </div>

          <p className="font-semibold text-slate-900 text-sm leading-snug">
            {name}
          </p>

          {quantity && (
            <p className="text-xs text-slate-500 mt-1">{quantity}</p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1"
                >
                  {tag.includes("veg") && <Leaf size={8} />}
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition
            ${
              isSelected
                ? "bg-teal border-teal"
                : "border-slate-300 bg-white"
            }`}
        >
          {isSelected && <Check size={16} className="text-white" />}
        </div>
      </div>
    </button>
  );
}