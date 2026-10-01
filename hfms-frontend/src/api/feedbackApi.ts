import axiosClient from "./axiosClient";
import type { FeedbackDTO, LowRatedItem } from "../types/feedback";

export const feedbackApi = {
  async submit(data: FeedbackDTO): Promise<FeedbackDTO> {
    const res = await axiosClient.post<FeedbackDTO>("/api/feedback", data);
    return res.data;
  },

  async forMeal(mealId: string): Promise<FeedbackDTO[]> {
    const res = await axiosClient.get<FeedbackDTO[]>(`/api/feedback/item/${mealId}`);
    return res.data;
  },

  async myFeedback(): Promise<FeedbackDTO[]> {
    const res = await axiosClient.get<FeedbackDTO[]>("/api/feedback/my");
    return res.data;
  },

  async getEligible(): Promise<{ mealId: string }[]> {
    const res = await axiosClient.get<{ mealId: string }[]>("/api/feedback/eligible");
    return res.data;
  },

  async lowRated(): Promise<LowRatedItem[]> {
    const res = await axiosClient.get<LowRatedItem[]>("/api/feedback/low-rated");
    return res.data;
  },
};