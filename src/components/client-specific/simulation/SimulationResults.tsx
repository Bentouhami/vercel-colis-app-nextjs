// path: src/app/client/simulation/results/page.tsx
"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

// Services & Helpers
import { deleteSimulationCookie, getSimulation } from "@/services/frontend-services/simulation/SimulationService";
import { updateSimulationUserId } from "@/services/backend-services/Bk_SimulationService";
import { checkAuthStatus } from "@/lib/auth-utils";
import ResultsSkeleton from "@/app/client/simulation/results/resultsSkeleton";
import LoginPromptModal from "@/components/modals/LoginPromptModal";
import { SimulationResponseDto } from "@/services/dtos";
import { SimulationStatus } from "@/services/dtos/enums/EnumsDto";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Icons
import { ArrowRight, Calendar, DollarSign, MapPin, Package, Weight } from "lucide-react";

export default function SimulationResults() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [isActionInProgress, setIsActionInProgress] = useState(false);
    const [results, setResults] = useState<SimulationResponseDto | null>(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [userId, setUserId] = useState<string | number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check user authentication status
    useEffect(() => {
        const checkAuth = async () => {
            const authResult = await checkAuthStatus(false);
            setIsAuthenticated(authResult.isAuthenticated);
            setUserId(authResult.userId || null);
        };
        checkAuth();
    }, []);

    // Fetch simulation results from the backend
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const simulationData = await getSimulation();


                if (!simulationData) {
                    toast.error("Something went wrong, please try again.");
                    setTimeout(() => {
                        router.push("/client/simulation");
                    }, 3000);
                    return;
                }
                toast.success("Simulation results loaded successfully.");
                setResults(simulationData);

            } catch (error) {
                toast.error("Erreur de chargement des résultats.");
            } finally {
                setLoading(false);
            }
        })();
    }, [router]);

    // Validate the simulation and redirect to the add destinataire page
    const handleValidate = async () => {
        setIsActionInProgress(true);
        startTransition(async () => {
            try {
                if (isAuthenticated) {
                    if (results) {
                        if (userId && !results.userId) {
                            results.userId = Number(userId);
                            await updateSimulationUserId(results.id, results.userId);
                        }
                        toast("Redirecting to add destinataire page...");
                        setTimeout(() => {
                            router.push("/client/simulation/ajouter-destinataire");
                            setIsActionInProgress(false);
                        }, 1000);
                    }
                } else {
                    setShowLoginPrompt(true);
                    setIsActionInProgress(false);
                }
            } catch (error) {
                console.error("Error validating simulation:", error);
                toast.error("An error occurred while validating the simulation.");
                setIsActionInProgress(false);
            }
        });
    };

    // Redirect to login if user is not authenticated
    const handleLoginRedirect = () => {
        setShowLoginPrompt(false);
        const redirectUrl = encodeURIComponent("/client/simulation/results");
        router.push(`/client/auth/login?redirect=${redirectUrl}`);
    };

    // Cancel the simulation and clean up
    const handleCancel = () => {
        setIsActionInProgress(true);
        startTransition(() => {
            (async () => {
                try {
                    toast.success("Cleaning up simulation...");
                    await deleteSimulationCookie();
                    toast.success("Simulation deleted successfully.");
                } catch (error) {
                    console.error("Error deleting simulation cookie:", error);
                    toast.error("An error occurred while cleaning up the simulation.");
                } finally {
                    toast("Redirecting to simulation page...");
                    setTimeout(() => {
                        router.push("/client/simulation");
                        setIsActionInProgress(false);
                    }, 3000);
                }
            })();
        });
    };

    // Edit the current simulation and redirect to the edit page
    const handleEdit = async () => {
        setIsActionInProgress(true);
        startTransition(() => {
            (async () => {
                try {
                    // const authResult = await checkAuthStatus();
                    if (!results) {
                        toast.error("Une erreur est survenue lors de la récupération des résultats de la simulation.");
                        setIsActionInProgress(false);
                        return;
                    }

                    // Only attempt to update userId if authenticated and simulation is not yet associated with a user
                    if (isAuthenticated && userId && !results.userId) {
                        results.userId = Number(userId);
                        results.simulationStatus = SimulationStatus.CONFIRMED; // Consider if this status change is always desired here
                        const response = await updateSimulationUserId(results.id, results.userId);
                        if (!response) {
                            toast.error("Une erreur est survenue lors de la mise à jour de la simulation.");
                            setIsActionInProgress(false);
                            return;
                        }
                    }

                    toast("Redirection en cours...");
                    setTimeout(() => {
                        router.push("/client/simulation/edit");
                        setIsActionInProgress(false);
                    }, 1000); // Reduced timeout for faster feedback
                } catch (error) {
                    console.error("Error updating simulation:", error);
                    toast.error("Une erreur est survenue lors de la mise à jour de la simulation.");
                    setIsActionInProgress(false);
                }
            })();
        });
    };

    if (loading || !results) {
        return <ResultsSkeleton />;
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-4xl font-bold text-center mb-8 text-primary">
                Votre Simulation de Colis
            </h1>

            {/* Main Price Display */}
            <Card className="mb-8 p-6 text-center bg-primary text-primary-foreground shadow-lg">
                <CardTitle className="text-xl font-semibold mb-2">Prix Total Estimé</CardTitle>
                <CardContent className="text-6xl font-extrabold">
                    {results.totalPrice ? `${results.totalPrice} €` : "À calculer"}
                </CardContent>
                {results.totalPrice === null && (
                    <p className="text-sm opacity-80 mt-2">
                        Le prix sera calculé après validation et confirmation.
                    </p>
                )}
            </Card>

            <div className="grid lg:grid-cols-3 gap-8 mb-8">
                {/* Departure Card */}
                <Card className="lg:col-span-1 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-700">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            Départ
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p><span className="font-medium">Pays:</span> {results.departureCountry}</p>
                        <p><span className="font-medium">Ville:</span> {results.departureCity}</p>
                        <p><span className="font-medium">Agence:</span> {results.departureAgency}</p>
                    </CardContent>
                </Card>

                {/* Destination Card */}
                <Card className="lg:col-span-1 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-green-700">
                            <MapPin className="h-5 w-5 text-green-600" />
                            Destination
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p><span className="font-medium">Pays:</span> {results.destinationCountry}</p>
                        <p><span className="font-medium">Ville:</span> {results.destinationCity}</p>
                        <p><span className="font-medium">Agence:</span> {results.destinationAgency}</p>
                    </CardContent>
                </Card>

                {/* Summary Calculations Card */}
                <Card className="lg:col-span-1 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                            <DollarSign className="h-5 w-5 text-gray-600" />
                            Résumé
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Weight className="h-4 w-4 text-gray-500" />
                            <p><span className="font-medium">Poids total:</span> {results.totalWeight} kg</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <p><span className="font-medium">Date de départ:</span> {new Date(results.departureDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <p><span className="font-medium">Date d’arrivée estimée:</span> {new Date(results.arrivalDate).toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Parcel Details Card */}
            <Card className="mb-8 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                        <Package className="h-5 w-5 text-gray-600" />
                        Détails des Colis
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.parcels?.map((pkg, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-muted/20">
                            <p className="font-semibold mb-1">Colis {index + 1}:</p>
                            <p className="text-sm text-gray-600">Hauteur: {pkg.height} cm</p>
                            <p className="text-sm text-gray-600">Largeur: {pkg.width} cm</p>
                            <p className="text-sm text-gray-600">Longueur: {pkg.length} cm</p>
                            <p className="text-sm text-gray-600">Poids: {pkg.weight} kg</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                    disabled={isActionInProgress}
                    size="lg"
                    className="min-w-[200px]"
                    onClick={handleValidate}
                >
                    Valider la Simulation
                </Button>
                <Button
                    disabled={isActionInProgress}
                    variant="outline"
                    size="lg"
                    className="min-w-[200px]"
                    onClick={handleEdit}
                >
                    Modifier la Simulation
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                    disabled={isActionInProgress}
                    variant="destructive"
                    size="lg"
                    className="min-w-[200px]"
                    onClick={handleCancel}
                >
                    Annuler
                </Button>
            </div>

            <LoginPromptModal
                show={showLoginPrompt}
                handleClose={() => setShowLoginPrompt(false)}
                handleLoginRedirect={handleLoginRedirect}
            />
        </div>
    );
}
