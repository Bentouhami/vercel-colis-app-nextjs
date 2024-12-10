import React, { useState, ChangeEvent } from 'react';
import { Button, Card } from 'react-bootstrap';
import { PlusCircle, Trash, Edit, Save } from 'lucide-react';
import PackageForm from "@/components/forms/SimulationForms/PackageForm";

const ParcelsManager = ({ parcels, setParcels, maxParcels }: {
    parcels: { height: number; width: number; length: number; weight: number }[];
    setParcels: React.Dispatch<React.SetStateAction<typeof parcels>>;
    maxParcels: number;
}) => {
    const [editingParcelIndex, setEditingParcelIndex] = useState<number | null>(null);

    // Add a new parcel
    const handleAddParcel = () => {
        if (parcels.length < maxParcels) {
            setParcels([...parcels, { height: 0, width: 0, length: 0, weight: 0 }]);
            setEditingParcelIndex(parcels.length); // Set focus on the new parcel
        }
    };

    // Delete a parcel
    const handleDeleteParcel = (index: number) => {
        const updatedParcels = parcels.filter((_, i) => i !== index);
        setParcels(updatedParcels);
        setEditingParcelIndex(null); // Reset editing index if applicable
    };

    // Update a parcel during editing
    const handleParcelChange = (index: number, field: string, value: number) => {
        const updatedParcels = parcels.map((parcel, i) =>
            i === index ? { ...parcel, [field]: value } : parcel
        );
        setParcels(updatedParcels);
    };

    // Save the edited parcel
    const handleSaveParcel = () => {
        setEditingParcelIndex(null); // End editing mode
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">Gestion des Colis</h3>

            {/* List of Parcels */}
            <div className="grid gap-4">
                {parcels.map((parcel, index) => (
                    <Card key={index} className="p-4 shadow-sm border">
                        {editingParcelIndex === index ? (
                            <>
                                <PackageForm
                                    index={index}
                                    pkg={parcel}
                                    onChange={handleParcelChange}
                                />
                                <div className="flex justify-end mt-2">
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={handleSaveParcel}
                                        className="flex items-center gap-2"
                                    >
                                        <Save size={16} /> Sauvegarder
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm">
                                        <strong>Colis {index + 1}:</strong><br />
                                        Hauteur: {parcel.height} cm, Largeur: {parcel.width} cm,
                                        Longueur: {parcel.length} cm, Poids: {parcel.weight} kg
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() => setEditingParcelIndex(index)}
                                            className="flex items-center gap-2"
                                        >
                                            <Edit size={16} /> Modifier
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteParcel(index)}
                                            className="flex items-center gap-2"
                                        >
                                            <Trash size={16} /> Supprimer
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </Card>
                ))}
            </div>

            {/* Add Parcel Button */}
            {parcels.length < maxParcels && (
                <div className="flex justify-center">
                    <Button
                        variant="success"
                        onClick={handleAddParcel}
                        className="flex items-center gap-2"
                    >
                        <PlusCircle size={20} /> Ajouter un colis
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ParcelsManager;
