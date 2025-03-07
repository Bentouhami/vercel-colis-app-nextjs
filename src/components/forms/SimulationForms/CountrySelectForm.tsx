import React from "react";
import { Label } from "@/components/ui/label";

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
                           disabled = false,
                           placeholder = "",
                       }: CountrySelectProps) => {
    return (
        <div className="mb-4 w-full">
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
