"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Plus, Video, Phone, User } from "lucide-react"

// Mock data
const mockAppointments = [
    {
        id: 1,
        title: "Consultation envoi international",
        date: "2024-01-25",
        time: "14:30",
        duration: "30 min",
        type: "video",
        status: "confirmed",
        consultant: "Marie Dubois",
        location: "Visioconférence",
        description: "Discussion sur les options d'envoi vers l'Asie",
    },
    {
        id: 2,
        title: "Rendez-vous en agence",
        date: "2024-01-28",
        time: "10:00",
        duration: "45 min",
        type: "in_person",
        status: "pending",
        consultant: "Jean Martin",
        location: "Agence Bruxelles Centre",
        description: "Signature de contrat entreprise",
    },
    {
        id: 3,
        title: "Appel téléphonique",
        date: "2024-01-30",
        time: "16:00",
        duration: "15 min",
        type: "phone",
        status: "completed",
        consultant: "Sophie Laurent",
        location: "Téléphone",
        description: "Suivi commande spéciale",
    },
]

const statusConfig = {
    pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Confirmé", color: "bg-green-100 text-green-800" },
    completed: { label: "Terminé", color: "bg-blue-100 text-blue-800" },
    cancelled: { label: "Annulé", color: "bg-red-100 text-red-800" },
}

const typeConfig = {
    video: { label: "Visioconférence", icon: Video, color: "text-blue-600" },
    phone: { label: "Téléphone", icon: Phone, color: "text-green-600" },
    in_person: { label: "En personne", icon: User, color: "text-purple-600" },
}

export default function AppointmentsComponent() {
    const [appointments] = useState(mockAppointments)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mes Rendez-vous</h1>
                    <p className="text-gray-600 dark:text-gray-400">Gérez vos rendez-vous et consultations</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Prendre rendez-vous
                </Button>
            </div>

            {/* Upcoming Appointments */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Rendez-vous à venir</h2>
                <div className="space-y-4">
                    {appointments
                        .filter((apt) => apt.status !== "completed")
                        .map((appointment) => {
                            const statusInfo = statusConfig[appointment.status as keyof typeof statusConfig]
                            const typeInfo = typeConfig[appointment.type as keyof typeof typeConfig]
                            const TypeIcon = typeInfo.icon

                            return (
                                <Card key={appointment.id} className="border-l-4 border-l-indigo-500">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                                                    <TypeIcon className={`h-5 w-5 ${typeInfo.color}`} />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{appointment.title}</h3>
                                                        <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{new Date(appointment.date).toLocaleDateString("fr-FR")}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4" />
                                                            <span>
                                                                {appointment.time} ({appointment.duration})
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>{appointment.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4" />
                                                            <span>{appointment.consultant}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {appointment.status === "confirmed" && (
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                        Rejoindre
                                                    </Button>
                                                )}
                                                <Button variant="outline" size="sm">
                                                    Modifier
                                                </Button>
                                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                                                    Annuler
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                </div>
            </div>

            {/* Past Appointments */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Historique</h2>
                <div className="space-y-4">
                    {appointments
                        .filter((apt) => apt.status === "completed")
                        .map((appointment) => {
                            const typeInfo = typeConfig[appointment.type as keyof typeof typeConfig]
                            const TypeIcon = typeInfo.icon

                            return (
                                <Card key={appointment.id} className="opacity-75">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                                    <TypeIcon className="h-5 w-5 text-gray-500" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{appointment.title}</h3>
                                                        <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        <p>
                                                            {new Date(appointment.date).toLocaleDateString("fr-FR")} à {appointment.time}
                                                        </p>
                                                        <p>Avec {appointment.consultant}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Voir le résumé
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}
