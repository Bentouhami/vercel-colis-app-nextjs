// path: src/components/pricing/Pricing.tsx
"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Plan = {
    name: string
    price: string
    description: string
    features: string[]
    buttonLabel: string
    outline: boolean
}

const plans: Plan[] = [
    {
        name: "Mensuel",
        price: "20€",
        description: "Abonnement mensuel avec 5 livraisons incluses.",
        features: ["5 livraisons", "Support standard", "Notifications de suivi"],
        buttonLabel: "S'abonner",
        outline: true,
    },
    {
        name: "Trimestriel",
        price: "50€",
        description: "Abonnement trimestriel avec 15 livraisons incluses.",
        features: ["15 livraisons", "Support prioritaire", "Notifications de suivi avancées"],
        buttonLabel: "S'abonner",
        outline: false,
    },
    {
        name: "Annuel",
        price: "180€",
        description: "Abonnement annuel avec 60 livraisons incluses.",
        features: ["60 livraisons", "Support premium", "Notifications en temps réel"],
        buttonLabel: "S'abonner",
        outline: false,
    },
    {
        name: "Premium",
        price: "100€",
        description: "Abonnement premium avec livraisons illimitées.",
        features: ["Livraisons illimitées", "Support 24/7", "Notifications en temps réel", "Livraison express"],
        buttonLabel: "S'abonner",
        outline: false,
    },
]

export default function Pricing() {
    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
                    Nos Plans d&apos;Abonnement
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: i * 0.15,
                                ease: [0.22, 1, 0.36, 1],
                                type: "spring",
                                stiffness: 60,
                                damping: 15,
                            }}
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-center text-xl font-semibold text-gray-800 dark:text-gray-100">
                                        {plan.name}
                                    </CardTitle>
                                    <p className="text-center text-gray-600 dark:text-gray-300 mt-2">{plan.description}</p>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center">
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {plan.price}<span className="text-sm"> / mois</span>
                                    </p>
                                    <ul className="text-sm text-gray-700 dark:text-gray-300 mt-4 space-y-2 self-start">
                                        {plan.features.map((feature, j) => (
                                            <li key={j}>✔️ {feature}</li>
                                        ))}
                                    </ul>
                                    <Button
                                        variant={plan.outline ? "outline" : "default"}
                                        className="mt-6 w-full"
                                    >
                                        {plan.buttonLabel}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
