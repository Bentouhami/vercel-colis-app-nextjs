// path: src/components/forms/SimulationForms/DepartureFormStep.tsx

'use client';

import React, { ChangeEvent, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import CountrySelect from "@/components/forms/SimulationForms/CountrySelectForm";
import CitySelect from "@/components/forms/SimulationForms/CitySelectForm";
import AgencySelect from "@/components/forms/SimulationForms/AgencySelectForm";
import { getAllCountries, getCitiesByCountryId, getAgenciesByCityId } from "@/services/frontend-services/AddressService";
import { toast } from 'sonner';

interface DepartureFormStepProps {
    departure: { country: string; city: string; agencyName: string };
    setDeparture: React.Dispatch<React.SetStateAction<{ country: string; city: string; agencyName: string }>>;
    options: any; // TODO: Define a proper type for options
    setOptions: React.Dispatch<React.SetStateAction<any>>; // TODO: Define a proper type for setOptions
}

const DepartureFormStep: React.FC<DepartureFormStepProps> = ({
    departure,
    setDeparture,
    options,
    setOptions,
}) => {

    //==================================
    //   FETCH DEPARTURE COUNTRIES
    //==================================
    useEffect(() => {
        (async () => {
            try {
                const data = await getAllCountries();
                setOptions((prev: any) => ({ ...prev, countries: data }));
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        })();
    }, [setOptions]);

    //==================================
    //   FETCH DEPARTURE CITIES
    //==================================
    useEffect(() => {
        if (!departure.country) {
            setOptions((prev: any) => ({ ...prev, departureCities: [] }));
            setDeparture((prev) => ({ ...prev, city: '', agencyName: '' }));
            return;
        }

        (async () => {
            try {
                const countryId = Number(departure.country);
                const data = await getCitiesByCountryId(countryId); // Only cities that actually have an agency
                setOptions((prev: any) => ({ ...prev, departureCities: data }));
                // Reset city + agency
                setDeparture((prev) => ({ ...prev, city: '', agencyName: '' }));
            } catch (error) {
                console.error("Error fetching departure cities:", error);
                toast.error("Failed to fetch cities. Please try again.");
            }
        })();
    }, [departure.country, setOptions, setDeparture]);

    //==================================
    //   FETCH DEPARTURE AGENCIES
    //==================================
    useEffect(() => {
        if (!departure.city) {
            setOptions((prev: any) => ({ ...prev, departureAgencies: [] }));
            setDeparture((prev) => ({ ...prev, agencyName: '' }));
            return;
        }

        (async () => {
            try {
                // cityId from the state
                const cityObj = options.departureCities.find((c: any) => c.id === Number(departure.city));

                if (cityObj) {
                    const data = await getAgenciesByCityId(cityObj.id);
                    setOptions((prev: any) => ({ ...prev, departureAgencies: data }));
                    setDeparture((prev) => ({ ...prev, agencyName: '' }));
                }
            } catch (error) {
                console.error(" Error fetching departure agencies:", error);
                toast.error("Failed to fetch agencies. Please try again.");
            }
        })();
    }, [departure.city, options.departureCities, setOptions, setDeparture]);

    const handleDepartureChange = (field: keyof typeof departure, value: string) => {
        setDeparture((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CountrySelect
                    label="Pays de départ"
                    value={departure.country}
                    onChange={(e) => handleDepartureChange('country', e.target.value)}
                    countries={options.countries}
                    placeholder="Sélectionnez un pays"
                />
                <CitySelect
                    label="Ville de départ"
                    value={departure.city}
                    onChange={(e) => handleDepartureChange('city', e.target.value)}
                    cities={options.departureCities}
                    disabled={!departure.country}
                />
                <AgencySelect
                    label="Agence de départ"
                    value={departure.agencyName}
                    onChange={(e) => handleDepartureChange('agencyName', e.target.value)}
                    agencies={options.departureAgencies}
                    disabled={!departure.city}
                />
            </div>
        </CardContent>
    );
};

export default DepartureFormStep;
