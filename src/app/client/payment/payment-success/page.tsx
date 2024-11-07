
// Path : src/app/client/payment/page.tsx


import React from 'react';

const PaymentSuccessPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold text-green-600">Paiement Réussi !</h1>
            <p className="mt-4">Merci pour votre paiement. Votre transaction a été complétée avec succès.</p>
        </div>
    );
};

export default PaymentSuccessPage;
