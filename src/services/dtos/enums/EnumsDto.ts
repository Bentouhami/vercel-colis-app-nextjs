// path: src/services/dtos/enums/EnumsDto.ts


// Enums matching the database schema
export enum RoleDto {
    CLIENT = 'CLIENT',
    SUPER_ADMIN = 'SUPER_ADMIN',
    DESTINATAIRE = 'DESTINATAIRE',
    AGENCY_ADMIN = 'AGENCY_ADMIN',
    ACCOUNTANT = 'ACCOUNTANT'
}

export enum SimulationStatus {
    DRAFT = 'DRAFT',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum EnvoiStatus {
    PENDING = 'PENDING',
    SENT = 'SENT',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    RETURNED = 'RETURNED'
}

export enum AppointmentStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    RESCHEDULED = 'RESCHEDULED',
    COMPLETED = 'COMPLETED',
    MISSED = 'MISSED',
    IN_PROGRESS = 'IN_PROGRESS'
}
