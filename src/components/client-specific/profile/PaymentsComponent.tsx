"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    CreditCard,
    Clock,
    Sparkles,
    BarChart3,
    FileText,
    Download,
    Euro,
    Receipt,
    Calendar,
    Construction,
} from "lucide-react"

export default function PaymentsComponent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div
            className={`space-y-6 transition-all duration-700 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                        Historique des Paiements
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse shadow-lg">
                            <Clock className="h-3 w-3 mr-1" />
                            Coming Soon
                        </Badge>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Consultez et gérez tous vos paiements et factures</p>
                </div>
            </div>

            {/* TFE Notice */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-dashed border-orange-200 dark:border-orange-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                        <Construction className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                                TFE - Fonctionnalité en Développement
                            </h3>
                        </div>
                        <p className="text-orange-700 dark:text-orange-300 mb-3">
                            Cette page complète de gestion des paiements et factures est prévue pour le développement post-soutenance.
                            Elle inclurait des fonctionnalités avancées comme :
                        </p>
                        <ul className="text-sm text-orange-600 dark:text-orange-400 space-y-1 ml-4">
                            <li>• Historique détaillé des transactions</li>
                            <li>• Filtres avancés par date, statut et montant</li>
                            <li>• Statistiques et graphiques de dépenses</li>
                            <li>• Export PDF des factures</li>
                            <li>• Gestion des moyens de paiement</li>
                            <li>• Notifications de paiement automatiques</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Mock Stats Cards - Disabled State */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 opacity-60">
                <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                <Euro className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Total payé</p>
                                <p className="text-2xl font-bold text-gray-400">---.-- €</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                <Receipt className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Transactions</p>
                                <p className="text-2xl font-bold text-gray-400">--</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Ce mois</p>
                                <p className="text-2xl font-bold text-gray-400">---.-- €</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                <BarChart3 className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Moyenne</p>
                                <p className="text-2xl font-bold text-gray-400">---.-- €</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Mock Content - Disabled State */}
            <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 opacity-60">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-400">
                        <FileText className="h-5 w-5" />
                        Historique des Paiements
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-12 text-center">
                    <div className="space-y-4">
                        <CreditCard className="h-16 w-16 text-gray-300 mx-auto" />
                        <div>
                            <h3 className="text-lg font-medium text-gray-400 mb-2">Fonctionnalité en Développement</h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                                L&apos;historique complet des paiements, les filtres avancés et les statistiques seront disponibles dans la
                                version post-TFE.
                            </p>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <Button disabled className="gap-2 cursor-not-allowed">
                                <Download className="h-4 w-4" />
                                Exporter (Bientôt)
                            </Button>
                            <Button variant="outline" disabled className="gap-2 cursor-not-allowed bg-transparent">
                                <BarChart3 className="h-4 w-4" />
                                Statistiques (Bientôt)
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Future Features Preview */}
            <Card className="border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                        <Sparkles className="h-5 w-5" />
                        Fonctionnalités Prévues Post-TFE
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h4 className="font-medium text-blue-800 dark:text-blue-200">Interface Utilisateur</h4>
                            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                <li>• Tableau de bord avec graphiques interactifs</li>
                                <li>• Filtres avancés multi-critères</li>
                                <li>• Recherche intelligente</li>
                                <li>• Export PDF/Excel personnalisé</li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-medium text-blue-800 dark:text-blue-200">Fonctionnalités Métier</h4>
                            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                <li>• Réconciliation automatique</li>
                                <li>• Alertes de paiement</li>
                                <li>• Analyse des tendances</li>
                                <li>• Intégration comptable</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
