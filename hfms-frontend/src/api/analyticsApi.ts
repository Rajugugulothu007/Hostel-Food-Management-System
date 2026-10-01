import axiosClient from "./axiosClient";
import type { DashboardSummaryDTO, WastageTrendDTO } from "../types/analytics";

export const analyticsApi = {
  async getDashboard(): Promise<DashboardSummaryDTO> {
    const res = await axiosClient.get<DashboardSummaryDTO>("/api/analytics/dashboard");
    return res.data;
  },

  async getWastage(): Promise<WastageTrendDTO> {
    const res = await axiosClient.get<WastageTrendDTO>("/api/analytics/wastage");
    return res.data;
  },
};