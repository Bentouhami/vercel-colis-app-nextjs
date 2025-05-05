// path: src/components/forms/SimulationForms/SimulationForm.tsx

'use client';

import React, { ChangeEvent, useEffect, useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// UI components
import CountrySelect from "@/components/forms/SimulationForms/CountrySelectForm";
import CitySelect from "@/components/forms/SimulationForms/CitySelectForm";
import AgencySelect from "@/components/forms/SimulationForms/AgencySelectForm";
import PackageForm from './PackageForm';
import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ArrowRight, Box, Calculator, MapPin, Truck } from "lucide-react";

// Services
import {
    deleteSimulationCookie,
    getSimulation,
    submitSimulation
} from "@/services/frontend-services/simulation/SimulationService";
import { simulationRequestSchema } from "@/utils/validationSchema";
import {
    fetchAgencies,
    fetchCities,
    fetchCountries,
    fetchDestinationCountries // <--- we'll use this
} from "@/services/frontend-services/AddressService";
import { SimulationDtoRequest } from "@/services/dtos";
import { COLIS_MAX_PER_ENVOI } from "@/utils/constants";
import { getSimulationFromCookie } from "@/lib/simulationCookie";
import { updateSimulationUserId } from "@/services/backend-services/Bk_SimulationService";
import { checkAuthStatus } from "@/lib/auth";

// Others
import SimulationSkeleton from "@/app/client/simulation/simulationSkeleton";
import SimulationConfirmationModal from "@/components/modals/SimulationConfirmationModal";

const SimulationForm = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // region: loading states
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // endregion

    // region: user or simulation state
    const [userId, setUserId] = useState<string | number | null>(null);
    const [simulationConfirmationModal, setSimulationConfirmationModal] = useState(false);
    // endregion

    // region: form states
    // Strings hold the IDs (as string) of the selected items
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

    const [options, setOptions] = useState({
        countries: [] as { id: number; name: string }[],
        destinationCountries: [] as { id: number; name: string }[],
        departureCities: [] as { id: number; name: string }[],
        departureAgencies: [] as { id: number; name: string }[],
        destinationCities: [] as { id: number; name: string }[],
        destinationAgencies: [] as { id: number; name: string }[],
    });

    // region: parcels
    const [packageCount, setPackageCount] = useState(1);
    const [parcels, setParcels] = useState([{ height: 0, width: 0, length: 0, weight: 0 }]);
    const [currentPackage, setCurrentPackage] = useState(0);
    // endregion

    //==================================
    //   AUTH + LOADING
    //==================================
    useEffect(() => {
        const checkAuth = async () => {
            const authResult = await checkAuthStatus(false);
            setIsAuthenticated(authResult.isAuthenticated);
            setUserId(authResult.userId || null);
        };
        checkAuth();
    }, []);

    //==================================
    //   LOOK FOR EXISTING SIMULATION
    //==================================
    useEffect(() => {
        (async () => {
            try {
                const simulationCookie = await getSimulationFromCookie();
                const simulationData = await getSimulation();
                if (simulationCookie) {
                    // if no user linked => link user if possible
                    if (simulationData && !simulationData?.userId && isAuthenticated && userId) {
                        await updateSimulationUserId(simulationCookie.id, Number(userId));
                    }
                    // show user a modal: keep or new
                    setSimulationConfirmationModal(true);
                }
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la recherche de la simulation:', error);
                setLoading(false);
            }
        })();
    }, [isAuthenticated, userId]);

    //==================================
    //   FETCH DEPARTURE COUNTRIES
    //==================================
    useEffect(() => {
        (async () => {
            try {
                const data = await fetchCountries();
                setOptions(prev => ({ ...prev, countries: data }));
                setLoading(false); // when countries are loaded
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        })();
    }, []);

    //==================================
    //   FETCH DEPARTURE CITIES
    //==================================
    useEffect(() => {
        if (!departure.country) {
            setOptions(prev => ({ ...prev, departureCities: [] }));
            setDeparture(prev => ({ ...prev, city: '', agencyName: '' }));
            return;
        }

        (async () => {
            try {
                const countryId = Number(departure.country);
                const data = await fetchCities(countryId); // Only cities that actually have an agency
                setOptions(prev => ({ ...prev, departureCities: data }));
                // Reset city + agency
                setDeparture(prev => ({ ...prev, city: '', agencyName: '' }));
            } catch (error) {
                console.error("Error fetching departure cities:", error);
                toast.error("Failed to fetch cities. Please try again.");
            }
        })();
    }, [departure.country]);

    //==================================
    //   FETCH DEPARTURE AGENCIES
    //==================================
    useEffect(() => {
        if (!departure.city) {
            setOptions(prev => ({ ...prev, departureAgencies: [] }));
            setDeparture(prev => ({ ...prev, agencyName: '' }));
            return;
        }

        (async () => {
            try {
                // cityId from the state
                const cityObj = options.departureCities.find(c => c.name === departure.city);
                if (cityObj) {
                    const data = await fetchAgencies(cityObj.id);
                    setOptions(prev => ({ ...prev, departureAgencies: data }));
                    setDeparture(prev => ({ ...prev, agencyName: '' }));
                }
            } catch (error) {
                console.error("Error fetching departure agencies:", error);
                toast.error("Failed to fetch agencies. Please try again.");
            }
        })();
    }, [departure.city, options.departureCities]);

    //==================================
    //   FETCH DESTINATION COUNTRIES
    //   => only after user picks a departure
    //==================================
    useEffect(() => {
        if (!departure.agencyName) {
            // We haven't chosen a valid departure agency yet => clear it
            setOptions(prev => ({ ...prev, destinationCountries: [] }));
            setDestination({ country: '', city: '', agencyName: '' });
            return;
        }

        // If the user has fully chosen a valid departure agency,
        // we fetch all possible other countries that have agencies
        (async () => {
            try {
                const data = await fetchDestinationCountries(departure.country);
                setOptions(prev => ({ ...prev, destinationCountries: data }));
                // reset destination
                setDestination({ country: '', city: '', agencyName: '' });
            } catch (error) {
                console.error("Error fetching destination countries:", error);
            }
        })();
    }, [departure.agencyName, departure.country]);

    //==================================
    //   FETCH DESTINATION CITIES
    //==================================
    useEffect(() => {
        if (!destination.country) {
            setOptions(prev => ({ ...prev, destinationCities: [] }));
            setDestination(prev => ({ ...prev, city: '', agencyName: '' }));
            return;
        }

        (async () => {
            try {
                const countryId = Number(destination.country);
                const data = await fetchCities(countryId); // Only cities with agencies
                setOptions(prev => ({ ...prev, destinationCities: data }));
                setDestination(prev => ({ ...prev, city: '', agencyName: '' }));
            } catch (error) {
                console.error("Error fetching destination cities:", error);
            }
        })();
    }, [destination.country]);

    //==================================
    //   FETCH DESTINATION AGENCIES
    //==================================
    useEffect(() => {
        if (!destination.city) {
            setOptions(prev => ({ ...prev, destinationAgencies: [] }));
            setDestination(prev => ({ ...prev, agencyName: '' }));
            return;
        }

        (async () => {
            try {
                const cityObj = options.destinationCities.find(c => c.name === destination.city);
                if (cityObj) {
                    const data = await fetchAgencies(cityObj.id);
                    setOptions(prev => ({ ...prev, destinationAgencies: data }));
                    setDestination(prev => ({ ...prev, agencyName: '' }));
                }
            } catch (error) {
                console.error("Error fetching destination agencies:", error);
                toast.error("Failed to fetch destination agencies. Please try again.");
            }
        })();
    }, [destination.city, options.destinationCities]);

    //==================================
    //   HANDLERS
    //==================================
    const handleDepartureChange = (field: keyof typeof departure, value: string) => {
        setDeparture(prev => ({ ...prev, [field]: value }));
    };

    const handleDestinationChange = (field: keyof typeof destination, value: string) => {
        setDestination(prev => ({ ...prev, [field]: value }));
    };

    const handlePackageCountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newCount = parseInt(e.target.value, 10);
        if (newCount > COLIS_MAX_PER_ENVOI) return; // guard
        setPackageCount(newCount);
        const newParcels = Array.from({ length: newCount }, (_, i) => parcels[i] || {
            height: 0,
            width: 0,
            length: 0,
            weight: 0,
        });
        setParcels(newParcels);
        // ensure current package index is valid
        if (currentPackage >= newCount) {
            setCurrentPackage(newCount - 1);
        }
    };

    const handlePackageChange = (index: number, field: string, value: number) => {
        const updated = parcels.map((pkg, i) =>
            i === index ? { ...pkg, [field]: value } : pkg
        );
        setParcels(updated);
    };

    const handlePageChange = (pageIndex: number) => {
        setCurrentPackage(pageIndex);
    };

    //==================================
    //   SUBMIT
    //==================================
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
            const response = await submitSimulation(simulationData);
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


    //==================================
    //   SIMULATION MODAL (KEEP / NEW)
    //==================================
    const handleKeepSimulation = () => {
        setSimulationConfirmationModal(false);
        toast.success("Continuant avec la simulation...");
        setTimeout(() => {
            router.push("/client/simulation/results");
        }, 1500);
    };

    const handleCreateNewSimulation = async () => {
        setSimulationConfirmationModal(false);
        toast.success("La suppression de la simulation est en cours...");
        await deleteSimulationCookie();
        router.refresh();
    };

    //==================================
    //   RENDER
    //==================================
    if (loading || isPending) {
        return <SimulationSkeleton />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto p-8 mt-10 space-y-8"
        >
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mt-3 text-6xl"
            >
                Système de Simulation d&#39;Envoi
            </motion.h2>

            {/* Main form */}
            <form onSubmit={handleSubmit} className="space-y-8">

                {/* ====== DEPARTURE ====== */}
                <Card>
                    <CardHeader className="flex items-center gap-2">
                        <MapPin />
                        <CardTitle>Informations de Départ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>
                    </CardContent>
                </Card>

                {/* ====== DESTINATION ====== */}
                <Card>
                    <CardHeader className="flex items-center gap-2">
                        <Truck />
                        <CardTitle>Informations de Destination</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>
                    </CardContent>
                </Card>

                {/* ====== PARCELS ====== */}
                <Card>
                    <CardHeader className="flex items-center gap-2">
                        <Box />
                        <CardTitle>Informations des Colis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Number of parcels */}
                            <div>
                                <Label htmlFor="packageCount" className="block text-gray-600 font-medium">
                                    Nombre de colis
                                </Label>
                                <Input
                                    id="packageCount"
                                    type="number"
                                    max={COLIS_MAX_PER_ENVOI}
                                    min={1}
                                    value={packageCount}
                                    onChange={handlePackageCountChange}
                                    className="mt-1"
                                />
                            </div>

                            {/* Show only the currently focused package in the form */}
                            {parcels.map((pkg, index) =>
                                    index === currentPackage && (
                                        <PackageForm
                                            key={index}
                                            index={index}
                                            pkg={pkg}
                                            onChange={handlePackageChange}
                                        />
                                    )
                            )}

                            {/* If multiple parcels, show pagination to move between them */}
                            {parcels.length > 1 && (
                                <div className="flex justify-center mt-4">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                size="default"
                                                isActive={currentPackage === 0}
                                                onClick={() => setCurrentPackage((p) => Math.max(p - 1, 0))}
                                            />
                                        </PaginationItem>
                                        {parcels.map((_, idx) => (
                                            <PaginationItem key={idx}>
                                                <PaginationLink
                                                    size="default"
                                                    isActive={idx === currentPackage}
                                                    onClick={() => handlePageChange(idx)}
                                                >
                                                    {idx + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext
                                                size="default"
                                                isActive={currentPackage === parcels.length - 1}
                                                onClick={() =>
                                                    setCurrentPackage((p) => Math.min(p + 1, parcels.length - 1))
                                                }
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* ====== SUBMIT ====== */}
                <div className="text-center">
                    <Button type="submit" className="flex items-center gap-2">
                        {isPending ? (
                            <>
                                <Calculator className="h-4 w-4" />
                                Calculation...
                            </>
                        ) : (
                            <>
                                <ArrowRight className="h-4 w-4" />
                                Soumettre la simulation
                            </>
                        )}
                    </Button>
                </div>
            </form>

            {/* Toast notifications */}
            {/*<ToastContainer position="bottom-right" autoClose={5000} theme="colored" />*/}

            {/* If existing simulation was found: show confirmation modal */}
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

export default SimulationForm;
