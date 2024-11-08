// path: src/app/api/payment/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import {DOMAIN} from "@/utils/constants";


// Utilisez une version d'API valide
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-10-28.acacia', // Version d'API compatible avec votre version de bibliothèque
});

export async function POST(req: Request) {
    try {
        const { amount } = await req.json();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: { name: 'Envoi de colis' },
                        unit_amount: Math.round(amount * 100), // Arrondir pour obtenir un entier
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${DOMAIN}/client/payment/payment-success`,
            cancel_url: `${DOMAIN}/client/payment/payment-cancel`,
        });

        return NextResponse.json({ id: session.id });
    } catch (error) {
        console.error('Erreur lors de la création de la session Stripe:', error);
        return new NextResponse('Erreur de paiement', { status: 500 });
    }
}
