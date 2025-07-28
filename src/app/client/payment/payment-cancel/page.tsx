"use client"
import { useRouter } from "next/navigation"
import RequireAuth from "@/components/auth/RequireAuth"
import { RoleDto } from "@/services/dtos"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, RefreshCw, HelpCircle, Phone, Mail, AlertTriangle, CreditCard } from "lucide-react"

const PaymentCancelPage = () => {
    const router = useRouter()

    const handleRetry = () => {
        router.push("/client/simulation")
    }

    const handleGoBack = () => {
        router.back()
    }

    return (
        <RequireAuth allowedRoles={[RoleDto.CLIENT, RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT]}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-8 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-red-600 mb-4">Paiement Annulé</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Votre transaction a été annulée. Aucun montant n'a été débité.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Actions principales */}
                        <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <RefreshCw className="w-5 h-5 text-blue-600" />
                                    Que souhaitez-vous faire ?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button onClick={handleRetry} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    Réessayer le paiement
                                </Button>

                                <Button variant="outline" onClick={handleGoBack} className="w-full h-12 bg-transparent">
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                    Retour à la page précédente
                                </Button>

                                <Button variant="outline" onClick={() => router.push("/client/simulation")} className="w-full h-12">
                                    <RefreshCw className="w-5 h-5 mr-2" />
                                    Nouvelle simulation
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Aide et support */}
                        <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-orange-600" />
                                    Besoin d'aide ?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                        <Phone className="w-5 h-5 text-orange-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-orange-800 dark:text-orange-400">Support téléphonique</p>
                                            <p className="text-sm text-orange-600 dark:text-orange-500">+32 2 123 45 67</p>
                                            <p className="text-xs text-orange-600 dark:text-orange-500">Lun-Ven: 9h-18h</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-blue-800 dark:text-blue-400">Support par email</p>
                                            <p className="text-sm text-blue-600 dark:text-blue-500">support@colisapp.com</p>
                                            <p className="text-xs text-blue-600 dark:text-blue-500">Réponse sous 24h</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Raisons possibles */}
                    <Card className="mt-8 animate-slide-up" style={{ animationDelay: "300ms" }}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                Raisons possibles de l'annulation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h4 className="font-medium">Problèmes techniques :</h4>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                            Connexion internet instable
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                            Timeout de la session
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                            Problème avec le navigateur
                                        </li>
                                    </ul>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-medium">Problèmes de paiement :</h4>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                            Carte bancaire expirée
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                            Fonds insuffisants
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                            Blocage par la banque
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </RequireAuth>
    )
}

export default PaymentCancelPage
