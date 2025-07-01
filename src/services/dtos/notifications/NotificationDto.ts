// path: src/services/dtos/notifications/NotificationDto.ts


// -------------------- Notification DTOs --------------------
export interface NotificationDto {
    id?: number;
    message: string;
    envoisId: number;
    agencyId: number;
    userId: number;
    destinataireId: number;
    envoiId: number;
    isRead: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
