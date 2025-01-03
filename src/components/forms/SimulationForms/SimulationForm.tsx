// path: src/components/forms/SimulationForm.tsx
'use client';

import React, {ChangeEvent, useEffect, useState, useTransition} from 'react';
import {motion} from 'framer-motion';
import {Button, Pagination, Spinner} from 'react-bootstrap';
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
        setLoading(true);  // This is fine as is
        const checkAuth = async () => {
            const authResult = await checkAuthStatus(false);
            setIsAuthenticated(authResult.isAuthenticated);
            setUserId(authResult.userId || null);
        };
        checkAuth();
    }, []);

    // Add this new useEffect to handle loading state
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
                            }
                        }
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
    };

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

                // validate data with zod schema
                const validated = simulationRequestSchema.safeParse(simulationData);

                if (!validated.success) {
                    toast.error(validated.error.errors[0].message);
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
            className="container mx-auto p-8 mt-10 bg-gray-50 rounded-lg shadow-lg space-y-8"
        >
            <motion.h2
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.1}}
                className="text-center text-3xl font-bold text-blue-600"
            >
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Departure Information */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.2}}
                    className="p-6 bg-white rounded-md shadow-md"
                >
                    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                        <MapPin className="text-blue-500"/> Informations de Départ
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <CountrySelect
                            label="Pays de départ"
                            value={departure.country}
                            onChange={(e) => handleDepartureChange('country', e.target.value)}
                            countries={options.countries}
                            disabled={isPending}
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
                </motion.div>

                {/* Destination Information */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.3}}
                    className="p-6 bg-white rounded-md shadow-md"
                >
                    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                        <Truck className="text-blue-500"/> Informations de Destination
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <CountrySelect
                            label="Pays de destination"
                            value={destination.country}
                            onChange={(e) => handleDestinationChange('country', e.target.value)}
                            countries={options.destinationCountries}
                            disabled={isPending}
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
                </motion.div>

                {/* Parcel Information */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.4}}
                    className="p-6 bg-white rounded-md shadow-md"
                >
                    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                        <Box className="text-blue-500"/> Informations des Colis
                    </h3>
                    <div className="mb-4">
                        <label className="block text-gray-600 font-medium mb-2">Nombre de colis</label>
                        <input
                            disabled={isPending}
                            type="number"
                            max={COLIS_MAX_PER_ENVOI}
                            min="1"
                            value={packageCount}
                            onChange={handlePackageCountChange}
                            className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    {parcels.map((pkg, index) => (
                        index === currentPackage && (
                            <PackageForm

                                disabled={isPending}
                                key={index}
                                index={index}
                                pkg={pkg}
                                onChange={handlePackageChange}

                            />
                        )
                    ))}
                    {parcels.length > 1 && (
                        <Pagination className="flex justify-center mt-4">
                            {parcels.map((_, index) => (
                                <Pagination.Item
                                    disabled={isPending}
                                    key={index}
                                    active={index === currentPackage}
                                    onClick={() => handlePageChange(index)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    )}
                </motion.div>

                <div className="text-center">
                    <Button
                        type="submit"
                        variant="primary"
                        className="px-8 py-3 flex items-center gap-2"
                        disabled={isPending}>
                        {isPending ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="mr-2"
                                />
                                <Calculator className="h-4 w-4"/>
                                Calculation... 🤗
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
                handleConfirm={handleKeepSimulation} // Keep simulation and go to results
                handleCreateNew={handleCreateNewSimulation} // Create a new simulation
            />
        </motion.div>
    );
};

export default SimulationForm;