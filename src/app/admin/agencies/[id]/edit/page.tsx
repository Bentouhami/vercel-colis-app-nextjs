// Path: src/app/dashboard/invoices/[id]/edit/page.tsx

import AgencyForm from "@/components/forms/admins/AgencyForm";

export const dynamic = 'force-dynamic'
/**
 * Edit invoice page component to edit an invoice
 * @param params - id of the invoice to edit
 * @constructor
 */
export default function EditAgencyPage({ params }: { params: { agencyId: string } }) {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Edit Agency</h1>
            <AgencyForm agencyId={parseInt(params.agencyId)} />
        </div>
    )
}

