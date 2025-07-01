"use client";
import React, { useEffect, useState } from "react";
import { ProfileDto } from "@/services/dtos";
import { getCurrentUserId } from "@/lib/auth";
import { getUserProfileById } from "@/services/frontend-services/UserService";
import EditProfileForm from "@/components/forms/AuthForms/EditProfileForm";

export default function SettingsComponent() {
    const [userData, setUserData] = useState<ProfileDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserData() {
            try {
                setLoading(true);
                const userId = await getCurrentUserId();
                if (userId) {
                    const user = await getUserProfileById(Number(userId));
                    setUserData(user);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Chargement...</div>;
    }

    return (
        <div>
            <EditProfileForm initialData={userData} />
        </div>
    );
}
