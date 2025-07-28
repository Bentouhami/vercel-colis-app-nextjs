"use client"

import type React from "react"
import type { ChangeEvent } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, Trash2, Copy, ChevronLeft, ChevronRight, Scale, Ruler, Calculator } from "lucide-react"
import { COLIS_MAX_PER_ENVOI } from "@/utils/constants"
import type { CreateParcelDto } from "@/services/dtos"

interface StepParcelsProps {
    packageCount: number
    parcels: CreateParcelDto[]
    currentPackage: number
    onPackageCountChange: (e: ChangeEvent<HTMLInputElement>) => void
    onPackageChange: (index: number, field: string, value: number) => void
    setCurrentPackage: (index: number) => void
    onAddParcel: () => void
    onRemoveParcel: (index: number) => void
    onDuplicateParcel: (index: number) => void
    isEditMode?: boolean
}

const StepParcels: React.FC<StepParcelsProps> = ({
    packageCount,
    parcels,
    currentPackage,
    onPackageCountChange,
    onPackageChange,
    setCurrentPackage,
    onAddParcel,
    onRemoveParcel,
    onDuplicateParcel,
    isEditMode = false,
}) => {
    // Calculs pour les statistiques
    const totalWeight = parcels.reduce((sum, parcel) => sum + (parcel.weight || 0), 0)
    const totalVolume = parcels.reduce((sum, parcel) => {
        const volume = (parcel.height || 0) * (parcel.width || 0) * (parcel.length || 0)
        return sum + volume
    }, 0)

    const currentParcel = parcels[currentPackage] || { height: 0, width: 0, length: 0, weight: 0 }

    // Validation du colis actuel
    const isCurrentParcelValid = () => {
        return (
            currentParcel.height > 0 &&
            currentParcel.width > 0 &&
            currentParcel.length > 0 &&
            currentParcel.weight > 0 &&
            currentParcel.weight <= 70 &&
            Math.max(currentParcel.height, currentParcel.width, currentParcel.length) <= 120 &&
            currentParcel.height + currentParcel.width + currentParcel.length <= 360
        )
    }

    const handleInputChange = (field: string, value: string) => {
        const numValue = Number.parseFloat(value) || 0
        onPackageChange(currentPackage, field, numValue)
    }

    return (
        <div className="space-y-6">
            {/* En-tête avec statistiques */}
            <Card className="transition-all duration-300 hover:shadow-lg border-2 border-blue-100">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-600" />
                            Informations des Colis
                            {isEditMode && <Badge variant="secondary">Mode Édition</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Scale className="h-4 w-4 text-green-600" />
                                <span className="font-medium">{totalWeight.toFixed(1)} kg</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calculator className="h-4 w-4 text-purple-600" />
                                <span className="font-medium">{(totalVolume / 1000000).toFixed(3)} m³</span>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {/* Contrôles de navigation des colis */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="packageCount" className="text-sm font-medium">
                                    Nombre de colis:
                                </Label>
                                <Input
                                    id="packageCount"
                                    type="number"
                                    min="1"
                                    max={COLIS_MAX_PER_ENVOI}
                                    value={packageCount}
                                    onChange={onPackageCountChange}
                                    className="w-20 text-center"
                                />
                                <span className="text-xs text-gray-500">max {COLIS_MAX_PER_ENVOI}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onAddParcel}
                                disabled={parcels.length >= COLIS_MAX_PER_ENVOI}
                                className="transition-all duration-200 hover:scale-105"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Ajouter
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDuplicateParcel(currentPackage)}
                                disabled={parcels.length >= COLIS_MAX_PER_ENVOI}
                                className="transition-all duration-200 hover:scale-105"
                            >
                                <Copy className="h-4 w-4 mr-1" />
                                Dupliquer
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onRemoveParcel(currentPackage)}
                                disabled={parcels.length <= 1}
                                className="transition-all duration-200 hover:scale-105"
                            >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Supprimer
                            </Button>
                        </div>
                    </div>

                    {/* Navigation entre les colis */}
                    {parcels.length > 1 && (
                        <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPackage(Math.max(0, currentPackage - 1))}
                                disabled={currentPackage === 0}
                                className="transition-all duration-200 hover:scale-105"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center gap-2">
                                {parcels.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPackage(index)}
                                        className={`w-8 h-8 rounded-full text-xs font-medium transition-all duration-200 ${index === currentPackage
                                            ? "bg-blue-600 text-white scale-110"
                                            : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:scale-105"
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPackage(Math.min(parcels.length - 1, currentPackage + 1))}
                                disabled={currentPackage === parcels.length - 1}
                                className="transition-all duration-200 hover:scale-105"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {/* Formulaire du colis actuel */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Package className="h-5 w-5 text-blue-600" />
                                Colis {currentPackage + 1}
                                {isCurrentParcelValid() ? (
                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                        Valide
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive">Incomplet</Badge>
                                )}
                            </h3>
                            <div className="text-sm text-gray-600">
                                Volume:{" "}
                                {(
                                    ((currentParcel.height || 0) * (currentParcel.width || 0) * (currentParcel.length || 0)) /
                                    1000000
                                ).toFixed(3)}{" "}
                                m³
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Dimensions */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Ruler className="h-4 w-4 text-blue-600" />
                                    <Label className="text-sm font-medium">Dimensions (cm)</Label>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <Label htmlFor={`height-${currentPackage}`} className="text-sm">
                                            Hauteur (cm)
                                        </Label>
                                        <Input
                                            id={`height-${currentPackage}`}
                                            type="number"
                                            min="0"
                                            max="120"
                                            step="0.1"
                                            value={currentParcel.height || ""}
                                            onChange={(e) => handleInputChange("height", e.target.value)}
                                            className={`transition-all duration-200 ${currentParcel.height > 0 && currentParcel.height <= 120
                                                ? "border-green-300 focus:border-green-500"
                                                : "border-red-300 focus:border-red-500"
                                                }`}
                                            placeholder="Ex: 30"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`width-${currentPackage}`} className="text-sm">
                                            Largeur (cm)
                                        </Label>
                                        <Input
                                            id={`width-${currentPackage}`}
                                            type="number"
                                            min="0"
                                            max="120"
                                            step="0.1"
                                            value={currentParcel.width || ""}
                                            onChange={(e) => handleInputChange("width", e.target.value)}
                                            className={`transition-all duration-200 ${currentParcel.width > 0 && currentParcel.width <= 120
                                                ? "border-green-300 focus:border-green-500"
                                                : "border-red-300 focus:border-red-500"
                                                }`}
                                            placeholder="Ex: 20"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`length-${currentPackage}`} className="text-sm">
                                            Longueur (cm)
                                        </Label>
                                        <Input
                                            id={`length-${currentPackage}`}
                                            type="number"
                                            min="0"
                                            max="120"
                                            step="0.1"
                                            value={currentParcel.length || ""}
                                            onChange={(e) => handleInputChange("length", e.target.value)}
                                            className={`transition-all duration-200 ${currentParcel.length > 0 && currentParcel.length <= 120
                                                ? "border-green-300 focus:border-green-500"
                                                : "border-red-300 focus:border-red-500"
                                                }`}
                                            placeholder="Ex: 15"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Poids et contraintes */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Scale className="h-4 w-4 text-green-600" />
                                    <Label className="text-sm font-medium">Poids et Contraintes</Label>
                                </div>

                                <div>
                                    <Label htmlFor={`weight-${currentPackage}`} className="text-sm">
                                        Poids (kg)
                                    </Label>
                                    <Input
                                        id={`weight-${currentPackage}`}
                                        type="number"
                                        min="0"
                                        max="70"
                                        step="0.1"
                                        value={currentParcel.weight || ""}
                                        onChange={(e) => handleInputChange("weight", e.target.value)}
                                        className={`transition-all duration-200 ${currentParcel.weight > 0 && currentParcel.weight <= 70
                                            ? "border-green-300 focus:border-green-500"
                                            : "border-red-300 focus:border-red-500"
                                            }`}
                                        placeholder="Ex: 5.5"
                                    />
                                </div>

                                {/* Indicateurs de contraintes */}
                                <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                                    <div className="text-xs font-medium text-gray-700 mb-2">Contraintes:</div>

                                    <div
                                        className={`flex items-center gap-2 text-xs ${(currentParcel.height + currentParcel.width + currentParcel.length) <= 360
                                            ? "text-green-600"
                                            : "text-red-600"
                                            }`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${(currentParcel.height + currentParcel.width + currentParcel.length) <= 360
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                                }`}
                                        />
                                        Somme dimensions: {(currentParcel.height + currentParcel.width + currentParcel.length).toFixed(1)}
                                        /360 cm
                                    </div>

                                    <div
                                        className={`flex items-center gap-2 text-xs ${Math.max(currentParcel.height, currentParcel.width, currentParcel.length) <= 120
                                            ? "text-green-600"
                                            : "text-red-600"
                                            }`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${Math.max(currentParcel.height, currentParcel.width, currentParcel.length) <= 120
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                                }`}
                                        />
                                        Plus grande dimension:{" "}
                                        {Math.max(currentParcel.height, currentParcel.width, currentParcel.length).toFixed(1)}/120 cm
                                    </div>

                                    <div
                                        className={`flex items-center gap-2 text-xs ${currentParcel.weight <= 70 ? "text-green-600" : "text-red-600"
                                            }`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${currentParcel.weight <= 70 ? "bg-green-500" : "bg-red-500"}`}
                                        />
                                        Poids: {(currentParcel.weight || 0).toFixed(1)}/70 kg
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Aperçu de tous les colis */}
            {parcels.length > 1 && (
                <Card className="transition-all duration-300 hover:shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg">Aperçu de tous les colis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {parcels.map((parcel, index) => {
                                const isValid = parcel.height > 0 && parcel.width > 0 && parcel.length > 0 && parcel.weight > 0
                                const volume = (parcel.height * parcel.width * parcel.length) / 1000000

                                return (
                                    <div
                                        key={index}
                                        onClick={() => setCurrentPackage(index)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${index === currentPackage
                                            ? "border-blue-500 bg-blue-50"
                                            : isValid
                                                ? "border-green-300 bg-green-50 hover:border-green-400"
                                                : "border-red-300 bg-red-50 hover:border-red-400"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-sm">Colis {index + 1}</span>
                                            {isValid ? (
                                                <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                                    ✓
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive" className="text-xs">
                                                    !
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="space-y-1 text-xs text-gray-600">
                                            <div>
                                                📏 {parcel.height} × {parcel.width} × {parcel.length} cm
                                            </div>
                                            <div>⚖️ {parcel.weight} kg</div>
                                            <div>📦 {volume.toFixed(3)} m³</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default StepParcels
