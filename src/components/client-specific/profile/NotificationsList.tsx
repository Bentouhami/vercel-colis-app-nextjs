// path src/components/client-specific/profile/NotificationsList.tsx

"use client";

import React, { useEffect, useState } from "react";
import { getCurrentUserId } from "@/lib/auth-utils";
import { fetchUserNotifications } from "@/services/frontend-services/NotificationService";
import { NotificationDto } from "@/services/dtos/notifications/NotificationDto";

export default function NotificationsList() {
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);

    useEffect(() => {
        (async () => {
            const userId = await getCurrentUserId();
            if (!userId) return;
            const data = await fetchUserNotifications(userId);
            setNotifications(data);
        })();
    }, []);

    return (
        <ul>
            {notifications.map((notif) => (
                <li key={notif.id}>
                    {notif.message}
                </li>
            ))}
        </ul>
    );
}