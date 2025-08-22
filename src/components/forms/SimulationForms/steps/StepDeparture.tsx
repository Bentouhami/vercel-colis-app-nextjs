"use client"

import type React from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import CountrySelect from "../CountrySelectForm"
import CitySelect from "../CitySelectForm"
import AgencySelect from "../AgencySelectForm"

interface Props {
    departure: {
        country: string
        city: string
        agencyName: string
    }
    countries: { id: number; name: string }[]
    cities: { id: number; name: string }[]
    agencies: { id: number; name: string }[]
    onChange: (field: "country" | "city" | "agencyName", value: string) => void
}

const StepDeparture: React.FC<Props> = ({ departure, countries, cities, agencies, onChange }) => {
    return (
        <Card className="w-full transition-all duration-300 hover:shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Informations de Départ
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <CountrySelect
                    label="Pays de départ"
                    value={departure.country}
                    onChange={(e) => onChange("country", e.target.value)}
                    countries={countries}
                    disabled={false}
                    placeholder="Sélectionnez un pays de départ"
                />

                <CitySelect
                    label="Ville de départ"
                    value={departure.city}
                    onChange={(e) => onChange("city", e.target.value)}
                    cities={cities}
                    disabled={!departure.country}
                />

                <AgencySelect
                    label="Agence de départ"
                    value={departure.agencyName}
                    onChange={(e) => onChange("agencyName", e.target.value)}
                    agencies={agencies}
                    disabled={!departure.city}
                />
            </CardContent>
        </Card>
    )
}

export default StepDeparture
