import { Suspense } from "react"
import SimulationFormWizard from "@/components/forms/SimulationForms/SimulationFormWizard"
import SimulationSkeleton from "@/components/skeletons/SimulationSkeleton"
import { PageLayout } from "@/components/ui/PageLayout"
import { Edit } from "lucide-react"

export default function EditSimulationPage() {
    return (
        <PageLayout
            title="Modifier la simulation"
            subtitle="Modifiez les détails de votre simulation d'envoi"
            icon={<Edit className="h-6 w-6 text-primary" />}
            maxWidth="2xl"
        >
            <Suspense fallback={<SimulationSkeleton />}>
                <SimulationFormWizard isEditMode={true} />
            </Suspense>
        </PageLayout>
    )
}
