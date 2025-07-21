// path: src/components/client-specific/simulation/results/ResultsHeader.tsx
import React from "react";
import { PackageSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Bandeau hero « Résultats de la simulation »
 */
interface Props {
    simulationId: number | string;
    status: string; // ex: "DRAFT" | "CONFIRMED"
    className?: string;
}

export const ResultsHeader: React.FC<Props> = ({ simulationId, status, className }) => (
    <header
        className={cn(
            "relative isolate overflow-hidden rounded-lg bg-gradient-to-br from-background via-card to-muted shadow-sm",
            "flex items-center px-6 py-10 sm:py-14 md:py-16"
        )}
    >
        <PackageSearch className="h-12 w-12 shrink-0 text-primary" />
        <div className="ml-5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Résultats&nbsp;de&nbsp;la&nbsp;simulation
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
                Simulation&nbsp;# {simulationId}
                <Badge variant="outline" className="ml-3 border-primary/20 text-primary">
                    {status}
                </Badge>
            </p>
        </div>
    </header>
);

export default ResultsHeader;
