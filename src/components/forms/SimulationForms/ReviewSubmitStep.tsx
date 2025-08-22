// path: src/components/forms/SimulationForms/ReviewSubmitStep.tsx

'use client';

import React from 'react';
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface ReviewSubmitStepProps {
    departure: { country: string; city: string; agencyName: string };
    destination: { country: string; city: string; agencyName: string };
    parcels: { height: number; width: number; length: number; weight: number }[];
}

const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({
    departure,
    destination,
    parcels,
}) => {
    return (
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Informations de Départ</h3>
                <p><span className="font-medium">Pays:</span> {departure.country}</p>
                <p><span className="font-medium">Ville:</span> {departure.city}</p>
                <p><span className="font-medium">Agence:</span> {departure.agencyName}</p>
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Informations de Destination</h3>
                <p><span className="font-medium">Pays:</span> {destination.country}</p>
                <p><span className="font-medium">Ville:</span> {destination.city}</p>
                <p><span className="font-medium">Agence:</span> {destination.agencyName}</p>
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Informations des Colis ({parcels.length})</h3>
                {parcels.map((pkg, index) => (
                    <div key={index} className="border rounded-md p-4 mb-2">
                        <h4 className="font-medium">Colis {index + 1}</h4>
                        <p>Hauteur: {pkg.height} cm</p>
                        <p>Largeur: {pkg.width} cm</p>
                        <p>Longueur: {pkg.length} cm</p>
                        <p>Poids: {pkg.weight} kg</p>
                    </div>
                ))}
            </div>
        </CardContent>
    );
};

export default ReviewSubmitStep;
