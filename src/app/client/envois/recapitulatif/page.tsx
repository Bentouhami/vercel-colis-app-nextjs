// path: src/app/client/envois/recapitulatif/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { getSimulationByIdAndToken } from "@/services/frontend-services/simulation/SimulationService";
import { getUserById } from "@/services/frontend-services/UserService";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Calendar, MapPin, User, Truck, Weight, DollarSign, CreditCard, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {BaseDestinataireDto, DestinataireResponseDto, FullSimulationDto, UserResponseDto} from "@/utils/dtos";


interface SimulationDataType extends FullSimulationDto {
    sender: BaseDestinataireDto;
    destinataire: BaseDestinataireDto;
}
export default function RecapitulatifPage() {
    const [simulationData, setSimulationData] = useState<SimulationDataType | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const getSimulation = async () => {
            try {
                const data = await getSimulationByIdAndToken();

                console.log("log ====> data in RecapitulatifPage.tsx: ", data);

                if (!data) {
                    toast.error("Impossible de trouver les données de simulation. réessayer ou contacter le support.");
                    setLoading(false);
                    return;
                }

                if (!data.userId || !data.destinataireId) {
                    toast.error("Données utilisateur manquantes.");
                    setLoading(false);
                    return;
                }

                const [senderData, destinataireData] = await Promise.all([
                    getUserById(data.userId),
                    getUserById(data.destinataireId)
                ]) as [BaseDestinataireDto, BaseDestinataireDto];

                if (!senderData || !destinataireData) {
                    toast.error("Impossible de récupérer les données utilisateur.");
                    setLoading(false);
                    return;
                }

                setSimulationData({
                    ...data,
                    sender: senderData,
                    destinataire: destinataireData
                });
            } catch (error) {
                toast.error("Une erreur est survenue lors du chargement des données.");
            } finally {
                setLoading(false);
            }
        };
        getSimulation();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!simulationData) {
        return (
            <Alert className="max-w-2xl mx-auto mt-8">
                <AlertDescription>
                    Aucune donnée de simulation n&#39;a été trouvée. Veuillez réessayer ou contacter le support.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6 mb-52 bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Récapitulatif de votre envoi</h1>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-blue-500 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-700">
                            <User className="h-5 w-5 text-blue-500" />
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
                            <User className="h-5 w-5 text-green-500" />
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
                            <MapPin className="h-5 w-5 text-yellow-500" />
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
                            <MapPin className="h-5 w-5 text-red-500" />
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
                        <Package className="h-5 w-5 text-blue-500" />
                        Détails de l&#39;envoi
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-500">Nombre de colis</p>
                            <p className="font-medium">{simulationData.parcels?.length || 0}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Weight className="h-5 w-5 text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-500">Poids total</p>
                            <p className="font-medium">{simulationData.totalWeight} kg</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-500">Date de départ</p>
                            <p className="font-medium">{new Date(simulationData.departureDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-gray-500" />
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
                        <DollarSign className="h-5 w-5" />
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
                <Button className="flex items-center gap-2 px-8 py-6 text-lg bg-green-500 hover:bg-green-600 text-white">
                    <CreditCard className="h-5 w-5" />
                    Payer maintenant
                </Button>
                <Button variant="destructive" className="flex items-center gap-2 px-8 py-6 text-lg text-white bg-red-500 hover:bg-red-600">
                    <XCircle className="h-5 w-5" />
                    Annuler
                </Button>
            </div>
        </div>
    );
}
