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
    Download,
    Printer,
    Share2,
    QrCode,
    Clock,
    CheckCircle,
    Truck,
    Building,
    Copy,
    XCircle,
} from "lucide-react"
import * as React from "react"
import type { EnvoisListDto } from "@/services/dtos"

interface ShipmentDetailsModalProps {
    shipment: EnvoisListDto | null
    isOpen: boolean
    onClose: () => void
}

const statusConfig = {
    DELIVERED: { label: "Livré", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: CheckCircle },
    PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", icon: Clock },
    SENT: { label: "En transit", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: Truck },
    CANCELLED: { label: "Annulé", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: XCircle },
    RETURNED: { label: "Retourné", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", icon: Package },
} as const

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
            // TODO: toast success
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
            // TODO: toast success
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* Shell responsive: full-screen on mobile, contained on ≥sm */}
            <DialogContent
                className="
          p-0 flex flex-col overflow-hidden
          w-[100vw] h-[100dvh] rounded-none
          sm:w-[95vw] sm:h-[90vh] sm:rounded-xl
          lg:max-w-6xl xl:max-w-7xl
        "
            >
                {/* Sticky header */}
                <DialogHeader
                    className="
            sticky top-0 z-20
            bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75
            p-4 sm:p-6 border-b
          "
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2 sm:p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="min-w-0">
                                <DialogTitle className="text-xl sm:text-2xl font-bold truncate">Envoi #{shipment.id}</DialogTitle>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
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

                        {/* Desktop/Tablet actions */}
                        <div className="hidden md:flex gap-2 shrink-0">
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

                {/* Body: the ScrollArea is the scroll container */}
                <div className="flex-1 min-h-0">
                    <ScrollArea className="h-full">
                        <div className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                                {/* LEFT: main content */}
                                <div className="space-y-4 sm:space-y-6 lg:col-span-2 min-w-0">
                                    {/* Tracking number */}
                                    {shipment.trackingNumber && (
                                        <Card className="border-2 border-indigo-200 dark:border-indigo-800">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <QrCode className="h-5 w-5 text-indigo-600 shrink-0" />
                                                        <div className="min-w-0">
                                                            <p className="text-xs sm:text-sm text-muted-foreground">Numéro de suivi</p>
                                                            <p className="text-base sm:text-lg font-mono font-bold truncate">
                                                                {shipment.trackingNumber}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm" onClick={handleCopyTracking} className="shrink-0">
                                                        <Copy className="h-4 w-4 mr-2" />
                                                        Copier
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Infos principales + Destinataire */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                                    <Package className="h-5 w-5" />
                                                    Informations principales
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                                    <div>
                                                        <p className="text-xs sm:text-sm text-muted-foreground">Date de création</p>
                                                        <p className="font-medium">
                                                            {shipment.createdAt &&
                                                                new Date(shipment.createdAt).toLocaleDateString("fr-FR", {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs sm:text-sm text-muted-foreground">Prix total</p>
                                                        <p className="font-bold text-lg text-green-600">
                                                            {shipment.totalPrice?.toFixed(2) || "0.00"} €
                                                        </p>
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                                    <div>
                                                        <p className="text-xs sm:text-sm text-muted-foreground">Poids total</p>
                                                        <p className="font-medium">{shipment.totalWeight || 0} kg</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs sm:text-sm text-muted-foreground">Statut de paiement</p>
                                                        <Badge className={shipment.paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                                            {shipment.paid ? "Payé" : "Non payé"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                                    <User className="h-5 w-5" />
                                                    Destinataire
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3 sm:space-y-4">
                                                <div>
                                                    <p className="text-xs sm:text-sm text-muted-foreground">Nom complet</p>
                                                    <p className="font-medium text-base sm:text-lg">
                                                        {shipment.destinataire || "Non spécifié"}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Itinéraire */}
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                                <MapPin className="h-5 w-5" />
                                                Itinéraire
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Agence de départ */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                                                        <h4 className="font-semibold text-green-700 dark:text-green-400">Agence de départ</h4>
                                                    </div>
                                                    <div className="ml-5 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Building className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium break-words">
                                {shipment.departureAgency || "Non spécifiée"}
                              </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Agence d'arrivée */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                                                        <h4 className="font-semibold text-red-700 dark:text-red-400">Agence d&apos;arrivée</h4>
                                                    </div>
                                                    <div className="ml-5 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Building className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium break-words">
                                {shipment.arrivalAgency || "Non spécifiée"}
                              </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* RIGHT: timeline */}
                                <div className="lg:col-span-1">
                                    <Card className="lg:sticky lg:top-20 max-h-full lg:max-h-[calc(90vh-8rem)] overflow-auto">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                                <Clock className="h-5 w-5" />
                                                Suivi de l&apos;envoi
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {/* Étape: Créé */}
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-4 h-4 rounded-full bg-green-500" />
                                                        <div className="w-0.5 h-8 bg-muted" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <p className="font-medium">Envoi créé</p>
                                                                <p className="text-sm text-muted-foreground truncate">
                                                                    {shipment.createdAt && new Date(shipment.createdAt).toLocaleString("fr-FR")}
                                                                </p>
                                                            </div>
                                                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Étape actuelle */}
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div
                                                            className={`w-4 h-4 rounded-full ${
                                                                shipment.envoiStatus === "PENDING"
                                                                    ? "bg-yellow-500"
                                                                    : shipment.envoiStatus === "SENT"
                                                                        ? "bg-blue-500"
                                                                        : shipment.envoiStatus === "DELIVERED"
                                                                            ? "bg-green-500"
                                                                            : "bg-red-500"
                                                            }`}
                                                        />
                                                        {shipment.envoiStatus !== "DELIVERED" && shipment.envoiStatus !== "CANCELLED" && (
                                                            <div className="w-0.5 h-8 bg-muted" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <p className="font-medium">
                                                                    {shipment.envoiStatus === "DELIVERED" ? "Livré" : statusInfo.label}
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {shipment.envoiStatus === "DELIVERED" ? "Livré" : "En cours"}
                                                                </p>
                                                            </div>
                                                            <StatusIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Étapes futures */}
                                                {shipment.envoiStatus !== "DELIVERED" && shipment.envoiStatus !== "CANCELLED" && (
                                                    <div className="flex items-center gap-4 opacity-60">
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-4 h-4 rounded-full bg-muted" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-muted-foreground">
                                                                {shipment.envoiStatus === "PENDING" ? "En transit" : "Livré"}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">En attente</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>

                        {/* Mobile bottom action bar — now INSIDE the ScrollArea */}
                        <div
                            className="
                md:hidden sticky bottom-0 z-20
                border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75
                px-4 py-3 flex items-center justify-end gap-2
              "
                        >
                            <Button variant="outline" onClick={handleDownloadInvoice}>
                                <Download className="h-4 w-4 mr-2" />
                                Facture
                            </Button>
                            <Button variant="outline" onClick={handlePrintLabel}>
                                <Printer className="h-4 w-4 mr-2" />
                                Étiquette
                            </Button>
                            <Button variant="default" onClick={handleShareTracking}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Partager
                            </Button>
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    )
}
