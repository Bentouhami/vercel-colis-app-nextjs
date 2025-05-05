// path: src/components/forms/SimulationForms/AgencySelectForm.tsx

import React, {ChangeEvent} from "react";
import {Label} from "@/components/ui/label";

interface AgencySelectProps {
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    agencies: { id: number; name: string }[];
    disabled?: boolean;
}

const AgencySelect = ({label, value, onChange, agencies, disabled = false}: AgencySelectProps) => {
    return (
        <div className="mb-4">
            <Label className="text-gray-700 font-semibold">{label}</Label>
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200">
                <option value="">{disabled ? "Sélection non disponible" : "Sélectionner une agence"}</option>
                {agencies.length > 0 ? (
                    agencies.map((agency) => (
                        <option key={agency.id} value={agency.name}>
                            {agency.name}
                        </option>
                    ))
                ) : (
                    <option disabled>Aucune agence disponible</option>
                )}
            </select>
        </div>
    );
};

export default AgencySelect;
