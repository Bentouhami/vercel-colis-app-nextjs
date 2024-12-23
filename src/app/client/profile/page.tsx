import ProfileComponent from "@/components/client-specific/profile/ProfileComponent";
import RequireAuth from "@/components/auth/RequireAuth";


function Profile() {
    return (
        <RequireAuth>
            <ProfileComponent />
        </RequireAuth>
    );
}

export default Profile
