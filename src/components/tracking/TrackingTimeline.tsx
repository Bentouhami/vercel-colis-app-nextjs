// src/components/tracking/TrackingTimeline.tsx
"use client";

import { format } from "date-fns";
import { cn } from "@/lib/utils";      // utilitaire Tailwind ‘classNames’
import { TrackingEventStatus } from "@prisma/client";

type TrackingEventDto = {
    id: number;
    eventStatus: TrackingEventStatus;
    location?: string;
    description?: string;
    createdAt: string;          // ISO string
};

interface Props {
    events: TrackingEventDto[];
}

export default function TrackingTimeline({ events }: Props) {
    if (!events?.length) return <p>Aucun événement pour le moment.</p>;

    return (
        <ol className="relative border-l-2 border-primary/40 ml-4">
            {events.map((e, idx) => (
                <li key={e.id} className="mb-8 ml-6">
                    {/* Puce */}
                    <span
                        className={cn(
                            "absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full",
                            idx === events.length - 1 ? "bg-primary" : "bg-muted"
                        )}
                    />
                    <h3 className="font-semibold text-primary">
                        {e.eventStatus.replaceAll("_", " ")}
                    </h3>
                    <time className="mb-1 block text-sm text-muted-foreground">
                        {format(new Date(e.createdAt), "dd/MM/yyyy HH:mm")}
                        {e.location ? ` — ${e.location}` : ""}
                    </time>
                    {e.description && (
                        <p className="text-sm text-muted-foreground">{e.description}</p>
                    )}
                </li>
            ))}
        </ol>
    );
}
