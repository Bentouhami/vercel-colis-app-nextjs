"use client";

import React, {useEffect, useState} from "react";
import {getCurrentUserId} from "@/lib/auth";
import {fetchUserDeliveries} from "@/services/frontend-services/envoi/EnvoiService";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {CalendarDays, CheckCircle, Euro, MapPin, Package, XCircle} from "lucide-react";

export default function DeliveriesList() {
    const [deliveries, setDeliveries] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const userId = await getCurrentUserId();

            console.log("log ====> connected user's id in path client-specific/profile/DeliveriesList.tsx is :", userId);

            if (!userId) return;
            const data = await fetchUserDeliveries(userId);
            console.log("log ====> data returned from fetchUserDeliveries function in path client-specific/profile/DeliveriesList.tsx is : ", data);

            setDeliveries(data);
        })();
    }, []);

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.isArray(deliveries) && deliveries.length > 0 ? (
                deliveries.map((delivery) => (
                    <Card key={delivery.id} className="shadow-lg border rounded-lg">
                        <CardHeader
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-5 rounded-t-lg">
                            <div className="flex items-start justify-between w-full">
                                {/* Left side: tracking & status & date stacked */}
                                <div className="flex flex-col space-y-1">
                                    {/* Tracking number */}
                                    <CardTitle className="text-lg">
                                        📦 {delivery.trackingNumber}
                                    </CardTitle>

                                    {/* Envoi status */}

                                    <Badge
                                        className={`mx-auto ${
                                            delivery.envoiStatus === "DELIVERED" ? "bg-green-500" : "bg-yellow-500"
                                        }`}
                                    >
                                        {delivery.envoiStatus}
                                    </Badge>



                                    {/* Date in French format */}
                                    <span
                                        className="mx-auto text-xs">{new Date(delivery.createdAt).toLocaleDateString("fr-FR", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}</span>
                                </div>
                            </div>
                        </CardHeader>


                        <CardContent className="p-5 space-y-3">
                            <div className="flex items-center space-x-2">
                                <MapPin className="text-blue-500" size={20}/>
                                <p className="font-semibold">Departure: {delivery.departureAgency}</p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <MapPin className="text-purple-500" size={20}/>
                                <p className="font-semibold">Arrival: {delivery.arrivalAgency}</p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Package className="text-gray-600" size={20}/>
                                <p className="font-semibold">Weight: {delivery.totalWeight} kg</p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Euro className="text-gray-600" size={20}/>
                                <p className="font-semibold">Total Price: {delivery.totalPrice} €</p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <CalendarDays className="text-green-500" size={20}/>
                                <p className="font-semibold">Departure: {new Date(delivery.departureDate).toLocaleDateString()}</p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <CalendarDays className="text-red-500" size={20}/>
                                <p className="font-semibold">Arrival: {new Date(delivery.arrivalDate).toLocaleDateString()}</p>
                            </div>

                            <div className="flex items-center space-x-2">
                                {delivery.paid ? (
                                    <CheckCircle className="text-green-500" size={20}/>
                                ) : (
                                    <XCircle className="text-red-500" size={20}/>
                                )}
                                <p className="font-semibold">Paid: {delivery.paid ? "Yes" : "No"}</p>
                            </div>
                        </CardContent>

                        <CardFooter className="p-5 border-t flex justify-between">
                            <span className="text-gray-600 font-bold">Destinataire: {delivery.destinataire}</span>
                            <Button variant="outline" onClick={() => console.log("Clicked")}>
                                Details
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <p className="text-gray-500 text-center col-span-full">No deliveries found</p>
            )}
        </div>
    );
}
