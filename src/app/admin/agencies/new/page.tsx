// path: src/app/dashboard/invoices/new/page.tsx
export const dynamic = 'force-dynamic'
import InvoiceForm from '@/components/dashboard/forms/InvoiceForm'

export default function NewInvoicePage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Create New Invoice</h1>
            <InvoiceForm />
        </div>
    )
}

