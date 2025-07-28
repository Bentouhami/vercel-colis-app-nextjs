// src/app/client/simulation/page.tsx

import { Suspense } from "react"
import SimulationFormWizard from "@/components/forms/SimulationForms/SimulationFormWizard"
import SimulationSkeleton from "@/components/skeletons/SimulationSkeleton"
import { PageLayout } from "@/components/ui/PageLayout"
import { Calculator } from "lucide-react"

const SimulationPage = () => {
    return (
        <PageLayout
            title="Simulation d'envoi"
            subtitle="Calculez le coût de votre envoi en quelques étapes"
            icon={<Calculator className="h-6 w-6 text-primary" />}
            maxWidth="2xl"
        >
            <Suspense fallback={<SimulationSkeleton />}>
                <SimulationFormWizard />
            </Suspense>
        </PageLayout>
    )
}

export default SimulationPage
