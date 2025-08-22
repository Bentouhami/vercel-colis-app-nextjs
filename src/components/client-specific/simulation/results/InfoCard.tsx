// src/components/client-specific/simulation/results/InfoCard.tsx

import type React from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

/** * Carte Départ / Destination. * * `type` définit la couleur d'accent (bleu = départ, vert = destination). */
interface InfoCardProps {
    type: "departure" | "destination"
    country: string | null
    city: string | null
    agency: string | null
    className?: string
}

const accent = {
    departure: {
        border: "border-primary",
        icon: "text-primary",
        badge: "Départ",
        title: "Départ",
    },
    destination: {
        border: "border-secondary",
        icon: "text-secondary",
        badge: "Arrivée",
        title: "Destination",
    },
}

export const InfoCard: React.FC<InfoCardProps> = ({ type, country, city, agency, className }) => {
    const style = accent[type]

    return (
        <Card className={cn("overflow-hidden border-l-4 shadow-sm", style.border, className)}>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-foreground">
                    <MapPin className={cn("h-5 w-5", style.icon)} />
                    {style.title}
                    <Badge
                        variant="outline"
                        className="ml-auto text-xs uppercase tracking-wider border-border text-muted-foreground"
                    >
                        {style.badge}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
                <p>
                    <span className="font-medium text-foreground">Pays&nbsp;:</span> {country ?? "_"}
                </p>
                <p>
                    <span className="font-medium text-foreground">Ville&nbsp;:</span> {city}
                </p>
                <p>
                    <span className="font-medium text-foreground">Agence&nbsp;:</span> {agency}
                </p>
            </CardContent>
        </Card>
    )
}

export default InfoCard
