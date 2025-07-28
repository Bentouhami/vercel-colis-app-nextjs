"use client"

import {
    PackageSearch,
    UserCheck,
    Send,
    CreditCard,
    ClipboardList,
    Building2,
    LayoutDashboard,
    UserCircle2,
    ArrowRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ScrollToTopButton from "@/components/ui/ScrollToTopButton"

const features = [
    {
        title: "Simulation rapide",
        description: "Estimez le coût d'un envoi en quelques clics, même sans être connecté.",
        icon: PackageSearch,
        color: "from-blue-500 to-blue-600",
    },
    {
        title: "Connexion sécurisée",
        description: "Créez un compte et connectez-vous facilement grâce à NextAuth & JWT.",
        icon: UserCheck,
        color: "from-green-500 to-green-600",
    },
    {
        title: "Paiement intégré",
        description: "Payez votre envoi directement via Stripe (mode test sécurisé).",
        icon: CreditCard,
        color: "from-purple-500 to-purple-600",
    },
    {
        title: "Destinataires intelligents",
        description: "Ajoutez vos destinataires avec détection automatique des doublons.",
        icon: UserCircle2,
        color: "from-indigo-500 to-indigo-600",
    },
    {
        title: "Suivi en temps réel",
        description: "Consultez le statut de vos colis : en attente, livré, annulé, etc.",
        icon: ClipboardList,
        color: "from-orange-500 to-orange-600",
    },
    {
        title: "Espace personnel",
        description: "Accédez à votre tableau de bord, à vos envois et à vos destinataires.",
        icon: LayoutDashboard,
        color: "from-teal-500 to-teal-600",
    },
    {
        title: "Interface administrateur",
        description: "Tableau de bord dédié aux admins pour gérer utilisateurs et agences.",
        icon: Send,
        color: "from-red-500 to-red-600",
    },
    {
        title: "Gestion des agences",
        description: "Ajoutez et configurez les agences via un super administrateur.",
        icon: Building2,
        color: "from-pink-500 to-pink-600",
    },
]

export default function FeaturesSection() {
    return (
        <>
            <section
                id="features"
                className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
            >
                <div className="container px-4 md:px-6">
                    {/* Header */}
                    <div className="text-center mb-16 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
                            <LayoutDashboard className="h-4 w-4" />
                            Fonctionnalités
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Tout ce dont vous avez besoin
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Une application pensée pour les particuliers et les agences. Simple, rapide, et intuitive avec toutes les
                            fonctionnalités essentielles.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="animate-slide-up group" style={{ animationDelay: `${index * 100}ms` }}>
                                <Card className="h-full bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                                    <CardContent className="p-6">
                                        {/* Icon */}
                                        <div
                                            className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                                        >
                                            <feature.icon className="w-7 h-7" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>

                                        {/* Hover Arrow */}
                                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="text-center mt-16 animate-slide-up" style={{ animationDelay: "800ms" }}>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Prêt à commencer ?</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Découvrez toutes nos fonctionnalités en créant votre première simulation
                            </p>
                            <Button
                                size="lg"
                                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            >
                                Commencer maintenant
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
            <ScrollToTopButton targetId="features" />
        </>
    )
}
