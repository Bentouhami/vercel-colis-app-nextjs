// path src/services/frontend-services/NotificationService.ts src/services/frontend-services/NotificationService.ts

import {NotificationDto} from "@/services/dtos/notifications/NotificationDto";
import {getCurrentUserId} from "@/lib/auth";
import apiClient from "@/utils/axiosInstance";

export async function fetchUserNotifications(userId: string | number | null): Promise<NotificationDto[]> {
    const response = await apiClient.get(`/notifications/user/${userId}`);
    return response.data;
}

export async function createNotification(notification: NotificationDto): Promise<NotificationDto> {
    const response = await apiClient.post(`/notifications`, notification);
    return response.data;
}

export async function updateNotification(notification: NotificationDto): Promise<NotificationDto> {
    const response = await apiClient.put(`/notifications/${notification.id}`, notification);
    return response.data;
}

export async function deleteNotification(notificationId: number): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`);
}



