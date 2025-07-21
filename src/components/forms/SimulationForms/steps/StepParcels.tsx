// src/components/forms/SimulationForms/steps/StepParcels.tsx

import React, { ChangeEvent } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react';
import PackageForm from '../PackageForm';
import { COLIS_MAX_PER_ENVOI } from '@/utils/constants';

export interface Parcel {
    height: number;
    width: number;
    length: number;
    weight: number;
}

interface Props {
    packageCount: number;
    parcels: Parcel[];
    currentPackage: number;
    /** relaie l’événement natif pour garder la compatibilité avec le wizard */
    onPackageCountChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onPackageChange: (index: number, field: string, value: number) => void;
    setCurrentPackage: (index: number) => void;
}

const StepParcels: React.FC<Props> = ({
    packageCount,
    parcels,
    currentPackage,
    onPackageCountChange,
    onPackageChange,
    setCurrentPackage,
}) => {
    /* helpers + / − */
    const updateCount = (newCount: number) => {
        if (newCount < 1 || newCount > COLIS_MAX_PER_ENVOI) return;

        // crée un faux event pour réutiliser le handler existant
        const evt = { target: { value: String(newCount) } } as unknown as ChangeEvent<HTMLInputElement>;
        onPackageCountChange(evt);
    };

    const increment = () => updateCount(packageCount + 1);
    const decrement = () => updateCount(packageCount - 1);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informations des Colis</CardTitle>
            </CardHeader>

            <CardContent>
                {/* sélecteur nombre de colis */}
                <div className="mb-6">
                    <label
                        htmlFor="packageCount"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Nombre de colis
                    </label>

                    <div className="flex items-center gap-0 rounded-md border overflow-hidden w-max">
                        <Button
                            type="button"
                            variant="ghost"
                            className="rounded-none"
                            onClick={decrement}
                            disabled={packageCount === 1}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>

                        {/* input masqué : sert juste à conserver le onChange original */}
                        <input
                            id="packageCount"
                            type="number"
                            value={packageCount}
                            onChange={onPackageCountChange}
                            className="w-14 text-center font-medium focus:outline-none border-x"
                            readOnly
                        />

                        <Button
                            type="button"
                            variant="ghost"
                            className="rounded-none"
                            onClick={increment}
                            disabled={packageCount === COLIS_MAX_PER_ENVOI}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* formulaire du colis courant */}
                {parcels.map(
                    (pkg, idx) =>
                        idx === currentPackage && (
                            <PackageForm key={idx} index={idx} pkg={pkg} onChange={onPackageChange} />
                        ),
                )}

                {/* pagination entre colis */}
                {parcels.length > 1 && (
                    <div className="flex items-center justify-between mt-6 max-w-xs mx-auto">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentPackage(Math.max(currentPackage - 1, 0))}
                            disabled={currentPackage === 0}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>

                        <span className="text-sm">
                            Colis {currentPackage + 1} / {parcels.length}
                        </span>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                setCurrentPackage(Math.min(currentPackage + 1, parcels.length - 1))
                            }
                            disabled={currentPackage === parcels.length - 1}
                        >
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default StepParcels;
