"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    PackageSearch,
    Route,
    Package,
    Calculator,
    Clock,
    Share2,
    Download,
    MapPin,
    Calendar,
    Weight,
    DollarSign,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Truck,
    Building2,
    User,
    CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { SimulationResponseDto } from "@/services/dtos"
import { SimulationStatus } from "@/services/dtos/enums/EnumsDto"

interface Props {
    results: SimulationResponseDto
    isActionInProgress: boolean
    onValidate: () => void
    onCancel: () => void
    onEdit: () => void
    onShare: () => void
    onExport: () => void
}

const statusConfig = {
    [SimulationStatus.DRAFT]: {
        label: "Brouillon",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: AlertCircle,
    },
    [SimulationStatus.CONFIRMED]: {
        label: "Confirmé",
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle2,
    },
    [SimulationStatus.COMPLETED]: {
        label: "Terminé",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: CheckCircle2,
    },
    [SimulationStatus.CANCELLED]: {
        label: "Annulé",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: AlertCircle,
    },
}

export default function SimulationResultsLayout({
    results,
    isActionInProgress,
    onValidate,
    onCancel,
    onEdit,
    onShare,
    onExport,
}: Props) {
    const [isVisible, setIsVisible] = useState(false)
    const [activeTab, setActiveTab] = useState("overview")

    const statusInfo = statusConfig[results.simulationStatus] || statusConfig[SimulationStatus.DRAFT]
    const StatusIcon = statusInfo.icon

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    // Calcul du volume total des colis
    const totalVolume = results.parcels.reduce(
        (sum, parcel) => sum + (parcel.length * parcel.width * parcel.height) / 1000000, // en m³
        0,
    )

    const stats = [
        {
            icon: Package,
            label: "Colis",
            value: results.parcels.length,
            color: "text-blue-600",
            suffix: results.parcels.length > 1 ? "colis" : "colis",
        },
        {
            icon: Weight,
            label: "Poids total",
            value: results.totalWeight,
            color: "text-green-600",
            suffix: "kg",
        },
        {
            icon: Calculator,
            label: "Volume total",
            value: totalVolume.toFixed(3),
            color: "text-purple-600",
            suffix: "m³",
        },
        {
            icon: Calendar,
            label: "Durée estimée",
            value: Math.ceil(
                (new Date(results.arrivalDate).getTime() - new Date(results.departureDate).getTime()) / (1000 * 60 * 60 * 24),
            ),
            color: "text-orange-600",
            suffix: "jours",
        },
        {
            icon: DollarSign,
            label: "Prix total",
            value: results.totalPrice ? `${results.totalPrice}` : "À calculer",
            color: "text-emerald-600",
            suffix: results.totalPrice ? "€" : "",
        },
        {
            icon: Clock,
            label: "Statut",
            value: statusInfo.label,
            color: "text-indigo-600",
            suffix: "",
        },
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header */}
            <div
                className={`overflow-hidden border-0 shadow-lg rounded-lg transition-all duration-500 delay-100 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                    }`}
            >
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-1">
                    <div className="bg-white dark:bg-gray-900 m-1 rounded-lg p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div
                                    className={`p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg transition-all duration-500 transform ${isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"
                                        }`}
                                >
                                    <PackageSearch className="h-8 w-8 text-white" />
                                </div>

                                <div className="space-y-2">
                                    <h1
                                        className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white transition-all duration-500 transform ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                                            }`}
                                    >
                                        Résultats de simulation
                                    </h1>

                                    <div
                                        className={`flex items-center gap-3 text-gray-600 dark:text-gray-300 transition-all duration-500 delay-100 transform ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                                            }`}
                                    >
                                        <span className="text-lg font-medium">Simulation #{results.id}</span>
                                        <Badge className={cn("font-medium flex items-center gap-1", statusInfo.color)}>
                                            <StatusIcon className="h-3 w-3" />
                                            {statusInfo.label}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar className="h-4 w-4" />
                                            {new Date().toLocaleDateString("fr-FR")}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`flex gap-3 transition-all duration-500 delay-200 transform ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                                    }`}
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onShare}
                                    className="bg-transparent hover:scale-105 transition-transform duration-200"
                                >
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Partager
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onExport}
                                    className="bg-transparent hover:scale-105 transition-transform duration-200"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Exporter
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div
                className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 transition-all duration-500 delay-200 transform ${isVisible ? "opacity-100" : "opacity-0"
                    }`}
            >
                {stats.map((stat, index) => (
                    <Card
                        key={index}
                        className={`hover:shadow-md transition-all duration-200 hover:scale-105 delay-${index * 50}`}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
                                    <p className="text-sm font-bold text-foreground truncate">
                                        {stat.value} {stat.suffix}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content */}
            <div className={`transition-all duration-500 delay-300 transform ${isVisible ? "opacity-100" : "opacity-0"}`}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 shadow-sm">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <Route className="h-4 w-4" />
                            <span className="hidden sm:inline">Aperçu</span>
                        </TabsTrigger>
                        <TabsTrigger value="parcels" className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <span className="hidden sm:inline">Colis</span>
                        </TabsTrigger>
                        <TabsTrigger value="pricing" className="flex items-center gap-2">
                            <Calculator className="h-4 w-4" />
                            <span className="hidden sm:inline">Tarification</span>
                        </TabsTrigger>
                        <TabsTrigger value="timeline" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="hidden sm:inline">Planning</span>
                        </TabsTrigger>
                    </TabsList>

                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <TabsContent value="overview" className="space-y-6 mt-0">
                                {/* Route Card */}
                                <Card className="overflow-hidden">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Route className="h-5 w-5 text-indigo-600" />
                                            Itinéraire de transport
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-8">
                                        {/* Departure */}
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                                                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                            </div>
                                            <Card className="flex-1 border-l-4 border-l-green-500">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Building2 className="h-4 w-4 text-green-600" />
                                                        <span className="font-semibold text-green-700 dark:text-green-400">Agence de départ</span>
                                                        <Badge variant="outline" className="ml-auto text-xs">
                                                            {new Date(results.departureDate).toLocaleDateString("fr-FR")}
                                                        </Badge>
                                                    </div>
                                                    <div className="space-y-2 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-3 w-3" />
                                                            <span className="font-medium text-foreground">Pays :</span>
                                                            <span>{results.departureCountry || "Non spécifié"}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-3 w-3" />
                                                            <span className="font-medium text-foreground">Ville :</span>
                                                            <span>{results.departureCity}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="h-3 w-3" />
                                                            <span className="font-medium text-foreground">Agence :</span>
                                                            <span>{results.departureAgency}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Transport Line */}
                                        <div className="flex items-center gap-4 ml-4">
                                            <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                                                <Truck className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Transport</span>
                                            </div>
                                            <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                                        </div>

                                        {/* Destination */}
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
                                                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                                            </div>
                                            <Card className="flex-1 border-l-4 border-l-red-500">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Building2 className="h-4 w-4 text-red-600" />
                                                        <span className="font-semibold text-red-700 dark:text-red-400">Agence d'arrivée</span>
                                                        <Badge variant="outline" className="ml-auto text-xs">
                                                            {new Date(results.arrivalDate).toLocaleDateString("fr-FR")}
                                                        </Badge>
                                                    </div>
                                                    <div className="space-y-2 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-3 w-3" />
                                                            <span className="font-medium text-foreground">Pays :</span>
                                                            <span>{results.destinationCountry || "Non spécifié"}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-3 w-3" />
                                                            <span className="font-medium text-foreground">Ville :</span>
                                                            <span>{results.destinationCity}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="h-3 w-3" />
                                                            <span className="font-medium text-foreground">Agence :</span>
                                                            <span>{results.destinationAgency}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="parcels" className="space-y-6 mt-0">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-5 w-5 text-indigo-600" />
                                                Détails des colis
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge variant="secondary">{results.parcels.length} colis</Badge>
                                                <Badge variant="outline">{results.totalWeight} kg total</Badge>
                                                <Badge variant="outline">{totalVolume.toFixed(3)} m³ total</Badge>
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {results.parcels.map((parcel, index) => (
                                                <Card key={index} className="border hover:shadow-md transition-shadow">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <span className="font-semibold text-sm">Colis {index + 1}</span>
                                                            <Badge variant="outline" className="text-xs">
                                                                {((parcel.length * parcel.width * parcel.height) / 1000000).toFixed(3)} m³
                                                            </Badge>
                                                        </div>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Poids :</span>
                                                                <span className="font-medium">{parcel.weight} kg</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Longueur :</span>
                                                                <span className="font-medium">{parcel.length} cm</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Largeur :</span>
                                                                <span className="font-medium">{parcel.width} cm</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Hauteur :</span>
                                                                <span className="font-medium">{parcel.height} cm</span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="pricing" className="space-y-6 mt-0">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calculator className="h-5 w-5 text-indigo-600" />
                                            Calcul de tarification
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {results.totalPrice ? (
                                            <div className="space-y-6">
                                                <div className="text-center p-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border">
                                                    <div className="flex items-center justify-center gap-2 mb-4">
                                                        <CreditCard className="h-6 w-6 text-green-600" />
                                                        <span className="text-lg font-semibold text-green-700 dark:text-green-400">
                                                            Prix calculé
                                                        </span>
                                                    </div>
                                                    <p className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
                                                        {results.totalPrice.toFixed(2)} €
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Tarif final pour {results.parcels.length} colis ({results.totalWeight} kg)
                                                    </p>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                        <h4 className="font-medium mb-2 flex items-center gap-2">
                                                            <Weight className="h-4 w-4" />
                                                            Facturation au poids
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            Basée sur le poids total de {results.totalWeight} kg selon nos tarifs en vigueur.
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                        <h4 className="font-medium mb-2 flex items-center gap-2">
                                                            <Calculator className="h-4 w-4" />
                                                            Facturation au volume
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            Basée sur le volume total de {totalVolume.toFixed(3)} m³ de vos {results.parcels.length}{" "}
                                                            colis.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-center text-sm text-muted-foreground border-t pt-4">
                                                    <p>
                                                        Le tarif appliqué correspond au plus avantageux entre le calcul au poids et au volume selon
                                                        nos barèmes.
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">Calcul en cours...</p>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    Le prix sera calculé en fonction de vos colis ({results.parcels.length} colis,{" "}
                                                    {results.totalWeight} kg, {totalVolume.toFixed(3)} m³)
                                                </p>
                                                <div className="grid grid-cols-2 gap-4 text-xs">
                                                    <div className="p-3 bg-white dark:bg-gray-700 rounded border">
                                                        <p className="font-medium">Poids total</p>
                                                        <p className="text-muted-foreground">{results.totalWeight} kg</p>
                                                    </div>
                                                    <div className="p-3 bg-white dark:bg-gray-700 rounded border">
                                                        <p className="font-medium">Volume total</p>
                                                        <p className="text-muted-foreground">{totalVolume.toFixed(3)} m³</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="timeline" className="space-y-6 mt-0">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-indigo-600" />
                                            Planning de livraison estimé
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            {[
                                                {
                                                    step: "Collecte à l'agence de départ",
                                                    date: new Date(results.departureDate).toLocaleDateString("fr-FR"),
                                                    time: "09:00 - 17:00",
                                                    status: "scheduled",
                                                    location: `${results.departureCity}, ${results.departureCountry}`,
                                                },
                                                {
                                                    step: "Préparation et chargement",
                                                    date: new Date(results.departureDate).toLocaleDateString("fr-FR"),
                                                    time: "18:00 - 20:00",
                                                    status: "scheduled",
                                                    location: results.departureAgency,
                                                },
                                                {
                                                    step: "Transport international",
                                                    date: "En cours",
                                                    time: "Variable",
                                                    status: "pending",
                                                    location: "En transit",
                                                },
                                                {
                                                    step: "Arrivée à destination",
                                                    date: new Date(results.arrivalDate).toLocaleDateString("fr-FR"),
                                                    time: "Estimé",
                                                    status: "pending",
                                                    location: `${results.destinationCity}, ${results.destinationCountry}`,
                                                },
                                                {
                                                    step: "Disponible pour retrait",
                                                    date: new Date(results.arrivalDate).toLocaleDateString("fr-FR"),
                                                    time: "Dès réception",
                                                    status: "pending",
                                                    location: results.destinationAgency,
                                                },
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start gap-4">
                                                    <div
                                                        className={cn(
                                                            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2",
                                                            item.status === "completed" && "bg-green-100 border-green-500 dark:bg-green-900",
                                                            item.status === "scheduled" && "bg-blue-100 border-blue-500 dark:bg-blue-900",
                                                            item.status === "pending" && "bg-gray-100 border-gray-300 dark:bg-gray-800",
                                                        )}
                                                    >
                                                        <div
                                                            className={cn(
                                                                "w-4 h-4 rounded-full",
                                                                item.status === "completed" && "bg-green-600",
                                                                item.status === "scheduled" && "bg-blue-600",
                                                                item.status === "pending" && "bg-gray-400",
                                                            )}
                                                        ></div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="min-w-0 flex-1">
                                                                <h4 className="font-medium text-foreground">{item.step}</h4>
                                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                                    <MapPin className="h-3 w-3" />
                                                                    <span>{item.location}</span>
                                                                </div>
                                                            </div>
                                                            <div className="text-right flex-shrink-0">
                                                                <Badge
                                                                    variant={
                                                                        item.status === "completed"
                                                                            ? "default"
                                                                            : item.status === "scheduled"
                                                                                ? "secondary"
                                                                                : "outline"
                                                                    }
                                                                    className="mb-1"
                                                                >
                                                                    {item.date}
                                                                </Badge>
                                                                <p className="text-xs text-muted-foreground">{item.time}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Price Summary */}
                            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                                <CardContent className="p-6 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <DollarSign className="h-5 w-5 text-primary" />
                                        <h3 className="font-semibold">Prix Total</h3>
                                    </div>

                                    {results.totalPrice ? (
                                        <div className="space-y-2">
                                            <p className="text-4xl font-bold text-primary">{results.totalPrice.toFixed(2)} €</p>
                                            <p className="text-sm text-muted-foreground">Tarif calculé</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <p className="text-2xl font-bold text-muted-foreground">À calculer</p>
                                            <Badge variant="outline">Estimation en cours</Badge>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Client Info */}
                            {results.userId && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-sm">
                                            <User className="h-4 w-4" />
                                            Informations client
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">ID Client :</span>
                                            <span className="font-medium">#{results.userId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Statut :</span>
                                            <Badge variant="outline" className="text-xs">
                                                {statusInfo.label}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Quick Actions */}
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <h3 className="font-semibold mb-4">Actions rapides</h3>

                                    <Button onClick={onValidate} disabled={isActionInProgress} className="w-full" size="lg">
                                        Valider la simulation
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>

                                    <Button
                                        onClick={onEdit}
                                        disabled={isActionInProgress}
                                        variant="outline"
                                        className="w-full bg-transparent"
                                    >
                                        Modifier la simulation
                                    </Button>

                                    <Button onClick={onCancel} disabled={isActionInProgress} variant="destructive" className="w-full">
                                        Annuler
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}
