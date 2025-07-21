// path: src/app/client/simulation/[id]/page.tsx

// import {Suspense} from "react";
// import SimulationResults from "@/components/client-specific/simulation/SimulationResults";

// export default function WrappedSimulationResults() {
//     return (
//         <Suspense fallback={<div>Loading...</div>}>
//             <div className="d-flex justify-content-around">
//                 <SimulationResults />
//             </div>

//         </Suspense>
//     );
// }


// path: src/app/client/simulation/results/page.tsx
"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import ResultsSkeleton from "@/app/client/simulation/results/resultsSkeleton";
import LoginPromptModal from "@/components/modals/LoginPromptModal";
import {
    deleteSimulationCookie,
    getSimulation,
} from "@/services/frontend-services/simulation/SimulationService";
import { updateSimulationUserId } from "@/services/backend-services/Bk_SimulationService";
import { checkAuthStatus } from "@/lib/auth-utils";
import { SimulationResponseDto } from "@/services/dtos";
import { SimulationStatus } from "@/services/dtos/enums/EnumsDto";

import ResultsHeader from "@/components/client-specific/simulation/results/ResultsHeader";
import ParcelGrid from "@/components/client-specific/simulation/results/ParcelGrid";
import SummaryWidgets from "@/components/client-specific/simulation/results/SummaryWidgets";
import PriceCard from "@/components/client-specific/simulation/results/PriceCard";
import ActionsBar from "@/components/client-specific/simulation/results/ActionsBar";
import InfoCard from "@/components/client-specific/simulation/results/InfoCard";

export default function SimulationResultsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [isActionInProgress, setIsActionInProgress] = useState(false);
    const [results, setResults] = useState<SimulationResponseDto | null>(null);

    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [userId, setUserId] = useState<string | number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /* ------------------- Auth ------------------- */
    useEffect(() => {
        (async () => {
            const auth = await checkAuthStatus(false);
            setIsAuthenticated(auth.isAuthenticated);
            setUserId(auth.userId || null);
        })();
    }, []);

    /* -------- Fetch simulation results ---------- */
    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await getSimulation();
            if (!data) {
                toast.error("Simulation introuvable.");
                router.push("/client/simulation");
                return;
            }
            toast.success("Résultats chargés.");
            setResults(data);
            setLoading(false);
        })();
    }, [router]);

    /* ---------------- Handlers ------------------ */
    const handleValidate = async () => {
        setIsActionInProgress(true);
        if (!results) return;
        if (isAuthenticated) {
            if (userId && !results.userId) {
                await updateSimulationUserId(results.id, Number(userId));
            }
            router.push("/client/simulation/ajouter-destinataire");
        } else {
            setShowLoginPrompt(true);
        }
        setIsActionInProgress(false);
    };

    const handleCancel = () => {
        setIsActionInProgress(true);
        startTransition(async () => {
            await deleteSimulationCookie();
            router.push("/client/simulation");
        });
    };

    const handleEdit = () => {
        setIsActionInProgress(true);
        router.push("/client/simulation/edit");
    };

    if (loading || !results) return <ResultsSkeleton />;

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-32">
            <ResultsHeader
                simulationId={results.id}
                status={results.simulationStatus ?? SimulationStatus.DRAFT}
            />

            <div className="grid sm:grid-cols-2 gap-6">
                <InfoCard
                    type="departure"
                    country={results.departureCountry}
                    city={results.departureCity}
                    agency={results.departureAgency}
                />
                <InfoCard
                    type="destination"
                    country={results.destinationCountry}
                    city={results.destinationCity}
                    agency={results.destinationAgency}
                />
            </div>

            <ParcelGrid parcels={results.parcels} />

            <SummaryWidgets
                totalWeight={results.totalWeight}
                departureDate={results.departureDate}
                arrivalDate={results.arrivalDate}
            />

            <PriceCard totalPrice={results.totalPrice ?? null} />

            <ActionsBar
                isActionInProgress={isActionInProgress || isPending}
                onValidate={handleValidate}
                onCancel={handleCancel}
                onEdit={handleEdit}
            />

            <LoginPromptModal
                show={showLoginPrompt}
                handleClose={() => setShowLoginPrompt(false)}
                handleLoginRedirect={() => {
                    setShowLoginPrompt(false);
                    router.push(
                        `/client/auth/login?redirect=${encodeURIComponent(
                            "/client/simulation/results",
                        )}`,
                    );
                }}
            />
        </div>
    );
}
