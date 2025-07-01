// path: src/components/sections/HeroSection.tsx
'use client'

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const HeroSection = () => {
    return (
        <section className="container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Texte gauche */}
                <div className="space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
                    >
                        Gérez vos colis en toute simplicité avec{" "}
                        <span className="text-blue-600">Colis App</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-xl text-gray-600 dark:text-gray-300"
                    >
                        La solution la plus simple et la plus rapide pour gérer vos colis.
                        Profitez d&apos;une expérience optimisée et sécurisée.
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

                {/* Image droite */}
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
    )
}

export default HeroSection

