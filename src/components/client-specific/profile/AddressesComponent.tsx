// src/components/client-specific/profile/AddressesComponent.tsx

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Home, Building, MapPin, Star, Check } from "lucide-react"

// Types
interface Address {
    id: string
    type: "home" | "work" | "other"
    label: string
    firstName: string
    lastName: string
    company?: string
    streetNumber: string
    street: string
    city: string
    postalCode: string
    country: string
    phone?: string
    instructions?: string
    isDefault: boolean
}

// Mock data
const mockAddresses: Address[] = [
    {
        id: "addr-001",
        type: "home",
        label: "Domicile",
        firstName: "Jean",
        lastName: "Dupont",
        streetNumber: "28",
        street: "Rue des Martyrs",
        city: "Frameries",
        postalCode: "7080",
        country: "Belgique",
        phone: "+32 65 12 34 56",
        instructions: "Sonnette au nom de Dupont, 2ème étage",
        isDefault: true,
    },
    {
        id: "addr-002",
        type: "work",
        label: "Bureau",
        firstName: "Jean",
        lastName: "Dupont",
        company: "TechCorp SPRL",
        streetNumber: "15",
        street: "Avenue Louise",
        city: "Bruxelles",
        postalCode: "1000",
        country: "Belgique",
        phone: "+32 2 123 45 67",
        instructions: "Réception au rez-de-chaussée",
        isDefault: false,
    },
    {
        id: "addr-003",
        type: "other",
        label: "Chez mes parents",
        firstName: "Marie",
        lastName: "Martin",
        streetNumber: "42",
        street: "Rue de la Paix",
        city: "Mons",
        postalCode: "7000",
        country: "Belgique",
        phone: "+32 65 98 76 54",
        instructions: "N'oubliez pas la porte bleue",
        isDefault: false,
    },
]

const addressTypeConfig = {
    home: {
        label: "Domicile",
        icon: Home,
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    work: {
        label: "Bureau",
        icon: Building,
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
    other: {
        label: "Autre",
        icon: MapPin,
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    },
}

export default function AddressesComponent() {
    const [addresses, setAddresses] = useState<Address[]>(mockAddresses)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)

    const handleAddAddress = () => {
        setEditingAddress(null)
        setIsDialogOpen(true)
    }

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address)
        setIsDialogOpen(true)
    }

    const handleDeleteAddress = (id: string) => {
        setAddresses(addresses.filter((addr) => addr.id !== id))
    }

    const handleSetDefault = (id: string) => {
        setAddresses(
            addresses.map((addr) => ({
                ...addr,
                isDefault: addr.id === id,
            })),
        )
    }

    const handleSaveAddress = (addressData: Partial<Address>) => {
        if (editingAddress) {
            // Edit existing address
            setAddresses((prev) => prev.map((addr) => (addr.id === editingAddress.id ? { ...addr, ...addressData } : addr)))
        } else {
            // Add new address
            const newAddress: Address = {
                id: `addr-${Date.now()}`,
                type: "home",
                isDefault: addresses.length === 0,
                firstName: "",
                lastName: "",
                streetNumber: "",
                street: "",
                city: "",
                postalCode: "",
                country: "Belgique",
                label: "",
                ...addressData,
            } as Address
            setAddresses((prev) => [...prev, newAddress])
        }
        setIsDialogOpen(false)
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mes Adresses</h1>
                    <p className="text-gray-600 dark:text-gray-400">Gérez vos adresses de livraison et de facturation</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleAddAddress} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Ajouter une adresse
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingAddress ? "Modifier l'adresse" : "Nouvelle adresse"}</DialogTitle>
                        </DialogHeader>
                        <AddressForm address={editingAddress} onSave={handleSaveAddress} onClose={() => setIsDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Addresses List */}
            <div className="grid gap-4">
                {addresses.map((address, index) => {
                    const typeInfo = addressTypeConfig[address.type]
                    const TypeIcon = typeInfo.icon

                    return (
                        <Card
                            key={address.id}
                            className={`relative transition-all duration-300 hover:shadow-lg animate-slide-up ${address.isDefault ? "ring-2 ring-blue-500 bg-blue-50/30 dark:bg-blue-950/20" : ""
                                }`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div
                                            className={`p-3 ${typeInfo.color.includes("blue")
                                                ? "bg-blue-100 dark:bg-blue-900"
                                                : typeInfo.color.includes("green")
                                                    ? "bg-green-100 dark:bg-green-900"
                                                    : "bg-purple-100 dark:bg-purple-900"
                                                } rounded-lg`}
                                        >
                                            <TypeIcon className="h-6 w-6 text-current" />
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{address.label}</h3>
                                                <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                                                {address.isDefault && (
                                                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                                        <Star className="h-3 w-3 mr-1" />
                                                        Par défaut
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="space-y-1 text-gray-600 dark:text-gray-400">
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {address.firstName} {address.lastName}
                                                </p>
                                                {address.company && <p className="text-sm font-medium">{address.company}</p>}
                                                <p>
                                                    {address.streetNumber} {address.street}
                                                </p>
                                                <p>
                                                    {address.postalCode} {address.city}
                                                </p>
                                                <p>{address.country}</p>
                                                {address.phone && <p className="text-sm">📞 {address.phone}</p>}
                                                {address.instructions && (
                                                    <p className="text-sm italic bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                                        💡 {address.instructions}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEditAddress(address)}
                                            className="hover:bg-blue-50 dark:hover:bg-blue-950"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteAddress(address.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                            disabled={addresses.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {!address.isDefault && (
                                    <div className="mt-4 pt-4 border-t">
                                        <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id)} className="gap-2">
                                            <Star className="h-4 w-4" />
                                            Définir par défaut
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {addresses.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Aucune adresse enregistrée</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Ajoutez votre première adresse pour commencer à utiliser nos services
                        </p>
                        <Button onClick={handleAddAddress} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Ajouter une adresse
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

function AddressForm({
    address,
    onSave,
    onClose,
}: {
    address?: Address | null
    onSave: (data: Partial<Address>) => void
    onClose: () => void
}) {
    const [formData, setFormData] = useState<Partial<Address>>({
        type: "home",
        label: "",
        firstName: "",
        lastName: "",
        company: "",
        streetNumber: "",
        street: "",
        city: "",
        postalCode: "",
        country: "Belgique",
        phone: "",
        instructions: "",
        ...address,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    const handleChange = (field: keyof Address, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type and Label */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="type">Type d&apos;adresse</Label>
                    <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="home">🏠 Domicile</SelectItem>
                            <SelectItem value="work">🏢 Bureau</SelectItem>
                            <SelectItem value="other">📍 Autre</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="label">Libellé</Label>
                    <Input
                        id="label"
                        placeholder="Ex: Domicile, Bureau..."
                        value={formData.label}
                        onChange={(e) => handleChange("label", e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                        id="firstName"
                        placeholder="Jean"
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                        id="lastName"
                        placeholder="Dupont"
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* Company (optional) */}
            <div className="space-y-2">
                <Label htmlFor="company">Entreprise (optionnel)</Label>
                <Input
                    id="company"
                    placeholder="Nom de l'entreprise"
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                />
            </div>

            {/* Address */}
            <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="streetNumber">Numéro</Label>
                    <Input
                        id="streetNumber"
                        placeholder="28"
                        value={formData.streetNumber}
                        onChange={(e) => handleChange("streetNumber", e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2 col-span-3">
                    <Label htmlFor="street">Rue</Label>
                    <Input
                        id="street"
                        placeholder="Rue des Martyrs"
                        value={formData.street}
                        onChange={(e) => handleChange("street", e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input
                        id="postalCode"
                        placeholder="7080"
                        value={formData.postalCode}
                        onChange={(e) => handleChange("postalCode", e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                        id="city"
                        placeholder="Frameries"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Belgique">🇧🇪 Belgique</SelectItem>
                        <SelectItem value="France">🇫🇷 France</SelectItem>
                        <SelectItem value="Luxembourg">🇱🇺 Luxembourg</SelectItem>
                        <SelectItem value="Pays-Bas">🇳🇱 Pays-Bas</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Contact */}
            <div className="space-y-2">
                <Label htmlFor="phone">Téléphone (optionnel)</Label>
                <Input
                    id="phone"
                    placeholder="+32 65 12 34 56"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                />
            </div>

            {/* Instructions */}
            <div className="space-y-2">
                <Label htmlFor="instructions">Instructions de livraison (optionnel)</Label>
                <Textarea
                    id="instructions"
                    placeholder="Ex: Sonnette au nom de Dupont, 2ème étage..."
                    value={formData.instructions}
                    onChange={(e) => handleChange("instructions", e.target.value)}
                    rows={3}
                />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 gap-2">
                    <Check className="h-4 w-4" />
                    {address ? "Modifier" : "Ajouter"}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                    Annuler
                </Button>
            </div>
        </form>
    )
}
