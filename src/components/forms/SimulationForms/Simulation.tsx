// src/components/forms/SimulationForms/Simulation.tsx

'use client';

import React, { ChangeEvent, useEffect, useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// ───────────────────────────────── UI components (shadcn/ui)
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

import CountrySelect from '@/components/forms/SimulationForms/CountrySelectForm';
import CitySelect from '@/components/forms/SimulationForms/CitySelectForm';
import AgencySelect from '@/components/forms/SimulationForms/AgencySelectForm';
import PackageForm from './PackageForm';

// ───────────────────────── services, hooks, utils (unchanged)
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
import { simulationRequestSchema } from '@/utils/validationSchema';
import { SimulationDtoRequest } from '@/services/dtos';
import { COLIS_MAX_PER_ENVOI } from '@/utils/constants';
import { checkAuthStatus } from '@/lib/auth-utils';

// ──────────────── skeleton & modal reused as‑is
import SimulationSkeleton from '@/app/client/simulation/SimulationSkeleton';
import SimulationConfirmationModal from '@/components/modals/SimulationConfirmationModal';
import { getSimulationFromCookie } from '@/lib/simulationCookie';
import { updateSimulationUserId } from '@/services/backend-services/Bk_SimulationService';

// ──────────────────────────────────────────────────────────────────────────────
//                         ───  TYPES & CONSTANTS  ───                          
// ──────────────────────────────────────────────────────────────────────────────

const STEPS = [
    'Informations de départ',
    'Informations de destination',
    'Informations des colis',
    'Confirmation',
] as const;

// Helper for Framer‑motion step fade
const fade = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.25 },
};

// ──────────────────────────────────────────────────────────────────────────────
//                                 COMPONENT                                    
// ──────────────────────────────────────────────────────────────────────────────
const SimulationFormMultiStep = () => {
    const router = useRouter();
    const { call } = useApi();
    const [isPending, startTransition] = useTransition();

    // ─────────── generic ui / loading states
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3>(0);

    // ─────────── auth state (unchanged)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | number | null>(null);
    const [simulationConfirmationModal, setSimulationConfirmationModal] =
        useState(false);

    // ─────────── form states (exact same shape)
    const [departure, setDeparture] = useState({
        country: '',
        city: '',
        agencyName: '',
    });
    const [destination, setDestination] = useState({
        country: '',
        city: '',
        agencyName: '',
    });
    const [options, setOptions] = useState({
        countries: [] as { id: number; name: string }[],
        destinationCountries: [] as { id: number; name: string }[],
        departureCities: [] as { id: number; name: string }[],
        departureAgencies: [] as { id: number; name: string }[],
        destinationCities: [] as { id: number; name: string }[],
        destinationAgencies: [] as { id: number; name: string }[],
    });

    const [packageCount, setPackageCount] = useState(1);
    const [parcels, setParcels] = useState([
        { height: 0, width: 0, length: 0, weight: 0 },
    ]);
    const [currentPackage, setCurrentPackage] = useState(0);

    // ───────────────────────────────────────────────────────────────────────────
    //                       DATA‑FETCHING SIDE‑EFFECTS (unchanged)
    // ───────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            const authResult = await checkAuthStatus(false);
            setIsAuthenticated(authResult.isAuthenticated);
            setUserId(authResult.userId || null);
        })();
    }, []);

    // Check for existing simulation cookie
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

    /* ------------------------------------------------------------------------
       Fetch countries, cities & agencies (same logic as original component)
       All the effects below are a 1‑for‑1 copy – only the function bodies are
       slightly refactored to avoid eslint warnings inside the file.         
    ------------------------------------------------------------------------ */

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

    // Departure cities
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

    // Departure agencies
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

    // Destination countries
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

    // Destination cities
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

    // Destination agencies
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

    // ───────────────────────────────────────── handlers (mostly unchanged)
    const handleDepartureChange = (field: keyof typeof departure, value: string) =>
        setDeparture((prev) => ({ ...prev, [field]: value }));
    const handleDestinationChange = (
        field: keyof typeof destination,
        value: string,
    ) => setDestination((prev) => ({ ...prev, [field]: value }));

    const handlePackageCountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newCount = parseInt(e.target.value, 10);
        if (newCount > COLIS_MAX_PER_ENVOI) return;
        setPackageCount(newCount);
        const newParcels = Array.from({ length: newCount }, (_, i) => parcels[i] || {
            height: 0,
            width: 0,
            length: 0,
            weight: 0,
        });
        setParcels(newParcels);
        if (currentPackage >= newCount) setCurrentPackage(newCount - 1);
    };

    const handlePackageChange = (index: number, field: string, value: number) => {
        const updated = parcels.map((pkg, i) => (i === index ? { ...pkg, [field]: value } : pkg));
        setParcels(updated);
    };

    const next = () => {
        // Quick guard for required fields before moving on
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
            case 2:
                if (!parcels.length || parcels.some((p) => !p.weight)) {
                    toast.error('Veuillez compléter les informations des colis.');
                    return;
                }
                break;
        }
        setCurrentStep((prev) => (prev < 3 ? (prev + 1) as 0 | 1 | 2 | 3 : prev));
    };

    const prev = () => setCurrentStep((prev) => (prev > 0 ? (prev - 1) as 0 | 1 | 2 | 3 : prev));

    // ───────────────────────────────────────────────────────────────────────────
    //                               SUBMIT LOGIC
    // ───────────────────────────────────────────────────────────────────────────
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

    // ───────────────────────────────────────────────────────────────────────────
    //                        SIMULATION COOKIE MODAL HANDLERS
    // ───────────────────────────────────────────────────────────────────────────
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

    // ───────────────────────────────────────────────────────────────────────────
    //                                RENDER
    // ───────────────────────────────────────────────────────────────────────────
    if (loading || isPending) {
        return <SimulationSkeleton />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto p-4 md:p-8 mt-10 space-y-10"
        >
            {/* ───────────── header */}
            <motion.h2
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center text-4xl md:text-6xl font-bold"
            >
                Système de Simulation d&apos;Envoi
            </motion.h2>

            {/* ───────────── progress bar */}
            <Progress value={((currentStep + 1) / STEPS.length) * 100} />
            <div className="flex justify-between text-sm font-medium px-1 md:px-2">
                {STEPS.map((label, idx) => (
                    <span
                        key={label}
                        className={
                            idx === currentStep ? 'text-primary' : idx < currentStep ? 'text-green-600' : 'text-gray-400'
                        }
                    >
                        {label}
                    </span>
                ))}
            </div>

            {/* ───────────── step content */}
            <AnimatePresence mode="wait">
                {currentStep === 0 && (
                    <motion.div key="step-0" {...fade}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations de Départ</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CountrySelect
                                    label="Pays de départ"
                                    value={departure.country}
                                    onChange={(e) => handleDepartureChange('country', e.target.value)}
                                    countries={options.countries}
                                    placeholder="Sélectionnez un pays"
                                />
                                <CitySelect
                                    label="Ville de départ"
                                    value={departure.city}
                                    onChange={(e) => handleDepartureChange('city', e.target.value)}
                                    cities={options.departureCities}
                                    disabled={!departure.country}
                                />
                                <AgencySelect
                                    label="Agence de départ"
                                    value={departure.agencyName}
                                    onChange={(e) => handleDepartureChange('agencyName', e.target.value)}
                                    agencies={options.departureAgencies}
                                    disabled={!departure.city}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 1 && (
                    <motion.div key="step-1" {...fade}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations de Destination</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CountrySelect
                                    label="Pays de destination"
                                    value={destination.country}
                                    onChange={(e) => handleDestinationChange('country', e.target.value)}
                                    countries={options.destinationCountries}
                                    disabled={!departure.agencyName}
                                    placeholder="Sélectionnez d’abord une agence de départ"
                                />
                                <CitySelect
                                    label="Ville de destination"
                                    value={destination.city}
                                    onChange={(e) => handleDestinationChange('city', e.target.value)}
                                    cities={options.destinationCities}
                                    disabled={!destination.country}
                                />
                                <AgencySelect
                                    label="Agence d'arrivée"
                                    value={destination.agencyName}
                                    onChange={(e) => handleDestinationChange('agencyName', e.target.value)}
                                    agencies={options.destinationAgencies}
                                    disabled={!destination.city}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 2 && (
                    <motion.div key="step-2" {...fade}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations des Colis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Nombre de colis */}
                                <div className="mb-6 max-w-xs">
                                    <label htmlFor="packageCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Nombre de colis
                                    </label>
                                    <input
                                        id="packageCount"
                                        type="number"
                                        max={COLIS_MAX_PER_ENVOI}
                                        min={1}
                                        value={packageCount}
                                        onChange={handlePackageCountChange}
                                        className="mt-1 w-full rounded-md border px-3 py-2"
                                    />
                                </div>

                                {parcels.map((pkg, idx) => idx === currentPackage && (
                                    <PackageForm key={idx} index={idx} pkg={pkg} onChange={handlePackageChange} />
                                ))}

                                {/* pagination intra-step */}
                                {parcels.length > 1 && (
                                    <div className="flex items-center justify-between mt-6 max-w-xs mx-auto">
                                        <Button variant="ghost" size="icon" onClick={() => setCurrentPackage((p) => Math.max(p - 1, 0))} disabled={currentPackage === 0}>
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm">
                                            Colis {currentPackage + 1} / {parcels.length}
                                        </span>
                                        <Button variant="ghost" size="icon" onClick={() => setCurrentPackage((p) => Math.min(p + 1, parcels.length - 1))} disabled={currentPackage === parcels.length - 1}>
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 3 && (
                    <motion.div key="step-3" {...fade}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Résumé & Soumission</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm md:text-base">
                                <div>
                                    <h4 className="font-semibold mb-2">Départ</h4>
                                    <p>{options.countries.find((c) => String(c.id) === departure.country)?.name} / {options.departureCities.find((c) => String(c.id) === departure.city)?.name} / {departure.agencyName}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Destination</h4>
                                    <p>{options.destinationCountries.find((c) => String(c.id) === destination.country)?.name} / {options.destinationCities.find((c) => String(c.id) === destination.city)?.name} / {destination.agencyName}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Colis</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {parcels.map((p, i) => (
                                            <li key={i}>Colis {i + 1}: {p.weight} kg – {p.length}×{p.width}×{p.height} cm</li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ───────────── navigation buttons */}
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

            {/* ───────────── existing simulation modal */}
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

export default SimulationFormMultiStep;
