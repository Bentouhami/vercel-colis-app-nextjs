// src/components/admin/UserProfileManager.tsx

import { useState } from 'react'
import ProfileComponent from "@/components/client-specific/profile/ProfileComponent"
import { Button } from "@/components/ui/button"
import type { ProfileDto } from "@/services/dtos/users/UserDto"
import { toast } from 'sonner';

interface UserProfileManagerProps {
    userId: string
    userRole: 'SUPER_ADMIN' | 'AGENCY_ADMIN'
}

export default function UserProfileManager({ userId, userRole }: UserProfileManagerProps) {
    const [refreshKey, setRefreshKey] = useState(0)

    const handleUserUpdated = (updatedUser: ProfileDto) => {
        toast(`${updatedUser.firstName} ${updatedUser.lastName}'s profile has been updated successfully.`)

        // Force refresh if needed
        setRefreshKey(prev => prev + 1)
    }

    const canEdit = userRole === 'SUPER_ADMIN' || userRole === 'AGENCY_ADMIN'

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">User Profile Management</h1>
                <Button
                    onClick={() => setRefreshKey(prev => prev + 1)}
                    variant="outline"
                >
                    Refresh
                </Button>
            </div>

            <ProfileComponent
                key={refreshKey} // Force re-render when refreshKey changes
                userId={userId}
                isAdminView={true}
                showEditButton={canEdit}
                onUserUpdated={handleUserUpdated}
            />
        </div>
    )
}