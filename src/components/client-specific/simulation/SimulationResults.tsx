// path: src/app/client/simulation/results/page.tsx
"use client";
import {useRouter, useSearchParams} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {
    getSimulation,
    updateSimulation
} from "@/services/frontend-services/simulation/SimulationService";
import {SimulationDto} from "@/services/dtos";
import LoginPromptModal from '@/components/modals/LoginPromptModal';
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowRight, Calendar, DollarSign, MapPin, Package, Weight} from "lucide-react";
import {useSession} from "next-auth/react";
import Link from "next/link";


export default function SimulationResults() {
    // get current user session
    const {data: session, status} = useSession();
    const searchParams = useSearchParams();
    // check if the user is authenticated and set the userId state variable
    const isAuthenticated = status === "authenticated";
    const userId = session?.user?.id || null

    const router = useRouter();

    const [results, setResults] = useState<SimulationDto | null>(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);


    // get simulation results from the backend and set them in the state variable results when available or redirect to the simulation page if not
    useEffect(() => {
        const getSimulationResults = async () => {
            try {
                const simulationData = await getSimulation();
                if (!simulationData) {
                    router.push('/client/simulation');
                    return;
                }

                console.log("log ====> simulationData returned from saveSimulation function in SimulationResults.tsx: ", simulationData);

                setResults(simulationData);
            } catch (error) {
                toast.error("Erreur de chargement des résultats.");
            }
        };
        getSimulationResults();
    }, [searchParams, router]);


    const handleValidate = async () => {
        if (isAuthenticated && userId && results?.userId) {
            console.log("log ====> userId : ", userId)

            console.log("log ====> userId found and in handleValidate function in SimulationResults.tsx: ", userId);

            results.userId = Number(userId) || null;

            console.log("log ====> results in handleValidate function in SimulationResults.tsx before calling updateSimulationWithSenderAndDestinataireIds function: ", results);
            await updateSimulation(results);

            router.push('/client/ajouter-destinataire');

        } else {
            setShowLoginPrompt(true);
        }
    };

    const handleLoginRedirect = () => {
        setShowLoginPrompt(false);
        const redirectUrl = encodeURIComponent('/client/simulation/results');
        router.push(`/client/auth/login?redirect=${redirectUrl}`);
    };

    const handleCancel = () => {
        localStorage.removeItem('simulationResults');
        router.push('/client/simulation');
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

            <Link href="/client/simulation/results/edit">
                <Button
                    className="flex items-center gap-2 px-8 py-6 text-lg bg-green-500 hover:bg-green-600 text-white">
                    Modifier la simulation
                    <ArrowRight className="h-4 w-4"/>
                </Button>
            </Link>


            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                    className="flex items-center gap-2 px-8 py-6 text-lg bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleValidate}>
                    Valider
                </Button>
                <Button variant="destructive"
                        className="flex items-center gap-2 px-8 py-6 text-lg text-white bg-red-500 hover:bg-red-600"
                        onClick={handleCancel}>
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
