// src/components/admin/ManualStatusForm.tsx
"use client";

import { TrackingEventStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { mutate } from "swr";
import { toast } from "sonner";

interface Props {
    envoiId: number;
    lastStatus: TrackingEventStatus;
}

export default function ManualStatusForm({ envoiId, lastStatus }: Props) {
    const [status, setStatus] = useState<TrackingEventStatus>("ARRIVED_AT_AGENCY");
    const [loading, setLoading] = useState(false);

    const onSave = async () => {
        setLoading(true);
        const res = await fetch("/api/v1/admin/tracking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ envoiId, status }),
        });
        setLoading(false);
        if (res.ok) {
            toast.success("Évènement ajouté");
            // revalide timeline côté admin et client
            mutate((key: string) => key.includes(`/tracking/`));
        } else {
            toast.error("Erreur");
        }
    };

    return (
        <div className="rounded-lg bg-muted p-4 space-y-3 max-w-md">
            <h2 className="font-semibold">Ajouter un statut</h2>
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TrackingEventStatus)}
                className="w-full rounded border p-2"
            >
                {Object.values(TrackingEventStatus).map((s) => (
                    <option key={s} value={s} disabled={s === lastStatus}>
                        {s}
                    </option>
                ))}
            </select>
            <Button disabled={loading} onClick={onSave}>
                {loading ? "..." : "Valider"}
            </Button>
        </div>
    );
}
