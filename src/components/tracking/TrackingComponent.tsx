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

            <div className="mt-6 rounded-lg bg-card border p-4 shadow-sm">
                <h2 className="mb-2 text-lg font-semibold text-card-foreground">Détails de l’envoi</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex justify-between"><span>Statut :</span> <span className="font-medium text-foreground">{envoi.envoiStatus}</span></li>
                    <li className="flex justify-between"><span>Poids :</span> <span className="font-medium text-foreground">{envoi.totalWeight} kg</span></li>
                    <li className="flex justify-between"><span>Volume :</span> <span className="font-medium text-foreground">{envoi.totalVolume} cm³</span></li>
                    <li className="flex justify-between"><span>Prix :</span> <span className="font-medium text-foreground">{envoi.totalPrice} €</span></li>
                    <li className="flex justify-between"><span>Agence départ :</span> <span className="font-medium text-foreground">{envoi.departureAgency?.name ?? "—"}</span></li>
                    <li className="flex justify-between"><span>Agence arrivée :</span> <span className="font-medium text-foreground">{envoi.arrivalAgency?.name ?? "—"}</span></li>
                    <li className="flex justify-between"><span>Départ prévu :</span> <span className="font-medium text-foreground">{new Date(envoi.departureDate).toLocaleDateString()}</span></li>
                    <li className="flex justify-between"><span>Arrivée prévue :</span> <span className="font-medium text-foreground">{new Date(envoi.arrivalDate).toLocaleDateString()}</span></li>
                </ul>
            </div>
        </>
    );
}
