// path: src/components/forms/SimulationForms/CountrySelectForm.tsx

import React, {useMemo} from "react";
import {Label} from "@/components/ui/label";

interface CountrySelectProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    countries: { id: number; name: string }[];
    disabled?: boolean;
    placeholder?: string;
}

const CountrySelect = ({
                           label,
                           value,
                           onChange,
                           countries,
                           disabled = false
                       }: CountrySelectProps) => {

    const placeholder = useMemo(() => disabled ? "Sélection non disponible" : "Sélectionner un pays", [disabled]);
    return (
        <div className="mb-4 w-full">
            <Label className="text-gray-700 font-semibold">{label}</Label>
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200">
                <option value="">{placeholder}</option>
                {countries.length > 0 ? (
                    countries.map((country) => (
                        <option key={country.id} value={country.id.toString()}>
                            {country.name}
                        </option>
                    ))
                ) : (
                    <option disabled>Aucun pays disponible</option>
                )}
            </select>
        </div>
    );
};

export default CountrySelect;
