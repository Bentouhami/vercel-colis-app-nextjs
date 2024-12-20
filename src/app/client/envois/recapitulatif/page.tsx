// path: src/app/client/envois/recapitulatif/page.tsx

'use client';
import React, {useEffect, useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {getSimulation} from "@/services/frontend-services/simulation/SimulationService";
import {getUserById} from "@/services/frontend-services/UserService";
import {toast} from "react-toastify";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Calendar, CreditCard, DollarSign, MapPin, Package, Truck, User, Weight, XCircle} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {CreateDestinataireDto, SimulationResponseDto} from "@/services/dtos";
import RequireAuth from "@/components/auth/RequireAuth";
import RecapSkeleton from "@/app/client/envois/recapitulatif/recapSkeleton";

interface SimulationDataType extends SimulationResponseDto {
    sender: CreateDestinataireDto;
    destinataire: CreateDestinataireDto;
}

export default function RecapitulatifPage() {
    const [simulationData, setSimulationData] = useState<SimulationDataType | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const getSimulationEffect = async () => {
            startTransition(() => {
                (async () => {

                    try {

                        const simulation = await getSimulation();
                        console.log("log ====> data in RecapitulatifPage.tsx: ", simulation);

                        if (!simulation) {
                            toast.error("Impossible de trouver les données de simulation. Réessayez ou contactez le support.");
                            setLoading(false);
                            return;
                        }

                        if (!simulation.userId || !simulation.destinataireId) {
                            toast.error("Données utilisateur manquantes.");
                            setTimeout(() => {
                                router.push("/client/simulation");
                            }, 3000);
                            setLoading(false);
                            return;
                        }

                        const [senderData, destinataireData] = await Promise.all([
                            getUserById(simulation.userId),
                            getUserById(simulation.destinataireId),
                        ]) as [CreateDestinataireDto, CreateDestinataireDto];

                        if (!senderData || !destinataireData) {
                            toast.error("Impossible de récupérer les données utilisateur.");
                            setLoading(false);
                            return;
                        }


                        setSimulationData({
                            ...simulation,
                            sender: senderData,
                            destinataire: destinataireData,
                        });
                    } catch (error) {
                        toast.error("Une erreur est survenue lors du chargement des données.");
                    } finally {
                        setLoading(false);
                    }
                })();
            })
        };
        getSimulationEffect();
    }, [router]);

    if (loading) {
        return <RecapSkeleton/>;
    }

    if (!simulationData) {

        return <RecapSkeleton/>;


    }

    const handlePaymentRedirect = () => {
        if (simulationData?.totalPrice) {


            // Navigate to payment page with totalPrice as a query parameter
            router.push(`/client/payment?amount=${simulationData.totalPrice}`);
        } else {
            toast.error("Le prix total est manquant.");
        }
    };

    return (
        <RequireAuth>
            <div className="max-w-4xl mx-auto p-6 space-y-6 mb-52 bg-gray-50 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Récapitulatif de votre envoi</h1>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-l-4 border-blue-500 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-700">
                                <User className="h-5 w-5 text-blue-500"/>
                                Expéditeur
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-medium">
                                {simulationData.sender.firstName} {simulationData.sender.lastName}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-green-500 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-700">
                                <User className="h-5 w-5 text-green-500"/>
                                Destinataire
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-medium">
                                {simulationData.destinataire.firstName} {simulationData.destinataire.lastName}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-yellow-500 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-700">
                                <MapPin className="h-5 w-5 text-yellow-500"/>
                                Point de départ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p><span className="font-medium">Pays:</span> {simulationData.departureCountry}</p>
                            <p><span className="font-medium">Ville:</span> {simulationData.departureCity}</p>
                            <p><span className="font-medium">Agence:</span> {simulationData.departureAgency}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-red-500 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-700">
                                <MapPin className="h-5 w-5 text-red-500"/>
                                Point d&#39;arrivée
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p><span className="font-medium">Pays:</span> {simulationData.destinationCountry}</p>
                            <p><span className="font-medium">Ville:</span> {simulationData.destinationCity}</p>
                            <p><span className="font-medium">Agence:</span> {simulationData.destinationAgency}</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6 bg-blue-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-500"/>
                            Détails de l&#39;envoi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-gray-500"/>
                            <div>
                                <p className="text-sm text-gray-500">Nombre de colis</p>
                                <p className="font-medium">{simulationData.parcels?.length || 0}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Weight className="h-5 w-5 text-gray-500"/>
                            <div>
                                <p className="text-sm text-gray-500">Poids total</p>
                                <p className="font-medium">{simulationData.totalWeight} kg</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-500"/>
                            <div>
                                <p className="text-sm text-gray-500">Date de départ</p>
                                <p className="font-medium">{new Date(simulationData.departureDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Truck className="h-5 w-5 text-gray-500"/>
                            <div>
                                <p className="text-sm text-gray-500">Date d&#39;arrivée estimée</p>
                                <p className="font-medium">{new Date(simulationData.arrivalDate).toLocaleDateString()}</p>
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
                            {simulationData.totalPrice ? `${simulationData.totalPrice} €` : 'À calculer'}
                        </p>
                    </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    {/* Bouton Payer maintenant */}
                    <Button
                        className="flex items-center gap-2 px-8 py-6 text-lg bg-green-500 hover:bg-green-600 text-white"
                        onClick={handlePaymentRedirect}
                    >
                        <CreditCard className="h-5 w-5"/>
                        Payer maintenant
                    </Button>
                    {/* Bouton Annuler */}
                    <Button variant="destructive"
                            className="flex items-center gap-2 px-8 py-6 text-lg text-white bg-red-500 hover:bg-red-600">
                        <XCircle className="h-5 w-5"/>
                        Annuler
                    </Button>
                </div>
            </div>
        </RequireAuth>
    );
}