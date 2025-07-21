// src/components/forms/SimulationForms/steps/StepDestination.tsx


import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import CountrySelect from '@/components/forms/SimulationForms/CountrySelectForm';
import CitySelect from '@/components/forms/SimulationForms/CitySelectForm';
import AgencySelect from '@/components/forms/SimulationForms/AgencySelectForm';

export interface DestinationState {
    country: string;
    city: string;
    agencyName: string;
}

interface Props {
    destination: DestinationState;
    countries: { id: number; name: string }[];
    cities: { id: number; name: string }[];
    agencies: { id: number; name: string }[];
    onChange: (field: keyof DestinationState, value: string) => void;
    /** 
     * Désactive entièrement l’étape tant qu’une agence de départ n’est pas sélectionnée.
     */
    disabled?: boolean;
}

const StepDestination: React.FC<Props> = ({
    destination,
    countries,
    cities,
    agencies,
    onChange,
    disabled,
}) => (
    <Card>
        <CardHeader>
            <CardTitle>Informations de Destination</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CountrySelect
                label="Pays de destination"
                value={destination.country}
                onChange={(e) => onChange('country', e.target.value)}
                countries={countries}
                disabled={disabled}
                placeholder="Sélectionnez d’abord une agence de départ"
            />

            <CitySelect
                label="Ville de destination"
                value={destination.city}
                onChange={(e) => onChange('city', e.target.value)}
                cities={cities}
                disabled={!destination.country}
            />

            <AgencySelect
                label="Agence d'arrivée"
                value={destination.agencyName}
                onChange={(e) => onChange('agencyName', e.target.value)}
                agencies={agencies}
                disabled={!destination.city}
            />
        </CardContent>
    </Card>
);

export default StepDestination;
