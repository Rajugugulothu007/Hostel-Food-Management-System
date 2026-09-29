export interface FeedbackDTO {
  id?: number;
  mealId: string;
  mealType: string;
  rating: number;
  comment?: string;
}

export interface LowRatedItem {
  mealId: string;
  averageRating: number;
}