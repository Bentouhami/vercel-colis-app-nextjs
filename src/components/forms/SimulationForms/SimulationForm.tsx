// path: src/components/forms/SimulationForm.tsx
'use client';

import React, {ChangeEvent, useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {Button, Pagination} from 'react-bootstrap';
import PackageForm from './PackageForm';
import CountrySelect from "@/components/forms/SimulationForms/CountrySelectForm";
import CitySelect from "@/components/forms/SimulationForms/CitySelectForm";
import AgencySelect from "@/components/forms/SimulationForms/AgencySelectForm";
import {getSimulation, submitSimulation} from "@/services/frontend-services/simulation/SimulationService";
import {toast, ToastContainer} from "react-toastify";
import {useRouter} from 'next/navigation';
import {simulationEnvoisSchema} from "@/utils/validationSchema";
import {
    fetchAgencies,
    fetchCities,
    fetchCountries,
    fetchDestinationCountries
} from "@/services/frontend-services/AddresseService";
import {BaseSimulationDto, PreparedSimulation, SimulationStatus} from "@/utils/dtos";
import {ArrowRight, Box, MapPin, Truck} from "lucide-react";

const SimulationForm = () => {
    const router = useRouter();
    const [departure, setDeparture] = useState({country: '', city: '', agency: ''});
    const [destination, setDestination] = useState({country: '', city: '', agency: ''});
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
    const [userId, setUserId] = useState<number | null>(null);


    useEffect(() => {
        const findExistingSimulation = async () => {

            const simulation = await getSimulation();
            if (simulation) {
                router.push(`/client/simulation/results`);
            }
        };

        findExistingSimulation();
    }, [router]);

    useEffect(() => {
        fetchCountries().then(data => setOptions(prev => ({...prev, countries: data}))).catch(console.error);
    }, []);

    useEffect(() => {
        if (departure.country) {
            fetchDestinationCountries(departure.country).then(data => setOptions(prev => ({
                ...prev,
                destinationCountries: data
            }))).catch(console.error);
        }
    }, [departure.country]);

    useEffect(() => {
        if (departure.country) {
            fetchCities(departure.country).then(data => setOptions(prev => ({
                ...prev,
                departureCities: data
            }))).catch(console.error);
            setDeparture(prev => ({...prev, city: '', agency: ''}));
        }
    }, [departure.country]);

    useEffect(() => {
        if (departure.city && departure.country) {
            fetchAgencies(departure.city).then(data => setOptions(prev => ({
                ...prev,
                departureAgencies: data
            }))).catch(console.error);
            setDeparture(prev => ({...prev, agency: ''}));
        }
    }, [departure.city, departure.country]);

    useEffect(() => {
        if (destination.country) {
            fetchCities(destination.country).then(data => setOptions(prev => ({
                ...prev,
                destinationCities: data
            }))).catch(console.error);
            setDestination(prev => ({...prev, city: '', agency: ''}));
        }
    }, [destination.country]);

    useEffect(() => {
        if (destination.city) {
            fetchAgencies(destination.city).then(data => setOptions(prev => ({
                ...prev,
                destinationAgencies: data
            }))).catch(console.error);
            setDestination(prev => ({...prev, agency: ''}));
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

        const simulationData: BaseSimulationDto = {
            departureCountry: departure.country,
            departureCity: departure.city,
            departureAgency: departure.agency,
            destinationCountry: destination.country,
            destinationCity: destination.city,
            destinationAgency: destination.agency,
            parcels
        };

        const validated = simulationEnvoisSchema.safeParse(simulationData);
        if (!validated.success) {
            toast.error(validated.error.errors[0].message);
            return;
        }

        try {
            const simulationDataWithUserAndDestinataireId: PreparedSimulation = {
                ...simulationData,
                userId: userId,
                destinataireId: null,
                status: SimulationStatus.DRAFT
            };

            const response = await submitSimulation(simulationDataWithUserAndDestinataireId);
            if (!response) {
                toast.error("Une erreur est survenue lors de la soumission de la simulation.");
                return;
            }

            toast.success("Simulation envoyée avec succès !");
            router.push(`/client/simulation/results`);
        } catch (error) {
            console.error('Erreur lors de la soumission de la simulation:', error);
            toast.error('Une erreur est survenue lors de la soumission de la simulation.');
        }
    };

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
                Simulation d&#39;Envoi
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
                            value={departure.agency}
                            onChange={(e) => handleDepartureChange('agency', e.target.value)}
                            agencies={options.departureAgencies}
                            disabled={!departure.city}
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
                            value={destination.agency}
                            onChange={(e) => handleDestinationChange('agency', e.target.value)}
                            agencies={options.destinationAgencies}
                            disabled={!destination.city}
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
                            type="number"
                            max="5"
                            min="1"
                            value={packageCount}
                            onChange={handlePackageCountChange}
                            className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    {parcels.map((pkg, index) => (
                        index === currentPackage && (
                            <PackageForm
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
                    <Button type="submit" variant="primary" className="px-8 py-3 flex items-center gap-2">
                        <ArrowRight className="h-4 w-4"/>
                        Soumettre la simulation
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
        </motion.div>
    );
};

export default SimulationForm;
