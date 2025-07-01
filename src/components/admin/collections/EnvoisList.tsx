// src/components/admin/collections/EnvoisList.tsx – table + recherche + pagination
"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { API_DOMAIN } from "@/utils/constants";
import { EnvoiStatus } from "@prisma/client";
import { format } from "date-fns";

interface EnvoiLiteDto {
    id: number;
    trackingNumber: string | null;
    envoiStatus: EnvoiStatus;
    paid: boolean;
    totalWeight: number;
    totalPrice: number;
    departureDate: Date;
    arrivalDate: Date;
    client: { name: string | null } | null;
}

interface Props {
    envois: EnvoiLiteDto[];
}

export default function EnvoisList({ envois }: Props) {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | EnvoiStatus>("ALL");
    const [page, setPage] = useState(1);
    const perPage = 10;

    const filtered = useMemo(() => {
        return envois.filter((e) => {
            const matchesStatus =
                statusFilter === "ALL" || e.envoiStatus === statusFilter;
            const target = `${e.trackingNumber ?? ""} ${e.client?.name ?? ""}`.toLowerCase();
            const matchesSearch = target.includes(search.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [envois, statusFilter, search]);

    const totalPages = Math.ceil(filtered.length / perPage) || 1;
    const current = filtered.slice((page - 1) * perPage, page * perPage);

    const deleteEnvoi = async (id: number) => {
        if (!confirm("Confirmer la suppression ?")) return;
        try {
            const res = await fetch(`${API_DOMAIN}/envois/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            toast.success("Envoi supprimé");
            router.refresh();
        } catch {
            toast.error("Erreur de suppression");
        }
    };

    const gotoTracking = (id: number) => router.push(`/admin/envois/${id}/tracking`);

    return (
        <div className="space-y-4">
            {/* filtres */}
            <div className="flex gap-4 items-center">
                <Input
                    placeholder="Recherche tracking ou client…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="border rounded px-2 py-1"
                >
                    <option value="ALL">Tous statuts</option>
                    {Object.values(EnvoiStatus).map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            {/* tableau */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Tracking</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Poids</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Départ</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {current.map((e) => (
                        <TableRow key={e.id}>
                            <TableCell>{e.id}</TableCell>
                            <TableCell>{e.trackingNumber ?? "‒"}</TableCell>
                            <TableCell>{e.client?.name ?? "‒"}</TableCell>
                            <TableCell>{e.totalWeight} kg</TableCell>
                            <TableCell>{e.totalPrice} €</TableCell>
                            <TableCell>{e.envoiStatus}</TableCell>
                            <TableCell>{format(new Date(e.departureDate), "dd/MM/yyyy")}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => gotoTracking(e.id)}>
                                            Suivi
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => deleteEnvoi(e.id)} className="text-destructive">
                                            Supprimer
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm">
        <span>
          Affichage {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} sur {filtered.length}
        </span>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                        Précédent
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Suivant
                    </Button>
                </div>
            </div>
        </div>
    );
}
