export interface NotificationDTO {
  id: number;
  recipientId?: number;
  type: string;
  title: string;
  body: string;
  channel: string;
  status: string;
  sentAt: string;
}

export interface FcmTokenRequest {
  studentId: number;
  token: string;
  deviceInfo?: string;
}