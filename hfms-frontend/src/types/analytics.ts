export interface MealCountDTO {
  mealType: string;
  votes: number;
  checkIns: number;
  wastagePercent: number;
}

export interface DashboardSummaryDTO {
  generatedAt: string;
  mealCounts: MealCountDTO[];
  totalSurplusToday: number;
  totalFeedbackToday: number;
  topMealToday: string;
}

export interface WastageTrendDTO {
  period: string;
  meals: MealCountDTO[];
  totalSurplusQty: number;
  overallWastagePercent: number;
}