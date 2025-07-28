"use client"

import type React from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Truck } from "lucide-react"
import CountrySelect from "../CountrySelectForm"
import CitySelect from "../CitySelectForm"
import AgencySelect from "../AgencySelectForm"

interface Props {
    destination: {
        country: string
        city: string
        agencyName: string
    }
    countries: { id: number; name: string }[]
    cities: { id: number; name: string }[]
    agencies: { id: number; name: string }[]
    onChange: (field: "country" | "city" | "agencyName", value: string) => void
    disabled: boolean
}

const StepDestination: React.FC<Props> = ({ destination, countries, cities, agencies, onChange, disabled }) => {
    return (
        <Card className="w-full transition-all duration-300 hover:shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    Informations de Destination
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <CountrySelect
                    label="Pays de destination"
                    value={destination.country}
                    onChange={(e) => onChange("country", e.target.value)}
                    countries={countries}
                    disabled={disabled}
                    placeholder={disabled ? "Sélectionnez d'abord une agence de départ" : "Sélectionnez un pays de destination"}
                />

                <CitySelect
                    label="Ville de destination"
                    value={destination.city}
                    onChange={(e) => onChange("city", e.target.value)}
                    cities={cities}
                    disabled={!destination.country}
                />

                <AgencySelect
                    label="Agence de destination"
                    value={destination.agencyName}
                    onChange={(e) => onChange("agencyName", e.target.value)}
                    agencies={agencies}
                    disabled={!destination.city}
                />
            </CardContent>
        </Card>
    )
}

export default StepDestination
