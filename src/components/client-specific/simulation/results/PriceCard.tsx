// path: src/components/client-specific/simulation/results/PriceCard.tsx
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
    totalPrice: number | null;
    className?: string;
}

const PriceCard: React.FC<Props> = ({ totalPrice, className }) => (
    <Card className={cn("bg-card shadow-md border border-border", className)}>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
                <DollarSign className="h-5 w-5 text-primary" />
                Prix&nbsp;Total
            </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
            {totalPrice ? (
                <p className="text-4xl font-extrabold text-primary">
                    {totalPrice} €
                </p>
            ) : (
                <p className="text-2xl font-bold text-muted-foreground flex items-center justify-center gap-2">
                    À calculer
                    <Badge variant="outline">Estimation</Badge>
                </p>
            )}
        </CardContent>
    </Card>
);

export default PriceCard;
