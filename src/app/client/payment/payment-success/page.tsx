// Path : src/app/client/payment/payment-success/page.tsx
'use client';

import React, {useEffect, useState} from 'react';
import RequireAuth from "@/components/auth/RequireAuth";
import {getSimulationFromCookie} from "@/lib/simulationCookie";
import {toast} from "react-toastify";
import {getEnvoiById, updateEnvoiDatas} from '@/services/frontend-services/envoi/EnvoiService';
import {$Enums} from "@prisma/client";
import SimulationStatus = $Enums.SimulationStatus;

const PaymentSuccessPage = () => {

    const [didUpdate, setDidUpdate] = useState(false);

    useEffect(() => {
        if (didUpdate) {
            // Already updated, so do nothing
            return;
        }
        setDidUpdate(true); // Mark that we've done our update

        const finalizePayment = async () => {
            const simulation = await getSimulationFromCookie();


            if (!simulation) {
                toast.error("Erreur lors de la suppression de la simulation.");
                return;
            }
            // get simulation by id
            const envoi = await getEnvoiById(Number(simulation.id));

            if (!envoi) {
                console.log("log ====> envoi not found from getEnvoiById in PaymentSuccessPage in path: src/app/client/payment/payment-success/page.tsx is : ", envoi);
                toast.error("Erreur lors de la suppression de l'envoi.");
                return;
            }
            console.log("log ====> envoi from getEnvoiById successful in PaymentSuccessPage with id:", envoi);

            if (envoi.trackingNumber &&
                envoi.qrCodeUrl &&
                envoi.paid &&
                (envoi.simulationStatus === SimulationStatus.COMPLETED)) {
                return;
            }
            // 1. Update envoi data (generates tracking, QR code, etc.)
            const updatedEnvoi = await updateEnvoiDatas(Number(simulation.id));
            if (!updatedEnvoi) {
                toast.error("Erreur lors de la mise à jour de l'envoi.");
                return;
            }
            // 2. Complete the payment
            // await completePaymentService();
            toast.success("Envoi mis à jour avec succès.");
            setDidUpdate(true);
        };

        finalizePayment();
    }, [didUpdate]);

    return (
        <RequireAuth>
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-3xl font-bold text-green-600">Paiement Réussi !</h1>
                <p className="mt-4">Merci pour votre paiement. Votre transaction a été complétée avec succès.</p>
            </div>
        </RequireAuth>
    );
};

export default PaymentSuccessPage;

