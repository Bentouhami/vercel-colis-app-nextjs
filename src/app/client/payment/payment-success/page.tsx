"use client"

import { useCallback, useEffect, useState } from "react"
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
import { CheckCircle, Package, Clock, Mail, ArrowRight, Download, Eye } from "lucide-react"

export default function PaymentSuccessPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [progress, setProgress] = useState(0)
    const { status } = useSession()

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true)
            if (status === "authenticated") {
                setIsAuthenticated(true)
                setIsLoading(false)
            }
        }
        checkAuth()
    }, [router, status])

    // Animation du progress
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        return 100
                    }
                    return prev + 2
                })
            }, 100)
            return () => clearInterval(interval)
        }
    }, [isAuthenticated, isLoading])

    const finalizePayment = useCallback(async () => {
        try {
            setIsLoading(true)

            const simulation = await getSimulationFromCookie()
            if (!simulation) {
                toast.error("Erreur lors de la récupération de la simulation.")
                return
            }

            let envoi = await getEnvoiById(Number(simulation.id))
            if (!envoi) {
                toast.error("Erreur lors de la récupération de l'envoi.")
                return
            }

            if (
                envoi?.paid &&
                envoi?.trackingNumber &&
                envoi?.qrCodeUrl &&
                envoi?.simulationStatus === SimulationStatus.COMPLETED
            ) {
                await deleteSimulationCookie()
                setTimeout(() => router.replace("/client/profile"), 3000)
                return
            }

            const updateSuccess = await updateEnvoiDatas(Number(simulation.id))
            if (!updateSuccess) {
                toast.error("Erreur lors de la mise à jour de l'envoi.")
                return
            }

            await new Promise((resolve) => setTimeout(resolve, 2000))
            envoi = await getEnvoiById(envoi.id!)

            if (
                envoi?.paid &&
                envoi?.trackingNumber &&
                envoi?.qrCodeUrl &&
                envoi?.simulationStatus === SimulationStatus.COMPLETED
            ) {
                setTimeout(() => {
                    deleteSimulationCookie()
                    router.push("/client/profile")
                }, 3000)
                return
            }
        } catch (error) {
            toast.error("Une erreur est survenue lors de la finalisation du paiement.")
        } finally {
            setIsLoading(false)
        }
    }, [router])

    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            finalizePayment()
        }
    }, [isAuthenticated, isLoading, finalizePayment])

    return (
        <RequireAuth allowedRoles={[RoleDto.CLIENT, RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT]}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Success Header */}
                    <div className="text-center mb-8 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-green-600 mb-4">Paiement Réussi !</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Merci pour votre paiement. Votre transaction a été complétée avec succès.
                        </p>
                    </div>

                    {/* Progress Card */}
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
                                                : "Terminé !"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Next Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Package className="w-5 h-5 text-blue-600" />
                                    Prochaines étapes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                                    onClick={() => router.push("/client/profile")}
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Voir mes envois
                                </Button>
                                <Button variant="outline" className="w-full justify-start bg-transparent" disabled={progress < 100}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Télécharger les documents
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start bg-transparent"
                                    onClick={() => router.push("/client/simulation")}
                                >
                                    <Package className="w-4 h-4 mr-2" />
                                    Nouvel envoi
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Loading Indicator */}
                    {isLoading && (
                        <Card className="animate-pulse">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
                                    <span className="text-lg text-gray-600 dark:text-gray-400">Redirection vers votre profil...</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </RequireAuth>
    )
}
