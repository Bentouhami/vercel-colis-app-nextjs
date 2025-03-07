import React, { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";

interface AgencySelectProps {
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    agencies: { id: number; name: string }[];
    disabled?: boolean;
}

const AgencySelect = ({ label, value, onChange, agencies, disabled = false }: AgencySelectProps) => {
    return (
        <div className="mb-4">
            <Label className="text-gray-700 font-semibold">{label}</Label>
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="
                  mt-1 w-full
                  border-2 border-gray-300
                  rounded-lg
                  p-2
                  focus:outline-none
                  focus:border-blue-600
                  transition duration-200
                "
            >
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
