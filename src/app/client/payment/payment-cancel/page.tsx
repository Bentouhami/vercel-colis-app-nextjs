// path: src/app/client/payment/payment-cancel/page.tsx

'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import RequireAuth from "@/components/auth/RequireAuth";

const PaymentCancelPage = () => {
    const router = useRouter();

    const handleRetry = () => {
        // Redirect to simulation page (or any preferred page)
        router.push('/client/simulation');
    };

    return (
        <RequireAuth>
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <h1 className="text-3xl font-bold text-red-600">Paiement Annulé</h1>
                <p className="mt-4 text-center">
                    Votre transaction a été annulée. Vous pouvez réessayer ou contacter le support en cas de besoin.
                </p>
                <button
                    onClick={handleRetry}
                    className="mt-8 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Réessayer
                </button>
            </div>
        </RequireAuth>
    );
};

export default PaymentCancelPage;
