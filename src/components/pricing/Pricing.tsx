"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, Zap, Crown, Gift, Sparkles } from "lucide-react"

type Plan = {
    name: string
    price: string
    originalPrice?: string
    description: string
    features: string[]
    buttonLabel: string
    popular?: boolean
    icon: any
    color: string
    badge?: string
}

const plans: Plan[] = [
    {
        name: "Mensuel",
        price: "20€",
        description: "Parfait pour débuter avec 5 livraisons incluses.",
        features: [
            "5 livraisons incluses",
            "Support standard",
            "Notifications de suivi",
            "Interface web",
            "Suivi en temps réel",
        ],
        buttonLabel: "Commencer",
        icon: Gift,
        color: "from-green-500 to-green-600",
        badge: "Starter",
    },
    {
        name: "Trimestriel",
        price: "50€",
        originalPrice: "60€",
        description: "Le plus populaire avec 15 livraisons incluses.",
        features: [
            "15 livraisons incluses",
            "Support prioritaire",
            "Notifications avancées",
            "Statistiques détaillées",
            "API access",
            "Rapports mensuels",
        ],
        buttonLabel: "Choisir ce plan",
        popular: true,
        icon: Star,
        color: "from-blue-500 to-blue-600",
        badge: "Populaire",
    },
    {
        name: "Annuel",
        price: "180€",
        originalPrice: "240€",
        description: "Économisez 25% avec 60 livraisons incluses.",
        features: [
            "60 livraisons incluses",
            "Support premium",
            "Notifications temps réel",
            "Rapports avancés",
            "API illimitée",
            "Formation personnalisée",
        ],
        buttonLabel: "Économiser 25%",
        icon: Zap,
        color: "from-purple-500 to-purple-600",
        badge: "Économique",
    },
    {
        name: "Premium",
        price: "100€",
        description: "Solution complète avec livraisons illimitées.",
        features: [
            "Livraisons illimitées",
            "Support 24/7",
            "Notifications temps réel",
            "Livraison express",
            "Manager dédié",
            "Intégrations personnalisées",
        ],
        buttonLabel: "Contacter",
        icon: Crown,
        color: "from-orange-500 to-orange-600",
        badge: "Enterprise",
    },
]

export default function Pricing() {
    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
                        <Sparkles className="h-4 w-4" />
                        Plans & Tarifs
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Choisissez votre plan
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Des tarifs transparents et flexibles pour tous vos besoins d&apos;expédition. Commencez gratuitement et évoluez
                        selon vos besoins.
                    </p>
                </div>

                {/* Plans Grid - Alignement parfait */}
                <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
                    {plans.map((plan, i) => (
                        <div key={i} className="animate-slide-up h-full" style={{ animationDelay: `${i * 150}ms` }}>
                            <Card
                                className={`
                  relative h-full flex flex-col
                  bg-white dark:bg-gray-800 
                  border-0 shadow-lg hover:shadow-2xl 
                  transition-all duration-500 
                  group hover:-translate-y-3 hover:scale-105
                  ${plan.popular ? "ring-2 ring-blue-500 lg:scale-110 z-10" : ""}
                  backdrop-blur-sm
                `}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                                            ⭐ Le plus populaire
                                        </div>
                                    </div>
                                )}

                                {/* Badge Corner */}
                                {plan.badge && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <div
                                            className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${plan.color} text-white shadow-sm`}
                                        >
                                            {plan.badge}
                                        </div>
                                    </div>
                                )}

                                <CardHeader className="text-center pb-4 pt-8">
                                    {/* Icon */}
                                    <div
                                        className={`
                      mx-auto w-20 h-20 rounded-3xl 
                      bg-gradient-to-r ${plan.color} 
                      flex items-center justify-center mb-6
                      group-hover:scale-110 group-hover:rotate-6
                      transition-all duration-500
                      shadow-lg
                    `}
                                    >
                                        <plan.icon className="w-10 h-10 text-white" />
                                    </div>

                                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{plan.name}</CardTitle>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed min-h-[3rem] flex items-center justify-center">
                                        {plan.description}
                                    </p>
                                </CardHeader>

                                <CardContent className="flex flex-col flex-grow px-6 pb-6">
                                    {/* Price */}
                                    <div className="text-center mb-8">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            {plan.originalPrice && (
                                                <span className="text-lg text-gray-400 line-through">{plan.originalPrice}</span>
                                            )}
                                            <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">par mois</span>
                                        {plan.originalPrice && (
                                            <div className="mt-2">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                    Économisez 25%
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Features - Hauteur fixe pour l'alignement */}
                                    <div className="flex-grow mb-8">
                                        <ul className="space-y-4">
                                            {plan.features.map((feature, j) => (
                                                <li
                                                    key={j}
                                                    className="flex items-start gap-3 group/item"
                                                    style={{ animationDelay: `${i * 150 + j * 50}ms` }}
                                                >
                                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                                                        <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors duration-200">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Button - Toujours en bas */}
                                    <div className="mt-auto">
                                        <Button
                                            className={`
                        w-full h-12 font-semibold text-base
                        ${plan.popular
                                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25"
                                                    : "bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                                                } 
                        transition-all duration-300 
                        hover:scale-105 hover:shadow-xl
                        active:scale-95
                        relative overflow-hidden
                        group/button
                      `}
                                        >
                                            <span className="relative z-10">{plan.buttonLabel}</span>
                                            {/* Effet de brillance */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-700" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-20 animate-slide-up" style={{ animationDelay: "800ms" }}>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 max-w-2xl mx-auto border border-blue-100 dark:border-blue-800">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Besoin d&apos;un plan personnalisé ?</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Contactez notre équipe pour une solution sur mesure adaptée à votre entreprise
                        </p>
                        <Button
                            variant="outline"
                            size="lg"
                            className="gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 hover:border-blue-300 transition-all duration-300 hover:scale-105"
                        >
                            <Crown className="w-4 h-4" />
                            Contactez notre équipe
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
