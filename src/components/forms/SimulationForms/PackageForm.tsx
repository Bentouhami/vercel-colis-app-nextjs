// Path: src/components/forms/SimulationForms/PackageForm.tsx
// path: src/components/forms/SimulationForms/PackageForm.tsx
import React from "react";
import { CreateParcelDto } from "@/services/dtos";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

interface PackageFormProps {
    index: number;
    pkg: CreateParcelDto;
    onChange: (index: number, key: string, value: number) => void;
    disabled?: boolean;
}

const PackageForm = ({ index, pkg, onChange, disabled = false }: PackageFormProps) => {
    const handleInputChange = (field: string) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value ? parseFloat(e.target.value) : 0;
        if (!isNaN(value)) {
            onChange(index, field, value);
        }
    };

    return (
        <div className="p-4 bg-gray-50 rounded-md shadow-sm mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Colis {index + 1}
            </h3>

            {/* Hauteur */}
            <div className="mb-3">
                <Label className="text-sm font-medium">Hauteur (cm)</Label>
                <Input
                    type="number"
                    disabled={disabled}
                    value={pkg.height || ""}
                    onChange={handleInputChange("height")}
                    min="0"
                    max="120"
                    placeholder="Hauteur maximum 120 cm"
                    className="
            mt-1 w-full
            border-2 border-gray-300
            rounded-lg p-2
            focus:border-blue-600
          "
                />
            </div>

            {/* Largeur */}
            <div className="mb-3">
                <Label className="text-sm font-medium">Largeur (cm)</Label>
                <Input
                    type="number"
                    disabled={disabled}
                    value={pkg.width || ""}
                    onChange={handleInputChange("width")}
                    min="0"
                    max="120"
                    placeholder="Largeur maximum 120 cm"
                    className="
            mt-1 w-full
            border-2 border-gray-300
            rounded-lg p-2
            focus:border-blue-600
          "
                />
            </div>

            {/* Longueur */}
            <div className="mb-3">
                <Label className="text-sm font-medium">Longueur (cm)</Label>
                <Input
                    type="number"
                    disabled={disabled}
                    value={pkg.length || ""}
                    onChange={handleInputChange("length")}
                    min="0"
                    max="120"
                    placeholder="Longueur maximum 120 cm"
                    className="
            mt-1 w-full
            border-2 border-gray-300
            rounded-lg p-2
            focus:border-blue-600
          "
                />
            </div>

            {/* Poids */}
            <div className="mb-3">
                <Label className="text-sm font-medium">Poids (kg)</Label>
                <Input
                    type="number"
                    disabled={disabled}
                    value={pkg.weight || ""}
                    onChange={handleInputChange("weight")}
                    min="1"
                    max="70"
                    step="0.1"
                    placeholder="Poids maximum 70 kg"
                    className="
            mt-1 w-full
            border-2 border-gray-300
            rounded-lg p-2
            focus:border-blue-600
          "
                />
            </div>
        </div>
    );
};

export default PackageForm;
