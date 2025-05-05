// path: src/app/admin/agencies/page.tsx

import AgenciesList from "@/components/admin/collections/AgenciesList";
import {RoleDto} from "@/services/dtos";
import {useSession} from "next-auth/react";

export default function AgenciesPage() {

    return (
        <AgenciesList />
    );
}
