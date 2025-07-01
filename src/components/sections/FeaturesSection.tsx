// src/components/sections/FeaturesSection.tsx
'use client'

import {motion} from 'framer-motion'
import {
    LucidePackageSearch,
    LucideUserCheck,
    LucideSend,
    LucideCreditCard,
    LucideClipboardList,
    LucideBuilding2,
    LucideLayoutDashboard,
    LucideUserCircle2
} from "lucide-react"

import {Card, CardContent} from "@/components/ui/card"
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";

const features = [
    {
        title: "Simulation rapide",
        description: "Estimez le coût d’un envoi en quelques clics, même sans être connecté.",
        icon: LucidePackageSearch
    },
    {
        title: "Connexion sécurisée",
        description: "Créez un compte et connectez-vous facilement grâce à NextAuth & JWT.",
        icon: LucideUserCheck
    },
    {
        title: "Paiement intégré",
        description: "Payez votre envoi directement via Stripe (mode test sécurisé).",
        icon: LucideCreditCard
    },
    {
        title: "Destinataires intelligents",
        description: "Ajoutez vos destinataires avec détection automatique des doublons.",
        icon: LucideUserCircle2
    },
    {
        title: "Suivi d’envoi en temps réel",
        description: "Consultez le statut de vos colis : en attente, livré, annulé, etc.",
        icon: LucideClipboardList
    },
    {
        title: "Espace personnel",
        description: "Accédez à votre tableau de bord, à vos envois et à vos destinataires.",
        icon: LucideLayoutDashboard
    },
    {
        title: "Interface administrateur",
        description: "Tableau de bord dédié aux admins pour gérer utilisateurs et agences.",
        icon: LucideSend
    },
    {
        title: "Gestion des agences",
        description: "Ajoutez et configurez les agences via un super administrateur.",
        icon: LucideBuilding2
    },
]

export default function FeaturesSection() {
    return (
        <>
            <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                            Fonctionnalités de ColisApp
                        </h2>
                        <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Une application pensée pour les particuliers et les agences. Simple, rapide, et intuitive.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{opacity: 0, y: 30}}
                                whileInView={{opacity: 1, y: 0}}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                    ease: [0.22, 1, 0.36, 1], // cubic-bezier easeOutExpo
                                    type: 'spring',
                                    stiffness: 60,
                                    damping: 15
                                }}
                                viewport={{once: true, amount: 0.3}}
                            >
                                <Card
                                    className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
                                    <CardContent className="p-6">
                                        <div
                                            className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 mb-4">
                                            <feature.icon className="w-6 h-6"/>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <ScrollToTopButton targetId="features"/>
        </>

    )
}
