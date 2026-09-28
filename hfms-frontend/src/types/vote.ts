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