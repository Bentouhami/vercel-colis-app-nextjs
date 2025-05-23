// path: src/app/page.tsx

import React from 'react';
import { Building, User, Shield, ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';
import { adminPath, clientPath } from "@/utils/constants";
import Footer from "@/components/navigations/footer/Footer";
import HeaderWrapper from "@/components/navigations/header/HeaderWrapper";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black ">
            <HeaderWrapper />

            {/* Hero Section */}
            <section className=" pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mt-40 text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                        Bienvenue sur <span className="text-indigo-600 dark:text-indigo-400">ColisApp</span>
                    </h2>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        La plateforme de gestion de colis intelligente pour entreprises et particuliers
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
                        <div className="p-8">
                            <h3 className="text-xl font-semibold text-center mb-6 dark:text-white">
                                Accéder à votre espace
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Client */}
                                <Link
                                    href="/client"
                                    className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
                                >
                                    <User className="w-12 h-12 text-indigo-600 mb-4" />
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Espace Client</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                                        Suivez vos colis et gérez vos expéditions
                                    </p>
                                    <div className="flex items-center text-indigo-600 group-hover:translate-x-1 transition-transform">
                                        <span className="text-sm font-medium mr-1">Accéder</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Link>

                                {/* Super Admin */}
                                <Link
                                    href={adminPath()}
                                    className="flex flex-col items-center p-6 bg-indigo-50 dark:bg-indigo-900 border border-indigo-100 dark:border-indigo-400 rounded-lg shadow hover:bg-indigo-100 dark:hover:bg-indigo-800 transition group"
                                >
                                    <Shield className="w-12 h-12 text-indigo-600 mb-4" />
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Administration</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                                        Gestion complète de la plateforme
                                    </p>
                                    <div className="flex items-center text-indigo-600 group-hover:translate-x-1 transition-transform">
                                        <span className="text-sm font-medium mr-1">Accéder</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Link>

                                {/* Agency Admin */}
                                <Link
                                    href={adminPath()}
                                    className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
                                >
                                    <Building className="w-12 h-12 text-indigo-600 mb-4" />
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Gestion Agence</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                                        Administration de votre agence locale
                                    </p>
                                    <div className="flex items-center text-indigo-600 group-hover:translate-x-1 transition-transform">
                                        <span className="text-sm font-medium mr-1">Accéder</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Nos fonctionnalités
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-lg flex items-center justify-center mb-4">
                                <Package className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Suivi en temps réel</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Suivez l&#39;état de vos colis à tout moment avec des mises à jour instantanées.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-lg flex items-center justify-center mb-4">
                                <User className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Portail client</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Interface intuitive pour gérer vos expéditions et demandes.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-lg flex items-center justify-center mb-4">
                                <Building className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Gestion multi-agences</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Administration complète de toutes vos agences depuis une seule interface.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
