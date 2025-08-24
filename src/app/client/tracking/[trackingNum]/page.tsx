// path: src/app/client/tracking/[trackingNum]/page.tsx

import TrackingComponent from "@/components/tracking/TrackingComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, Clock } from "lucide-react";

// Définir le type pour params
interface TrackingPageParams {
    params: Promise<{
        trackingNum: string;
    }>;
}

export default async function TrackingPage(props: TrackingPageParams) {
    const params = await props.params;
    return (
        <div className="container py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Suivi de votre envoi</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Code de suivi: <span className="font-mono bg-muted p-1 rounded-md">{params.trackingNum}</span>
                </p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                <div className="h-full rounded-lg bg-card border p-5">
                    <h2 className="text-xl font-semibold mb-4">Détails de l&apos;envoi:</h2>
                    <TrackingComponent trackingNum={params.trackingNum} />
                </div>
                <div className="h-full rounded-lg lg:col-span-2">
                    <Card className="relative h-full transition-all duration-300 hover:shadow-lg border-dashed border-2">
                        <div className="absolute -top-3 -right-3 z-10">
                            <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 text-xs font-semibold shadow-lg animate-pulse">
                                <Clock className="w-3 h-3 mr-1" />
                                Bientôt Disponible
                            </Badge>
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-muted-foreground">
                                <Map className="h-5 w-5" />
                                Carte de Suivi en Temps Réel
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-full flex flex-col items-center justify-center text-center opacity-60">
                            <div className="space-y-4">
                                <Map className="h-24 w-24 text-gray-300 dark:text-gray-600" />
                                <p className="text-lg font-medium text-muted-foreground">
                                    L&apos;intégration de la carte est en cours de développement.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Vous pourrez bientôt suivre votre colis en temps réel sur une carte interactive.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}