"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Edit, Trash2, Mail, Phone, User, Clock, Sparkles, UserPlus, Contact } from "lucide-react"

// Types
interface Destinataire {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    isDefault: boolean
    createdAt: string
}

// Mock data pour la démo
const mockDestinataires: Destinataire[] = [
    {
        id: "dest-001",
        firstName: "Marie",
        lastName: "Martin",
        email: "marie.martin@email.com",
        phone: "+32 2 123 45 67",
        isDefault: true,
        createdAt: "2024-01-15",
    },
    {
        id: "dest-002",
        firstName: "Pierre",
        lastName: "Durand",
        email: "pierre.durand@gmail.com",
        phone: "+32 65 98 76 54",
        isDefault: false,
        createdAt: "2024-01-10",
    },
    {
        id: "dest-003",
        firstName: "Sophie",
        lastName: "Leblanc",
        email: "sophie.leblanc@hotmail.com",
        phone: "+32 4 555 12 34",
        isDefault: false,
        createdAt: "2024-01-05",
    },
]

export default function DestinatairesComponent() {
    const [destinataires, setDestinataires] = useState<Destinataire[]>(mockDestinataires)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingDestinataire, setEditingDestinataire] = useState<Destinataire | null>(null)

    const handleAddDestinataire = () => {
        setEditingDestinataire(null)
        setIsDialogOpen(true)
    }

    const handleEditDestinataire = (destinataire: Destinataire) => {
        setEditingDestinataire(destinataire)
        setIsDialogOpen(true)
    }

    const handleDeleteDestinataire = (id: string) => {
        setDestinataires(destinataires.filter((dest) => dest.id !== id))
    }

    const handleSetDefault = (id: string) => {
        setDestinataires(
            destinataires.map((dest) => ({
                ...dest,
                isDefault: dest.id === id,
            })),
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mes Destinataires</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Gérez votre carnet de destinataires pour faciliter vos envois futurs
                    </p>
                </div>
                <Button onClick={handleAddDestinataire} className="gap-2" disabled>
                    <Plus className="h-4 w-4" />
                    Ajouter un destinataire
                </Button>
            </div>

            {/* Coming Soon Notice */}
            <Card className="relative transition-all duration-300 hover:shadow-lg border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50">
                {/* Coming Soon Badge */}
                <div className="absolute -top-3 -right-3 z-10">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 text-xs font-semibold shadow-lg animate-pulse">
                        <Clock className="w-3 h-3 mr-1" />
                        Coming Soon
                    </Badge>
                </div>

                <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <UserPlus className="h-5 w-5" />
                        Carnet de Destinataires
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Pratique
                        </Badge>
                    </CardTitle>

                    {/* TFE Notice */}
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-blue-800 dark:text-blue-300">Fonctionnalité Future - TFE</p>
                                <p className="text-blue-600 dark:text-blue-400 mt-1">
                                    Cette fonctionnalité permettra de sauvegarder vos destinataires fréquents pour faciliter la création
                                    d&apos;envois futurs. Elle sera disponible dans les versions post-TFE avec synchronisation et suggestions
                                    intelligentes.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="opacity-60">
                    <div className="space-y-4">
                        {/* Feature Preview */}
                        <div className="grid gap-3">
                            <div className="flex items-center justify-between p-4 border rounded-lg border-dashed">
                                <div className="flex items-center gap-3">
                                    <Contact className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <h4 className="font-medium text-gray-600 dark:text-gray-400">Sauvegarde automatique</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-500">
                                            Les destinataires seront automatiquement sauvegardés lors de vos envois
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-gray-500 border-gray-300">
                                    Non disponible
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg border-dashed">
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <h4 className="font-medium text-gray-600 dark:text-gray-400">Sélection rapide</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-500">
                                            Dropdown avec recherche pour sélectionner rapidement un destinataire
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-gray-500 border-gray-300">
                                    Non disponible
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg border-dashed">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <h4 className="font-medium text-gray-600 dark:text-gray-400">Suggestions intelligentes</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-500">
                                            Suggestions basées sur vos envois précédents et fréquence d&apos;utilisation
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-gray-500 border-gray-300">
                                    Non disponible
                                </Badge>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full cursor-not-allowed opacity-50 border-dashed bg-transparent"
                            disabled
                        >
                            <Clock className="w-4 h-4 mr-2" />
                            Fonctionnalité en développement
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Preview of Future Destinataires List */}
            <Card className="relative transition-all duration-300 hover:shadow-lg border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50">
                {/* Coming Soon Badge */}
                <div className="absolute -top-3 -right-3 z-10">
                    <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 text-xs font-semibold shadow-lg animate-pulse">
                        <Clock className="w-3 h-3 mr-1" />
                        Aperçu
                    </Badge>
                </div>

                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Users className="h-5 w-5" />
                        Aperçu de la Liste des Destinataires
                    </CardTitle>

                    {/* TFE Notice */}
                    <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-green-800 dark:text-green-300">Aperçu de l&apos;Interface Future</p>
                                <p className="text-green-600 dark:text-green-400 mt-1">
                                    Voici à quoi ressemblera la gestion de vos destinataires dans les futures versions.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="opacity-60">
                    <div className="grid gap-4">
                        {mockDestinataires.map((destinataire, index) => (
                            <div
                                key={destinataire.id}
                                className={`p-4 border rounded-lg border-dashed transition-all duration-300 ${destinataire.isDefault ? "bg-blue-50/30 dark:bg-blue-950/20 border-blue-300" : ""
                                    }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                                            <User className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                                                    {destinataire.firstName} {destinataire.lastName}
                                                </h3>
                                                {destinataire.isDefault && (
                                                    <Badge variant="outline" className="text-gray-500 border-gray-300">
                                                        Par défaut
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="space-y-1 text-sm text-gray-500 dark:text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4" />
                                                    <span>{destinataire.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4" />
                                                    <span>{destinataire.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" disabled className="opacity-50 cursor-not-allowed">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" disabled className="opacity-50 cursor-not-allowed text-red-400">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 text-center">
                        <Button variant="outline" className="cursor-not-allowed opacity-50 border-dashed bg-transparent" disabled>
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter un destinataire (Non disponible)
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Benefits Section */}
            <Card className="relative transition-all duration-300 hover:shadow-lg border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Sparkles className="h-5 w-5" />
                        Avantages de cette Fonctionnalité
                    </CardTitle>
                </CardHeader>
                <CardContent className="opacity-60">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-600 dark:text-gray-400">Gain de temps</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">
                                        Plus besoin de ressaisir les informations de vos destinataires fréquents
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-600 dark:text-gray-400">Organisation</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">
                                        Gardez tous vos contacts d&apos;envoi organisés en un seul endroit
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-600 dark:text-gray-400">Précision</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">
                                        Réduisez les erreurs de saisie avec des informations pré-enregistrées
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                    <UserPlus className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-600 dark:text-gray-400">Simplicité</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">
                                        Interface intuitive avec recherche et sélection rapide
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
