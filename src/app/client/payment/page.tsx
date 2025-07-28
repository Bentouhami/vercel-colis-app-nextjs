"use client"

import { Suspense, useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useSearchParams, useRouter } from "next/navigation"
import { API_DOMAIN } from "@/utils/constants"
import axios from "axios"
import { CreditCard, Shield, Lock, ArrowLeft, Euro, Package, CheckCircle, AlertCircle } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

const PaymentContent = () => {
    const [loading, setLoading] = useState(false)
    const [amount, setAmount] = useState<number | null>(null)
    const [simulationId, setSimulationId] = useState<string | null>(null)
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const amountParam = searchParams.get("amount")
        const simulationParam = searchParams.get("simulation")

        if (amountParam) {
            setAmount(Number.parseFloat(amountParam))
        } else {
            toast.error("Erreur : le prix total est introuvable.")
        }

        if (simulationParam) {
            setSimulationId(simulationParam)
        }
    }, [searchParams])

    const handlePayment = async () => {
        setLoading(true)
        try {
            const response = await axios.post(
                `${API_DOMAIN}/payment`,
                { amount: amount },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                },
            )

            const { id: sessionId } = response.data
            const stripe = await stripePromise
            const result = await stripe?.redirectToCheckout({ sessionId })

            if (result?.error) {
                toast.error("Erreur lors de la redirection vers Stripe : " + result.error.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Une erreur est survenue. Veuillez réessayer.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Finaliser votre paiement</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Sécurisé par Stripe - Vos données sont protégées</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Résumé de commande */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="w-5 h-5 text-blue-600" />
                                    Résumé de votre commande
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Simulation #{simulationId}</span>
                                    <span className="font-medium">Expédition de colis</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Frais de service</span>
                                    <span className="font-medium">Inclus</span>
                                </div>
                                <div className="flex justify-between items-center py-3 text-lg font-bold">
                                    <span>Total à payer</span>
                                    <span className="text-blue-600 flex items-center gap-1">
                                        <Euro className="w-5 h-5" />
                                        {amount?.toFixed(2)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sécurité */}
                        <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <Shield className="w-6 h-6 text-green-600" />
                                        <div>
                                            <p className="font-medium text-green-800 dark:text-green-400">Sécurisé</p>
                                            <p className="text-sm text-green-600 dark:text-green-500">SSL 256-bit</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <Lock className="w-6 h-6 text-blue-600" />
                                        <div>
                                            <p className="font-medium text-blue-800 dark:text-blue-400">Crypté</p>
                                            <p className="text-sm text-blue-600 dark:text-blue-500">Données protégées</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <CheckCircle className="w-6 h-6 text-purple-600" />
                                        <div>
                                            <p className="font-medium text-purple-800 dark:text-purple-400">Certifié</p>
                                            <p className="text-sm text-purple-600 dark:text-purple-500">PCI DSS</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Paiement */}
                    <div className="space-y-6">
                        <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-blue-600" />
                                    Paiement
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">€{amount?.toFixed(2)}</div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Paiement sécurisé via Stripe</p>
                                </div>

                                <Button
                                    onClick={handlePayment}
                                    disabled={loading || !amount}
                                    className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                            Redirection en cours...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-5 h-5" />
                                            Payer maintenant
                                        </div>
                                    )}
                                </Button>

                                <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                                    En cliquant sur "Payer maintenant", vous acceptez nos conditions d'utilisation
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informations */}
                        <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm">Paiement instantané</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                Votre commande sera traitée immédiatement
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm">Confirmation par email</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Vous recevrez un reçu de paiement</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PaymentPage = () => {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
                </div>
            }
        >
            <PaymentContent />
        </Suspense>
    )
}

export default PaymentPage
