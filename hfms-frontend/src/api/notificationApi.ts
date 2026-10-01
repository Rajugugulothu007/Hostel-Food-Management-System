import axiosClient from "./axiosClient";
import type { FcmTokenRequest, NotificationDTO } from "../types/notification";

export const notificationApi = {
  async getMyNotifications(): Promise<NotificationDTO[]> {
    const res = await axiosClient.get<NotificationDTO[]>("/api/notifications/my");
    return res.data;
  },

  async registerFcmToken(data: FcmTokenRequest): Promise<void> {
    await axiosClient.post("/api/notifications/token", data);
  },

  async send(data: {
    type: string;
    title: string;
    body: string;
    recipientIds?: number[];
  }): Promise<{ sent: number; type: string }> {
    const res = await axiosClient.post("/api/notifications/send", data);
    return res.data;
  },
};