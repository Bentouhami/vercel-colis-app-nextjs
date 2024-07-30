import {Form} from 'react-bootstrap';

const PackageForm = ({index, pkg, onChange, key}) => {
    return (
        <div className="mt-3">
            <Form.Group className="mb-3" controlId={`packageHeight${index}`}>
                <Form.Label>Hauteur (cm)</Form.Label>
                <Form.Control
                    type="number"
                    value={pkg.height}
                    onChange={(e) => onChange(index, 'height', e.target.value)}
                />
            </Form.Group>
            <Form.Group  className="mb-3" controlId={`packageWidth${index}`}>
                <Form.Label>Largeur (cm)</Form.Label>
                <Form.Control
                    type="number"
                    value={pkg.width}
                    onChange={(e) => onChange(index, 'width', e.target.value)}
                />
            </Form.Group>
            <Form.Group  className="mb-3" controlId={`packageLength${index}`}>
                <Form.Label>Longueur (cm)</Form.Label>
                <Form.Control
                    type="number"
                    value={pkg.length}
                    onChange={(e) => onChange(index, 'length', e.target.value)}
                />
            </Form.Group>
            <Form.Group  className="mb-3" controlId={`packageWeight${index}`}>
                <Form.Label>Poids (kg)</Form.Label>
                <Form.Control
                    type="number"
                    value={pkg.weight}
                    onChange={(e) => onChange(index, 'weight', e.target.value)}
                />
            </Form.Group>
        </div>
    );
};

export default PackageForm;
