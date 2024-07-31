// import { Form } from 'react-bootstrap';
//
// const AgencySelect = ({ label, value, onChange, agencies, disabled }) => {
//     return (
//         <Form.Group  className="mb-3">
//             <Form.Label>{label}</Form.Label>
//             <Form.Select value={value} onChange={onChange} disabled={disabled}>
//                 <option value="">Sélectionner une agence</option>
//                 {agencies.map((agency, index) => (
//                     <option key={index} value={agency}>{agency}</option>
//                 ))}
//             </Form.Select>
//         </Form.Group>
//     );
// };
//
// export default AgencySelect;
import { Form } from 'react-bootstrap';

const AgencySelect = ({ label, value, onChange, agencies, disabled }) => {
    return (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Select value={value} onChange={onChange} disabled={disabled}>
                <option value="">Sélectionner une agence</option>
                {agencies.map((agency, index) => (
                    <option key={index} value={agency}>{agency}</option>
                ))}
            </Form.Select>
        </Form.Group>
    );
};

export default AgencySelect;
