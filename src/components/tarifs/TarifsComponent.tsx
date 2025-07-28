'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, MapPin, Package, Clock, Truck, Shield } from 'lucide-react'

const tarifs = [
    {
        destination: "Maroc → Belgique",
        poids: "0-5kg",
        prix: "25€",
        delai: "5-7 jours",
        icon: Package,
        color: "from-blue-500 to-blue-600"
    },
    {
        destination: "Maroc → Belgique",
        poids: "5-10kg",
        prix: "45€",
        delai: "5-7 jours",
        icon: Package,
        color: "from-green-500 to-green-600"
    },
    {
        destination: "Maroc → Belgique",
        poids: "10-20kg",
        prix: "75€",
        delai: "7-10 jours",
        icon: Package,
        color: "from-purple-500 to-purple-600"
    },
    {
        destination: "Belgique → Maroc",
        poids: "0-5kg",
        prix: "30€",
        delai: "5-7 jours",
        icon: Package,
        color: "from-orange-500 to-orange-600"
    },
    {
        destination: "Belgique → Maroc",
        poids: "5-10kg",
        prix: "50€",
        delai: "5-7 jours",
        icon: Package,
        color: "from-red-500 to-red-600"
    },
    {
        destination: "Belgique → Maroc",
        poids: "10-20kg",
        prix: "85€",
        delai: "7-10 jours",
        icon: Package,
        color: "from-pink-500 to-pink-600"
    }
]

const services = [
    {
        title: "Livraison Express",
        description: "Livraison en 3-5 jours ouvrables",
        icon: Truck,
        supplement: "+15€"
    },
    {
        title: "Assurance Premium",
        description: "Protection jusqu'à 500€",
        icon: Shield,
        supplement: "+10€"
    },
    {
        title: "Suivi GPS",
        description: "Localisation en temps réel",
        icon: MapPin,
        supplement: "+5€"
    }
]

export default function TarifsComponent() {
    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
                        <Calculator className="h-4 w-4" />
                        Tarification
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Nos Tarifs Transparents
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Des prix clairs et compétitifs pour tous vos envois entre le Maroc et la Belgique
                    </p>
                </div>

                {/* Tarifs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {tarifs.map((tarif, index) => (
                        <div
                            key={index}
                            className="animate-slide-up group"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <Card className="h-full bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                                <CardHeader className="text-center pb-4">
                                    <div className={`mx-auto w-14 h-14 rounded-xl bg-gradient-to-r ${tarif.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <tarif.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                                        {tarif.destination}
                                    </CardTitle>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        {tarif.poids}
                                    </p>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        {tarif.prix}
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm">{tarif.delai}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full group-hover:bg-gray-50 dark:group-hover:bg-gray-700 transition-colors"
                                    >
                                        Choisir ce tarif
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* Services Additionnels */}
                <div className="animate-slide-up" style={{ animationDelay: "600ms" }}>
                    <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                        Services Additionnels
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {services.map((service, index) => (
                            <Card key={index} className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                                <CardContent className="p-6 text-center">
                                    <service.icon className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                                        {service.description}
                                    </p>
                                    <div className="text-lg font-bold text-blue-600">
                                        {service.supplement}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center animate-slide-up" style={{ animationDelay: "800ms" }}>
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Calculez le prix exact de votre envoi
                        </h3>
                        <p className="text-blue-100 mb-6">
                            Utilisez notre simulateur pour obtenir un devis personnalisé en quelques clics
                        </p>
                        <Button size="lg" variant="secondary" className="gap-2">
                            <Calculator className="h-4 w-4" />
                            Faire une simulation
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
