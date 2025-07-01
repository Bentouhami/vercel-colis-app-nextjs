// path: src/app/client/about/page.tsx
import React from 'react';
import { Package, ShieldCheck, Truck, Users } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">
                        À propos de ColisApp
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Une plateforme moderne pour simplifier l&#39;envoi et le suivi de colis entre le Maroc et la Belgique.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Introduction section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Notre mission</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Chez ColisApp, nous facilitons les envois pour les particuliers comme pour les agences.
                            Notre objectif est d&#39;offrir une plateforme simple, sécurisée et efficace pour gérer
                            vos expéditions internationales, en particulier entre le Maroc et la Belgique.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            Grâce à notre interface intuitive, vous pouvez simuler des envois, ajouter des destinataires,
                            suivre vos colis, et gérer vos informations personnelles facilement.
                        </p>
                    </div>

                    {/* Illustration section */}
                    <div className="flex items-center justify-center">
                        <Package className="w-32 h-32 text-indigo-500 dark:text-indigo-400" />
                    </div>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                        <Truck className="mx-auto w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Livraison simplifiée</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Suivez vos envois en temps réel et bénéficiez d’une logistique fluide et transparente.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                        <ShieldCheck className="mx-auto w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Sécurité et fiabilité</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Vos données et vos colis sont protégés grâce à des protocoles de sécurité avancés.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                        <Users className="mx-auto w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Accessible à tous</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Que vous soyez un particulier ou une agence, notre plateforme s’adapte à vos besoins.
                        </p>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Un projet académique, pensé comme une vraie entreprise
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                        ColisApp est développé dans le cadre d’un travail de fin d’études, avec l’ambition de proposer une
                        solution professionnelle. Chaque fonctionnalité est pensée pour répondre à des besoins réels :
                        paiement sécurisé, interface claire, suivi détaillé, et plus encore.
                    </p>
                </div>
            </div>
        </div>
    );
}

