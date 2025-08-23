"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    CreditCard,
    Shield,
    AlertTriangle,
    LogIn,
    UserPlus,
    ArrowLeft,
    Loader2,
    CheckCircle,
    XCircle,
} from "lucide-react"
import { RoleDto } from "@/services/dtos"
import { toast } from "sonner"
import axios from "axios"
import { loadStripe } from '@stripe/stripe-js';
import { API_DOMAIN } from "@/utils/constants"

// Charger la clé publique Stripe depuis les variables d'environnement
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
// Types for our API shape
type PaymentAmountDto = {
    simulationId: number
    amount: number
    currency: "EUR" | string
    departureCity: string
    destinationCity: string
    totalWeight: number
    parcelsCount: number
    isValidForPayment: boolean
}
type PaymentAmountResponse = { success: boolean; data: PaymentAmountDto }

export default function PaymentPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [isLoading, setIsLoading] = useState(true)
    const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")

    // Keep amount minimal, but you could store whole data if you want
    const [amount, setAmount] = useState<number | null>(null)

    const simulationId = searchParams.get("simulationId")
    const userRole = session?.user?.role as RoleDto

    useEffect(() => {
        // don’t run until session resolved
        if (status === "loading") return

        // redirect unauthenticated users
        if (status === "unauthenticated") {
            toast.error("Vous devez être connecté pour effectuer un paiement")
            router.push(`/auth/login?redirect=${encodeURIComponent("/client/payment")}`)
            return
        }

        // must have simulationId (we never pass amount in URL!)
        if (!simulationId) {
            toast.error("Informations de paiement manquantes")
            router.push("/client/simulation")
            return
        }

        // fetch server-verified amount (shape: { success, data: { amount, ... } })
        ; (async () => {
            try {
                setIsLoading(true)

                const response = await axios.get<PaymentAmountResponse>(
                    `/api/v1/simulations/${simulationId}/payment-amount`,
                    { withCredentials: true } // axios uses withCredentials (not credentials)
                )

                if (!response.data?.success || !response.data.data) {
                    throw new Error("Failed to fetch simulation amount")
                }

                const serverData = response.data.data
                setAmount(serverData.amount)
            } catch (error) {
                console.error("Error fetching simulation amount:", error)
                toast.error("Erreur lors de la récupération du montant de la simulation.")
                router.push("/client/simulation")
            } finally {
                setIsLoading(false)
            }
        })()
    }, [status, simulationId, router])

    // Server-side payment: we send ONLY the simulationId.
    const handlePayment = async () => {
        setIsLoading(true);

        try {
            // Créer une session de paiement en appelant votre route API
            const response = await axios.post(`${API_DOMAIN}/payment`,
                { amount: amount },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,

                });

            const { id: sessionId } = response.data; // Extract sessionId from response

            // Charger Stripe
            const stripe = await stripePromise;
            const result = await stripe?.redirectToCheckout({ sessionId });

            if (result?.error) {
                toast.error("Erreur lors de la redirection vers Stripe : " + result.error.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }

    };

    // Loading state
    if (isLoading || status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Vérification des informations de paiement...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Admin role blocking
    if (userRole && [RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT].includes(userRole)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <Shield className="h-12 w-12 text-orange-500" />
                        </div>
                        <CardTitle className="text-xl font-bold">Compte Administrateur Détecté</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                <strong>Restriction de Paiement</strong>
                                <br />
                                Les comptes administrateurs ne peuvent pas effectuer de paiements personnels. Utilisez un compte client
                                pour vos envois personnels.
                            </AlertDescription>
                        </Alert>

                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Rôle actuel:</span>
                                <Badge variant="secondary">{userRole}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Accès paiement:</span>
                                <div className="flex items-center gap-1">
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    <span className="text-sm text-red-600 dark:text-red-400">Bloqué</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button onClick={() => router.push("/admin")} className="w-full">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour au tableau de bord
                            </Button>

                            <Button onClick={() => router.push("/auth/login")} variant="outline" className="w-full">
                                <LogIn className="h-4 w-4 mr-2" />
                                Se connecter avec un compte client
                            </Button>

                            <Button onClick={() => router.push("/auth/register")} variant="outline" className="w-full">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Créer un compte client
                            </Button>
                        </div>

                        {/* Debug info in development */}
                        {process.env.NODE_ENV === "development" && (
                            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-xs">
                                <strong>Debug Info:</strong>
                                <div>User Role: {userRole}</div>
                                <div>Session ID: {session?.user?.id}</div>
                                <div>Simulation ID: {simulationId}</div>
                                <div>Amount: {amount ?? "—"}€</div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Valid client payment page
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <Card className="shadow-lg">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <CreditCard className="h-6 w-6 text-primary" />
                            <CardTitle className="text-2xl">Finaliser le Paiement</CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Payment Summary */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <h3 className="font-semibold mb-3">Récapitulatif du Paiement</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Simulation ID:</span>
                                    <span className="font-mono text-sm">{simulationId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Montant:</span>
                                    <span className="font-bold text-lg">
                                        {amount != null
                                            ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount)
                                            : "—"}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold">
                                    <span>Total à payer:</span>
                                    <span className="text-primary">
                                        {amount != null
                                            ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount)
                                            : "—"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Status */}
                        {paymentStatus === "processing" && (
                            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <AlertDescription>
                                    <strong>Traitement en cours...</strong>
                                    <br />
                                    Veuillez patienter pendant que nous traitons votre paiement.
                                </AlertDescription>
                            </Alert>
                        )}

                        {paymentStatus === "success" && (
                            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>
                                    <strong>Paiement réussi!</strong>
                                    <br />
                                    Redirection vers la page de confirmation...
                                </AlertDescription>
                            </Alert>
                        )}

                        {paymentStatus === "error" && (
                            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                                <XCircle className="h-4 w-4" />
                                <AlertDescription>
                                    <strong>Erreur de paiement</strong>
                                    <br />
                                    Une erreur est survenue lors du traitement. Veuillez réessayer.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Payment Actions */}
                        <div className="space-y-3">
                            <Button
                                onClick={handlePayment}
                                disabled={paymentStatus === "processing" || paymentStatus === "success" || amount == null}
                                className="w-full h-12 text-lg"
                            >
                                {paymentStatus === "processing" ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Traitement en cours...
                                    </>
                                ) : paymentStatus === "success" ? (
                                    <>
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        Paiement effectué
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="h-5 w-5 mr-2" />
                                        Payer{" "}
                                        {amount != null
                                            ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount)
                                            : "—"}
                                    </>
                                )}
                            </Button>

                            <Button
                                onClick={() => router.back()}
                                variant="outline"
                                disabled={paymentStatus === "processing"}
                                className="w-full"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                        </div>

                        {/* Security Notice */}
                        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                            <Shield className="h-4 w-4 inline mr-1" />
                            Paiement sécurisé SSL - Vos données sont protégées
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
