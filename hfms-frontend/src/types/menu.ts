export interface MenuItemDTO {
  id?: string;
  itemName: string;
  mealType: string;
  quantity?: string;
  dietaryTags?: string;
  allergens?: string;
  imageUrl?: string;    // ← NEW
  active?: boolean;
}

export const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER"] as const;
export type MealType = (typeof MEAL_TYPES)[number];