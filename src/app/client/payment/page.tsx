// path: src/app/client/payment/page.tsx
"use client";
import React, {Suspense, useEffect, useState} from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {Button} from '@/components/ui/button';
import {toast} from 'react-toastify';
import {useSearchParams} from "next/navigation";
import {DOMAIN} from "@/utils/constants";
import axios from "axios";

// Charger la clé publique Stripe depuis les variables d'environnement
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const PaymentContent = () => {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState<number | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const amount = searchParams.get("amount");
        if (amount) {
            setAmount(parseFloat(amount));
        } else {
            toast.error("Erreur : le prix total est introuvable.");
        }
    }, [searchParams]);
    // Fonction pour initier le paiement
    const handlePayment = async () => {
        setLoading(true);

        try {
            // Créer une session de paiement en appelant votre route API
            const response = await axios.post(`${DOMAIN}/api/v1/payment`, {amount: amount}, {
                headers: {'Content-Type': 'application/json'},
            });

            const {id: sessionId} = response.data; // Extract sessionId from response

            // Charger Stripe
            const stripe = await stripePromise;
            const result = await stripe?.redirectToCheckout({sessionId});

            if (result?.error) {
                toast.error("Erreur lors de la redirection vers Stripe : " + result.error.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Paiement de votre commande</h1>
            <p className="mb-8">Cliquez sur le bouton ci-dessous pour finaliser votre paiement.</p>
            <Button onClick={handlePayment} disabled={loading}>
                {loading ? 'Redirection en cours...' : 'Payer maintenant'}
            </Button>
        </div>
    );
};
const PaymentPage = () => {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <PaymentContent/>
        </Suspense>
    );
};
// Correction : Assurez-vous que l'export par défaut est bien le nom du composant
export default PaymentPage;
