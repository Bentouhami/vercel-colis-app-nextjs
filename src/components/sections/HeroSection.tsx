"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react"

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Contenu gauche */}
                    <div className="space-y-8 animate-fade-in">
                        {/* Badge */}
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium animate-slide-up"
                            style={{ animationDelay: "100ms" }}
                        >
                            <Sparkles className="h-4 w-4" />
                            Solution de gestion de colis #1
                        </div>

                        {/* Titre principal */}
                        <h1
                            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight animate-slide-up"
                            style={{ animationDelay: "200ms" }}
                        >
                            Gérez vos colis en toute{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                simplicité
                            </span>
                        </h1>

                        {/* Sous-titre */}
                        <p
                            className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed animate-slide-up"
                            style={{ animationDelay: "300ms" }}
                        >
                            La solution la plus simple et la plus rapide pour gérer vos colis. Profitez d&apos;une expérience optimisée et
                            sécurisée avec ColisApp.
                        </p>

                        {/* Points clés */}
                        <div className="flex flex-wrap gap-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <Shield className="h-5 w-5 text-green-500" />
                                <span className="font-medium">100% Sécurisé</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <Zap className="h-5 w-5 text-yellow-500" />
                                <span className="font-medium">Ultra Rapide</span>
                            </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "500ms" }}>
                            <Link href="/client/simulation">
                                <Button
                                    size="lg"
                                    className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
                                >
                                    Faire une simulation
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/client/tracking">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 bg-transparent"
                                >
                                    Suivre un colis
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div
                            className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700 animate-slide-up"
                            style={{ animationDelay: "600ms" }}
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">10K+</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Colis livrés</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">99.9%</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Fiabilité</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">24/7</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
                            </div>
                        </div>
                    </div>

                    {/* Image droite */}
                    <div className="relative animate-scale-in" style={{ animationDelay: "300ms" }}>
                        <div className="relative h-[400px] lg:h-[600px] w-full">
                            {/* Cercles décoratifs */}
                            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
                            <div
                                className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
                                style={{ animationDelay: "1s" }}
                            ></div>

                            {/* Image principale */}
                            <div className="relative z-10 h-full w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-shadow duration-500">
                                <Image
                                    priority
                                    src="/svg/home/welcome.svg"
                                    alt="ColisApp - Gestion de colis simplifiée"
                                    fill
                                    className="object-contain p-4"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
