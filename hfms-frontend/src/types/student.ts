export interface StudentDTO {
  id?: number;
  name: string;
  rollNo: string;
  roomNo?: string;
  phone?: string;
  email?: string;
  hostelId?: number;
  type: "HOSTELLER" | "DAY_SCHOLAR";
  active?: boolean;
}

export const STUDENT_TYPES = ["HOSTELLER", "DAY_SCHOLAR"] as const;
export type StudentType = (typeof STUDENT_TYPES)[number];