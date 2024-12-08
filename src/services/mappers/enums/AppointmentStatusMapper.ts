// path: src/services/mappers/enums/AppointmentStatusMapper.ts

import {AppointmentStatus as PrismaAppointmentStatus} from "@prisma/client";
import {AppointmentStatus} from "@/services/dtos";

export class AppointmentStatusMapper {
    static toDtoStatus(status: PrismaAppointmentStatus): AppointmentStatus {
        switch (status) {
            case PrismaAppointmentStatus.PENDING:
                return AppointmentStatus.PENDING;
            case PrismaAppointmentStatus.CONFIRMED:
                return AppointmentStatus.CONFIRMED;
            case PrismaAppointmentStatus.CANCELLED:
                return AppointmentStatus.CANCELLED;
            case PrismaAppointmentStatus.RESCHEDULED:
                return AppointmentStatus.RESCHEDULED;
            case PrismaAppointmentStatus.COMPLETED:
                return AppointmentStatus.COMPLETED;
            case PrismaAppointmentStatus.MISSED:
                return AppointmentStatus.MISSED;
            case PrismaAppointmentStatus.IN_PROGRESS:
                return AppointmentStatus.IN_PROGRESS;
            default:
                throw new Error(`Invalid Appointment Status: ${status}`);
        }
    }

    static toPrismaStatus(status: AppointmentStatus): PrismaAppointmentStatus {
        switch (status) {
            case AppointmentStatus.PENDING:
                return PrismaAppointmentStatus.PENDING;
            case AppointmentStatus.CONFIRMED:
                return PrismaAppointmentStatus.CONFIRMED;
            case AppointmentStatus.CANCELLED:
                return PrismaAppointmentStatus.CANCELLED;
            case AppointmentStatus.RESCHEDULED:
                return PrismaAppointmentStatus.RESCHEDULED;
            case AppointmentStatus.COMPLETED:
                return PrismaAppointmentStatus.COMPLETED;
            case AppointmentStatus.MISSED:
                return PrismaAppointmentStatus.MISSED;
            case AppointmentStatus.IN_PROGRESS:
                return PrismaAppointmentStatus.IN_PROGRESS;
            default:
                throw new Error(`Invalid Appointment Status: ${status}`);
        }
    }

    static isValidStatus(status: AppointmentStatus): boolean {
        return Object.values(AppointmentStatus).includes(status);
    }
}

