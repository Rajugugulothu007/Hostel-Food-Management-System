export interface LiveCountDTO {
  mealId: string;
  count: number;
}

export interface VoteRequest {
  mealId: string;
  mealType: string;
}

export interface VoteResponse {
  status: "CREATED" | "UPDATED";
  mealId: string;
  mealType: string;
  message: string;
}

export const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER"] as const;
export type MealType = (typeof MEAL_TYPES)[number];

// Voting cutoff times (local time each day)
export const VOTE_CUTOFFS: Record<MealType, string> = {
  BREAKFAST: "22:30", // 10:30 PM
  LUNCH: "10:30",     // 10:30 AM
  DINNER: "16:30",    // 4:30 PM
};

// When voting opens for each meal
export const VOTE_OPENS: Record<MealType, string> = {
  BREAKFAST: "20:00", // 8:00 PM previous day
  LUNCH: "08:30",     // 8:30 AM
  DINNER: "14:30",    // 2:30 PM
};