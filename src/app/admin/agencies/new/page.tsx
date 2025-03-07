// path: src/app/dashboard/invoices/new/page.tsx
import AgencyForm from "@/components/forms/admins/AgencyForm";

export const dynamic = 'force-dynamic'

export default function AgencyNewPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Ajouter un agence</h1>
            <AgencyForm />
        </div>
    )
}

