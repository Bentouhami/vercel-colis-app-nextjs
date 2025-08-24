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
        <div className="space-y-4 md:space-y-6">
            {/* En-tête de confirmation */}
            <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader className="p-4 md:p-6">
                    <CardTitle className="flex items-center gap-2 text-green-800 text-base md:text-lg">
                        <CheckCircle className="h-5 w-5 md:h-6 md:w-6" />
                        Confirmation de la Simulation
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                    <p className="text-green-700 text-sm md:text-base">
                        Veuillez vérifier les informations ci-dessous avant de soumettre votre simulation d&apos;envoi.
                    </p>
                </CardContent>
            </Card>

            {/* Informations de départ et destination */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                {/* Informations de départ */}
                <Card className="transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="bg-blue-50 p-4 md:p-6">
                        <CardTitle className="flex items-center gap-2 text-blue-700 text-base md:text-lg">
                            <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                            Point de Départ
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <span className="text-gray-600 text-sm md:text-base">Pays:</span>
                            <Badge variant="outline" className="w-fit text-xs md:text-sm">
                                {getDepartureCountryName()}
                            </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <span className="text-gray-600 text-sm md:text-base">Ville:</span>
                            <Badge variant="outline" className="w-fit text-xs md:text-sm">
                                {getDepartureCityName()}
                            </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <span className="text-gray-600 text-sm md:text-base">Agence:</span>
                            <Badge variant="outline" className="w-fit text-xs md:text-sm break-words">
                                {getDepartureAgencyName()}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Informations de destination */}
                <Card className="transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="bg-green-50 p-4 md:p-6">
                        <CardTitle className="flex items-center gap-2 text-green-700 text-base md:text-lg">
                            <Truck className="h-4 w-4 md:h-5 md:w-5" />
                            Point de Destination
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <span className="text-gray-600 text-sm md:text-base">Pays:</span>
                            <Badge variant="outline" className="w-fit text-xs md:text-sm">
                                {getDestinationCountryName()}
                            </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <span className="text-gray-600 text-sm md:text-base">Ville:</span>
                            <Badge variant="outline" className="w-fit text-xs md:text-sm">
                                {getDestinationCityName()}
                            </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <span className="text-gray-600 text-sm md:text-base">Agence:</span>
                            <Badge variant="outline" className="w-fit text-xs md:text-sm break-words">
                                {getDestinationAgencyName()}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Résumé des colis */}
            <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader className="bg-purple-50 dark:bg-purple-900/20 p-4 md:p-6">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                            <Package className="h-4 w-4 md:h-5 md:w-5" />
                            <span className="text-base md:text-lg">Résumé des Colis ({parcels.length})</span>
                        </div>
                        <div className="flex items-center gap-3 md:gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Scale className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <span className="font-medium text-foreground">{totalWeight.toFixed(1)} kg</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="font-medium text-foreground">{(totalVolume / 1000000).toFixed(3)} m³</span>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                        {parcels.map((parcel, index) => {
                            const volume = (parcel.height * parcel.width * parcel.length) / 1000000
                            return (
                                <div
                                    key={index}
                                    className="p-3 md:p-4 border rounded-lg bg-muted hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors duration-200"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-medium text-sm text-foreground">Colis {index + 1}</span>
                                        <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                            ✓ Valide
                                        </Badge>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                            <span className="text-muted-foreground">Dimensions:</span>
                                            <span className="font-medium break-words text-foreground">
                                                {parcel.height} × {parcel.width} × {parcel.length} cm
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                            <span className="text-muted-foreground">Poids:</span>
                                            <span className="font-medium text-foreground">{parcel.weight} kg</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                            <span className="text-muted-foreground">Volume:</span>
                                            <span className="font-medium text-foreground">{volume.toFixed(3)} m³</span>
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
                <CardContent className="p-4 md:p-6">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                            <h4 className="font-medium text-blue-800 mb-2 text-sm md:text-base">Prêt pour la simulation</h4>
                            <p className="text-blue-700 text-sm">
                                Toutes les informations ont été vérifiées. Cliquez sur &quot;Soumettre la simulation&quot; pour calculer le coût
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
