"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import RequireAuth from "@/components/auth/RequireAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { getSimulationFromCookie } from "@/lib/simulationCookie"
import { getEnvoiById, updateEnvoiDatas } from "@/services/frontend-services/envoi/EnvoiService"
import { useRouter } from "next/navigation"
import { deleteSimulationCookie } from "@/services/frontend-services/simulation/SimulationService"
import { SimulationStatus } from "@prisma/client"
import { useSession } from "next-auth/react"
import { RoleDto } from "@/services/dtos"
import { CheckCircle, Package, Clock, Mail, ArrowRight, Download, Eye, AlertTriangle } from 'lucide-react'

export default function PaymentSuccessPage() {
    const router = useRouter()
    const { status } = useSession()

    // États séparés pour éviter les conflits
    const [authLoading, setAuthLoading] = useState(true)
    const [processingPayment, setProcessingPayment] = useState(false)
    const [progress, setProgress] = useState(0)
    const [paymentCompleted, setPaymentCompleted] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Refs pour éviter les appels multiples
    const hasProcessedPayment = useRef(false)
    const progressInterval = useRef<NodeJS.Timeout | null>(null)

    // Vérification de l'authentification
    useEffect(() => {
        if (status === "authenticated") {
            setAuthLoading(false)
        } else if (status === "unauthenticated") {
            router.replace("/auth/login")
        }
    }, [status, router])

    // Animation du progress uniquement quand le paiement est en cours
    useEffect(() => {
        if (processingPayment && !paymentCompleted) {
            progressInterval.current = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 95) {
                        return 95 // On s'arrête à 95% jusqu'à ce que le paiement soit vraiment terminé
                    }
                    return prev + 2
                })
            }, 100)

            return () => {
                if (progressInterval.current) {
                    clearInterval(progressInterval.current)
                }
            }
        }
    }, [processingPayment, paymentCompleted])

    // Finalisation du paiement - appelé une seule fois
    const finalizePayment = useCallback(async () => {
        // Éviter les appels multiples
        if (hasProcessedPayment.current || processingPayment) {
            return
        }

        try {
            hasProcessedPayment.current = true
            setProcessingPayment(true)
            setError(null)

            // Récupération de la simulation
            const simulation = await getSimulationFromCookie()
            if (!simulation) {
                setError("Aucune simulation trouvée. Redirection vers le profil...")
                setTimeout(() => router.replace("/client/profile"), 2000)
                return
            }

            // Vérification de l'envoi
            let envoi = await getEnvoiById(Number(simulation.id))
            if (!envoi) {
                setError("Envoi introuvable. Redirection vers le profil...")
                setTimeout(() => router.replace("/client/profile"), 2000)
                return
            }

            // Vérifier si le paiement est déjà traité
            if (
                envoi.paid &&
                envoi.trackingNumber &&
                envoi.qrCodeUrl &&
                envoi.simulationStatus === SimulationStatus.COMPLETED
            ) {
                // Paiement déjà traité, nettoyer et rediriger
                setProgress(100)
                setPaymentCompleted(true)
                await deleteSimulationCookie()

                toast.success("Paiement déjà traité avec succès !")
                setTimeout(() => router.replace("/client/profile"), 3000)
                return
            }

            // Traitement du paiement
            const updateSuccess = await updateEnvoiDatas(Number(simulation.id))
            if (!updateSuccess) {
                setError("Erreur lors de la mise à jour de l'envoi.")
                return
            }

            // Attendre un peu pour que les données soient mises à jour
            await new Promise((resolve) => setTimeout(resolve, 2000))

            // Vérifier à nouveau l'état de l'envoi
            envoi = await getEnvoiById(envoi.id!)

            if (
                envoi?.paid &&
                envoi?.trackingNumber &&
                envoi?.qrCodeUrl &&
                envoi?.simulationStatus === SimulationStatus.COMPLETED
            ) {
                // Succès complet
                setProgress(100)
                setPaymentCompleted(true)

                // Nettoyer le cookie de simulation
                await deleteSimulationCookie()

                toast.success("Paiement traité avec succès !")

                // Redirection après 3 secondes
                setTimeout(() => {
                    router.replace("/client/profile")
                }, 3000)
            } else {
                setError("Le paiement n'a pas pu être finalisé complètement.")
            }

        } catch (error) {
            console.error("Erreur lors de la finalisation du paiement:", error)
            setError("Une erreur est survenue lors de la finalisation du paiement.")
            toast.error("Erreur lors du traitement du paiement")
        } finally {
            setProcessingPayment(false)
        }
    }, [router, processingPayment])

    // Démarrer le processus une seule fois quand l'utilisateur est authentifié
    useEffect(() => {
        if (!authLoading && status === "authenticated" && !hasProcessedPayment.current) {
            finalizePayment()
        }
    }, [authLoading, status, finalizePayment])

    // Empêcher le retour en arrière
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            event.preventDefault()
            // Rediriger vers le profil si l'utilisateur essaie de revenir en arrière
            router.replace("/client/profile")
        }

        window.addEventListener('popstate', handlePopState)

        // Remplacer l'entrée actuelle dans l'historique pour éviter le retour
        window.history.replaceState(null, '', window.location.href)

        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [router])

    // Affichage pendant le chargement de l'authentification
    if (authLoading) {
        return (
            <RequireAuth allowedRoles={[RoleDto.CLIENT, RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT]}>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center space-x-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
                                <span className="text-lg text-gray-600 dark:text-gray-400">Vérification...</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </RequireAuth>
        )
    }

    return (
        <RequireAuth allowedRoles={[RoleDto.CLIENT, RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT]}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Success Header */}
                    <div className="text-center mb-8 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
                            {error ? (
                                <AlertTriangle className="w-10 h-10 text-red-600" />
                            ) : (
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            )}
                        </div>
                        <h1 className={`text-4xl font-bold mb-4 ${error ? 'text-red-600' : 'text-green-600'}`}>
                            {error ? 'Erreur de Traitement' : 'Paiement Réussi !'}
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            {error
                                ? error
                                : "Merci pour votre paiement. Votre transaction a été complétée avec succès."
                            }
                        </p>
                    </div>

                    {/* Progress Card - Affiché seulement si pas d'erreur */}
                    {!error && (
                        <Card className="mb-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    Traitement de votre commande
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Progression</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {progress < 50
                                            ? "Validation du paiement..."
                                            : progress < 80
                                                ? "Génération des documents..."
                                                : progress < 100
                                                    ? "Finalisation..."
                                                    : "Terminé !"
                                        }
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Next Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Package className="w-5 h-5 text-blue-600" />
                                    {error ? 'Actions recommandées' : 'Prochaines étapes'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error ? (
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <AlertTriangle className="w-4 h-4 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Contactez le support</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Si le problème persiste, contactez notre équipe
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Paiement confirmé</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Votre paiement a été traité avec succès</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Clock className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Génération des documents</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Étiquettes et QR code en cours de création
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Mail className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Confirmation par email</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Vous recevrez tous les détails par email</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <ArrowRight className="w-5 h-5 text-green-600" />
                                    Actions disponibles
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start bg-transparent"
                                    onClick={() => router.replace("/client/profile")}
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Voir mes envois
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start bg-transparent"
                                    disabled={!paymentCompleted}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Télécharger les documents
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start bg-transparent"
                                    onClick={() => router.replace("/client/simulation")}
                                >
                                    <Package className="w-4 h-4 mr-2" />
                                    Nouvel envoi
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Loading Indicator */}
                    {processingPayment && (
                        <Card className="animate-pulse">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
                                    <span className="text-lg text-gray-600 dark:text-gray-400">
                                        {paymentCompleted ? "Redirection vers votre profil..." : "Traitement du paiement..."}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </RequireAuth>
    )
}