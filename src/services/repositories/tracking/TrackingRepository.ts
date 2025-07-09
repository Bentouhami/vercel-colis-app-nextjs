// src/services/repositories/tracking/TrackingRepository.ts
import {TrackingEventStatus} from "@prisma/client";
import { prisma } from "@/utils/db";
import { RoleDto } from "@/services/dtos/enums/EnumsDto";

export const trackingRepository = {
    async addEvent(data: {
        envoiId: number;
        status: TrackingEventStatus;
        location?: string;
        description?: string;
    }) {
        return prisma.$transaction(async (tx) => {
            const event = await tx.trackingEvent.create({
                data: {
                    envoiId: data.envoiId,
                    eventStatus: data.status,
                    location: data.location,
                    description: data.description,
                },
            });

            // si DELIVERED → mise à jour envoi
            if (data.status === 'DELIVERED') {
                await tx.envoi.update({
                    where: {id: data.envoiId},
                    data: {envoiStatus: 'DELIVERED'},
                });
            }
            return event;
        });
    },

    async adminAddEvent(
        userRole: RoleDto,
        data: { envoiId: number; status: TrackingEventStatus; location?: string; description?: string }
    ) {
        if (userRole !== RoleDto.AGENCY_ADMIN && userRole !== RoleDto.SUPER_ADMIN)
            throw new Error("Forbidden");

        return trackingRepository.addEvent(data);   // réutilise l’existant
    },

    async listByTrackingNumber(trackingNumber: string) {
        return prisma.trackingEvent.findMany({
            where: {envoi: {trackingNumber}},
            orderBy: {createdAt: 'asc'},
        });
    },
};
