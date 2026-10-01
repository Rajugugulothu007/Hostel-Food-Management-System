import axiosClient from "./axiosClient";
import type { LiveCountDTO, VoteRequest, VoteResponse } from "../types/vote";

export const votingApi = {
  async castVote(data: VoteRequest): Promise<VoteResponse> {
    const res = await axiosClient.post<VoteResponse>("/api/votes", data);
    return res.data;
  },

  async getLiveCount(mealId: string): Promise<LiveCountDTO> {
    const res = await axiosClient.get<LiveCountDTO>(`/api/votes/count/${mealId}`);
    return res.data;
  },
};