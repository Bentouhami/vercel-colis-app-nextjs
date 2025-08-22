"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Package,
    MapPin,
    User,
    Phone,
    Mail,
    Weight,
    Download,
    Printer,
    Share2,
    QrCode,
    Clock,
    CheckCircle,
    Truck,
    Building,
    FileText,
    Shield,
    Copy,
    XCircle,
} from "lucide-react"
import type { EnvoisListDto } from "@/services/dtos"

interface ShipmentDetailsModalProps {
    shipment: EnvoisListDto | null
    isOpen: boolean
    onClose: () => void
}

const statusConfig = {
    DELIVERED: {
        label: "Livré",
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
    },
    PENDING: {
        label: "En attente",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Clock,
    },
    SENT: {
        label: "En transit",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: Truck,
    },
    CANCELLED: {
        label: "Annulé",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: XCircle,
    },
    RETURNED: {
        label: "Retourné",
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        icon: Package,
    },
}

export default function ShipmentDetailsModal({ shipment, isOpen, onClose }: ShipmentDetailsModalProps) {
    if (!shipment) return null

    const statusInfo = statusConfig[shipment.envoiStatus as keyof typeof statusConfig] || {
        label: shipment.envoiStatus,
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        icon: Package,
    }

    const StatusIcon = statusInfo.icon

    const handleCopyTracking = async () => {
        if (shipment.trackingNumber) {
            await navigator.clipboard.writeText(shipment.trackingNumber)
            // Toast notification pourrait être ajoutée ici
        }
    }

    const handleDownloadInvoice = () => {
        console.log("Téléchargement de la facture pour l'envoi:", shipment.id)
    }

    const handlePrintLabel = () => {
        console.log("Impression de l'étiquette pour l'envoi:", shipment.id)
    }

    const handleShareTracking = async () => {
        if (shipment.trackingNumber) {
            const trackingUrl = `${window.location.origin}/tracking/${shipment.trackingNumber}`
            await navigator.clipboard.writeText(trackingUrl)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                                <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">Envoi #{shipment.id}</DialogTitle>
                                <div className="flex items-center gap-3 mt-2">
                                    <Badge className={statusInfo.color}>
                                        <StatusIcon className="h-3 w-3 mr-1" />
                                        {statusInfo.label}
                                    </Badge>
                                    {shipment.paid && (
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Payé
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
                                <Download className="h-4 w-4 mr-2" />
                                Facture
                            </Button>
                            <Button variant="outline" size="sm" onClick={handlePrintLabel}>
                                <Printer className="h-4 w-4 mr-2" />
                                Étiquette
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleShareTracking}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Partager
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6">
                    {/* Numéro de suivi */}
                    {shipment.trackingNumber && (
                        <Card className="mb-6 border-2 border-indigo-200 dark:border-indigo-800">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <QrCode className="h-5 w-5 text-indigo-600" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Numéro de suivi</p>
                                            <p className="text-lg font-mono font-bold text-gray-900 dark:text-gray-100">
                                                {shipment.trackingNumber}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleCopyTracking}>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copier
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Informations principales */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Informations principales
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Date de création</p>
                                        <p className="font-medium">
                                            {shipment.createdAt && new Date(shipment.createdAt).toLocaleDateString("fr-FR", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Prix total</p>
                                        <p className="font-bold text-lg text-green-600">{shipment.totalPrice?.toFixed(2) || "0.00"} €</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Poids total</p>
                                        <p className="font-medium flex items-center gap-1">
                                            <Weight className="h-4 w-4" />
                                            {shipment.totalWeight || 0} kg
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Statut de paiement</p>
                                        <Badge className={shipment.paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                            {shipment.paid ? "Payé" : "Non payé"}
                                        </Badge>
                                    </div>
                                </div>

                                
                            </CardContent>
                        </Card>

                        {/* Destinataire */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Destinataire
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Nom complet</p>
                                    <p className="font-medium text-lg">
                                        {shipment.destinataire || "Non spécifié"}
                                    </p>
                                </div>

                                
                            </CardContent>
                        </Card>
                    </div>

                    {/* Itinéraire */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Itinéraire
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Agence de départ */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <h4 className="font-semibold text-green-700 dark:text-green-400">Agence de départ</h4>
                                    </div>
                                    <div className="ml-5 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Building className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium">{shipment.departureAgency || "Non spécifiée"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Agence d'arrivée */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <h4 className="font-semibold text-red-700 dark:text-red-400">Agence d&apos;arrivée</h4>
                                    </div>
                                    <div className="ml-5 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Building className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium">{shipment.arrivalAgency || "Non spécifiée"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Chronologie du suivi */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Suivi de l&apos;envoi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Étape: Créé */}
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                        <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Envoi créé</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {shipment.createdAt && new Date(shipment.createdAt).toLocaleString("fr-FR")}
                                                </p>
                                            </div>
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Étape actuelle basée sur le statut */}
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-4 h-4 rounded-full ${shipment.envoiStatus === "PENDING"
                                                ? "bg-yellow-500"
                                                : shipment.envoiStatus === "SENT"
                                                    ? "bg-blue-500"
                                                    : shipment.envoiStatus === "DELIVERED"
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                }`}
                                        ></div>
                                        {shipment.envoiStatus !== "DELIVERED" && shipment.envoiStatus !== "CANCELLED" && (
                                            <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700"></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{statusInfo.label}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {shipment.envoiStatus === "DELIVERED" ? "Livré" : "En cours"}
                                                </p>
                                            </div>
                                            <StatusIcon className="h-5 w-5 text-gray-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Étapes futures */}
                                {shipment.envoiStatus !== "DELIVERED" && shipment.envoiStatus !== "CANCELLED" && (
                                    <div className="flex items-center gap-4 opacity-50">
                                        <div className="flex flex-col items-center">
                                            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-500">
                                                {shipment.envoiStatus === "PENDING" ? "En transit" : "Livré"}
                                            </p>
                                            <p className="text-sm text-gray-400">En attente</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Informations supplémentaires */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {/* Service et options */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Service et options
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Type de service</p>
                                    <p className="font-medium">Standard</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Assurance</p>
                                    <p className="font-medium">Incluse (jusqu&apos;à 100€)</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Livraison</p>
                                    <p className="font-medium">En agence</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Documents */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Documents
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start bg-transparent"
                                    onClick={handleDownloadInvoice}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Télécharger la facture
                                </Button>
                                <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handlePrintLabel}>
                                    <Printer className="h-4 w-4 mr-2" />
                                    Imprimer l&apos;étiquette
                                </Button>
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Bordereau d&apos;expédition
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
