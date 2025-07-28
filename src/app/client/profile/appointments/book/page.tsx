// src/app/client/profile/appointments/book/page.tsx

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Calendar } from '@/components/ui/calender';

interface EnvoiInfo {
    id: number
    departureAgencyName: string
    trackingNumber: string
}

export default function BookAppointmentPage() {
    const [date, setDate] = useState<Date | null>(null)
    const [loading, setLoading] = useState(false)
    const [envoi, setEnvoi] = useState<EnvoiInfo | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Récupérer le dernier envoi payé sans rendez-vous
        fetch("/api/client/appointments/envoi-paye")
            .then((res) => res.json())
            .then((data) => {
                if (data?.envoi) {
                    setEnvoi(data.envoi)
                } else {
                    toast.error("Aucun envoi payé en attente de rendez-vous.")
                    router.push("/client/profile/appointments")
                }
            })
    }, [])

    const handleSubmit = async () => {
        if (!date || !envoi) return
        setLoading(true)
        const res = await fetch("/api/client/appointments/book", {
            method: "POST",
            body: JSON.stringify({ envoiId: envoi.id, date }),
        })

        if (res.ok) {
            toast.success("Rendez-vous enregistré avec succès.")
            router.push("/client/profile/appointments")
        } else {
            const err = await res.json()
            toast.error(err.message || "Erreur lors de la création du rendez-vous.")
        }
        setLoading(false)
    }

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <Card>
                <CardHeader>
                    <CardTitle>Prendre rendez-vous pour votre envoi</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {envoi ? (
                            <>Envoi : <strong>{envoi.trackingNumber}</strong> – Agence : <strong>{envoi.departureAgencyName}</strong></>
                        ) : (
                            "Chargement de votre envoi en cours..."
                        )}
                    </p>
                </CardHeader>
                <CardContent>
                    <Calendar
                        mode="single"
                        selected={date ?? undefined}
                        onSelect={setDate}
                        fromDate={new Date()}
                        locale={fr}
                        required
                        className="rounded-md border shadow"
                    />
                    <div className="mt-4 flex justify-end">
                        <Button onClick={handleSubmit} disabled={!date || loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Confirmer le rendez-vous
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
