// path: src/components/client-specific/profile/AppointmentsList.tsx

"use client";
import React, { useEffect, useState } from "react";
import { getCurrentUserId } from "@/lib/auth-utils";
import { AppointmentDto } from "@/services/dtos/appointments/AppointmentDto";
import {fetchUserAppointments} from "@/services/frontend-services/appointement/AppointmentService";

export default function AppointmentsList() {
    const [appointments, setAppointments] = useState<AppointmentDto[]>([]);

    useEffect(() => {
        (async () => {
            const userId = await getCurrentUserId();
            if (!userId) return;
            const data = await fetchUserAppointments(userId);
            setAppointments(data);
        })();
    }, []);

    return (
        <ul>
            {appointments.map((apt) => (
                <li key={apt.id}>
                    Rendez-vous #{apt.id} le {apt.date.toString()} — Status: {apt.status}
                </li>
            ))}
        </ul>
    );
}
