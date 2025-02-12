// src/app/client/profile/settings/page.tsx

import React from "react";
import SettingsComponent from "@/components/client-specific/profile/SettingsComponent";

export default function SettingsPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Paramètres du Profil</h1>
            <SettingsComponent />
        </div>
    );
}
