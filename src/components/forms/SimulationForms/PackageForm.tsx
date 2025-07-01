// path: src/components/forms/SimulationForms/PackageForm.tsx

import React from "react";
import { CreateParcelDto } from "@/services/dtos";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md shadow-sm mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
                Colis {index + 1}
            </h3>

            {/* Hauteur */}
            <div className="mb-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Hauteur (cm)</Label>
                <Input
                    type="number"
                    disabled={disabled}
                    value={pkg.height || ""}
                    onChange={handleInputChange("height")}
                    min="0"
                    max="120"
                    placeholder="Hauteur maximum 120 cm"
                    className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
            </div>

            {/* Largeur */}
            <div className="mb-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Largeur (cm)</Label>
                <Input
                    type="number"
                    disabled={disabled}
                    value={pkg.width || ""}
                    onChange={handleInputChange("width")}
                    min="0"
                    max="120"
                    placeholder="Largeur maximum 120 cm"
                    className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
            </div>

            {/* Longueur */}
            <div className="mb-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Longueur (cm)</Label>
                <Input
                    type="number"
                    disabled={disabled}
                    value={pkg.length || ""}
                    onChange={handleInputChange("length")}
                    min="0"
                    max="120"
                    placeholder="Longueur maximum 120 cm"
                    className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
            </div>

            {/* Poids */}
            <div className="mb-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Poids (kg)</Label>
                <Input
                    type="number"
                    disabled={disabled}
                    value={pkg.weight || ""}
                    onChange={handleInputChange("weight")}
                    min="1"
                    max="70"
                    step="0.1"
                    placeholder="Poids maximum 70 kg"
                    className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
            </div>
        </div>
    );
};

export default PackageForm;
