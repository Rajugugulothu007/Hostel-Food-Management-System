export interface CheckInRequest {
  studentId: number;
  mealId: string;
  mealType: string;
  counterId?: number;
}

export interface CheckInDTO {
  id: number;
  studentId: number;
  mealId: string;
  mealType: string;
  checkInDate: string;
  checkInTime: string;
  counterId?: number;
}

export interface AttendanceSummaryDTO {
  mealType: string;
  checkInCount: number;
}