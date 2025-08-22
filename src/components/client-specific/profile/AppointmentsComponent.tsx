"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Package, X } from "lucide-react"

// Mock data alignée avec ColisApp
const mockAppointments = [
    {
        id: 1,
        trackingCode: "MO-BER-BE-BRU-XHZ835",
        date: "2025-07-25",
        time: "14:00",
        weight: "36 kg",
        agency: "Agence de Berkane",
        status: "scheduled",
        notes: "Préparer l'étiquette et présenter le code d’envoi à l’accueil.",
    },
    {
        id: 2,
        trackingCode: "MO-BER-BE-BRU-XYZ111",
        date: "2025-07-20",
        time: "09:30",
        weight: "44 kg",
        agency: "Agence de Berkane",
        status: "completed",
        notes: "Colis déposé et validé en agence.",
    },
    {
        id: 3,
        trackingCode: "MO-BER-BE-BRU-ZZZ999",
        date: "2025-07-22",
        time: "10:00",
        weight: "50 kg",
        agency: "Agence de Nador",
        status: "cancelled",
        notes: "Client absent, rendez-vous annulé.",
    },
]

const statusConfig = {
    scheduled: { label: "Prévu", color: "bg-yellow-100 text-yellow-800" },
    completed: { label: "Effectué", color: "bg-green-100 text-green-800" },
    cancelled: { label: "Annulé", color: "bg-red-100 text-red-800" },
}

export default function AppointmentsComponent() {
    const [appointments] = useState(mockAppointments)

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Rendez-vous</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Retrouvez vos rendez-vous pour déposer vos colis dans l’agence choisie.
                </p>
            </div>

            {appointments.map((apt) => {
                const status = statusConfig[apt.status as keyof typeof statusConfig]
                return (
                    <Card key={apt.id} className="border-l-4 border-l-indigo-500">
                        <CardContent className="p-6">
                            <div className="flex justify-between gap-4 flex-wrap">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Package className="h-5 w-5 text-indigo-600" />
                                        <h2 className="font-semibold text-gray-900 dark:text-white">{apt.trackingCode}</h2>
                                        <Badge className={status.color}>{status.label}</Badge>
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>{formatDate(apt.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>{apt.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>{apt.agency}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4" />
                                            <span>{apt.weight}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{apt.notes}</p>
                                </div>

                                <div className="flex flex-col gap-2 mt-2">
                                    {apt.status === "scheduled" && (
                                        <>
                                            <Button size="sm" variant="default">Confirmer l’arrivée</Button>
                                            <Button size="sm" variant="outline">Replanifier</Button>
                                            <Button size="sm" variant="outline" className="text-red-600">
                                                <X className="w-4 h-4 mr-1" /> Annuler
                                            </Button>
                                        </>
                                    )}
                                    {apt.status === "completed" && (
                                        <Button size="sm" variant="ghost" disabled>
                                            Déjà effectué
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
