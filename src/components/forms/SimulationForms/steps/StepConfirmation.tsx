"use client"

import type React from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, MapPin, Truck, Package, Scale, Calculator } from "lucide-react"
import type { CreateParcelDto } from "@/services/dtos"

interface Props {
    departure: {
        country: string
        city: string
        agencyName: string
    }
    destination: {
        country: string
        city: string
        agencyName: string
    }
    parcels: CreateParcelDto[]
    options: {
        countries: { id: number; name: string }[]
        destinationCountries: { id: number; name: string }[]
        departureCities: { id: number; name: string }[]
        departureAgencies: { id: number; name: string }[]
        destinationCities: { id: number; name: string }[]
        destinationAgencies: { id: number; name: string }[]
    }
}

const StepConfirmation: React.FC<Props> = ({ departure, destination, parcels, options }) => {
    // Récupérer les noms à partir des IDs
    const getDepartureCountryName = () => {
        const country = options.countries.find((c) => c.id.toString() === departure.country)
        return country?.name || departure.country
    }

    const getDepartureCityName = () => {
        const city = options.departureCities.find((c) => c.id.toString() === departure.city)
        return city?.name || departure.city
    }

    const getDepartureAgencyName = () => {
        const agency = options.departureAgencies.find((a) => a.id.toString() === departure.agencyName)
        return agency?.name || departure.agencyName
    }

    const getDestinationCountryName = () => {
        const country = options.destinationCountries.find((c) => c.id.toString() === destination.country)
        return country?.name || destination.country
    }

    const getDestinationCityName = () => {
        const city = options.destinationCities.find((c) => c.id.toString() === destination.city)
        return city?.name || destination.city
    }

    const getDestinationAgencyName = () => {
        const agency = options.destinationAgencies.find((a) => a.id.toString() === destination.agencyName)
        return agency?.name || destination.agencyName
    }

    // Calculs des totaux
    const totalWeight = parcels.reduce((sum, parcel) => sum + (parcel.weight || 0), 0)
    const totalVolume = parcels.reduce((sum, parcel) => {
        const volume = (parcel.height || 0) * (parcel.width || 0) * (parcel.length || 0)
        return sum + volume
    }, 0)

    return (
        <div className="space-y-6">
            {/* En-tête de confirmation */}
            <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-6 w-6" />
                        Confirmation de la Simulation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-green-700">
                        Veuillez vérifier les informations ci-dessous avant de soumettre votre simulation d'envoi.
                    </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informations de départ */}
                <Card className="transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="bg-blue-50">
                        <CardTitle className="flex items-center gap-2 text-blue-700">
                            <MapPin className="h-5 w-5" />
                            Point de Départ
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Pays:</span>
                            <Badge variant="outline">{getDepartureCountryName()}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Ville:</span>
                            <Badge variant="outline">{getDepartureCityName()}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Agence:</span>
                            <Badge variant="outline">{getDepartureAgencyName()}</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Informations de destination */}
                <Card className="transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="bg-green-50">
                        <CardTitle className="flex items-center gap-2 text-green-700">
                            <Truck className="h-5 w-5" />
                            Point de Destination
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Pays:</span>
                            <Badge variant="outline">{getDestinationCountryName()}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Ville:</span>
                            <Badge variant="outline">{getDestinationCityName()}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Agence:</span>
                            <Badge variant="outline">{getDestinationAgencyName()}</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Résumé des colis */}
            <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader className="bg-purple-50">
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-purple-700">
                            <Package className="h-5 w-5" />
                            Résumé des Colis ({parcels.length})
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Scale className="h-4 w-4 text-green-600" />
                                <span className="font-medium">{totalWeight.toFixed(1)} kg</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calculator className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">{(totalVolume / 1000000).toFixed(3)} m³</span>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {parcels.map((parcel, index) => {
                            const volume = (parcel.height * parcel.width * parcel.length) / 1000000
                            return (
                                <div
                                    key={index}
                                    className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-medium text-sm">Colis {index + 1}</span>
                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                            ✓ Valide
                                        </Badge>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Dimensions:</span>
                                            <span className="font-medium">
                                                {parcel.height} × {parcel.width} × {parcel.length} cm
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Poids:</span>
                                            <span className="font-medium">{parcel.weight} kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Volume:</span>
                                            <span className="font-medium">{volume.toFixed(3)} m³</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Message de confirmation */}
            <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-800 mb-2">Prêt pour la simulation</h4>
                            <p className="text-blue-700 text-sm">
                                Toutes les informations ont été vérifiées. Cliquez sur "Soumettre la simulation" pour calculer le coût
                                et la durée de votre envoi.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default StepConfirmation
