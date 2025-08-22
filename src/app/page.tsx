// path: src/app/page.tsx

import { Building, User, Shield, ArrowRight, Package, Zap, Globe, Users } from "lucide-react"
import Link from "next/link"
import { adminPath } from "@/utils/constants"
import Footer from "@/components/navigations/footer/Footer"
import HeaderWrapper from "@/components/navigations/header/HeaderWrapper"
import { auth } from "@/auth/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function Home() {
    const session = await auth()

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black">
            <HeaderWrapper session={session} />

            {/* Hero Section */}
            <section className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mt-40 text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                        Bienvenue sur <span className="text-blue-600 dark:text-blue-400">ColisApp</span>
                    </h1>
                    <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        La plateforme de gestion de colis intelligente pour entreprises et particuliers
                    </p>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                        Transport sécurisé entre le Maroc et la Belgique
                    </p>
                </div>

                {/* Access Cards */}
                <div className="max-w-6xl mx-auto mb-16">
                    <Card
                        className="bg-white dark:bg-gray-900 shadow-xl border-0 animate-slide-up"
                        style={{ animationDelay: "200ms" }}
                    >
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Accéder à votre espace</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Client */}
                                <Link
                                    href="/client"
                                    className="group flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <User className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Espace Client</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                                        Suivez vos colis et gérez vos expéditions
                                    </p>
                                    <div className="flex items-center text-blue-600 group-hover:translate-x-1 transition-transform">
                                        <span className="text-sm font-medium mr-1">Accéder</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Link>

                                {/* Admin */}
                                <Link
                                    href={adminPath()}
                                    className="group flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Shield className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Administration</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                                        Gestion complète de la plateforme
                                    </p>
                                    <div className="flex items-center text-purple-600 group-hover:translate-x-1 transition-transform">
                                        <span className="text-sm font-medium mr-1">Accéder</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Link>

                                {/* Agency */}
                                <Link
                                    href={adminPath()}
                                    className="group flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Building className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Gestion Agence</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                                        Administration de votre agence locale
                                    </p>
                                    <div className="flex items-center text-green-600 group-hover:translate-x-1 transition-transform">
                                        <span className="text-sm font-medium mr-1">Accéder</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Link>

                                {/* Tracking */}
                                <Link
                                    href="/client/tracking"
                                    className="group flex flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Package className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Suivi Envois</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                                        Suivez l&apos;état de votre colis en temps réel
                                    </p>
                                    <div className="flex items-center text-orange-600 group-hover:translate-x-1 transition-transform">
                                        <span className="text-sm font-medium mr-1">Accéder</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* CTA Section */}
                <div className="text-center animate-slide-up" style={{ animationDelay: "400ms" }}>
                    <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                        <Link href="/client/simulation">
                            Commencer un envoi
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-fade-in">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Nos fonctionnalités</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Une solution complète pour tous vos besoins d&apos;expédition
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Package,
                                title: "Suivi en temps réel",
                                description: "Suivez l'état de vos colis à tout moment avec des mises à jour instantanées.",
                                color: "blue",
                                delay: "100ms",
                            },
                            {
                                icon: Zap,
                                title: "Livraison rapide",
                                description: "Service d'expédition express entre le Maroc et la Belgique.",
                                color: "yellow",
                                delay: "200ms",
                            },
                            {
                                icon: Globe,
                                title: "Réseau international",
                                description: "Couverture complète avec nos partenaires locaux dans chaque pays.",
                                color: "green",
                                delay: "300ms",
                            },
                            {
                                icon: Users,
                                title: "Support 24/7",
                                description: "Équipe de support disponible pour vous aider à tout moment.",
                                color: "purple",
                                delay: "400ms",
                            },
                        ].map((feature, index) => (
                            <Card
                                key={index}
                                className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                                style={{ animationDelay: feature.delay }}
                            >
                                <CardContent className="p-6">
                                    <div
                                        className={`w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900/20 rounded-lg flex items-center justify-center mb-4`}
                                    >
                                        <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
