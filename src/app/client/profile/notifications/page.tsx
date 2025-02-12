// path src/app/client/profile/notifications/page.tsx

import React from "react";
import NotificationsList from "@/components/client-specific/profile/NotificationsList";

export default function NotificationsPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <NotificationsList />
        </div>
    );
}