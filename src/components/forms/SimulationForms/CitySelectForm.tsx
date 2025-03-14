import React, {ChangeEvent, useMemo} from "react";
import {Label} from "@/components/ui/label";

interface CitySelectProps {
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    cities: { id: number; name: string }[];
    placeholder?: string;
    disabled?: boolean;
}

const CitySelect = ({label, value, onChange, cities, disabled = false}: CitySelectProps) => {
    const placeholder = useMemo(() => disabled ? "Sélection non disponible" : "Sélectionner une ville", [disabled]);

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
                <option value="">{placeholder}</option>
                {cities.length > 0 ? (
                    cities.map((city) => (
                        <option key={city.id} value={city.name}> {/* ✅ Ensure correct key and value */}
                            {city.name}
                        </option>
                    ))
                ) : (
                    <option disabled>Aucune ville disponible</option>
                )}
            </select>
        </div>
    );
};

export default CitySelect;
