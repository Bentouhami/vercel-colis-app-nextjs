'use client';

import React, { useCallback, useEffect, useState } from 'react';
import RequireAuth from '@/components/auth/RequireAuth';
import { toast } from 'react-toastify';
import { getSimulationFromCookie } from '@/lib/simulationCookie';
import { getEnvoiById, updateEnvoiDatas } from '@/services/frontend-services/envoi/EnvoiService';
import { checkAuthStatus } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { deleteSimulationCookie } from '@/services/frontend-services/simulation/SimulationService';
import { DOMAIN } from '@/utils/constants';
import { SimulationStatus } from '@prisma/client';

export default function PaymentSuccessPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [didUpdate, setDidUpdate] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /**
     * Check auth on mount
     */
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            try {
                const authResult = await checkAuthStatus(false);
                setIsAuthenticated(authResult.isAuthenticated);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    /**
     * Finalize the payment process and delete the simulation cookie if conditions are met
     */
    const finalizePayment = useCallback(async () => {
        try {
            setIsLoading(true);

            // 1) Retrieve the simulation
            const simulation = await getSimulationFromCookie();
            if (!simulation) {
                toast.error('Erreur lors de la récupération de la simulation.');
                return;
            }

            // 2) Fetch the envoi
            const envoiResponse = await getEnvoiById(Number(simulation.id));
            if (!envoiResponse) {
                toast.error("Erreur lors de la récupération de l'envoi.");
                return;
            }

            const envoi = envoiResponse;

            // 3) If envoi is fully completed (paid + trackingNumber + qrCodeUrl + COMPLETED)
            if (
                envoi?.paid &&
                envoi?.trackingNumber &&
                envoi?.qrCodeUrl &&
                envoi?.simulationStatus === SimulationStatus.COMPLETED
            ) {
                await deleteSimulationCookie();
                router.push(`${DOMAIN}/client/profile`);
                return;
            }

            console.log("log ====> envoi before updateEnvoisDatas call function in path: src/app/client/payment/payment-success/page.tsx is : ", envoi);
            // 4) Otherwise, update the envoi
            const updatedEnvoiResponse = await updateEnvoiDatas(Number(simulation.id));
            if (!updatedEnvoiResponse) {
                toast.error("Erreur lors de la mise à jour de l'envoi.");
                return;
            }

            // 5) Check if we have enough data to proceed
            if (!envoi?.arrivalAgency?.id || !envoi?.userId) {
                toast.error("Erreur lors de la mise à jour de l'agence.");
                return;
            }

            // 6) Delete the cookie, then redirect
            await deleteSimulationCookie();
            toast.success('Envoi mis à jour avec succès.');
            router.push(`${DOMAIN}/client/profile`);
        } catch (error) {
            console.error('Error in finalizePayment:', error);
            toast.error('Une erreur est survenue lors de la finalisation du paiement.');
        } finally {
            setIsLoading(false);
            setDidUpdate(true);
        }
    }, [router]);

    /**
     * Kick off finalizePayment once user is authenticated (and not already done)
     */
    useEffect(() => {
        if (isAuthenticated && !isLoading && !didUpdate) {
            finalizePayment();
        }
    }, [isAuthenticated, isLoading, didUpdate, finalizePayment]);

    return (
        <RequireAuth>
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-3xl font-bold text-green-600">Paiement Réussi !</h1>
                <p className="mt-4">Merci pour votre paiement. Votre transaction a été complétée avec succès.</p>

                {/* Show a simple spinner while loading */}
                {isLoading && (
                    <div className="mt-8 flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-green-600" />
                        <span className="text-sm text-gray-600">Redirection en cours...</span>
                    </div>
                )}
            </div>
        </RequireAuth>
    );
}
