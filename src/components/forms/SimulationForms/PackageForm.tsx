import { Form, FormGroup } from 'react-bootstrap';
import { CreateParcelDto } from '@/app/utils/dtos';
import React from "react";

interface PackageFormProps {
    index: number;
    pkg: CreateParcelDto;
    onChange: (index: number, key: string, value: number) => void;
}

const PackageForm = ({ index, pkg, onChange }: PackageFormProps) => {
    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        onChange(index, field, value);
    };

    return (
        <div className="mt-3">
            <FormGroup className="mb-3" controlId={`packageHeight${index}`}>
                <Form.Label>Hauteur (cm)</Form.Label>
                <Form.Control
                    type="number"
                    value={pkg.height}
                    onChange={handleInputChange('height')}
                />
            </FormGroup>
            <FormGroup className="mb-3" controlId={`packageWidth${index}`}>
                <Form.Label>Largeur (cm)</Form.Label>
                <Form.Control
                    type="number"
                    value={pkg.width}
                    onChange={handleInputChange('width')}
                />
            </FormGroup>
            <FormGroup className="mb-3" controlId={`packageLength${index}`}>
                <Form.Label>Longueur (cm)</Form.Label>
                <Form.Control
                    type="number"
                    value={pkg.length}
                    onChange={handleInputChange('length')}
                />
            </FormGroup>
            <FormGroup className="mb-3" controlId={`packageWeight${index}`}>
                <Form.Label>Poids (kg)</Form.Label>
                <Form.Control
                    type="number"
                    value={pkg.weight}
                    onChange={handleInputChange('weight')}
                />
            </FormGroup>
        </div>
    );
};

export default PackageForm;
