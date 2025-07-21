'use client';
/**
 * SimulationFormWizard orchestrates the multi‑step shipment simulation.
 * Chaque étape est maintenant dans son propre composant (voir dossier `steps/`).
 * La logique d’état, de chargement des données et la validation restent 100 % identiques.
 */

import React, { ChangeEvent, useEffect, useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

// ────────────────────── étapes décomposées
import StepDeparture from './steps/StepDeparture';
import StepDestination from './steps/StepDestination';
import StepParcels from './steps/StepParcels';
import StepConfirmation from './steps/StepConfirmation';

// ───────── services, hooks & utils (inchangés)
import { useApi } from '@/hooks/useApi';
import {
    deleteSimulationCookie,
    getSimulation,
    submitSimulation,
} from '@/services/frontend-services/simulation/SimulationService';
import {
    getAllCountries,
    getAgenciesByCityId,
    getCitiesByCountryId,
    getDestinationCountries,
} from '@/services/frontend-services/AddressService';
import { simulationRequestSchema, parcelsSchema } from '@/utils/validationSchema';
import { SimulationDtoRequest } from '@/services/dtos';
import { COLIS_MAX_PER_ENVOI } from '@/utils/constants';
import { checkAuthStatus } from '@/lib/auth-utils';
import {
    updateSimulationUserId,
} from '@/services/backend-services/Bk_SimulationService';

// Skeleton & modal réutilisés
import SimulationSkeleton from '@/app/client/simulation/simulationSkeleton';
import SimulationConfirmationModal from '@/components/modals/SimulationConfirmationModal';
import { getSimulationFromCookie } from '@/lib/simulationCookie';

// ──────────────────────── constantes
const STEPS = [
    'Informations de départ',
    'Informations de destination',
    'Informations des colis',
    'Confirmation',
] as const;

const fade = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.25 },
};

// ──────────────────────── composant principal
const SimulationFormWizard = () => {
    const router = useRouter();
    const { call } = useApi();
    const [isPending, startTransition] = useTransition();

    // ui / chargement
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3>(0);

    // auth
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | number | null>(null);
    const [simulationConfirmationModal, setSimulationConfirmationModal] = useState(false);

    // état du formulaire
    const [departure, setDeparture] = useState({ country: '', city: '', agencyName: '' });
    const [destination, setDestination] = useState({ country: '', city: '', agencyName: '' });
    const [options, setOptions] = useState({
        countries: [] as { id: number; name: string }[],
        destinationCountries: [] as { id: number; name: string }[],
        departureCities: [] as { id: number; name: string }[],
        departureAgencies: [] as { id: number; name: string }[],
        destinationCities: [] as { id: number; name: string }[],
        destinationAgencies: [] as { id: number; name: string }[],
    });

    const [packageCount, setPackageCount] = useState(1);
    const [parcels, setParcels] = useState([{ height: 0, width: 0, length: 0, weight: 0 }]);
    const [currentPackage, setCurrentPackage] = useState(0);

    // ───────── effets → auth
    useEffect(() => {
        (async () => {
            const authResult = await checkAuthStatus(false);
            setIsAuthenticated(authResult.isAuthenticated);
            setUserId(authResult.userId || null);
        })();
    }, []);

    // ───────── effets → simulation existante
    useEffect(() => {
        (async () => {
            try {
                const simulationCookie = await getSimulationFromCookie();
                const simulationData = await getSimulation();
                if (simulationCookie) {
                    if (simulationData && !simulationData?.userId && isAuthenticated && userId) {
                        await updateSimulationUserId(simulationCookie.id, Number(userId));
                    }
                    setSimulationConfirmationModal(true);
                }
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la recherche de la simulation:', error);
                setLoading(false);
            }
        })();
    }, [isAuthenticated, userId]);

    // ───────── data‑fetching (pays, villes, agences) → identique
    useEffect(() => {
        (async () => {
            try {
                const data = await getAllCountries();
                setOptions((prev) => ({ ...prev, countries: data }));
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        })();
    }, []);

    useEffect(() => {
        if (!departure.country) {
            setOptions((prev) => ({ ...prev, departureCities: [] }));
            setDeparture((prev) => ({ ...prev, city: '', agencyName: '' }));
            return;
        }
        (async () => {
            try {
                const countryId = Number(departure.country);
                const data = await getCitiesByCountryId(countryId);
                setOptions((prev) => ({ ...prev, departureCities: data }));
                setDeparture((prev) => ({ ...prev, city: '', agencyName: '' }));
            } catch (error) {
                console.error('Error fetching departure cities:', error);
                toast.error('Failed to fetch cities. Please try again.');
            }
        })();
    }, [departure.country]);

    useEffect(() => {
        if (!departure.city) {
            setOptions((prev) => ({ ...prev, departureAgencies: [] }));
            setDeparture((prev) => ({ ...prev, agencyName: '' }));
            return;
        }
        (async () => {
            try {
                const cityObj = options.departureCities.find((c) => c.id === Number(departure.city));
                if (cityObj) {
                    const data = await getAgenciesByCityId(cityObj.id);
                    setOptions((prev) => ({ ...prev, departureAgencies: data }));
                    setDeparture((prev) => ({ ...prev, agencyName: '' }));
                }
            } catch (error) {
                console.error('❌ Error fetching departure agencies:', error);
                toast.error('Failed to fetch agencies. Please try again.');
            }
        })();
    }, [departure.city, options.departureCities]);

    useEffect(() => {
        if (!departure.agencyName) {
            setOptions((prev) => ({ ...prev, destinationCountries: [] }));
            setDestination({ country: '', city: '', agencyName: '' });
            return;
        }
        (async () => {
            try {
                const data = await getDestinationCountries(departure.country);
                setOptions((prev) => ({ ...prev, destinationCountries: data }));
                setDestination({ country: '', city: '', agencyName: '' });
            } catch (error) {
                console.error('Error fetching destination countries:', error);
            }
        })();
    }, [departure.agencyName, departure.country]);

    useEffect(() => {
        if (!destination.country) {
            setOptions((prev) => ({ ...prev, destinationCities: [] }));
            setDestination((prev) => ({ ...prev, city: '', agencyName: '' }));
            return;
        }
        (async () => {
            try {
                const countryId = Number(destination.country);
                const data = await getCitiesByCountryId(countryId);
                setOptions((prev) => ({ ...prev, destinationCities: data }));
                setDestination((prev) => ({ ...prev, city: '', agencyName: '' }));
            } catch (error) {
                console.error('Error fetching destination cities:', error);
            }
        })();
    }, [destination.country]);

    useEffect(() => {
        if (!destination.city) {
            setOptions((prev) => ({ ...prev, destinationAgencies: [] }));
            setDestination((prev) => ({ ...prev, agencyName: '' }));
            return;
        }
        (async () => {
            try {
                const cityObj = options.destinationCities.find((c) => c.id === Number(destination.city));
                if (cityObj) {
                    const data = await getAgenciesByCityId(cityObj.id);
                    setOptions((prev) => ({ ...prev, destinationAgencies: data }));
                    setDestination((prev) => ({ ...prev, agencyName: '' }));
                }
            } catch (error) {
                console.error('Error fetching destination agencies:', error);
                toast.error('Failed to fetch destination agencies. Please try again.');
            }
        })();
    }, [destination.city, options.destinationCities]);

    // ───────── handlers
    const handleDepartureChange = (field: keyof typeof departure, value: string) =>
        setDeparture((prev) => ({ ...prev, [field]: value }));
    const handleDestinationChange = (field: keyof typeof destination, value: string) =>
        setDestination((prev) => ({ ...prev, [field]: value }));

    const handlePackageCountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newCount = parseInt(e.target.value, 10);
        if (newCount > COLIS_MAX_PER_ENVOI) return;
        setPackageCount(newCount);
        const newParcels = Array.from({ length: newCount }, (_, i) => parcels[i] || { height: 0, width: 0, length: 0, weight: 0 });
        setParcels(newParcels);
        if (currentPackage >= newCount) setCurrentPackage(newCount - 1);
    };

    const handlePackageChange = (index: number, field: string, value: number) => {
        const updated = parcels.map((pkg, i) => (i === index ? { ...pkg, [field]: value } : pkg));
        setParcels(updated);
    };

    // navigation entre étapes
    // Traductions des messages Zod anglais → français pour les colis
    const parcelErrorTranslations: Record<string, string> = {
        'Height must be positive': 'La hauteur doit être un nombre positif',
        'Width must be positive': 'La largeur doit être un nombre positif',
        'Length must be positive': 'La longueur doit être un nombre positif',
        'Weight must be at least 1kg': 'Le poids doit être d\'au moins 1 kg',
        'Weight must be at most 70kg': 'Le poids doit être d\'au plus 70 kg',
        'The sum of dimensions (L + W + H) must be less than 360 cm': 'La somme des dimensions (L + l + H) doit être inférieure à 360 cm',
        'The largest side must be at most 120 cm': 'La plus grande dimension doit être d\'au plus 120 cm',
        'The volume must be at least 1728 cm³': 'Le volume doit être d\'au moins 1728 cm³',
        'Parcel height must be a positive number': 'La hauteur du colis doit être un nombre positif',
        'Parcel width must be a positive number': 'La largeur du colis doit être un nombre positif',
        'Parcel length must be a positive number': 'La longueur du colis doit être un nombre positif',
        'Parcel weight must be a positive number': 'Le poids du colis doit être un nombre positif',
    };

    const next = () => {
        switch (currentStep) {
            case 0:
                if (!departure.country || !departure.city || !departure.agencyName) {
                    toast.error('Veuillez compléter toutes les informations de départ.');
                    return;
                }
                break;
            case 1:
                if (!destination.country || !destination.city || !destination.agencyName) {
                    toast.error('Veuillez compléter toutes les informations de destination.');
                    return;
                }
                break;
            case 2: {
                // validation détaillée des colis selon parcelsSchema
                for (let i = 0; i < parcels.length; i++) {
                    const res = parcelsSchema.safeParse(parcels[i]);
                    if (!res.success) {
                        const enMsg = res.error.errors[0].message;
                        const frMsg = parcelErrorTranslations[enMsg] || enMsg;
                        toast.error(`Colis ${i + 1} : ${frMsg}`);
                        return;
                    }
                }
                break;
            }
        }
        setCurrentStep((prev) => (prev < 3 ? (prev + 1) as 0 | 1 | 2 | 3 : prev));
    };

    const prev = () => setCurrentStep((prev) => (prev > 0 ? (prev - 1) as 0 | 1 | 2 | 3 : prev));

    // submit
    const handleSubmit = async () => {
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
            validated.error.errors.forEach((err) => toast.error(err.message));
            setLoading(false);
            return;
        }
        try {
            const response = await call(() => submitSimulation(simulationData));
            if (!response) {
                toast.error('Une erreur est survenue lors de la soumission de la simulation.');
                setLoading(false);
                return;
            }
            startTransition(() => {
                toast.success('Simulation envoyée avec succès !');
                router.push('/client/simulation/results');
            });
        } catch (error) {
            console.error('Erreur lors de la soumission de la simulation:', error);
            toast.error('Une erreur est survenue lors de la soumission de la simulation.');
        } finally {
            setLoading(false);
        }
    };

    // modal cookie
    const handleKeepSimulation = () => {
        setSimulationConfirmationModal(false);
        toast.success('Continuant avec la simulation...');
        setTimeout(() => router.push('/client/simulation/results'), 1500);
    };
    const handleCreateNewSimulation = async () => {
        setSimulationConfirmationModal(false);
        toast.success('La suppression de la simulation est en cours...');
        await deleteSimulationCookie();
        router.refresh();
    };

    // ───────── render
    if (loading || isPending) return <SimulationSkeleton />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto p-4 md:p-8 mt-10 space-y-10">
            <motion.h2 initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center text-4xl md:text-6xl font-bold">
                Système de Simulation d&apos;Envoi
            </motion.h2>

            <Progress value={((currentStep + 1) / STEPS.length) * 100} />
            <div className="flex justify-between text-sm font-medium px-1 md:px-2">
                {STEPS.map((label, idx) => (
                    <span key={label} className={idx === currentStep ? 'text-primary' : idx < currentStep ? 'text-green-600' : 'text-gray-400'}>
                        {label}
                    </span>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {currentStep === 0 && (
                    <motion.div key="step-0" {...fade}>
                        <StepDeparture
                            departure={departure}
                            countries={options.countries}
                            cities={options.departureCities}
                            agencies={options.departureAgencies}
                            onChange={handleDepartureChange}
                        />
                    </motion.div>
                )}
                {currentStep === 1 && (
                    <motion.div key="step-1" {...fade}>
                        <StepDestination
                            destination={destination}
                            countries={options.destinationCountries}
                            cities={options.destinationCities}
                            agencies={options.destinationAgencies}
                            onChange={handleDestinationChange}
                            disabled={!departure.agencyName}
                        />
                    </motion.div>
                )}
                {currentStep === 2 && (
                    <motion.div key="step-2" {...fade}>
                        <StepParcels
                            packageCount={packageCount}
                            parcels={parcels}
                            currentPackage={currentPackage}
                            onPackageCountChange={handlePackageCountChange}
                            onPackageChange={handlePackageChange}
                            setCurrentPackage={setCurrentPackage}
                        />
                    </motion.div>
                )}
                {currentStep === 3 && (
                    <motion.div key="step-3" {...fade}>
                        <StepConfirmation
                            departure={departure}
                            destination={destination}
                            parcels={parcels}
                            options={options}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-between mt-8">
                {currentStep > 0 ? (
                    <Button variant="secondary" onClick={prev}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Précédent
                    </Button>
                ) : <span />}

                {currentStep < 3 ? (
                    <Button onClick={next}>
                        Suivant
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Soumettre la simulation
                    </Button>
                )}
            </div>

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

export default SimulationFormWizard;
