"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getCurrentUserId } from "@/lib/auth-utils";
import { fetchUserDeliveries } from "@/services/frontend-services/envoi/EnvoiService";
import { EnvoisListDto } from "@/services/dtos";
import { Loader2, ArrowUpDown, CheckCircle, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import DeliveryDetails from "@/components/client-specific/profile/DeliveryDetails";

export default function DeliveriesTable() {
    const [deliveries, setDeliveries] = useState<EnvoisListDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const itemsPerPage = 5;
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        (async () => {
            setLoading(true);
            const userId = await getCurrentUserId();
            if (!userId) return;

            try {
                const { data, total } = await fetchUserDeliveries(userId, page, itemsPerPage);
                setDeliveries(data);
                setTotalPages(Math.ceil(total / itemsPerPage));
            } catch (err) {
                setError("Une erreur est survenue lors de la récupération de vos livraisons.");
            } finally {
                setLoading(false);
            }
        })();
    }, [page]);

    // Filtering function
    const filteredDeliveries = useMemo(() => {
        return deliveries.filter((delivery) =>
            delivery.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            delivery.destinataire.toLowerCase().includes(searchQuery.toLowerCase()) ||
            delivery.departureAgency.toLowerCase().includes(searchQuery.toLowerCase()) ||
            delivery.arrivalAgency.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [deliveries, searchQuery]);

    return (
        <div className="w-full flex flex-col items-center p-4">
            {/* Search Input */}
            <Input
                type="text"
                placeholder="Rechercher par tracking, destinataire, agence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4 w-full max-w-md"
            />

            {loading ? (
                <Loader2 className="animate-spin text-gray-500 h-12 w-12 my-10" />
            ) : filteredDeliveries.length > 0 ? (
                <>
                    {/* Table */}
                    <Table className="w-full border">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tracking</TableHead>
                                <TableHead>Départ</TableHead>
                                <TableHead>Arrivée</TableHead>
                                <TableHead className="text-center">Poids (kg)</TableHead>
                                <TableHead className="text-center">Prix (€)</TableHead>
                                <TableHead className="text-center">Statut</TableHead>
                                <TableHead className="text-center">Payé</TableHead>
                                <TableHead>Date d&#39;Envoi</TableHead>
                                <TableHead>Détails</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDeliveries.map((delivery) => (
                                <TableRow key={delivery.id}>
                                    <TableCell>{delivery.trackingNumber}</TableCell>
                                    <TableCell>{delivery.departureAgency}</TableCell>
                                    <TableCell>{delivery.arrivalAgency}</TableCell>
                                    <TableCell className="text-center">{delivery.totalWeight}</TableCell>
                                    <TableCell className="text-center">{delivery.totalPrice}</TableCell>
                                    <TableCell className="text-center">
                                        <span className={`px-2 py-1 rounded text-white ${
                                            delivery.envoiStatus === "DELIVERED" ? "bg-green-500" :
                                                delivery.envoiStatus === "PENDING" ? "bg-yellow-500" :
                                                    "bg-gray-500"
                                        }`}>
                                            {delivery.envoiStatus}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {delivery.paid ? (
                                            <CheckCircle className="text-green-500" size={20} />
                                        ) : (
                                            <XCircle className="text-red-500" size={20} />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(delivery.departureDate).toLocaleDateString("fr-FR")}
                                    </TableCell>
                                    <TableCell>
                                        <DeliveryDetails delivery={delivery}/>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <Pagination className="mt-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    size="default"
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    isActive={page === 1}
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <span className="text-sm font-semibold">
                                    Page {page} sur {totalPages}
                                </span>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext
                                    size="default"
                                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                    isActive={page === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            ) : (
                <p className="text-gray-500 text-center col-span-full">
                    Aucun envoi trouvé pour votre compte.
                </p>
            )}
        </div>
    );
}
