import axiosClient from "./axiosClient";
import type { DayScholarDTO, SurplusLogDTO } from "../types/surplus";

export const surplusApi = {
  async logSurplus(data: SurplusLogDTO): Promise<SurplusLogDTO> {
    const res = await axiosClient.post<SurplusLogDTO>("/api/surplus/log", data);
    return res.data;
  },

  async today(): Promise<SurplusLogDTO[]> {
    const res = await axiosClient.get<SurplusLogDTO[]>("/api/surplus/today");
    return res.data;
  },

  async ngoQueue(): Promise<SurplusLogDTO[]> {
    const res = await axiosClient.get<SurplusLogDTO[]>("/api/surplus/queue/ngo");
    return res.data;
  },

  async markForNgo(id: number): Promise<SurplusLogDTO> {
    const res = await axiosClient.post<SurplusLogDTO>(`/api/surplus/${id}/ngo`);
    return res.data;
  },

  async registerDayScholar(data: DayScholarDTO): Promise<DayScholarDTO> {
    const res = await axiosClient.post<DayScholarDTO>(
      "/api/surplus/day-scholar/register",
      data
    );
    return res.data;
  },

  async getDayScholarByCollegeId(collegeId: string): Promise<DayScholarDTO> {
    const res = await axiosClient.get<DayScholarDTO>(
      `/api/surplus/day-scholar/college/${collegeId}`
    );
    return res.data;
  },

  async claim(surplusLogId: number, dayScholarId: number): Promise<SurplusLogDTO> {
    const res = await axiosClient.post<SurplusLogDTO>(
      `/api/surplus/claim/${surplusLogId}/by/${dayScholarId}`
    );
    return res.data;
  },
};