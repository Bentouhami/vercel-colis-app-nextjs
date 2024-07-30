import { Form } from 'react-bootstrap';

const CitySelect = ({ label, value, onChange, cities, disabled }) => {
    return (
        <Form.Group  className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Select value={value} onChange={onChange} disabled={disabled}>
                <option value="">Sélectionner une ville</option>
                {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                ))}
            </Form.Select>
        </Form.Group>
    );
};

export default CitySelect;
