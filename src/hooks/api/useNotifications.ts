import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import type {
  NotificationsListResponse,
  NotificationDto,
} from "../../types/notifications";

export const notificationsKey = (
  params?: {
    limit?: number;
    offset?: number;
    read?: boolean;
    category?: string;
  } | undefined
) => ["notifications", params] as const;

export const unreadCountKey = ["notifications-unread-count"] as const;

export const useNotifications = (
  params?: {
    limit?: number;
    offset?: number;
    read?: boolean;
    category?: string;
  },
  options?: {
    enabled?: boolean;
    refetchInterval?: number | false;
    staleTime?: number;
    refetchOnMount?: boolean;
  }
) =>
  useQuery<NotificationsListResponse>({
    queryKey: notificationsKey(params),
    queryFn: () =>
      api
        .get<NotificationsListResponse>("/notifications", { params })
        .then((r) => r.data),
    enabled: options?.enabled ?? true,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: options?.staleTime,
    refetchOnMount: options?.refetchOnMount,
  });

export const useUnreadCount = (options?: { enabled?: boolean }) =>
  useQuery<{ count: number }>({
    queryKey: unreadCountKey,
    queryFn: () =>
      api.get<{ count: number }>("/notifications/unread-count").then((r) => r.data),
    enabled: options?.enabled ?? true,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useDeleteAllNotifications = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api.delete<{ deletedCount: number }>("/notifications").then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: unreadCountKey });
    },
  });
};

export const useDeleteNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/notifications/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: unreadCountKey });
    },
  });
};

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.put<NotificationDto>(`/notifications/${id}/read`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: unreadCountKey });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api
        .put<{ modifiedCount: number }>("/notifications/mark-all-read")
        .then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: unreadCountKey });
    },
  });
};

export const useCreateTestNotification = () => {
  const qc = useQueryClient();

  return useMutation<NotificationDto>({
    mutationFn: () =>
      api.post<NotificationDto>("/notifications/test").then((r) => r.data),

    onSuccess: () => {
      // 1) Invalidate queries to trigger re-render
      // We invalidate broadly to ensure all lists (with different params) catch the update
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: unreadCountKey });
    },
  });
};
