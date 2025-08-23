// path: src/services/dtos/enums/EnumsDto.ts

// Enums matching the database schema
export enum RoleDto {
  CLIENT = "CLIENT",
  SUPER_ADMIN = "SUPER_ADMIN",
  DESTINATAIRE = "DESTINATAIRE",
  AGENCY_ADMIN = "AGENCY_ADMIN",
  ACCOUNTANT = "ACCOUNTANT",
}

// admin roles
export enum AdminRoleDto {
  SUPER_ADMIN = "SUPER_ADMIN",
  AGENCY_ADMIN = "AGENCY_ADMIN",
  ACCOUNTANT = "ACCOUNTANT",
}

export enum SimulationStatusDto {
  DRAFT = "DRAFT",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum EnvoiStatusDto {
  PENDING = "PENDING",
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
}

export enum PaymentStatusDto {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum AppointmentStatusDto {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  RESCHEDULED = "RESCHEDULED",
  COMPLETED = "COMPLETED",
  MISSED = "MISSED",
  IN_PROGRESS = "IN_PROGRESS",
}
