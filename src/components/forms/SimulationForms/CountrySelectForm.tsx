import {Form} from 'react-bootstrap';
import React from "react";

interface CountrySelectProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    countries: { id: number, country: string }[];
}
const CountrySelect = ({ label, value, onChange, countries } : CountrySelectProps) => {
    return (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Select value={value} onChange={onChange}>
                <option value="">Sélectionner un pays</option>
                {countries.map((country, index) => (
                    <option key={country.id} value={country.country}>{country.country}</option>
                ))}
            </Form.Select>
        </Form.Group>
    );
};

export default CountrySelect;
