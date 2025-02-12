// path: src/components/forms/SimulationForm.tsx
'use client';

import React, {ChangeEvent, useEffect, useState, useTransition} from 'react';
import {motion} from 'framer-motion';
import {Button, Pagination} from 'react-bootstrap';
import PackageForm from './PackageForm';
import CountrySelect from "@/components/forms/SimulationForms/CountrySelectForm";
import CitySelect from "@/components/forms/SimulationForms/CitySelectForm";
import AgencySelect from "@/components/forms/SimulationForms/AgencySelectForm";
import {
    deleteSimulationCookie,
    getSimulation,
    submitSimulation
} from "@/services/frontend-services/simulation/SimulationService";
import {toast, ToastContainer} from "react-toastify";
import {useRouter} from 'next/navigation';
import {simulationRequestSchema} from "@/utils/validationSchema";
import {
    fetchAgencies,
    fetchCities,
    fetchCountries,
    fetchDestinationCountries
} from "@/services/frontend-services/AddressService";
import {SimulationDtoRequest} from "@/services/dtos";
import {ArrowRight, Box, Calculator, MapPin, Truck} from "lucide-react";
import {COLIS_MAX_PER_ENVOI} from "@/utils/constants";
import {getSimulationFromCookie} from "@/lib/simulationCookie";

import {updateSimulationUserId} from "@/services/backend-services/Bk_SimulationService";
import {useSession} from "next-auth/react";
import {checkAuthStatus} from "@/lib/auth";
import SimulationSkeleton from "@/app/client/simulation/simulationSkeleton";
import SimulationConfirmationModal from "@/components/modals/SimulationConfirmationModal";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import {Label} from '@/components/ui/label';
import {Input} from "@/components/ui/input";
import {
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';


const SimulationForm = () => {
    const {data: session, status} = useSession();
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [departure, setDeparture] = useState({country: '', city: '', agencyName: ''});
    const [destination, setDestination] = useState({country: '', city: '', agencyName: ''});
    const [options, setOptions] = useState({
        countries: [],
        destinationCountries: [],
        departureCities: [],
        departureAgencies: [],
        destinationCities: [],
        destinationAgencies: []
    });

    const [packageCount, setPackageCount] = useState(1);
    const [parcels, setParcels] = useState([{height: 0, width: 0, length: 0, weight: 0}]);
    const [currentPackage, setCurrentPackage] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [simulationConfirmationModal, setSimulationConfirmationModal] = useState(false);


    useEffect(() => {
        setLoading(true);
        const checkAuth = async () => {
            const authResult = await checkAuthStatus(false);
            setIsAuthenticated(authResult.isAuthenticated);
            setUserId(authResult.userId || null);
        };
        checkAuth();
    }, []);

    useEffect(() => {
        // Check if all necessary initial data is loaded
        if (
            options.countries.length > 0 && // Countries are loaded
            userId !== undefined && // Auth check is complete (even if user is not logged in)
            !isPending // No transitions are pending
        ) {
            setLoading(false);
        }
    }, [options.countries, userId, isPending]);


    /**
     * Find existing previous simulation in cookies and redirect to results page
     * @returns {Promise<void>}
     */
    useEffect(() => {
        const findExistingSimulation = async () => {
            startTransition(() => {
                (async () => {
                    try {
                        const simulation = await getSimulationFromCookie();

                        // get Simulation by id
                        const simulationData = await getSimulation();
                        if (simulation) {
                            setSimulationConfirmationModal(true);
                            if (!simulationData?.userId) {
                                if (isAuthenticated && userId) {
                                    // update simulation with sender connected user id
                                    await updateSimulationUserId(simulation.id, Number(userId));
                                }
                                // show modal to confirm in the use wants to keep the simulation or create a new one
                                setSimulationConfirmationModal(true);
                            }
                        }
                        setLoading(false);
                    } catch (error) {
                        console.error('Erreur lors de la recherche de la simulation:', error);
                    }
                })();
            });
        }

        findExistingSimulation();
    }, [isAuthenticated, router, session?.user?.id, userId])

    // fetch countries when component mounts
    useEffect(() => {
        fetchCountries().then(data => setOptions(prev => ({...prev, countries: data}))).catch(console.error);
    }, []);

    // fetch destination countries when departure country changes
    useEffect(() => {
        if (departure.country) {
            fetchDestinationCountries(departure.country).then(data => setOptions(prev => ({
                ...prev,
                destinationCountries: data
            }))).catch(console.error);
        }
    }, [departure.country]);

    // fetch departure cities when departure country changes
    useEffect(() => {
        if (departure.country) {
            fetchCities(departure.country).then(data => setOptions(prev => ({
                ...prev,
                departureCities: data
            }))).catch(console.error);
            setDeparture(prev => ({...prev, city: '', agencyName: ''}));
        }
    }, [departure.country]);

    // fetch departure agencies when departure city changes
    useEffect(() => {
        if (departure.city && departure.country) {
            fetchAgencies(departure.city).then(data => setOptions(prev => ({
                ...prev,
                departureAgencies: data
            }))).catch(console.error);
            setDeparture(prev => ({...prev, agencyName: ''}));
        }
    }, [departure.city, departure.country]);


    // fetch destination cities when destination country changes
    useEffect(() => {
        if (destination.country) {
            fetchCities(destination.country).then(data => setOptions(prev => ({
                ...prev,
                destinationCities: data
            }))).catch(console.error);
            setDestination(prev => ({...prev, city: '', agencyName: ''}));
        }
    }, [destination.country]);

    // fetch destination agencies when destination city changes
    useEffect(() => {
        if (destination.city) {
            fetchAgencies(destination.city).then(data => setOptions(prev => ({
                ...prev,
                destinationAgencies: data
            }))).catch(console.error);
            setDestination(prev => ({...prev, agencyName: ''}));
        }
    }, [destination.city]);

    const handleDepartureChange = (field: keyof typeof departure, value: string) => {
        setDeparture(prev => ({...prev, [field]: value}));
    };

    const handleDestinationChange = (field: keyof typeof destination, value: string) => {
        setDestination(prev => ({...prev, [field]: value}));
    };

    const handlePackageChange = (index: number, field: string, value: number) => {
        const updatedPackages = parcels.map((pkg, i) => (i === index ? {...pkg, [field]: value} : pkg));
        setParcels(updatedPackages);
    };

    const handlePackageCountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const count = parseInt(e.target.value, 10);
        setPackageCount(count);
        const newPackages = Array.from({length: count}, (_, i) => parcels[i] || {
            height: 0,
            width: 0,
            length: 0,
            weight: 0
        });
        setParcels(newPackages);
    };

    const handlePageChange = (pageIndex: number) => {
        setCurrentPackage(pageIndex);
    }

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        startTransition(() => {
            (async () => {
                // data to be validated by zod schema
                const simulationData: SimulationDtoRequest = {
                    departureCountry: departure.country,
                    departureCity: departure.city,
                    departureAgency: departure.agencyName,
                    destinationCountry: destination.country,
                    destinationCity: destination.city,
                    destinationAgency: destination.agencyName,
                    parcels,
                };

                console.log("Simulation Data before validation:", simulationData);
                const validated = simulationRequestSchema.safeParse(simulationData);
                console.log("Validation Result:", validated);

                if (!validated.success) {
                    validated.error.errors.forEach((err) => {
                        toast.error(err.message);
                    });
                    console.log("Validation Errors:", validated.error.errors);
                    return;
                }


                try {
                    // Submit simulation to the backend
                    const response = await submitSimulation(simulationData);
                    if (!response) {
                        toast.error("Une erreur est survenue lors de la soumission de la simulation.");
                        return;
                    }

                    toast.success("Simulation envoyée avec succès !");
                    router.push(`/client/simulation/results`);
                } catch (error) {
                    console.error("Erreur lors de la soumission de la simulation:", error);
                    toast.error("Une erreur est survenue lors de la soumission de la simulation.");
                    setLoading(false);
                }
            })();
        });

    };

    const handleKeepSimulation = () => {
        setSimulationConfirmationModal(false);

        toast.success("Continuant avec la simulation...");
        setTimeout(() => {
            router.push(`/client/simulation/results`);
        }, 2000);

    };

    const handleCreateNewSimulation = async () => {
        setSimulationConfirmationModal(false);
        setTimeout(async () => {
            toast.success("La suppression de la simulation est en cours...");
            await deleteSimulationCookie(); // Clear simulation cookies
            router.refresh(); // Refresh the page
        }, 2000);
    };

    if (loading) {
        return (<SimulationSkeleton/>);
    }

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="max-w-4xl mx-auto p-8 mt-10 space-y-8"
        >
            <motion.h2
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.1}}
                className="text-center text-3xl font-bold text-blue-600"
            >
                Simulation Form
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Departure Information */}
                <Card>
                    <CardHeader className="flex items-center gap-2">
                        <MapPin className="text-blue-500"/>
                        <CardTitle>Informations de Départ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CountrySelect
                                label="Pays de départ"
                                value={departure.country}
                                onChange={(e) => handleDepartureChange('country', e.target.value)}
                                countries={options.countries}
                                disabled={isPending}
                                placeholder="Sélectionnez un pays avant de continuer"
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
                                disabled={!departure.city || isPending}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Destination Information */}
                <Card>
                    <CardHeader className="flex items-center gap-2">
                        <Truck className="text-blue-500"/>
                        <CardTitle>Informations de Destination</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CountrySelect
                                label="Pays de destination"
                                value={destination.country}
                                onChange={(e) => handleDestinationChange('country', e.target.value)}
                                countries={options.destinationCountries}
                                disabled={!departure.country || isPending}
                                placeholder="Sélectionnez un pays de départ avant de continuer"
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
                                disabled={!destination.city || isPending}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Parcel Information */}
                <Card>
                    <CardHeader className="flex items-center gap-2">
                        <Box className="text-blue-500"/>
                        <CardTitle>Informations des Colis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="packageCount" className="block text-gray-600 font-medium">
                                    Nombre de colis
                                </Label>
                                <Input
                                    id="packageCount"
                                    type="number"
                                    max={COLIS_MAX_PER_ENVOI}
                                    min="1"
                                    value={packageCount}
                                    onChange={handlePackageCountChange}
                                    disabled={isPending}
                                    className="mt-1"
                                />
                            </div>

                            {/* Display the current package form */}
                            {parcels.map((pkg, index) =>
                                    index === currentPackage && (
                                        <PackageForm
                                            key={index}
                                            index={index}
                                            pkg={pkg}
                                            onChange={handlePackageChange}
                                            disabled={isPending}
                                        />
                                    )
                            )}

                            {/* Pagination Controls */}
                            {parcels.length > 1 && (
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                isDisabled={currentPackage === 0}
                                                onClick={() => setCurrentPackage((prev) => Math.max(prev - 1, 0))}
                                            />
                                        </PaginationItem>

                                        {parcels.map((_, index) => (
                                            <PaginationItem key={index}>
                                                <PaginationLink
                                                    isActive={index === currentPackage}
                                                    onClick={() => handlePageChange(index)}
                                                >
                                                    {index + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                isDisabled={currentPackage === parcels.length - 1}
                                                onClick={() => setCurrentPackage((prev) => Math.min(prev + 1, parcels.length - 1))}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>

                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Button type="submit" disabled={isPending} className="flex items-center gap-2">
                        {isPending ? (
                            <>
                                <Calculator className="h-4 w-4"/>
                                Calculation...
                            </>
                        ) : (
                            <>
                                <ArrowRight className="h-4 w-4"/>
                                Soumettre la simulation
                            </>
                        )}
                    </Button>
                </div>
            </form>

            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                theme="colored"
                closeOnClick
                pauseOnHover
                draggable
                pauseOnFocusLoss
            />

            <SimulationConfirmationModal
                show={simulationConfirmationModal}
                handleClose={() => setSimulationConfirmationModal(false)}
                handleConfirm={handleKeepSimulation}
                handleCreateNew={handleCreateNewSimulation}
            />
        </motion.div>
    );
};

export default SimulationForm;