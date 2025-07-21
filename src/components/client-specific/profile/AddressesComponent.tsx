"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Home, Building } from "lucide-react"

// Mock data
const mockAddresses = [
    {
        id: 1,
        type: "home",
        label: "Domicile",
        streetNumber: "28",
        street: "Rue des Martyrs",
        city: "Frameries",
        postalCode: "7080",
        country: "Belgique",
        isDefault: true,
    },
    {
        id: 2,
        type: "work",
        label: "Bureau",
        streetNumber: "15",
        street: "Avenue Louise",
        city: "Bruxelles",
        postalCode: "1000",
        country: "Belgique",
        isDefault: false,
    },
]

export default function AddressesComponent() {
    const [addresses, setAddresses] = useState(mockAddresses)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<any>(null)

    const handleAddAddress = () => {
        setEditingAddress(null)
        setIsDialogOpen(true)
    }

    const handleEditAddress = (address: any) => {
        setEditingAddress(address)
        setIsDialogOpen(true)
    }

    const handleDeleteAddress = (id: number) => {
        setAddresses(addresses.filter((addr) => addr.id !== id))
    }

    const handleSetDefault = (id: number) => {
        setAddresses(
            addresses.map((addr) => ({
                ...addr,
                isDefault: addr.id === id,
            })),
        )
    }

    return (
        <div className="space-y-6">
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
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingAddress ? "Modifier l'adresse" : "Nouvelle adresse"}</DialogTitle>
                        </DialogHeader>
                        <AddressForm address={editingAddress} onClose={() => setIsDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Addresses List */}
            <div className="grid gap-4">
                {addresses.map((address) => (
                    <Card key={address.id} className="relative">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                                        {address.type === "home" ? (
                                            <Home className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        ) : (
                                            <Building className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{address.label}</h3>
                                            {address.isDefault && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Par défaut
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-gray-600 dark:text-gray-400 space-y-1">
                                            <p>
                                                {address.streetNumber} {address.street}
                                            </p>
                                            <p>
                                                {address.postalCode} {address.city}
                                            </p>
                                            <p>{address.country}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleEditAddress(address)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteAddress(address.id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            {!address.isDefault && (
                                <div className="mt-4 pt-4 border-t">
                                    <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id)}>
                                        Définir par défaut
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function AddressForm({ address, onClose }: { address?: any; onClose: () => void }) {
    return (
        <form className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="label">Libellé</Label>
                <Input id="label" placeholder="Ex: Domicile, Bureau..." defaultValue={address?.label} />
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                    <Label htmlFor="streetNumber">Numéro</Label>
                    <Input id="streetNumber" placeholder="28" defaultValue={address?.streetNumber} />
                </div>
                <div className="space-y-2 col-span-2">
                    <Label htmlFor="street">Rue</Label>
                    <Input id="street" placeholder="Rue des Martyrs" defaultValue={address?.street} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input id="postalCode" placeholder="7080" defaultValue={address?.postalCode} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" placeholder="Frameries" defaultValue={address?.city} />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Input id="country" placeholder="Belgique" defaultValue={address?.country} />
            </div>
            <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                    {address ? "Modifier" : "Ajouter"}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                    Annuler
                </Button>
            </div>
        </form>
    )
}
