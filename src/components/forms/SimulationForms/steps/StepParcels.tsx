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
        <div className="space-y-4 md:space-y-6">
            {/* En-tête avec statistiques */}
            <Card className="transition-all duration-300 hover:shadow-lg border-2 border-blue-100 dark:border-blue-900/50">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 md:p-6">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-foreground">
                            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <span className="text-base md:text-lg">Informations des Colis</span>
                            {isEditMode && (
                                <Badge variant="secondary" className="text-xs">
                                    Mode Édition
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-3 md:gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Scale className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <span className="font-medium text-foreground">{totalWeight.toFixed(1)} kg</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calculator className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                <span className="font-medium text-foreground">{(totalVolume / 1000000).toFixed(3)} m³</span>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                    {/* Contrôles de navigation des colis */}
                    <div className="flex flex-col gap-4 mb-6">
                        {/* Nombre de colis */}
                        <div className="flex items-center justify-center sm:justify-start gap-4">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="packageCount" className="text-sm font-medium whitespace-nowrap text-foreground">
                                    Nombre de colis:
                                </Label>
                                <Input
                                    id="packageCount"
                                    type="number"
                                    min="1"
                                    max={COLIS_MAX_PER_ENVOI}
                                    value={packageCount}
                                    onChange={onPackageCountChange}
                                    className="w-16 md:w-20 text-center"
                                />
                                <span className="text-xs text-muted-foreground whitespace-nowrap">max {COLIS_MAX_PER_ENVOI}</span>
                            </div>
                        </div>

                        {/* Boutons actions - Empilés proprement sur mobile */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onAddParcel}
                                disabled={parcels.length >= COLIS_MAX_PER_ENVOI}
                                className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Ajouter un colis
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDuplicateParcel(currentPackage)}
                                disabled={parcels.length >= COLIS_MAX_PER_ENVOI}
                                className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                Dupliquer ce colis
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onRemoveParcel(currentPackage)}
                                disabled={parcels.length <= 1}
                                className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer ce colis
                            </Button>
                        </div>
                    </div>

                    {/* Navigation entre les colis - Pagination adaptative */}
                    {parcels.length > 1 && (
                        <div className="mb-6 p-3 md:p-4 bg-muted rounded-lg">
                            <div className="flex items-center justify-center gap-2 md:gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPackage(Math.max(0, currentPackage - 1))}
                                    disabled={currentPackage === 0}
                                    className="transition-all duration-200 hover:scale-105 flex-shrink-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                {/* Pagination adaptative - ne déborde pas */}
                                <div className="flex items-center justify-center gap-1 md:gap-2 flex-wrap max-w-[200px] sm:max-w-none">
                                    {parcels.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentPackage(index)}
                                            className={`w-7 h-7 md:w-8 md:h-8 rounded-full text-xs font-medium transition-all duration-200 flex-shrink-0 ${index === currentPackage
                                                ? "bg-blue-600 text-white scale-110"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 hover:scale-105"
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
                                    className="transition-all duration-200 hover:scale-105 flex-shrink-0"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Formulaire du colis actuel */}
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <h3 className="text-base md:text-lg font-semibold flex items-center gap-2 text-foreground">
                                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                Colis {currentPackage + 1}
                                {isCurrentParcelValid() ? (
                                    <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                        Valide
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" className="text-xs">
                                        Incomplet
                                    </Badge>
                                )}
                            </h3>
                            <div className="text-sm text-muted-foreground">
                                Volume:{" "}
                                {(
                                    ((currentParcel.height || 0) * (currentParcel.width || 0) * (currentParcel.length || 0)) /
                                    1000000
                                ).toFixed(3)}{" "}
                                m³
                            </div>
                        </div>

                        {/* Grille d'entrée - 1 colonne mobile, 2 colonnes desktop */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                            {/* Dimensions */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Ruler className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <Label className="text-sm font-medium text-foreground">Dimensions (cm)</Label>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <Label htmlFor={`height-${currentPackage}`} className="text-sm text-muted-foreground">
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
                                                ? "border-green-300 focus:border-green-500 dark:border-green-700"
                                                : "border-red-300 focus:border-red-500 dark:border-red-700"
                                                }`}
                                            placeholder="Ex: 30"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`width-${currentPackage}`} className="text-sm text-muted-foreground">
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
                                                ? "border-green-300 focus:border-green-500 dark:border-green-700"
                                                : "border-red-300 focus:border-red-500 dark:border-red-700"
                                                }`}
                                            placeholder="Ex: 20"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`length-${currentPackage}`} className="text-sm text-muted-foreground">
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
                                                ? "border-green-300 focus:border-green-500 dark:border-green-700"
                                                : "border-red-300 focus:border-red-500 dark:border-red-700"
                                                }`}
                                            placeholder="Ex: 15"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Poids et contraintes */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Scale className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    <Label className="text-sm font-medium text-foreground">Poids et Contraintes</Label>
                                </div>

                                <div>
                                    <Label htmlFor={`weight-${currentPackage}`} className="text-sm text-muted-foreground">
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
                                            ? "border-green-300 focus:border-green-500 dark:border-green-700"
                                            : "border-red-300 focus:border-red-500 dark:border-red-700"
                                            }`}
                                        placeholder="Ex: 5.5"
                                    />
                                </div>

                                {/* Indicateurs de contraintes */}
                                <div className="space-y-2 p-3 bg-muted rounded-lg">
                                    <div className="text-xs font-medium text-foreground mb-2">Contraintes:</div>

                                    <div
                                        className={`flex items-center gap-2 text-xs ${(currentParcel.height + currentParcel.width + currentParcel.length) <= 360
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-red-600 dark:text-red-400"
                                            }`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full flex-shrink-0 ${(currentParcel.height + currentParcel.width + currentParcel.length) <= 360
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                                }`}
                                        />
                                        <span className="break-words">
                                            Somme dimensions: {(currentParcel.height + currentParcel.width + currentParcel.length).toFixed(1)}
                                            /360 cm
                                        </span>
                                    </div>

                                    <div
                                        className={`flex items-center gap-2 text-xs ${Math.max(currentParcel.height, currentParcel.width, currentParcel.length) <= 120
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-red-600 dark:text-red-400"
                                            }`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full flex-shrink-0 ${Math.max(currentParcel.height, currentParcel.width, currentParcel.length) <= 120
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                                }`}
                                        />
                                        <span className="break-words">
                                            Plus grande dimension:{" "}
                                            {Math.max(currentParcel.height, currentParcel.width, currentParcel.length).toFixed(1)}/120 cm
                                        </span>
                                    </div>

                                    <div
                                        className={`flex items-center gap-2 text-xs ${currentParcel.weight <= 70 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full flex-shrink-0 ${currentParcel.weight <= 70 ? "bg-green-500" : "bg-red-500"}`}
                                        />
                                        <span>Poids: {(currentParcel.weight || 0).toFixed(1)}/70 kg</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Résumé colis - 1 → 2 → 3 colonnes selon la taille d'écran */}
            {parcels.length > 1 && (
                <Card className="transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="p-4 md:p-6">
                        <CardTitle className="text-base md:text-lg text-foreground">Aperçu de tous les colis</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                            {parcels.map((parcel, index) => {
                                const isValid = parcel.height > 0 && parcel.width > 0 && parcel.length > 0 && parcel.weight > 0
                                const volume = (parcel.height * parcel.width * parcel.length) / 1000000

                                return (
                                    <div
                                        key={index}
                                        onClick={() => setCurrentPackage(index)}
                                        className={`p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${index === currentPackage
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                                            : isValid
                                                ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/30 hover:border-green-400"
                                                : "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/30 hover:border-red-400"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-sm text-foreground">Colis {index + 1}</span>
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
                                        <div className="space-y-1 text-xs text-muted-foreground">
                                            <div className="break-words">
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
