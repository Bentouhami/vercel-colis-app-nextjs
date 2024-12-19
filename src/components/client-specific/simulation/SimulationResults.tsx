// path: src/app/client/simulation/results/page.tsx
"use client";
import {useRouter} from 'next/navigation';
import React, {useEffect, useState, useTransition} from 'react';
import {toast, ToastContainer} from 'react-toastify';
import {deleteSimulationCookie, getSimulation} from "@/services/frontend-services/simulation/SimulationService";
import {SimulationResponseDto} from "@/services/dtos";
import LoginPromptModal from '@/components/modals/LoginPromptModal';
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowRight, Calendar, DollarSign, MapPin, Package, Weight} from "lucide-react";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {updateSimulationUserId} from "@/services/backend-services/Bk_SimulationService";
import {checkAuthStatus} from "@/lib/auth";

export default function SimulationResults() {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [results, setResults] = useState<SimulationResponseDto | null>(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const authResult = await checkAuthStatus(false);
            setIsAuthenticated(authResult.isAuthenticated);
            setUserId(authResult.userId || null);
        };
        checkAuth();
    }, []);
    // get simulation results from the backend and set them in the state variable results when available or redirect to the simulation page if not
    useEffect(() => {
        const getSimulationResults = async () => {
            try {

                const simulationData = await getSimulation();

                if (!simulationData) {
                    toast.error("Something went wrong, please try again.");
                    setTimeout(() => {
                        router.push("/client/simulation");
                    }, 3000);
                }
                toast.success("Simulation results loaded successfully.");

                console.log("log ====> simulationData in SimulationResults.tsx after calling getSimulationById function: ", simulationData);

                setResults(simulationData);

            } catch (error) {
                toast.error("Erreur de chargement des résultats.");
            }
        };
        getSimulationResults();
    }, [router]);



    /**
     * handle edit current simulation user id updating and redirecting to the add destinataire page
     */
    const handleValidate = async () => {
        startTransition(() => {
            (async () => {
                try {
                    // Check if the user is authenticated
                    const authResult = await checkAuthStatus();
                    if (authResult.isAuthenticated) {
                    // Check if the results object is not empty
                        if (results) {
                            if (authResult.userId && !results.userId) {
                                results.userId = Number(authResult.userId);
                                await updateSimulationUserId(results.id, results.userId);
                            }
                            toast("Redirecting to add destinataire page in 3 seconds...");
                            setTimeout(() => {
                                router.push("/client/simulation/ajouter-destinataire");
                            }, 3000);
                        }
                    } else {
                        setShowLoginPrompt(true);
                    }
                } catch (error) {
                    console.error("Error validating simulation:", error);
                    toast.error("An error occurred while validating the simulation.");
                    1
                }
            })();
        });
    };


    const handleLoginRedirect = () => {
        setShowLoginPrompt(false);
        const redirectUrl = encodeURIComponent('/client/simulation/results');
        router.push(`/client/auth/login?redirect=${redirectUrl}`);
    };

    const handleCancel = () => {

        startTransition(() => {
            (async () => {
                try {

                    toast.success("Cleaning up simulation...");

                    const response = await deleteSimulationCookie();
                    if (!response) {
                        toast.error("Une erreur est survenue lors de la suppression de la simulation.");
                        return;
                    }
                } catch (error) {
                    console.error("Error deleting simulation cookie:", error);
                    toast.error("An error occurred while cleaning up the simulation.");
                } finally {
                    toast("Redirecting to simulation page in 3 seconds...");

                    setTimeout(() => {
                        router.push('/client/simulation');
                    }, 3000);
                }
            })();
        });
    };


    /**
     * handle edit current simulation user id updating
     * and redirecting to the edit simulation page
     */
    const handleEdit = async () => {
        startTransition(() => {
            (async () => {
                try {
                    const authResult = await checkAuthStatus();

                    if (authResult.isAuthenticated) {
                        if (results) {
                            if (authResult.userId && !results.userId) {
                                results.userId = Number(authResult.userId);
                                const response = await updateSimulationUserId(results.id, results.userId);

                                if (!response) {
                                    toast.error("Une erreur est survenue lors de la mise à jour de la simulation.");
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error updating simulation:", error);
                    toast.error("Une erreur est survenue lors de la mise à jour de la simulation.");
                } finally {
                    toast("Redirection en cours...");
                    setTimeout(() => {
                        router.push('/client/simulation/edit');
                    }, 3000);
                }
            })();
        });
    };

    // render the loading spinner if the results are not available
    if (!results) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }


    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6 mb-52 bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Résultats de la Simulation</h1>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-blue-500 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-700">
                            <MapPin className="h-5 w-5 text-blue-500"/>
                            Départ
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><span className="font-medium">Pays:</span> {results.departureCountry}</p>
                        <p><span className="font-medium">Ville:</span> {results.departureCity}</p>
                        <p><span className="font-medium">Agence:</span> {results.departureAgency}</p>
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
                        <p><span className="font-medium">Pays:</span> {results.destinationCountry}</p>
                        <p><span className="font-medium">Ville:</span> {results.destinationCity}</p>
                        <p><span className="font-medium">Agence:</span> {results.destinationAgency}</p>
                    </CardContent>
                </Card>
            </div>

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
                            <p><span className="font-medium">Colis {index + 1}:</span></p>
                            <p>Hauteur: {pkg.height} cm</p>
                            <p>Largeur: {pkg.width} cm</p>
                            <p>Longueur: {pkg.length} cm</p>
                            <p>Poids: {pkg.weight} kg</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

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
                            <p className="text-sm text-gray-500">Date d&#39;arrivée estimée</p>
                            <p className="font-medium">{new Date(results.arrivalDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-blue-100">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                        <DollarSign className="h-5 w-5"/>
                        Prix Total
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-center text-blue-800">
                        {results.totalPrice ? `${results.totalPrice} €` : 'À calculer'}
                    </p>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                    disabled={isPending}
                    className="flex items-center gap-2 px-8 py-6 text-lg bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleValidate}>
                    Valider
                </Button>
                <Button
                    disabled={isPending}
                    variant="destructive"
                    className="flex items-center gap-2 px-8 py-6 text-lg text-white bg-red-500 hover:bg-red-600"
                    onClick={handleCancel}>
                    Annuler
                </Button>


                <Link href={`/client/simulation/edit`}>
                    <Button
                        onClick={handleEdit}
                        disabled={isPending}
                        className="flex items-center gap-2 px-8 py-6 text-lg bg-green-500 hover:bg-green-600 text-white">
                        Modifier ma simulation
                        <ArrowRight className="h-4 w-4"/>
                    </Button>
                </Link>

            </div>
            <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar theme="colored"/>
            <LoginPromptModal
                show={showLoginPrompt}
                handleClose={() => setShowLoginPrompt(false)}
                handleLoginRedirect={handleLoginRedirect}
            />
        </div>
    );
}
