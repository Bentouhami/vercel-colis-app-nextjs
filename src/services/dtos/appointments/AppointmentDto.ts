// path:


// -------------------- Appointment DTOs --------------------
import {EnvoiDto} from "@/services/dtos/envois/EnvoiDto";
import {AgencyDto} from "@/services/dtos/agencies/AgencyDto";
import {AppointmentStatus} from "@/services/dtos/enums/EnumsDto";

export interface AppointmentDto {
    id?: number;
    envoiId: number;
    envoi?: EnvoiDto;
    agencyId: number;
    agency?: AgencyDto;
    date: Date;
    status: AppointmentStatus;
}

// DTO for creating a new appointment
export interface CreateAppointmentDto extends Omit<AppointmentDto, "id" | "envoi" | "agency" | "status"> {
}

// DTO for updating an existing appointment
export interface UpdateAppointmentDto extends Partial<CreateAppointmentDto> {
    id: number;
}
