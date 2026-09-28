export interface MenuItemDTO {
  id?: string;              // e.g., "MEAL001"
  itemName: string;
  mealType: string;         // BREAKFAST, LUNCH, DINNER
  quantity?: string;
  dietaryTags?: string;     // "veg,gluten-free"
  allergens?: string;       // "dairy,nuts"
  active?: boolean;
}

export const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER"] as const;
export type MealType = (typeof MEAL_TYPES)[number];