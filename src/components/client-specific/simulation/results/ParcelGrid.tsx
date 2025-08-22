// src/components/client-specific/simulation/results/ParcelGrid.tsx

import { ParcelCard } from "@/components/ui/SimulationResultsWidgets"
import type React from "react"
import { Package } from "lucide-react"

interface Parcel {
    height: number
    width: number
    length: number
    weight: number
}

interface Props {
    parcels: Parcel[]
    className?: string
}

const ParcelGrid: React.FC<Props> = ({ parcels, className }) => (
    <section className={className}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
            <Package className="h-6 w-6 text-primary" /> Détails des&nbsp;Colis
            <span className="text-muted-foreground text-sm font-normal">({parcels.length})</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {parcels.map((p, i) => (
                <ParcelCard key={i} index={i} parcel={p} />
            ))}
        </div>
    </section>
)

export default ParcelGrid
