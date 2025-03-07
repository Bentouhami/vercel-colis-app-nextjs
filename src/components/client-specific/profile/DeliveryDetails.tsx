"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EnvoisListDto } from "@/services/dtos";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, CheckCircle, Euro, MapPin, Package, XCircle } from "lucide-react";

export default function DeliveryDetails({ delivery }: { delivery: EnvoisListDto }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Voir</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-full">
                <DialogHeader>
                    <DialogTitle>Détails de l&#39;Envoi 📦</DialogTitle>
                    <DialogDescription>
                        Voici toutes les informations concernant votre envoi.
                    </DialogDescription>
                </DialogHeader>
                <Card className="shadow-lg border rounded-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-t-lg">
                        <div className="flex flex-col space-y-1 w-full">
                            <CardTitle className="text-lg">📦 {delivery.trackingNumber}</CardTitle>
                            <Badge
                                className={`mx-auto ${
                                    delivery.envoiStatus === "DELIVERED" ? "bg-green-500" : "bg-yellow-500"
                                }`}
                            >
                                {delivery.envoiStatus}
                            </Badge>
                            <span className="mx-auto text-xs">
                                {new Date(delivery.createdAt).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 space-y-2">
                        <div className="flex items-center space-x-2">
                            <MapPin className="text-blue-500" size={20} />
                            <p className="font-semibold">Départ: {delivery.departureAgency}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="text-purple-500" size={20} />
                            <p className="font-semibold">Arrivée: {delivery.arrivalAgency}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Package className="text-gray-600" size={20} />
                            <p className="font-semibold">Poids: {delivery.totalWeight} kg</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Euro className="text-gray-600" size={20} />
                            <p className="font-semibold">Prix total: {delivery.totalPrice} €</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CalendarDays className="text-green-500" size={20} />
                            <p className="font-semibold">Départ: {new Date(delivery.departureDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CalendarDays className="text-red-500" size={20} />
                            <p className="font-semibold">Arrivée: {new Date(delivery.arrivalDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {delivery.paid ? (
                                <CheckCircle className="text-green-500" size={20} />
                            ) : (
                                <XCircle className="text-red-500" size={20} />
                            )}
                            <p className="font-semibold">Payé: {delivery.paid ? "Oui" : "Non"}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="p-2 border-t flex justify-between w-full">
                        <span className="text-gray-600 font-bold">Destinataire: {delivery.destinataire}</span>
                    </CardFooter>
                </Card>
            </DialogContent>
        </Dialog>
    );
}
