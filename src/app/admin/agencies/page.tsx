// path: src/app/admin/agencies/page.tsx

import React from 'react'
import AgenciesList from "@/components/admin/collections/AgenciesList";

/**
 * This page is used to manage agencies. It displays a list of agencies and allows users to create, edit, and delete agencies. It also provides a search functionality to filter agencies by name. The page uses the AgencyList component to display the list of agencies and the AgencyForm component to create, edit, and delete agencies.
 * for AGENCY-ADMIN role and SUPER_ADMIN role
 */
const AgenciesPage = () => {
    // get all agencies from the database and set them to the state variable
    return (
            <AgenciesList />
    )
}
export default AgenciesPage
