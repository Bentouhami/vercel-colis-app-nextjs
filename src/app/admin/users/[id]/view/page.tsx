// src/app/admin/users/[id]/view/page.tsx

import ProfileComponent from "@/components/client-specific/profile/ProfileComponent"

type AdminUserViewProps = {
    params: Promise<{
        id: string
    }>
}

export default async function AdminUserView({ params }: AdminUserViewProps) {
    const resolvedParams = await params

    return (
        <div className="w-full max-w-4xl mx-auto">
            <ProfileComponent
                userId={resolvedParams.id}
                isAdminView={true}
                showEditButton={false} // Read-only mode
            />
        </div>
    )
}
