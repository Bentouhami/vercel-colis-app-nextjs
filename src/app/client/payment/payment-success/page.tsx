'use client';

import React, {useCallback, useEffect, useState} from 'react';
import RequireAuth from '@/components/auth/RequireAuth';
import {toast} from 'sonner';
import {getSimulationFromCookie} from '@/lib/simulationCookie';
import {getEnvoiById, updateEnvoiDatas} from '@/services/frontend-services/envoi/EnvoiService';
import {useRouter} from 'next/navigation';
import {deleteSimulationCookie} from '@/services/frontend-services/simulation/SimulationService';
import {SimulationStatus} from '@prisma/client';
import {useSession} from "next-auth/react";
import {RoleDto} from "@/services/dtos";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const {status} = useSession();

    /**
     * Check auth on mount
     */
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            if (status === "authenticated") {
                setIsAuthenticated(true);
                setIsLoading(false);
            }
        };
        checkAuth();
    }, [router, status]);

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
            let envoi = await getEnvoiById(Number(simulation.id));
            if (!envoi) {
                toast.error("Erreur lors de la récupération de l'envoi.");
                return;
            }


            // 3) If envoi is fully completed
            if (
                envoi?.paid &&
                envoi?.trackingNumber &&
                envoi?.qrCodeUrl &&
                envoi?.simulationStatus === SimulationStatus.COMPLETED
            ) {


                await deleteSimulationCookie();
                router.replace("/client/profile");
                return;
            }

            // 4) Update the envoi
            const updateSuccess = await updateEnvoiDatas(Number(simulation.id));

            if (!updateSuccess) {
                toast.error("Erreur lors de la mise à jour de l'envoi.");
                return;
            }

            // 5) Wait briefly to allow the update to propagate
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // 6) Re-fetch the envoi
            envoi = await getEnvoiById(envoi.id!);
            // 7) Delete cookie and redirect
            if (
                envoi?.paid &&
                envoi?.trackingNumber &&
                envoi?.qrCodeUrl &&
                envoi?.simulationStatus === SimulationStatus.COMPLETED
            ) {
                setTimeout(() => {
                    deleteSimulationCookie();
                    router.push("/client/profile");
                }, 2000);
                router.replace("/client/profile");
                return;
            }
        } catch (error) {
            toast.error('Une erreur est survenue lors de la finalisation du paiement.');
        } finally {
            setIsLoading(false);
        }
    }, [router]);


    /**
     * Kick off finalizePayment once a user is authenticated (and not already done)
     */
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            finalizePayment();
        }
    }, [isAuthenticated, isLoading, finalizePayment]);

    return (
        <RequireAuth allowedRoles={[RoleDto.CLIENT, RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT]}>
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-3xl font-bold text-green-600">Paiement Réussi !</h1>
                <p className="mt-4">Merci pour votre paiement. Votre transaction a été complétée avec succès.</p>

                {/* Show a simple spinner while loading */}
                {isLoading && (
                    <div className="mt-8 flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-green-600"/>
                        <span className="text-sm text-gray-600">Redirection en cours...</span>
                    </div>
                )}
            </div>
        </RequireAuth>
    );
}