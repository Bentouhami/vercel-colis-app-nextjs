// path: src/components/client-specific/simulation/results/SummaryWidgets.tsx
import React from "react";
import { Weight, Calendar } from "lucide-react";
import { SummaryWidget } from "@/components/ui/SimulationResultsWidgets";

interface Props {
    totalWeight: number;
    departureDate: string | Date;
    arrivalDate: string | Date;
    className?: string;
}

const SummaryWidgets: React.FC<Props> = ({
    totalWeight,
    departureDate,
    arrivalDate,
    className,
}) => (
    <section className={className}>
        <h2 className="sr-only">Résumé des calculs</h2>
        <div className="grid sm:grid-cols-3 gap-4">
            <SummaryWidget
                icon={Weight}
                label="Poids total"
                value={`${totalWeight} kg`}
            />
            <SummaryWidget
                icon={Calendar}
                label="Date de départ"
                value={new Date(departureDate).toLocaleDateString()}
            />
            <SummaryWidget
                icon={Calendar}
                label="Arrivée estimée"
                value={new Date(arrivalDate).toLocaleDateString()}
            />
        </div>
    </section>
);

export default SummaryWidgets;
