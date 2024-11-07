import { Form } from 'react-bootstrap';
import { ChangeEvent, useMemo } from "react";

interface CitySelectProps {
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    cities: { id: string, city: string }[];
    disabled?: boolean;
}

const CitySelect = ({ label, value, onChange, cities, disabled = false }: CitySelectProps) => {
    const placeholder = useMemo(() => disabled ? "Sélection non disponible" : "Sélectionner une ville", [disabled]);

    return (
        <Form.Group className="mb-4">
            <Form.Label className="text-gray-700 font-semibold">{label}</Form.Label>
            <Form.Select
                value={value}
                onChange={onChange}
                disabled={disabled}
                aria-label={label}
                className="border-2 border-gray-300 rounded-lg focus:border-blue-600 transition duration-200 ease-in-out"
            >
                <option value="">{placeholder}</option>
                {cities.length > 0 ? (
                    cities.map((city) => (
                        <option key={city.id} value={city.city}>{city.city}</option>
                    ))
                ) : (
                    <option disabled>Aucune ville disponible</option>
                )}
            </Form.Select>
        </Form.Group>
    );
};

export default CitySelect;
