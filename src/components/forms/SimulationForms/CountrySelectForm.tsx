import { Form } from 'react-bootstrap';
import React from "react";

interface CountrySelectProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    countries: { id: number, country: string }[];
    disabled?: boolean;

}

const CountrySelect = ({ label, value, onChange, countries, disabled = false }: CountrySelectProps) => {
    const placeholder = "Sélectionner un pays";

    return (
        <Form.Group className="mb-4">
            <Form.Label className="text-gray-700 font-semibold">{label}</Form.Label>
            <Form.Select
                value={value}
                onChange={onChange}
                aria-label={label}
                disabled={disabled}
                className="border-2 border-gray-300 rounded-lg focus:border-blue-600 transition duration-200 ease-in-out"
            >
                <option value="">{placeholder}</option>
                {countries.length > 0 ? (
                    countries.map((country) => (
                        <option key={country.id} value={country.country}>{country.country}</option>
                    ))
                ) : (
                    <option disabled>Aucun pays disponible</option>
                )}
            </Form.Select>
        </Form.Group>
    );
};

export default CountrySelect;
