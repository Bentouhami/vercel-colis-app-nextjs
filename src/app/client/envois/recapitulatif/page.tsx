"use client"

import { useEffect, useState, useTransition, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getSimulation } from "@/services/frontend-services/simulation/SimulationService"
import { getUserById } from "@/services/frontend-services/UserService"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { PageLayout } from "@/components/ui/PageLayout"
import { InfoCard } from "@/components/ui/InfoCard"
import { ActionBar } from "@/components/ui/ActionBar"
import {
    Calendar,
    CreditCard,
    MapPin,
    Package,
    Truck,
    User,
    Weight,
    XCircle,
    ArrowLeft,
    Download,
    Share2,
    CheckCircle,
    AlertTriangle,
    Loader2,
    RefreshCw,
    Clock,
    Euro,
    Mail,
    Phone,
    Edit3,
    Copy,
    Shield,
    FileText,
    UserX,
    LogIn,
} from "lucide-react"
import { type CreateDestinataireDto, RoleDto, type SimulationResponseDto } from "@/services/dtos"
import RequireAuth from "@/components/auth/RequireAuth"
import { useSession } from "next-auth/react"
import { isAdminRole } from "@/lib/auth-utils"

interface SimulationDataType extends SimulationResponseDto {
    sender: CreateDestinataireDto
    destinataire: CreateDestinataireDto
}

interface LoadingState {
    simulation: boolean
    users: boolean
    payment: boolean
}

export default function EnvoiRecapPage() {
    const [simulationData, setSimulationData] = useState<SimulationDataType | null>(null)
    const [loadingState, setLoadingState] = useState<LoadingState>({
        simulation: true,
        users: false,
        payment: false,
    })
    const [error, setError] = useState<string | null>(null)
    const [retryCount, setRetryCount] = useState(0)
    const [currentStep, setCurrentStep] = useState(0)
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const { data: session } = useSession()

    // Check if current user is admin role
    const isCurrentUserAdmin = useMemo(() => {
        return session?.user?.role ? isAdminRole(session.user.role as RoleDto) : false
    }, [session?.user?.role])

    // Memoized loading status
    const isLoading = useMemo(() => {
        return Object.values(loadingState).some(Boolean)
    }, [loadingState])

    // Memoized price formatting
    const formattedPrice = useMemo(() => {
        if (!simulationData?.totalPrice) return "À calculer"
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(simulationData.totalPrice)
    }, [simulationData?.totalPrice])

    // Memoized date formatting
    const formatDate = useCallback((date: string | Date) => {
        return new Intl.DateTimeFormat("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date))
    }, [])

    // Calculate delivery duration
    const deliveryDuration = useMemo(() => {
        if (!simulationData?.departureDate || !simulationData?.arrivalDate) return null
        const departure = new Date(simulationData.departureDate)
        const arrival = new Date(simulationData.arrivalDate)
        const diffTime = Math.abs(arrival.getTime() - departure.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }, [simulationData?.departureDate, simulationData?.arrivalDate])

    const loadSimulationData = useCallback(async (currentRetryCount = 0) => {
        console.log(`🔄 Loading simulation data (attempt ${currentRetryCount + 1})...`)
        setError(null)
        setCurrentStep(0)
        setLoadingState((prev) => ({ ...prev, simulation: true }))

        try {
            setCurrentStep(1)
            const simulation = await getSimulation()
            if (!simulation) {
                throw new Error("Impossible de trouver les données de simulation. Réessayez ou contactez le support.")
            }

            if (!simulation.userId || !simulation.destinataireId) {
                throw new Error("Données utilisateur manquantes dans la simulation.")
            }

            setCurrentStep(2)
            setLoadingState((prev) => ({ ...prev, simulation: false, users: true }))

            console.log("👥 Loading user data...")
            const [senderData, destinataireData] = await Promise.all([
                getUserById(simulation.userId),
                getUserById(simulation.destinataireId),
            ])

            if (!senderData || !destinataireData) {
                throw new Error("Impossible de récupérer les données utilisateur.")
            }

            setCurrentStep(3)
            const completeData: SimulationDataType = {
                ...simulation,
                sender: senderData,
                destinataire: destinataireData,
            }

            setSimulationData(completeData)
            console.log("✅ Simulation data loaded successfully:", completeData)

            if (currentRetryCount > 0) {
                toast.success("Données chargées avec succès !")
            }
        } catch (error: any) {
            console.error("💥 Error loading simulation data:", error)
            const errorMessage = error.message || "Une erreur est survenue lors du chargement des données."
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoadingState({ simulation: false, users: false, payment: false })
            setCurrentStep(0)
        }
    }, [])

    useEffect(() => {
        loadSimulationData(0)
    }, [loadSimulationData])

    const handlePaymentRedirect = useCallback(async () => {
        if (!simulationData?.totalPrice || !simulationData?.id) {
            toast.error("Données de simulation incomplètes.")
            return
        }

        if (isCurrentUserAdmin) {
            toast.error("Les comptes administrateurs ne peuvent pas effectuer de paiements personnels.")
            return
        }

        setLoadingState((prev) => ({ ...prev, payment: true }))
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            toast.success("Redirection vers le paiement sécurisé...")
            // ✅ SÉCURISÉ: Passer seulement l'ID de simulation
            router.push(`/client/payment?simulationId=${simulationData.id}`)
        } catch (error) {
            toast.error("Erreur lors de la redirection vers le paiement.")
        } finally {
            setLoadingState((prev) => ({ ...prev, payment: false }))
        }
    }, [simulationData, router, isCurrentUserAdmin])

    const handleRetry = useCallback(() => {
        const newRetryCount = retryCount + 1
        setRetryCount(newRetryCount)
        loadSimulationData(newRetryCount)
    }, [retryCount, loadSimulationData])

    const handleGoBack = useCallback(() => {
        router.push("/client/simulation")
    }, [router])

    const handleEdit = useCallback(() => {
        router.push("/client/simulation/edit")
    }, [router])

    const handleSwitchToPersonalAccount = useCallback(() => {
        toast.info("Veuillez vous connecter avec votre compte personnel pour effectuer des paiements.")
        router.push("/auth/login?returnUrl=" + encodeURIComponent(window.location.href))
    }, [router])

    const handleCreatePersonalAccount = useCallback(() => {
        toast.info("Créez un compte personnel pour effectuer des envois.")
        router.push("/auth/register?returnUrl=" + encodeURIComponent(window.location.href))
    }, [router])

    const handleDownload = useCallback(() => {
        if (!simulationData) return

        const summary = `═══════════════════════════════════════════════════════════════
                    RÉCAPITULATIF D'ENVOI
═══════════════════════════════════════════════════════════════

📋 INFORMATIONS GÉNÉRALES
──────────────────────────────────────────────────────────────
Date de création: ${new Date().toLocaleString("fr-FR")}
Statut: Confirmé

👤 EXPÉDITEUR
──────────────────────────────────────────────────────────────
Nom complet: ${simulationData.sender.firstName} ${simulationData.sender.lastName}
Email: ${simulationData.sender.email}
Téléphone: ${simulationData.sender.phoneNumber}

👥 DESTINATAIRE
──────────────────────────────────────────────────────────────
Nom complet: ${simulationData.destinataire.firstName} ${simulationData.destinataire.lastName}
Email: ${simulationData.destinataire.email}
Téléphone: ${simulationData.destinataire.phoneNumber}

🗺️  ITINÉRAIRE
──────────────────────────────────────────────────────────────
🚀 DÉPART
   Pays: ${simulationData.departureCountry}
   Ville: ${simulationData.departureCity}
   Agence: ${simulationData.departureAgency}

🎯 ARRIVÉE
   Pays: ${simulationData.destinationCountry}
   Ville: ${simulationData.destinationCity}
   Agence: ${simulationData.destinationAgency}

📦 DÉTAILS DE L'ENVOI
──────────────────────────────────────────────────────────────
Nombre de colis: ${simulationData.parcels?.length || 0}
Poids total: ${simulationData.totalWeight} kg
Durée estimée: ${deliveryDuration || "N/A"} jour(s)

📅 PLANNING
──────────────────────────────────────────────────────────────
Date de départ: ${formatDate(simulationData.departureDate)}
Date d'arrivée: ${formatDate(simulationData.arrivalDate)}

💰 TARIFICATION
──────────────────────────────────────────────────────────────
PRIX TOTAL: ${formattedPrice}
${simulationData.totalPrice ? "✅ Prix confirmé" : "⏳ Prix en cours de calcul"}

──────────────────────────────────────────────────────────────
📞 CONTACT SUPPORT: +32 123 456 789
🌐 SITE WEB: www.colisapp.com
📧 EMAIL: support@colisapp.com

Ce document a été généré automatiquement le ${new Date().toLocaleString("fr-FR")}
© ColisApp - Tous droits réservés
══════════════════════════════════════════════════════════════
    `.trim()

        const blob = new Blob([summary], { type: "text/plain;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `recapitulatif-envoi.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast.success("📄 Récapitulatif téléchargé avec succès !")
    }, [simulationData, formattedPrice, formatDate, deliveryDuration])

    const handleShare = useCallback(async () => {
        if (!simulationData) return

        const shareData = {
            title: "📦 Récapitulatif d'envoi - ColisApp",
            text: `Envoi de ${simulationData.sender.firstName} vers ${simulationData.destinataire.firstName} (${simulationData.departureCity} → ${simulationData.destinationCity}) - ${formattedPrice}`,
            url: window.location.href,
        }

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData)
                toast.success("🚀 Partagé avec succès !")
            } else {
                const textToCopy = `${shareData.title}\n${shareData.text}\n${shareData.url}`
                await navigator.clipboard.writeText(textToCopy)
                toast.success("📋 Informations copiées dans le presse-papiers !")
            }
        } catch (error) {
            console.error("Error sharing:", error)
            toast.error("❌ Impossible de partager")
        }
    }, [simulationData, formattedPrice])

    

    if (isLoading) {
        return (
            <PageLayout
                title="Chargement du récapitulatif"
                subtitle="Récupération des données de votre envoi"
                icon={<FileText className="h-6 w-6 text-primary" />}
            >
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Chargement en cours...</h3>
                        <p className="text-muted-foreground mb-4">
                            {currentStep === 1 && "Récupération des données de simulation..."}
                            {currentStep === 2 && "Chargement des informations utilisateur..."}
                            {currentStep === 3 && "Finalisation des données..."}
                            {currentStep === 0 && "Préparation..."}
                        </p>
                        <Progress value={(currentStep / 3) * 100} className="w-64 mx-auto" />
                    </div>
                </div>
            </PageLayout>
        )
    }

    if (error) {
        return (
            <RequireAuth allowedRoles={[RoleDto.CLIENT, RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT]}>
                <PageLayout
                    title="Erreur de chargement"
                    subtitle="Une erreur s'est produite lors du chargement"
                    icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
                >
                    <Card>
                        <CardContent className="p-8 text-center space-y-6">
                            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                                <AlertTriangle className="h-8 w-8 text-destructive" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Oups ! Une erreur s&apos;est produite</h3>
                                <p className="text-muted-foreground">{error}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button onClick={handleRetry}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Réessayer
                                </Button>
                                <Button variant="outline" onClick={handleGoBack}>
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Retour à la simulation
                                </Button>
                            </div>
                            {retryCount > 1 && (
                                <Badge variant="secondary" className="text-xs">
                                    Tentative #{retryCount}
                                </Badge>
                            )}
                        </CardContent>
                    </Card>
                </PageLayout>
            </RequireAuth>
        )
    }

    if (!simulationData) {
        return (
            <RequireAuth allowedRoles={[RoleDto.CLIENT, RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT]}>
                <PageLayout
                    title="Aucune donnée trouvée"
                    subtitle="Aucune simulation n'a été trouvée"
                    icon={<Package className="h-6 w-6 text-muted-foreground" />}
                >
                    <Card>
                        <CardContent className="p-8 text-center space-y-6">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Aucune donnée trouvée</h3>
                                <p className="text-muted-foreground">
                                    Aucune simulation n&apos;a été trouvée. Veuillez créer une nouvelle simulation pour continuer.
                                </p>
                            </div>
                            <Button onClick={handleGoBack}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Nouvelle simulation
                            </Button>
                        </CardContent>
                    </Card>
                </PageLayout>
            </RequireAuth>
        )
    }

    const headerActions = (
        <>
            <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Partager
            </Button>
            <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit3 className="h-4 w-4 mr-2" />
                Modifier
            </Button>
        </>
    )

    return (
        <RequireAuth allowedRoles={[RoleDto.CLIENT, RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT]}>
            <PageLayout
                title="Récapitulatif de votre envoi"
                subtitle="Vérifiez les détails avant de procéder au paiement"
                icon={<FileText className="h-6 w-6 text-primary" />}
                headerActions={headerActions}
                maxWidth="full"
            >
                {/* Badges d'information */}
                <div className="flex items-center justify-center gap-4 flex-wrap mb-6">
                    
                    <Badge variant="secondary">
                        <Package className="h-3 w-3 mr-2" />
                        {simulationData.parcels?.length || 0} colis
                    </Badge>
                    <Badge variant="secondary">
                        <Weight className="h-3 w-3 mr-2" />
                        {simulationData.totalWeight} kg
                    </Badge>
                    {deliveryDuration && (
                        <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-2" />
                            {deliveryDuration} jour{deliveryDuration > 1 ? "s" : ""}
                        </Badge>
                    )}
                </div>

                {/* Alert pour les comptes administrateurs */}
                {isCurrentUserAdmin && (
                    <Alert className="border-orange-200 bg-orange-50/50 mb-6">
                        <UserX className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                            <div className="space-y-3">
                                <div>
                                    <strong>Compte administrateur détecté.</strong> Les comptes professionnels ne peuvent pas effectuer de
                                    paiements personnels.
                                </div>
                                <div className="text-sm">
                                    Pour procéder au paiement, vous devez utiliser un compte personnel (CLIENT).
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <Button size="sm" variant="outline" onClick={handleSwitchToPersonalAccount}>
                                        <LogIn className="h-4 w-4 mr-2" />
                                        Compte personnel
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={handleCreatePersonalAccount}>
                                        <User className="h-4 w-4 mr-2" />
                                        Créer un compte
                                    </Button>
                                </div>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Contenu principal */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Colonne gauche - Participants */}
                    <div className="space-y-6">
                        {/* Expéditeur */}
                        <InfoCard title="Expéditeur" icon={<User className="h-5 w-5 text-primary" />}>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold text-lg">
                                        {simulationData.sender.firstName} {simulationData.sender.lastName}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{simulationData.sender.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{simulationData.sender.phoneNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </InfoCard>

                        {/* Destinataire */}
                        <InfoCard title="Destinataire" icon={<User className="h-5 w-5 text-primary" />}>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold text-lg">
                                        {simulationData.destinataire.firstName} {simulationData.destinataire.lastName}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{simulationData.destinataire.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{simulationData.destinataire.phoneNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </InfoCard>
                    </div>

                    {/* Colonne centrale - Itinéraire */}
                    <div className="space-y-6">
                        <InfoCard title="Itinéraire" icon={<MapPin className="h-5 w-5 text-primary" />}>
                            <div className="space-y-6">
                                {/* Départ */}
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                                        A
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <h4 className="font-medium">Point de départ</h4>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <div className="flex justify-between">
                                                <span>Pays:</span>
                                                <span className="font-medium text-foreground">{simulationData.departureCountry}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Ville:</span>
                                                <span className="font-medium text-foreground">{simulationData.departureCity}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Agence:</span>
                                                <span className="font-medium text-foreground">{simulationData.departureAgency}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <div className="w-0.5 h-8 bg-border"></div>
                                </div>

                                {/* Arrivée */}
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground text-sm font-bold">
                                        B
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <h4 className="font-medium">Point d&apos;arrivée</h4>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <div className="flex justify-between">
                                                <span>Pays:</span>
                                                <span className="font-medium text-foreground">{simulationData.destinationCountry}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Ville:</span>
                                                <span className="font-medium text-foreground">{simulationData.destinationCity}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Agence:</span>
                                                <span className="font-medium text-foreground">{simulationData.destinationAgency}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </InfoCard>
                    </div>

                    {/* Colonne droite - Détails et Prix */}
                    <div className="space-y-6">
                        {/* Détails de l'envoi */}
                        <InfoCard title="Détails de l'envoi" icon={<Package className="h-5 w-5 text-primary" />}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                                        <Package className="h-6 w-6 text-primary mx-auto mb-1" />
                                        <p className="text-2xl font-bold">{simulationData.parcels?.length || 0}</p>
                                        <p className="text-xs text-muted-foreground">Colis</p>
                                    </div>
                                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                                        <Weight className="h-6 w-6 text-primary mx-auto mb-1" />
                                        <p className="text-2xl font-bold">{simulationData.totalWeight}</p>
                                        <p className="text-xs text-muted-foreground">kg</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Départ prévu:</span>
                                    </div>
                                    <p className="text-sm font-medium pl-6">{formatDate(simulationData.departureDate)}</p>

                                    <div className="flex items-center gap-2 text-sm">
                                        <Truck className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Arrivée estimée:</span>
                                    </div>
                                    <p className="text-sm font-medium pl-6">{formatDate(simulationData.arrivalDate)}</p>
                                </div>
                            </div>
                        </InfoCard>

                        {/* Prix */}
                        <InfoCard
                            title="Tarification"
                            icon={<Euro className="h-5 w-5 text-primary" />}
                            variant={simulationData.totalPrice ? "success" : "warning"}
                        >
                            <div className="text-center space-y-4">
                                <div>
                                    <p className="text-3xl font-bold text-primary mb-1">{formattedPrice}</p>
                                    {simulationData.totalPrice ? (
                                        <div className="flex items-center justify-center gap-1 text-sm text-green-600">
                                            <CheckCircle className="h-4 w-4" />
                                            <span>Prix confirmé</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-1 text-sm text-orange-600">
                                            <Clock className="h-4 w-4" />
                                            <span>En cours de calcul</span>
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    <div className="flex items-center justify-center gap-1">
                                        <Euro className="h-3 w-3" />
                                        <span>Prix tout compris • TVA incluse</span>
                                    </div>
                                </div>
                            </div>
                        </InfoCard>
                    </div>
                </div>

                {/* Alert si pas de prix */}
                {!simulationData.totalPrice && (
                    <Alert className="border-orange-200 bg-orange-50/50">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                            <strong>Prix en cours de calcul.</strong> Notre équipe finalise votre devis personnalisé. Vous recevrez
                            une notification dès que le prix sera disponible.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Actions */}
                <ActionBar>
                    <Button variant="outline" onClick={handleGoBack} disabled={loadingState.payment}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Annuler l&apos;envoi
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleEdit} disabled={loadingState.payment}>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Modifier
                        </Button>
                        <Button
                            onClick={handlePaymentRedirect}
                            disabled={!simulationData.totalPrice || loadingState.payment || isCurrentUserAdmin}
                        >
                            {loadingState.payment ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Redirection...
                                </>
                            ) : isCurrentUserAdmin ? (
                                <>
                                    <UserX className="h-4 w-4 mr-2" />
                                    Compte admin
                                </>
                            ) : (
                                <>
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Procéder au paiement
                                </>
                            )}
                        </Button>
                    </div>
                </ActionBar>

                {/* Footer */}
                <Card className="bg-muted/30">
                    <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Shield className="h-5 w-5 text-primary" />
                            <span className="font-medium">Paiement 100% sécurisé</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                            Ce récapitulatif a été généré le {new Date().toLocaleString("fr-FR")}
                        </p>
                        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                            <a href="tel:+32123456789" className="flex items-center gap-2 text-primary hover:underline">
                                <Phone className="h-4 w-4" />
                                +32 123 456 789
                            </a>
                            <a href="mailto:support@colisapp.com" className="flex items-center gap-2 text-primary hover:underline">
                                <Mail className="h-4 w-4" />
                                support@colisapp.com
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </PageLayout>
        </RequireAuth>
    )
}
