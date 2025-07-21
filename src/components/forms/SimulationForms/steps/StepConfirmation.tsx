// src/components/forms/SimulationForms/steps/StepConfirmation.tsx 
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { DepartureState } from './StepDeparture';
import { DestinationState } from './StepDestination';
import { Parcel } from './StepParcels';

interface OptionLists {
    countries: { id: number; name: string }[];
    destinationCountries: { id: number; name: string }[];
    departureCities: { id: number; name: string }[];
    destinationCities: { id: number; name: string }[];
    departureAgencies?: { id: number; name: string }[];
    destinationAgencies?: { id: number; name: string }[];
}

interface Props {
    departure: DepartureState;
    destination: DestinationState;
    parcels: Parcel[];
    options: OptionLists;
}

const StepConfirmation: React.FC<Props> = ({ departure, destination, parcels, options }) => {
    const depCountry = options.countries.find((c) => String(c.id) === departure.country)?.name;
    const depCity = options.departureCities.find((c) => String(c.id) === departure.city)?.name;
    const depAgency = options.departureAgencies?.find((a) => String(a.id) === departure.agencyName)?.name || departure.agencyName;

    const destCountry = options.destinationCountries.find((c) => String(c.id) === destination.country)?.name;
    const destCity = options.destinationCities.find((c) => String(c.id) === destination.city)?.name;
    const destAgency = options.destinationAgencies?.find((a) => String(a.id) === destination.agencyName)?.name || destination.agencyName;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Résumé &amp; Soumission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
                {/* Départ */}
                <div>
                    <h4 className="font-semibold mb-2">Départ</h4>
                    <p>
                        {depCountry} / {depCity} / {depAgency}
                    </p>
                </div>

                {/* Destination */}
                <div>
                    <h4 className="font-semibold mb-2">Destination</h4>
                    <p>
                        {destCountry} / {destCity} / {destAgency}
                    </p>
                </div>

                {/* Colis */}
                <div>
                    <h4 className="font-semibold mb-2">Colis</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {parcels.map((p, i) => (
                            <li key={i}>
                                Colis {i + 1}: {p.weight} kg – {p.length}×{p.width}×{p.height} cm
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};

export default StepConfirmation;
