import { MEAL_TYPES, type MealType } from "../../types/vote";

interface Props {
  selected: MealType;
  onChange: (meal: MealType) => void;
  status: Record<MealType, { isOpen: boolean; isLocked: boolean; isUpcoming: boolean }>;
}

export default function MealTabs({ selected, onChange, status }: Props) {
  return (
    <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
      {MEAL_TYPES.map((meal) => {
        const info = status[meal];
        const isActive = selected === meal;

        return (
          <button
            key={meal}
            onClick={() => onChange(meal)}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1
              ${
                isActive
                  ? "bg-white text-teal shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
          >
            <span>{meal.charAt(0) + meal.slice(1).toLowerCase()}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                info.isLocked
                  ? "bg-red-100 text-red-600"
                  : info.isOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {info.isLocked ? "Closed" : info.isOpen ? "Open" : "Soon"}
            </span>
          </button>
        );
      })}
    </div>
  );
}