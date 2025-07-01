// path: src/services/frontend-services/appointement/AppointmentService.ts
import {AppointmentDto} from "@/services/dtos/appointments/AppointmentDto";
import {getCurrentUserId} from "@/lib/auth";
import apiClient from "@/utils/axiosInstance";

export async function fetchUserAppointments(userId: string | number | null): Promise<AppointmentDto[]> {

    if (!userId) {
        return [];
    }
    const response = await apiClient.get(`/appointments/user/${userId}`);
    return response.data;
}

export async function createAppointment(appointment: AppointmentDto): Promise<AppointmentDto> {
    const response = await apiClient.post(`/appointments`, appointment);
    return response.data;
}

export async function updateAppointment(appointment: AppointmentDto): Promise<AppointmentDto> {
    const response = await apiClient.put(`/appointments/${appointment.id}`, appointment);
    return response.data;
}

export async function deleteAppointment(appointmentId: number): Promise<void> {
    await apiClient.delete(`/appointments/${appointmentId}`);
}