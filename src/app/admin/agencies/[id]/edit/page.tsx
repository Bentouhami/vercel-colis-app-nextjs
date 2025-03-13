// Path: src/app/dashboard/invoices/[id]/edit/page.tsx
import AgencyForm from "@/components/forms/admins/AgencyForm";

export const dynamic = 'force-dynamic';

export default function EditAgencyPage({ params }: { params: { id: string } }) {
    console.log("🔍 Full params object:", params);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Edit Agency</h1>
            <AgencyForm agencyId={parseInt(params.id, 10)} />
        </div>
    );
}
