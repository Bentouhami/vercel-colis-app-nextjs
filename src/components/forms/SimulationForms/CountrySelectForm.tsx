import { Form } from 'react-bootstrap';

const CountrySelect = ({ label, value, onChange, countries }) => {
    return (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Select value={value} onChange={onChange}>
                <option value="">Sélectionner un pays</option>
                {countries.map((country, index) => (
                    <option key={index} value={country}>{country}</option>
                ))}
            </Form.Select>
        </Form.Group>
    );
};

export default CountrySelect;
