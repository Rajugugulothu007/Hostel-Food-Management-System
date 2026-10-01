import axiosClient from "./axiosClient";
import type {
  AttendanceSummaryDTO,
  CheckInDTO,
  CheckInRequest,
} from "../types/attendance";

export const attendanceApi = {
  // Get QR as PNG blob
  async getQrBlob(studentId: number): Promise<Blob> {
    const res = await axiosClient.get(`/api/attendance/qr/${studentId}`, {
      responseType: "blob",
    });
    return res.data;
  },

  async verifyQr(content: string): Promise<{ valid: boolean; studentId?: number }> {
    const res = await axiosClient.get("/api/attendance/qr/verify", {
      params: { content },
    });
    return res.data;
  },

  async checkIn(data: CheckInRequest): Promise<CheckInDTO> {
    const res = await axiosClient.post<CheckInDTO>("/api/attendance/checkin", data);
    return res.data;
  },

  async today(): Promise<CheckInDTO[]> {
    const res = await axiosClient.get<CheckInDTO[]>("/api/attendance/today");
    return res.data;
  },

  async studentHistory(studentId: number): Promise<CheckInDTO[]> {
    const res = await axiosClient.get<CheckInDTO[]>(
      `/api/attendance/student/${studentId}`
    );
    return res.data;
  },

  async headcount(mealId: string): Promise<{ mealId: string; count: number }> {
    const res = await axiosClient.get(`/api/attendance/meal/${mealId}/count`);
    return res.data;
  },

  async todaySummary(): Promise<AttendanceSummaryDTO[]> {
    const res = await axiosClient.get<AttendanceSummaryDTO[]>(
      "/api/attendance/summary/today"
    );
    return res.data;
  },
};