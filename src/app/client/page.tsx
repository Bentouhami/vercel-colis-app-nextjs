"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Calculator,
    Package,
    MapPin,
    Clock,
    Shield,
    Zap,
    ArrowRight,
    Star,
    Users,
    TrendingUp,
    CheckCircle,
    Sparkles,
} from "lucide-react"

const stats = [
    { label: "Colis livrés", value: "10,000+", icon: Package },
    { label: "Clients satisfaits", value: "2,500+", icon: Users },
    { label: "Taux de réussite", value: "99.9%", icon: TrendingUp },
    { label: "Support 24/7", value: "Disponible", icon: Shield },
]

const quickActions = [
    {
        title: "Nouvelle Simulation",
        description: "Calculez le coût de votre envoi en quelques clics",
        icon: Calculator,
        href: "/client/simulation",
        color: "from-blue-500 to-blue-600",
        primary: true,
    },
    {
        title: "Suivre un Colis",
        description: "Localisez votre envoi en temps réel",
        icon: MapPin,
        href: "/client/tracking",
        color: "from-green-500 to-green-600",
    },
    {
        title: "Mes Envois",
        description: "Consultez l'historique de vos expéditions",
        icon: Package,
        href: "/client/profile",
        color: "from-purple-500 to-purple-600",
    },
]

const features = [
    {
        title: "Simulation Instantanée",
        description: "Obtenez un devis précis en moins de 2 minutes",
        icon: Zap,
    },
    {
        title: "Suivi en Temps Réel",
        description: "Suivez votre colis à chaque étape du transport",
        icon: Clock,
    },
    {
        title: "Sécurité Garantie",
        description: "Vos colis sont assurés et protégés",
        icon: Shield,
    },
    {
        title: "Service Premium",
        description: "Support client disponible 24h/24 et 7j/7",
        icon: Star,
    },
]

export default function ClientHomePage() {
    const [hoveredAction, setHoveredAction] = useState<number | null>(null)

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

                <div className="container mx-auto px-4">
                    <div className="text-center max-w-4xl mx-auto animate-fade-in">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6 animate-slide-up">
                            <Sparkles className="h-4 w-4" />
                            Plateforme de gestion de colis #1
                        </div>

                        {/* Main Title */}
                        <h1
                            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up"
                            style={{ animationDelay: "100ms" }}
                        >
                            Expédiez vos colis en toute{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                confiance
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p
                            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto animate-slide-up"
                            style={{ animationDelay: "200ms" }}
                        >
                            La solution complète pour gérer vos envois entre le Maroc et la Belgique. Simple, rapide et sécurisé.
                        </p>

                        {/* CTA Buttons */}
                        <div
                            className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up"
                            style={{ animationDelay: "300ms" }}
                        >
                            <Link href="/client/simulation">
                                <Button
                                    size="lg"
                                    className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
                                >
                                    <Calculator className="h-5 w-5" />
                                    Commencer une simulation
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/client/tracking">
                                <Button variant="outline" size="lg" className="gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                                    <MapPin className="h-5 w-5" />
                                    Suivre un colis
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg mx-auto mb-2">
                                        <stat.icon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Actions Rapides</h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Accédez rapidement aux fonctionnalités essentielles de ColisApp
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {quickActions.map((action, index) => (
                            <Link key={index} href={action.href}>
                                <Card
                                    className={`h-full cursor-pointer transition-all duration-300 hover:shadow-xl border-0 ${action.primary ? "ring-2 ring-blue-500 scale-105" : ""
                                        } ${hoveredAction === index ? "-translate-y-2" : ""} animate-slide-up`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    onMouseEnter={() => setHoveredAction(index)}
                                    onMouseLeave={() => setHoveredAction(null)}
                                >
                                    <CardHeader className="text-center pb-4">
                                        <div
                                            className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 transition-transform duration-300 ${hoveredAction === index ? "scale-110" : ""}`}
                                        >
                                            <action.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{action.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center">
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">{action.description}</p>
                                        <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                                            <span>Accéder</span>
                                            <ArrowRight
                                                className={`h-4 w-4 transition-transform ${hoveredAction === index ? "translate-x-1" : ""}`}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pourquoi Choisir ColisApp ?</h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Une plateforme conçue pour simplifier vos expéditions avec des fonctionnalités avancées
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="flex items-center justify-center w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl mx-auto mb-4">
                                    <feature.icon className="h-7 w-7 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="container mx-auto px-4 text-center animate-fade-in">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-4">Prêt à expédier votre premier colis ?</h2>
                        <p className="text-blue-100 text-lg mb-8">
                            Rejoignez des milliers de clients qui font confiance à ColisApp pour leurs expéditions
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/client/simulation">
                                <Button size="lg" variant="secondary" className="gap-2 bg-white text-blue-600 hover:bg-gray-100">
                                    <Calculator className="h-5 w-5" />
                                    Faire une simulation gratuite
                                </Button>
                            </Link>
                            <Link href="/client/auth/register">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="gap-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                                >
                                    <CheckCircle className="h-5 w-5" />
                                    Créer un compte
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
