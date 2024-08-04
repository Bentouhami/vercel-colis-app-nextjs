
import { Form } from 'react-bootstrap';
import {ChangeEvent} from "react";

interface CitySelectProps {
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    cities: {id: string, city: string}[];
    disabled?: boolean; // si cette prop est optionnelle

}
const CitySelect = ({ label, value, onChange, cities, disabled } : CitySelectProps) => {
    return (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Select value={value} onChange={onChange} disabled={disabled}>
                <option value="">Sélectionner une ville</option>
                {cities.map((city, index) => (
                    <option key={city.id} value={city.city}>{city.city}</option>
                ))}
            </Form.Select>
        </Form.Group>
    );
};

export default CitySelect;
