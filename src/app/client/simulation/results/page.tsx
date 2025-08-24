"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PageLayout } from "@/components/ui/PageLayout"
import { Button } from "@/components/ui/button"
import ResultsSkeleton from "./resultsSkeleton"
import LoginPromptModal from "@/components/modals/LoginPromptModal"
import { deleteSimulationCookie, getSimulation } from "@/services/frontend-services/simulation/SimulationService"
import { updateSimulationUserId } from "@/services/backend-services/Bk_SimulationService"
import { checkAuthStatus } from "@/lib/auth-utils"
import type { SimulationResponseDto } from "@/services/dtos"
import SimulationResultsLayout from "@/components/client-specific/simulation/results/SimulationResultsLayout"
import { PackageSearch, Share2, Download } from "lucide-react"

export default function SimulationResultsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()
    const [isActionInProgress, setIsActionInProgress] = useState(false)
    const [results, setResults] = useState<SimulationResponseDto | null>(null)
    const [showLoginPrompt, setShowLoginPrompt] = useState(false)
    const [userId, setUserId] = useState<string | number | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    /* ------------------- Auth ------------------- */
    useEffect(() => {
        ; (async () => {
            const auth = await checkAuthStatus(false)
            setIsAuthenticated(auth.isAuthenticated)
            setUserId(auth.userId || null)
        })()
    }, [])

    /* -------- Fetch simulation results ---------- */
    useEffect(() => {
        ; (async () => {
            setLoading(true)
            try {
                const data = await getSimulation()
                if (!data) {
                    toast.error("Simulation introuvable.")
                    router.push("/client/simulation")
                    return
                }
                toast.success("Résultats chargés avec succès !")
                setResults(data)
            } catch (error) {
                console.error("Error fetching simulation:", error)
                toast.error("Erreur lors du chargement des résultats.")
                router.push("/client/simulation")
            } finally {
                setLoading(false)
            }
        })()
    }, [router])

    /* ---------------- Handlers ------------------ */
    const handleValidate = async () => {
        setIsActionInProgress(true)
        try {
            if (!results) return
            if (isAuthenticated) {
                if (userId && !results.userId) {
                    await updateSimulationUserId(results.id, Number(userId))
                }
                toast.success("Redirection vers l'ajout du destinataire...")
                router.push("/client/simulation/ajouter-destinataire")
            } else {
                setShowLoginPrompt(true)
            }
        } catch (error) {
            console.error("Error validating simulation:", error)
            toast.error("Erreur lors de la validation.")
        } finally {
            setIsActionInProgress(false)
        }
    }

    const handleCancel = () => {
        setIsActionInProgress(true)
        startTransition(async () => {
            try {
                await deleteSimulationCookie()
                toast.success("Simulation annulée.")
                router.push("/client/simulation")
            } catch (error) {
                console.error("Error canceling simulation:", error)
                toast.error("Erreur lors de l'annulation.")
            }
        })
    }

    const handleEdit = () => {
        setIsActionInProgress(true)
        toast.info("Redirection vers l'édition...")
        router.push("/client/simulation/edit")
    }

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Simulation d'envoi - ${results?.parcels.length} colis`,
                    text: `Découvrez ma simulation d'envoi de ${results?.parcels.length} colis`,
                    url: window.location.href,
                })
            } else {
                await navigator.clipboard.writeText(window.location.href)
                toast.success("Lien copié dans le presse-papiers !")
            }
        } catch (error) {
            console.error("Error sharing:", error)
            toast.error("Erreur lors du partage.")
        }
    }

    const handleExport = () => {
        if (!results) return
        const data = {
            departure: {
                country: results.departureCountry,
                city: results.departureCity,
                agency: results.departureAgency,
            },
            destination: {
                country: results.destinationCountry,
                city: results.destinationCity,
                agency: results.destinationAgency,
            },
            parcels: results.parcels,
            totalWeight: results.totalWeight,
            totalPrice: results.totalPrice,
            dates: {
                departure: results.departureDate,
                arrival: results.arrivalDate,
            },
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `simulation.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success("Simulation exportée !")
    }

    if (loading || !results) return <ResultsSkeleton />

    const headerActions = (
        <>
            <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Partager
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
            </Button>
        </>
    )

    return (
        <PageLayout
            title="Résultats de simulation"
            subtitle={`${results.parcels.length} colis`}
            icon={<PackageSearch className="h-6 w-6 text-primary" />}
            headerActions={headerActions}
            maxWidth="full"
        >
            <SimulationResultsLayout
                results={results}
                isActionInProgress={isActionInProgress || isPending}
                onValidate={handleValidate}
                onCancel={handleCancel}
                onEdit={handleEdit}
                onShare={handleShare}
                onExport={handleExport}
            />

            <LoginPromptModal
                show={showLoginPrompt}
                handleClose={() => setShowLoginPrompt(false)}
                handleLoginRedirect={() => {
                    setShowLoginPrompt(false)
                    router.push(`/auth/login?redirect=${encodeURIComponent("/client/simulation/results")}`)
                }}
            />
        </PageLayout>
    )
}
