// E:\fullstack_project\NextJs_Projects\newColiApp\src\components\tracking\TrackingComponent.tsx
"use client";

import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import TrackingTimeline from "@/components/tracking/TrackingTimeline";

async function fetcher(url: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Erreur réseau");
    return res.json();
}

interface Props {
    trackingNum: string;
}

export default function TrackingComponent({ trackingNum }: Props) {
    // correspond à la route src/app/api/v1/tracking/[trackingNumber]/route.ts
    const { data, error, isLoading } = useSWR(
        `/api/v1/tracking/${trackingNum}`,
        fetcher,
        { refreshInterval: 10_000 }
    );

    if (isLoading) return <Skeleton className="h-40 w-full" />;
    if (error) return <p className="text-destructive">Impossible de charger le suivi.</p>;
    if (!data) return null;

    const { events, envoi } = data;

    return (
        <>
            <TrackingTimeline events={events} />

            <div className="mt-6 rounded-lg bg-white p-4 shadow">
                <h2 className="mb-2 text-lg font-semibold">Détails de l’envoi</h2>
                <ul className="space-y-1 text-sm">
                    <li>Statut : {envoi.envoiStatus}</li>
                    <li>Poids : {envoi.totalWeight} kg</li>
                    <li>Volume : {envoi.totalVolume} cm³</li>
                    <li>Prix : {envoi.totalPrice} €</li>
                    <li>Agence départ : {envoi.departureAgency?.name ?? "—"}</li>
                    <li>Agence arrivée : {envoi.arrivalAgency?.name ?? "—"}</li>
                    <li>Départ prévu : {new Date(envoi.departureDate).toLocaleDateString()}</li>
                    <li>Arrivée prévue : {new Date(envoi.arrivalDate).toLocaleDateString()}</li>
                </ul>
            </div>
        </>
    );
}
