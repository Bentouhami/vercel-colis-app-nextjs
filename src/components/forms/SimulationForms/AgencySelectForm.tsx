import { Form } from 'react-bootstrap';
import { ChangeEvent, useMemo } from 'react';

interface AgencySelectProps {
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    agencies: { id: string; name: string }[];
    disabled?: boolean; // Optional prop to disable the select input
}

const AgencySelect = ({ label, value, onChange, agencies, disabled = false }: AgencySelectProps) => {
    // Dynamically setting placeholder text
    const placeholder = useMemo(() => disabled ? "Sélection non disponible" : "Sélectionner une agence", [disabled]);

    return (
        <Form.Group className="mb-4">
            <Form.Label className="text-gray-700 font-semibold">{label}</Form.Label>
            <Form.Select
                value={value}
                onChange={onChange}
                disabled={disabled}
                aria-label={label} // for accessibility
                className="border-2 border-gray-300 rounded-lg focus:border-blue-600 transition duration-200 ease-in-out"
            >
                <option value="">{placeholder}</option>
                {agencies.length > 0 ? (
                    agencies.map((agency) => (
                        <option key={agency.id} value={agency.name}>
                            {agency.name}
                        </option>
                    ))
                ) : (
                    <option disabled>Aucune agence disponible</option>
                )}
            </Form.Select>
        </Form.Group>
    );
};

export default AgencySelect;
