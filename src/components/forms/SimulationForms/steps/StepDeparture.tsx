import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import CountrySelect from '@/components/forms/SimulationForms/CountrySelectForm';
import CitySelect from '@/components/forms/SimulationForms/CitySelectForm';
import AgencySelect from '@/components/forms/SimulationForms/AgencySelectForm';

export interface DepartureState {
    country: string;
    city: string;
    agencyName: string;
}

interface Props {
    departure: DepartureState;
    countries: { id: number; name: string }[];
    cities: { id: number; name: string }[];
    agencies: { id: number; name: string }[];
    onChange: (field: keyof DepartureState, value: string) => void;
}

const StepDeparture: React.FC<Props> = ({
    departure,
    countries,
    cities,
    agencies,
    onChange,
}) => (
    <Card>
        <CardHeader>
            <CardTitle>Informations de Départ</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CountrySelect
                label="Pays de départ"
                value={departure.country}
                onChange={(e) => onChange('country', e.target.value)}
                countries={countries}
                placeholder="Sélectionnez un pays"
            />

            <CitySelect
                label="Ville de départ"
                value={departure.city}
                onChange={(e) => onChange('city', e.target.value)}
                cities={cities}
                disabled={!departure.country}
            />

            <AgencySelect
                label="Agence de départ"
                value={departure.agencyName}
                onChange={(e) => onChange('agencyName', e.target.value)}
                agencies={agencies}
                disabled={!departure.city}
            />
        </CardContent>
    </Card>
);

export default StepDeparture;
