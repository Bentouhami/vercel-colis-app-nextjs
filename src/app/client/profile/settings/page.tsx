import SettingsComponent from '@/components/client-specific/profile/SettingsComponent';
// src/app/client/profile/settings/page.tsx
import { redirect } from 'next/navigation';

export default function SettingsPage() {
    return (
        <div className="w-full">
            <div className="mb-6 hidden"> {/* This header is now handled by SettingsComponent */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Paramètres du Profil</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Modifiez vos informations personnelles et préférences</p>
            </div>
            <SettingsComponent />
        </div>
    )
}
