// Path: src/components/forms/SimulationForms/PackageForm.tsx


import { Form, FormGroup } from 'react-bootstrap';
import React from "react";
import { CreateParcelDto } from '@/utils/dtos';

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
        <div className="p-4 bg-gray-50 rounded-md shadow-sm mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Colis {index + 1}</h3>
            <FormGroup className="mb-3">
                <Form.Label className="text-sm font-medium">Hauteur (cm)</Form.Label>
                <Form.Control
                    type="number"
                    value={pkg.height}
                    onChange={handleInputChange('height')}
                    className="border-2 border-gray-300 rounded-lg p-2"
                    min="0"
                />
            </FormGroup>
            <FormGroup className="mb-3">
                <Form.Label className="text-sm font-medium">Largeur (cm)</Form.Label>
                <Form.Control
                    type="number"
                    value={pkg.width}
                    onChange={handleInputChange('width')}
                    className="border-2 border-gray-300 rounded-lg p-2"
                    min="0"
                />
            </FormGroup>
            <FormGroup className="mb-3">
                <Form.Label className="text-sm font-medium">Longueur (cm)</Form.Label>
                <Form.Control
                    type="number"
                    value={pkg.length}
                    onChange={handleInputChange('length')}
                    className="border-2 border-gray-300 rounded-lg p-2"
                    min="0"
                />
            </FormGroup>
            <FormGroup className="mb-3">
                <Form.Label className="text-sm font-medium">Poids (kg)</Form.Label>
                <Form.Control
                    type="number"
                    value={pkg.weight}
                    onChange={handleInputChange('weight')}
                    className="border-2 border-gray-300 rounded-lg p-2"
                    min="0"
                    step="0.1" // pour autoriser les décimales
                />
            </FormGroup>
        </div>
    );
};

export default PackageForm;
