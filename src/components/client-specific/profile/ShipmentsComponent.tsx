"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Package,
    Search,
    Download,
    Truck,
    Clock,
    CheckCircle,
    XCircle,
    Loader2,
    MapPin,
    Calendar,
    User,
    Weight,
    Eye,
    Plus,
    Filter,
} from "lucide-react"
import { getCurrentUserId } from "@/lib/auth-utils"
import { fetchUserDeliveries } from "@/services/frontend-services/envoi/EnvoiService"
import type { EnvoisListDto } from "@/services/dtos"
import ShipmentDetailsModal from "./ShipmentDetailsModal"

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

export default function ShipmentsComponent() {
    const [shipments, setShipments] = useState<EnvoisListDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("all")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedShipment, setSelectedShipment] = useState<EnvoisListDto | null>(null)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const itemsPerPage = 10

    // Charger les envois
    useEffect(() => {
        const loadShipments = async () => {
            try {
                setLoading(true)
                setError(null)
                const userId = await getCurrentUserId()
                if (!userId) {
                    setError("Utilisateur non connecté")
                    return
                }
                const { data, total } = await fetchUserDeliveries(userId, page, itemsPerPage)
                setShipments(data)
                setTotalPages(Math.ceil(total / itemsPerPage))
            } catch (err) {
                setError("Erreur lors du chargement des envois")
                console.error("Error fetching shipments:", err)
            } finally {
                setLoading(false)
            }
        }

        loadShipments()
    }, [page])

    // Filtrage des envois
    const filteredShipments = useMemo(() => {
        return shipments.filter((shipment) => {
            const searchFields = [
                shipment.trackingNumber,
                shipment.destinataire,
                shipment.departureAgency,
                shipment.arrivalAgency,
                shipment.id.toString(),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()

            const matchesSearch = searchFields.includes(searchTerm.toLowerCase())
            const matchesTab = activeTab === "all" || shipment.envoiStatus.toLowerCase() === activeTab.toLowerCase()

            return matchesSearch && matchesTab
        })
    }, [shipments, searchTerm, activeTab])

    // Statistiques
    const stats = useMemo(() => {
        return {
            total: shipments.length,
            delivered: shipments.filter((s) => s.envoiStatus === "DELIVERED").length,
            pending: shipments.filter((s) => s.envoiStatus === "PENDING").length,
            sent: shipments.filter((s) => s.envoiStatus === "SENT").length,
            cancelled: shipments.filter((s) => s.envoiStatus === "CANCELLED").length,
            returned: shipments.filter((s) => s.envoiStatus === "RETURNED").length,
        }
    }, [shipments])

    const handleViewDetails = (shipment: EnvoisListDto) => {
        setSelectedShipment(shipment)
        setIsDetailsModalOpen(true)
    }

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false)
        setSelectedShipment(null)
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mes Envois</h1>
                        <p className="text-gray-600 dark:text-gray-400">Suivez l&apos;historique de vos envois et colis</p>
                    </div>
                </div>
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Chargement des envois...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mes Envois</h1>
                        <p className="text-gray-600 dark:text-gray-400">Suivez l&apos;historique de vos envois et colis</p>
                    </div>
                </div>
                <Card>
                    <CardContent className="p-12 text-center">
                        <div className="text-red-500 mb-4">
                            <Package className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Erreur de chargement</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()} variant="outline">
                            Réessayer
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Mes Envois</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Suivez l&apos;historique de vos envois et colis</p>
                </div>
                <Button className="flex items-center gap-2 shrink-0">
                    <Plus className="h-4 w-4" />
                    Nouvel envoi
                </Button>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <Card className="flex-1">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                            <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">En attente</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pending}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">En transit</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.sent}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Livrés</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.delivered}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Annulés</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.cancelled}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Retournés</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.returned}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        placeholder="Rechercher par numéro, destinataire ou agence..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                    />
                </div>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Filter className="h-4 w-4" />
                    Filtres
                </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="flex flex-wrap justify-start gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                    <TabsTrigger value="all" className="text-sm py-2 px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-indigo-400">
                        Tous
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="text-sm py-2 px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-indigo-400">
                        En attente
                    </TabsTrigger>
                    <TabsTrigger value="sent" className="text-sm py-2 px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-indigo-400">
                        En transit
                    </TabsTrigger>
                    <TabsTrigger value="delivered" className="text-sm py-2 px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-indigo-400">
                        Livrés
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" className="text-sm py-2 px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-indigo-400">
                        Annulés
                    </TabsTrigger>
                    <TabsTrigger value="returned" className="text-sm py-2 px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-indigo-400">
                        Retournés
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    {filteredShipments.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Aucun envoi trouvé</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {searchTerm
                                        ? "Essayez de modifier vos critères de recherche"
                                        : "Vous n&apos;avez pas encore d&apos;envois dans cette catégorie"}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredShipments.map((shipment) => {
                                const statusInfo = statusConfig[shipment.envoiStatus as keyof typeof statusConfig] || {
                                    label: shipment.envoiStatus,
                                    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
                                    icon: Package,
                                }
                                const StatusIcon = statusInfo.icon

                                return (
                                    <Card key={shipment.id} className="transition-all hover:shadow-md">
                                        <CardContent className="p-4 sm:p-6">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                <div className="flex items-start gap-4 flex-1 w-full">
                                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg shrink-0">
                                                        <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                    </div>
                                                    <div className="space-y-2 flex-1">
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-wrap">
                                                            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                                                                {shipment.trackingNumber || `Envoi #${shipment.id}`}
                                                            </h3>
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
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4 shrink-0" />
                                                                <span>
                                                                    <strong>Destinataire:</strong>{" "}
                                                                    {shipment.destinataire || "Non spécifié"}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4 shrink-0" />
                                                                <span>
                                                                    <strong>De:</strong> {shipment.departureAgency || "Non spécifiée"}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4 shrink-0" />
                                                                <span>
                                                                    <strong>Vers:</strong> {shipment.arrivalAgency || "Non spécifiée"}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Weight className="h-4 w-4 shrink-0" />
                                                                <span>
                                                                    <strong>Poids:</strong> {shipment.totalWeight || 0} kg
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 shrink-0" />
                                                                <span>
                                                                    <strong>Créé le:</strong> {new Date(shipment.createdAt).toLocaleDateString("fr-FR")}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end sm:items-end gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(shipment.createdAt).toLocaleDateString("fr-FR")}
                                                    </p>
                                                    <p className="font-semibold text-xl text-gray-900 dark:text-gray-100">
                                                        {shipment.totalPrice?.toFixed(2) || "0.00"} €
                                                    </p>
                                                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                                                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(shipment)} className="flex-1 sm:flex-none">
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Détails
                                                        </Button>
                                                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                                                            <Download className="h-4 w-4 mr-1" />
                                                            Facture
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2"
                    >
                        Précédent
                    </Button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {page} sur {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2"
                    >
                        Suivant
                    </Button>
                </div>
            )}

            {/* Modal de détails */}
            <ShipmentDetailsModal shipment={selectedShipment} isOpen={isDetailsModalOpen} onClose={handleCloseDetailsModal} />
        </div>
    )
}
