// path: src/components/forms/SimulationForms/MultiStepSimulationForm.tsx

'use client';

import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

// Services
import { deleteSimulationCookie, submitSimulation } from "@/services/frontend-services/simulation/SimulationService";
import { simulationRequestSchema } from "@/utils/validationSchema";
import { SimulationDtoRequest } from "@/services/dtos";
import { useApi } from '@/hooks/useApi';
import SimulationConfirmationModal from "@/components/modals/SimulationConfirmationModal";
import SimulationSkeleton from "@/app/client/simulation/SimulationSkeleton";
import { checkAuthStatus } from "@/lib/auth-utils";
import { getSimulationFromCookie } from "@/lib/simulationCookie";
import { updateSimulationUserId } from "@/services/backend-services/Bk_SimulationService";

// Step Components (to be created/refactored)
import DepartureFormStep from './DepartureFormStep';
import DestinationFormStep from './DestinationFormStep';
import ParcelFormStep from './ParcelFormStep';
import ReviewSubmitStep from './ReviewSubmitStep';

const MultiStepSimulationForm = () => {
    const router = useRouter();
    const { call } = useApi();
    const [isPending, startTransition] = useTransition();

    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | number | null>(null);
    const [simulationConfirmationModal, setSimulationConfirmationModal] = useState(false);

    // Form states
    const [departure, setDeparture] = useState({
        country: '',
        city: '',
        agencyName: ''
    });
    const [destination, setDestination] = useState({
        country: '',
        city: '',
        agencyName: ''
    });
    const [parcels, setParcels] = useState([{ height: 0, width: 0, length: 0, weight: 0 }]);
    const [packageCount, setPackageCount] = useState(1); // For parcel step

    // Options for select fields
    const [options, setOptions] = useState({
        countries: [] as { id: number; name: string }[],
        destinationCountries: [] as { id: number; name: string }[],
        departureCities: [] as { id: number; name: string }[],
        departureAgencies: [] as { id: number; name: string }[],
        destinationCities: [] as { id: number; name: string }[],
        destinationAgencies: [] as { id: number; name: string }[],
    });

    // Auth and existing simulation check
    React.useEffect(() => {
        const checkAuthAndSimulation = async () => {
            const authResult = await checkAuthStatus(false);
            setIsAuthenticated(authResult.isAuthenticated);
            setUserId(authResult.userId || null);

            try {
                const simulationCookie = await getSimulationFromCookie();
                const simulationData = await call(() => getSimulationFromCookie()); // Use call for API service
                if (simulationCookie) {
                    if (simulationData && !simulationData?.id && isAuthenticated && userId) {
                        await updateSimulationUserId(simulationCookie.id, Number(userId));
                    }
                    setSimulationConfirmationModal(true);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error checking for existing simulation:', error);
                setLoading(false);
            }
        };
        checkAuthAndSimulation();
    }, [isAuthenticated, userId, call]);

    const handleKeepSimulation = () => {
        setSimulationConfirmationModal(false);
        toast.success("Continuing with simulation...");
        setTimeout(() => {
            router.push("/client/simulation/results");
        }, 1500);
    };

    const handleCreateNewSimulation = async () => {
        setSimulationConfirmationModal(false);
        toast.success("Deleting existing simulation...");
        await deleteSimulationCookie();
        router.refresh();
    };

    const steps = [
        {
            title: "Informations de Départ",
            component: (
                <DepartureFormStep
                    departure={departure}
                    setDeparture={setDeparture}
                    options={options}
                    setOptions={setOptions}
                />
            ),
            validation: () => {
                // Basic validation for departure step
                if (!departure.country || !departure.city || !departure.agencyName) {
                    toast.error("Veuillez remplir toutes les informations de départ.");
                    return false;
                }
                return true;
            }
        },
        {
            title: "Informations de Destination",
            component: (
                <DestinationFormStep
                    destination={destination}
                    setDestination={setDestination}
                    options={options}
                    setOptions={setOptions}
                    departure={departure} // Pass the entire departure object
                />
            ),
            validation: () => {
                // Basic validation for destination step
                if (!destination.country || !destination.city || !destination.agencyName) {
                    toast.error("Veuillez remplir toutes les informations de destination.");
                    return false;
                }
                return true;
            }
        },
        {
            title: "Informations des Colis",
            component: (
                <ParcelFormStep
                    parcels={parcels}
                    setParcels={setParcels}
                    packageCount={packageCount}
                    setPackageCount={setPackageCount}
                />
            ),
            validation: () => {
                // Basic validation for parcels step
                if (parcels.some(p => p.height <= 0 || p.width <= 0 || p.length <= 0 || p.weight <= 0)) {
                    toast.error("Veuillez saisir des dimensions et un poids valides pour tous les colis.");
                    return false;
                }
                return true;
            }
        },
        {
            title: "Révision et Soumission",
            component: (
                <ReviewSubmitStep
                    departure={departure}
                    destination={destination}
                    parcels={parcels}
                />
            ),
            validation: () => true // No specific validation needed for review step, as previous steps are validated
        }
    ];

    const handleNext = () => {
        if (steps[currentStep].validation()) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const simulationData: SimulationDtoRequest = {
            departureCountry: departure.country,
            departureCity: departure.city,
            departureAgency: departure.agencyName,
            destinationCountry: destination.country,
            destinationCity: destination.city,
            destinationAgency: destination.agencyName,
            parcels,
        };

        const validated = simulationRequestSchema.safeParse(simulationData);
        if (!validated.success) {
            validated.error.errors.forEach((err) => {
                toast.error(err.message);
            });
            setLoading(false);
            return;
        }

        try {
            const response = await call(() => submitSimulation(simulationData));

            if (!response) {
                toast.error("Une erreur est survenue lors de la soumission de la simulation.");
                setLoading(false);
                return;
            }

            startTransition(() => {
                toast.success("Simulation envoyée avec succès !");
                router.push("/client/simulation/results");
            });

        } catch (error) {
            console.error("Erreur lors de la soumission de la simulation:", error);
            toast.error("Une erreur est survenue lors de la soumission de la simulation.");
        } finally {
            setLoading(false);
        }
    };

    if (loading || isPending) {
        return <SimulationSkeleton />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-4xl space-y-8"
        >
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8"
            >
                Système de Simulation d&#39;Envoi
            </motion.h2>

            {/* Progress Indicator */}
            <div className="flex justify-center mb-8">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${index <= currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                                    }`}
                            >
                                {index < currentStep ? <CheckCircle size={20} /> : index + 1}
                            </div>
                            <p className={`mt-2 text-sm text-center ${index <= currentStep ? 'text-indigo-600' : 'text-gray-500'}`}>
                                {step.title}
                            </p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-1 bg-gray-300 mx-2 mt-5 ${index < currentStep ? 'bg-indigo-600' : ''}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            {steps[currentStep].title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {steps[currentStep].component}
                    </CardContent>
                </Card>

                <div className="flex justify-between mt-8">
                    {currentStep > 0 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrevious}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> Précédent
                        </Button>
                    )}
                    {currentStep < steps.length - 1 && (
                        <Button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center gap-2 ml-auto"
                        >
                            Suivant <ArrowRight className="h-4 w-4" />
                        </Button>
                    )}
                    {currentStep === steps.length - 1 && (
                        <Button
                            type="submit"
                            className="flex items-center gap-2 ml-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            <CheckCircle className="h-4 w-4" /> Soumettre la simulation
                        </Button>
                    )}
                </div>
            </form>

            {simulationConfirmationModal && (
                <SimulationConfirmationModal
                    show={simulationConfirmationModal}
                    handleClose={() => setSimulationConfirmationModal(false)}
                    handleConfirm={handleKeepSimulation}
                    handleCreateNew={handleCreateNewSimulation}
                />
            )}
        </motion.div>
    );
};

export default MultiStepSimulationForm;
