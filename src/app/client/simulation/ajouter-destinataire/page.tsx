import { Suspense } from "react"
import AddReceiverForm from "@/components/forms/EnvoiForms/AddReceiverForm"
import DestinaireSkeleton from "./destinataireSkeleton"
import { PageLayout } from "@/components/ui/PageLayout"
import { UserPlus } from "lucide-react"

export default function AjouterDestinairePage() {
    return (
        <PageLayout
            title="Ajouter un destinataire"
            subtitle="Renseignez les informations du destinataire de votre envoi"
            icon={<UserPlus className="h-6 w-6 text-primary" />}
            maxWidth="lg"
        >
            <Suspense fallback={<DestinaireSkeleton />}>
                <AddReceiverForm />
            </Suspense>
        </PageLayout>
    )
}
