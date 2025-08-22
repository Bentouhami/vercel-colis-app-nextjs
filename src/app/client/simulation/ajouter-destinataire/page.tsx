import { Suspense } from "react"
import DestinatairesPageSkeleton from "./DestinatairesPageSkeleton";
import AddReceiverForm from "@/components/forms/EnvoiForms/AddReceiverForm";


export default function DestinatairesPage() {
    return (
        <Suspense fallback={<DestinatairesPageSkeleton />}>
            <AddReceiverForm />
        </Suspense>
    )
}
