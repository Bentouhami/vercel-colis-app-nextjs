// Path : src/app/client/payment/payment-cancel/page.tsx

import React from 'react';

const PaymentCancelPage = () => {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold text-red-600">Paiement Annulé</h1>
            <p className="mt-4">Votre transaction a été annulée. Vous pouvez réessayer ou contacter le support si besoin.</p>
        </div>
    );
};

export default PaymentCancelPage;
