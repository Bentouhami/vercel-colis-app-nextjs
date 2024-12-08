// path: src/app/admin/super-admin/agencies/[id]/page.tsx
'use client';
import React from 'react'
import {useParams} from "next/navigation";

/**
 * This page is used to manage the settings of an agency by an admin of the agency
 */
const AgencyAdminPage = () => {
    const {id} = useParams();


    return (
        <div>
            <h1>Agency Admin Page - {id}</h1>
        </div>
    )
}

export default AgencyAdminPage
