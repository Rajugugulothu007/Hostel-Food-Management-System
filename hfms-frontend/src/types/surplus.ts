export interface SurplusLogDTO {
  id?: number;
  mealId: string;
  mealType: string;
  preparedQty?: number;
  servedQty?: number;
  surplusQty: number;
  disposition?: string;
  claimedBy?: number;
}

export interface DayScholarDTO {
  id?: number;
  name: string;
  collegeId: string;
  phone: string;
  claimCount?: number;
}