'use client';
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Pricing from "@/components/pricing/Pricing";
import TarifsPage from "@/app/client/tarifs/page";
import { ArrowRight, Package, Truck, Clock, Shield } from "lucide-react";

const HomePage = () => {
    const features = [
        {
            icon: <Package className="h-6 w-6" />,
            title: "Gestion Simplifiée",
            description: "Interface intuitive pour gérer tous vos colis efficacement"
        },
        {
            icon: <Truck className="h-6 w-6" />,
            title: "Suivi en Temps Réel",
            description: "Suivez vos colis à chaque étape de leur livraison"
        },
        {
            icon: <Clock className="h-6 w-6" />,
            title: "Rapide et Efficace",
            description: "Économisez du temps avec nos processus optimisés"
        },
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Sécurisé",
            description: "Protection maximale de vos colis et de vos données"
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl md:text-5xl font-bold text-gray-900"
                        >
                            Gérez vos colis en toute simplicité avec{" "}
                            <span className="text-blue-600">Colis App</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-xl text-gray-600"
                        >
                            La solution la plus simple et la plus rapide pour gérer vos colis.
                            Profitez d&#39;une expérience optimisée et sécurisée.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link href="/client/simulation">
                                <Button size="lg" className="gap-2">
                                    Faire une simulation
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <div className="relative h-[400px] lg:h-[500px] w-full">
                            <Image
                                priority
                                src="/svg/home/welcome.svg"
                                alt="Welcome"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Pourquoi choisir Colis App ?
                        </h2>
                        <p className="text-lg text-gray-600">
                            Découvrez nos fonctionnalités conçues pour faciliter votre gestion de colis
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <Pricing />
                </div>
            </section>

            {/* Tarifs Section */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <TarifsPage />
                </div>
            </section>
        </div>
    );
};

export default HomePage;