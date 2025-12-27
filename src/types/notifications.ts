// src/types/notifications.ts

export type NotificationType = "info" | "warning" | "error" | "success";

export interface NotificationDto {
  id: string;
  type: NotificationType;
  category: string; // e.g. "scan", "billing"
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
  readAt?: string;
}

export interface NotificationsListResponse {
  notifications: NotificationDto[];
  total: number;
}
