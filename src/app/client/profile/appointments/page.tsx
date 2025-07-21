// src/app/client/profile/appointments/page.tsx

import React from "react";
import AppointmentsList from "@/components/client-specific/profile/AppointmentsComponent";

export default function AppointmentsPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Mes Rendez-vous</h1>
            <AppointmentsList />
        </div>
    );
}
