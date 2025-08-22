// path: src/components/forms/SimulationForms/ParcelFormStep.tsx

'use client';

import { cn } from "@/lib/utils";
import React, { ChangeEvent, useState } from 'react';
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import PackageForm from './PackageForm';
import { COLIS_MAX_PER_ENVOI } from "@/utils/constants";

interface ParcelFormStepProps {
    parcels: { height: number; width: number; length: number; weight: number }[];
    setParcels: React.Dispatch<React.SetStateAction<{ height: number; width: number; length: number; weight: number }[]>>;
    packageCount: number;
    setPackageCount: React.Dispatch<React.SetStateAction<number>>;
}

const ParcelFormStep: React.FC<ParcelFormStepProps> = ({
    parcels,
    setParcels,
    packageCount,
    setPackageCount,
}) => {
    const [currentPackage, setCurrentPackage] = useState(0);

    const handlePackageCountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newCount = parseInt(e.target.value, 10);
        if (newCount > COLIS_MAX_PER_ENVOI) return; // guard
        setPackageCount(newCount);
        const newParcels = Array.from({ length: newCount }, (_, i) => parcels[i] || {
            height: 0,
            width: 0,
            length: 0,
            weight: 0,
        });
        setParcels(newParcels);
        // ensure current package index is valid
        if (currentPackage >= newCount) {
            setCurrentPackage(newCount - 1);
        }
    };

    const handlePackageChange = (index: number, field: string, value: number) => {
        const updated = parcels.map((pkg, i) =>
            i === index ? { ...pkg, [field]: value } : pkg
        );
        setParcels(updated);
    };

    const handlePageChange = (pageIndex: number) => {
        setCurrentPackage(pageIndex);
    };

    return (
        <CardContent>
            <div className="space-y-4">
                {/* Number of parcels */}
                <div className="mb-6 max-w-xs">
                                <Label htmlFor="packageCount">
                                    Nombre de colis
                                </Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handlePackageCountChange({ target: { value: String(packageCount - 1) } } as ChangeEvent<HTMLInputElement>)}
                                        disabled={packageCount <= 1}
                                    >
                                        -
                                    </Button>
                                    <Input
                                        id="packageCount"
                                        type="number"
                                        max={COLIS_MAX_PER_ENVOI}
                                        min={1}
                                        value={packageCount}
                                        onChange={handlePackageCountChange}
                                        className="w-20 text-center"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handlePackageCountChange({ target: { value: String(packageCount + 1) } } as ChangeEvent<HTMLInputElement>)}
                                        disabled={packageCount >= COLIS_MAX_PER_ENVOI}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                {/* Show only the currently focused package in the form */}
                {parcels.map((pkg, index) =>
                    index === currentPackage && (
                        <PackageForm
                            key={index}
                            index={index}
                            parcel={pkg}
                            onParcelChange={handlePackageChange}
                        />
                    )
                )}

                {/* If multiple parcels, show pagination to move between them */}
                {parcels.length > 1 && (
                    <div className="flex justify-center mt-6">
                        <PaginationContent className="flex flex-wrap justify-center gap-2">
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => {
                                        if (currentPackage > 0) {
                                            setCurrentPackage((p) => p - 1);
                                        }
                                    }}
                                    className={cn("px-3 py-2", { "cursor-not-allowed text-muted-foreground": currentPackage === 0 })}
                                />
                            </PaginationItem>
                            {parcels.map((_, idx) => (
                                <PaginationItem key={idx}>
                                    <PaginationLink
                                        onClick={() => handlePageChange(idx)}
                                        isActive={idx === currentPackage}
                                        className="px-3 py-2"
                                    >
                                        {idx + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => {
                                        if (currentPackage < parcels.length - 1) {
                                            setCurrentPackage((p) => p + 1);
                                        }
                                    }}
                                    className={cn("px-3 py-2", { "cursor-not-allowed text-muted-foreground": currentPackage === parcels.length - 1 })}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </div>
                )}
            </div>
        </CardContent>
    );
};

export default ParcelFormStep;
