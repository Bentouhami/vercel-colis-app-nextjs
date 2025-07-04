// path: src/app/client/simulation/results/page.tsx
"use client";

import React, {useEffect, useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {toast} from "sonner";

// Services & Helpers
import {deleteSimulationCookie, getSimulation} from "@/services/frontend-services/simulation/SimulationService";
import {updateSimulationUserId} from "@/services/backend-services/Bk_SimulationService";
import {checkAuthStatus} from "@/lib/auth";
import ResultsSkeleton from "@/app/client/simulation/results/resultsSkeleton";
import LoginPromptModal from "@/components/modals/LoginPromptModal";
import {SimulationResponseDto} from "@/services/dtos";
import {SimulationStatus} from "@/services/dtos/enums/EnumsDto";

// Shadcn UI Components
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

// Icons
import {ArrowRight, Calendar, DollarSign, MapPin, Package, Weight} from "lucide-react";

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
                    if (results) {
                        if (userId && !results.userId) {
                            results.userId = Number(userId);
                            results.simulationStatus = SimulationStatus.CONFIRMED;
                            const response = await updateSimulationUserId(results.id, results.userId);
                            if (!response) {
                                toast.error("Une erreur est survenue lors de la mise à jour de la simulation.");
                                setIsActionInProgress(false);
                                return;
                            }
                            toast("Redirection en cours...");
                            setTimeout(() => {
                                router.push("/client/simulation/edit");
                                setIsActionInProgress(false);
                            }, 3000);
                        }
                    } else {
                        toast.error("Une erreur est survenue lors de la récupération des résultats de la simulation.");
                        setIsActionInProgress(false);
                    }
                } catch (error) {
                    console.error("Error updating simulation:", error);
                    toast.error("Une erreur est survenue lors de la mise à jour de la simulation.");
                    setIsActionInProgress(false);
                }
            })();
        });
    };

    if (loading || !results) {
        return <ResultsSkeleton/>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6 mb-52 bg-gray-50 rounded-lg shadow-lg mt-5">
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Résultats de la Simulation</h1>

            {/* Departure & Destination Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-blue-500 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-700">
                            <MapPin className="h-5 w-5 text-blue-500"/>
                            Départ
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            <span className="font-medium">Pays:</span> {results.departureCountry}
                        </p>
                        <p>
                            <span className="font-medium">Ville:</span> {results.departureCity}
                        </p>
                        <p>
                            <span className="font-medium">Agence:</span> {results.departureAgency}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-green-500 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-700">
                            <MapPin className="h-5 w-5 text-green-500"/>
                            Destination
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            <span className="font-medium">Pays:</span> {results.destinationCountry}
                        </p>
                        <p>
                            <span className="font-medium">Ville:</span> {results.destinationCity}
                        </p>
                        <p>
                            <span className="font-medium">Agence:</span> {results.destinationAgency}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Parcel Details Card */}
            <Card className="mt-6 bg-blue-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-500"/>
                        Détails des Colis
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    {results.parcels?.map((pkg, index) => (
                        <div key={index} className="p-4 bg-white rounded-lg shadow-sm border">
                            <p>
                                <span className="font-medium">Colis {index + 1}:</span>
                            </p>
                            <p>Hauteur: {pkg.height} cm</p>
                            <p>Largeur: {pkg.width} cm</p>
                            <p>Longueur: {pkg.length} cm</p>
                            <p>Poids: {pkg.weight} kg</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Summary Calculations Card */}
            <Card className="bg-blue-100">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                        <DollarSign className="h-5 w-5"/>
                        Résumé des Calculs
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <Weight className="h-5 w-5 text-gray-500"/>
                        <div>
                            <p className="text-sm text-gray-500">Poids total</p>
                            <p className="font-medium">{results.totalWeight} kg</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-500"/>
                        <div>
                            <p className="text-sm text-gray-500">Date de départ</p>
                            <p className="font-medium">{new Date(results.departureDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-500"/>
                        <div>
                            <p className="text-sm text-gray-500">Date d’arrivée estimée</p>
                            <p className="font-medium">{new Date(results.arrivalDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Total Price Card */}
            <Card className="bg-blue-100">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                        <DollarSign className="h-5 w-5"/>
                        Prix Total
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-center text-blue-800">
                        {results.totalPrice ? `${results.totalPrice} €` : "À calculer"}
                    </p>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                    disabled={isActionInProgress}
                    className="flex items-center gap-2 px-8 py-6 text-lg bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleValidate}
                >
                    Valider
                </Button>
                <Button
                    disabled={isActionInProgress}
                    variant="destructive"
                    className="flex items-center gap-2 px-8 py-6 text-lg bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleCancel}
                >
                    Annuler
                </Button>
                <Link href="/client/simulation/edit">
                    <Button
                        onClick={handleEdit}
                        disabled={isActionInProgress}
                        className="flex items-center gap-2 px-8 py-6 text-lg bg-green-500 hover:bg-green-600 text-white"
                    >
                        Modifier ma simulation
                        <ArrowRight className="h-4 w-4"/>
                    </Button>
                </Link>
            </div>
            <LoginPromptModal
                show={showLoginPrompt}
                handleClose={() => setShowLoginPrompt(false)}
                handleLoginRedirect={handleLoginRedirect}
            />
        </div>
    );
}
