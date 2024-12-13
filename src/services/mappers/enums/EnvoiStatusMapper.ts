import {EnvoiStatus as PrismaEnvoiStatus} from "@prisma/client";
import {EnvoiStatus} from "@/services/dtos";

export class EnvoiStatusMapper {
    static toDtoStatus(status: PrismaEnvoiStatus): EnvoiStatus {
        switch (status) {
            case PrismaEnvoiStatus.PENDING:
                return EnvoiStatus.PENDING;
            case PrismaEnvoiStatus.SENT:
                return EnvoiStatus.SENT;
            case PrismaEnvoiStatus.DELIVERED:
                return EnvoiStatus.DELIVERED;
            case PrismaEnvoiStatus.CANCELLED:
                return EnvoiStatus.CANCELLED;
            case PrismaEnvoiStatus.RETURNED:
                return EnvoiStatus.RETURNED;
            default:
                throw new Error(`Invalid Envoi Status: ${status}`);
        }
    }

    static toPrismaStatus(envoiStatus: EnvoiStatus): PrismaEnvoiStatus {
        switch (envoiStatus) {
            case EnvoiStatus.PENDING:
                return PrismaEnvoiStatus.PENDING;
            case EnvoiStatus.SENT:
                return PrismaEnvoiStatus.SENT;
            case EnvoiStatus.DELIVERED:
                return PrismaEnvoiStatus.DELIVERED;
            case EnvoiStatus.CANCELLED:
                return PrismaEnvoiStatus.CANCELLED;
            case EnvoiStatus.RETURNED:
                return PrismaEnvoiStatus.RETURNED;
            default:
                throw new Error(`Invalid Envoi Status: ${envoiStatus}`);
        }
    }
}