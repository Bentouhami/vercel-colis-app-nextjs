// E:\fullstack_project\NextJs_Projects\newColiApp\src\components\forms\admins\AgencySelector.tsx

'use client';

import React, { useEffect, useState } from 'react';

import { getAllCountries, getCitiesByCountryId } from '@/services/frontend-services/AddressService';
import { getAgenciesLight } from '@/services/frontend-services/agencies/AgencyService';

interface AgencySelectorProps {
    onSelectAction: (agencyId: number) => void;
    defaultAgencyId?: number;
}

export function AgencySelector({ onSelectAction, defaultAgencyId }: AgencySelectorProps) {
    const [countries, setCountries] = useState<{ id: number; name: string }[]>([]);
    const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
    const [agencies, setAgencies] = useState<{ id: number; name: string }[]>([]);

    const [selectedCountryId, setSelectedCountryId] = useState<number | undefined>();
    const [selectedCityId, setSelectedCityId] = useState<number | undefined>();

    useEffect(() => {
        getAllCountries().then(setCountries);
    }, []);

    useEffect(() => {
        if (selectedCountryId) {
            getCitiesByCountryId(selectedCountryId).then(setCities);
        }
    }, [selectedCountryId]);

    useEffect(() => {
        if (selectedCityId) {
            getAgenciesLight({ cityId: selectedCityId }).then(setAgencies);
        }
    }, [selectedCityId]);

    return (
        <div className="space-y-4">
            <div>
                <label>Pays</label>
                <select
                    className="w-full p-2 border rounded"
                    onChange={(e) => setSelectedCountryId(Number(e.target.value))}
                >
                    <option value="">-- Sélectionner un pays --</option>
                    {countries.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {selectedCountryId && (
                <div>
                    <label>Ville</label>
                    <select
                        className="w-full p-2 border rounded"
                        onChange={(e) => setSelectedCityId(Number(e.target.value))}
                    >
                        <option value="">-- Sélectionner une ville --</option>
                        {cities.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {selectedCityId && (
                <div>
                    <label>Agence</label>
                    <select
                        className="w-full p-2 border rounded"
                        defaultValue={defaultAgencyId}
                        onChange={(e) => onSelectAction(Number(e.target.value))}
                    >
                        <option value="">-- Sélectionner une agence --</option>
                        {agencies.map((a) => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}
