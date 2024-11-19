// Path : src/app/client/payment/page.tsx
'use client';

import React, {useEffect} from 'react';

import {completePaymentService} from "@/services/frontend-services/payment/paymentService";

const PaymentSuccessPage = () => {


    useEffect(() => {
        const deleteSimulation = async () => {
            await completePaymentService();
            // await deleteSimulationCookie();
        };
        deleteSimulation();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold text-green-600">Paiement Réussi !</h1>
            <p className="mt-4">Merci pour votre paiement. Votre transaction a été complétée avec succès.</p>

        </div>
    );
};

export default PaymentSuccessPage;

