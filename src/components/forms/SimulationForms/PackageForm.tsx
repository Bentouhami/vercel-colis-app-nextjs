"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Package, Scale, Ruler } from "lucide-react"
import type { CreateParcelDto } from "@/services/dtos"

interface PackageFormProps {
    parcel: CreateParcelDto
    index: number
    onParcelChange: (index: number, field: string, value: number) => void
    isActive?: boolean
}

const PackageForm: React.FC<PackageFormProps> = ({ parcel, index, onParcelChange, isActive = false }) => {
    const handleInputChange = (field: string, value: string) => {
        const numValue = Number.parseFloat(value) || 0
        onParcelChange(index, field, numValue)
    }

    // Validation du colis
    const isValid = () => {
        return (
            parcel.height > 0 &&
            parcel.width > 0 &&
            parcel.length > 0 &&
            parcel.weight > 0 &&
            parcel.weight <= 70 &&
            Math.max(parcel.height, parcel.width, parcel.length) <= 120 &&
            parcel.height + parcel.width + parcel.length <= 360
        )
    }

    const volume = (parcel.height * parcel.width * parcel.length) / 1000000

    return (
        <Card
            className={`transition-all duration-300 ${isActive ? "border-2 border-blue-500 shadow-lg scale-105" : "border hover:shadow-md"
                }`}
        >
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        Colis {index + 1}
                    </div>
                    {isValid() ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                            Valide
                        </Badge>
                    ) : (
                        <Badge variant="destructive">Incomplet</Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    {/* Dimensions */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Ruler className="h-4 w-4 text-blue-600" />
                            <Label className="text-sm font-medium">Dimensions (cm)</Label>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <Label htmlFor={`height-${index}`} className="text-xs">
                                    Hauteur
                                </Label>
                                <Input
                                    id={`height-${index}`}
                                    type="number"
                                    min="0"
                                    max="120"
                                    step="0.1"
                                    value={parcel.height || ""}
                                    onChange={(e) => handleInputChange("height", e.target.value)}
                                    className="h-8 text-sm"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <Label htmlFor={`width-${index}`} className="text-xs">
                                    Largeur
                                </Label>
                                <Input
                                    id={`width-${index}`}
                                    type="number"
                                    min="0"
                                    max="120"
                                    step="0.1"
                                    value={parcel.width || ""}
                                    onChange={(e) => handleInputChange("width", e.target.value)}
                                    className="h-8 text-sm"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <Label htmlFor={`length-${index}`} className="text-xs">
                                    Longueur
                                </Label>
                                <Input
                                    id={`length-${index}`}
                                    type="number"
                                    min="0"
                                    max="120"
                                    step="0.1"
                                    value={parcel.length || ""}
                                    onChange={(e) => handleInputChange("length", e.target.value)}
                                    className="h-8 text-sm"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Poids et infos */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Scale className="h-4 w-4 text-green-600" />
                            <Label className="text-sm font-medium">Poids</Label>
                        </div>

                        <div>
                            <Label htmlFor={`weight-${index}`} className="text-xs">
                                Poids (kg)
                            </Label>
                            <Input
                                id={`weight-${index}`}
                                type="number"
                                min="0"
                                max="70"
                                step="0.1"
                                value={parcel.weight || ""}
                                onChange={(e) => handleInputChange("weight", e.target.value)}
                                className="h-8 text-sm"
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-1 text-xs text-gray-600">
                            <div>Volume: {volume.toFixed(3)} m³</div>
                            <div>Somme: {(parcel.height + parcel.width + parcel.length).toFixed(1)}/360 cm</div>
                            <div>Max: {Math.max(parcel.height, parcel.width, parcel.length).toFixed(1)}/120 cm</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default PackageForm
