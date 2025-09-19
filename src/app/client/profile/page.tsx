
// 1. Current user viewing their own profile (existing usage)
// src/app/client/profile/page.tsx

import ProfileComponent from "@/components/client-specific/profile/ProfileComponent"

function UserProfilePage() {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <ProfileComponent />
        </div>
    )
}

export default UserProfilePage