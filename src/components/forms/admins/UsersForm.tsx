// src/components/forms/admins/UsersForm.tsx

import ProfileComponent from "@/components/client-specific/profile/ProfileComponent"

export default function UsersForm({ userId }: { userId: string }) {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <ProfileComponent
                userId={userId}
                isAdminView={true}
                showEditButton={true}
                onUserUpdated={(user) => {
                    console.log('User profile updated:', user)
                    // Add any additional logic here
                }}
            />
        </div>
    )
}