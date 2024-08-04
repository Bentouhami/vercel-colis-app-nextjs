import { Form } from 'react-bootstrap';
import { ChangeEvent } from 'react';

interface AgencySelectProps {
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    agencies: {id:string , name:string}[];
    disabled?: boolean; // si cette prop est optionnelle
}

const AgencySelect = ({ label, value, onChange, agencies, disabled }: AgencySelectProps) => {
    return (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Select value={value} onChange={onChange} disabled={disabled}>
                <option value="">Sélectionner une agence</option>
                {agencies.map((agency, index) => (
                    <option key={agency.id} value={agency.name}>{agency.name}</option>
                ))}
            </Form.Select>
        </Form.Group>
    );
};

export default AgencySelect;
