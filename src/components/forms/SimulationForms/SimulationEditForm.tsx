'use client';

import React, {ChangeEvent, useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {useRouter} from 'next/navigation';
import {CreateParcelDto, SimulationResponseDto} from '@/services/dtos';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Edit, Edit2, MapPin, Package, PlusCircle, Trash2, Truck} from 'lucide-react';
import {toast} from 'react-toastify';
import {
    fetchAgencies,
    fetchCities,
    fetchCountries,
    fetchDestinationCountries
} from "@/services/frontend-services/AddresseService";
import {getSimulation} from "@/services/frontend-services/simulation/SimulationService";
import AgencySelect from "@/components/forms/SimulationForms/AgencySelectForm";
import CitySelect from "@/components/forms/SimulationForms/CitySelectForm";
import CountrySelect from "@/components/forms/SimulationForms/CountrySelectForm";
import {CardBody} from "react-bootstrap";


const SimulationEditForm = () => {
    const router = useRouter();

    const [simulationData, setSimulationData] = useState<SimulationResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [results, setResults] = useState<SimulationResponseDto | null>(null);
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
    const [currentPackage, setCurrentPackage] = useState(0);
    const [packageCount, setPackageCount] = useState(1);
    const [parcels, setParcels] = useState([{height: 0, width: 0, length: 0, weight: 0}]);
    const [editingParcel, setEditingParcel] = useState<{ index: number; parcel: CreateParcelDto } | null>(null);

    useEffect(() => {
        const getSimulationResults = async () => {
            try {
                const simulationData = await getSimulation();

                if (!simulationData) {
                    router.push('/client/simulation');
                    return;
                }

                console.log("log ====> simulationData in SimulationResults.tsx after calling getSimulationById function: ", simulationData);

                setResults(simulationData);
                setIsLoading(false);
            } catch (error) {
                toast.error("Erreur de chargement des résultats.");
            }
        };
        getSimulationResults();
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
            setDeparture(prev => ({...prev, city: '', agencyName: ''}));
        }
    }, [departure.country]);

    useEffect(() => {
        if (departure.city && departure.country) {
            fetchAgencies(departure.city).then(data => setOptions(prev => ({
                ...prev,
                departureAgencies: data
            }))).catch(console.error);
            setDeparture(prev => ({...prev, agencyName: ''}));
        }
    }, [departure.city, departure.country]);

    useEffect(() => {
        if (destination.country) {
            fetchCities(destination.country).then(data => setOptions(prev => ({
                ...prev,
                destinationCities: data
            }))).catch(console.error);
            setDestination(prev => ({...prev, city: '', agencyName: ''}));
        }
    }, [destination.country]);

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

    const handleParcelEdit = (index: number) => {
        if (simulationData?.parcels) {
            setEditingParcel({index, parcel: {...simulationData.parcels[index]}});
        }
    };

    const handleParcelUpdate = () => {
        if (simulationData && editingParcel) {
            const updatedParcels = [...simulationData.parcels];
            updatedParcels[editingParcel.index] = editingParcel.parcel;
            setSimulationData({...simulationData, parcels: updatedParcels});
            setEditingParcel(null);
        }
    };

    const handleAddParcel = () => {
        if (simulationData) {
            const newParcel: CreateParcelDto = {height: 0, width: 0, length: 0, weight: 0};
            setSimulationData({
                ...simulationData,
                parcels: [...(simulationData.parcels || []), newParcel],
            });
        }
    };

    const handleRemoveParcel = (index: number) => {
        if (simulationData?.parcels) {
            const updatedParcels = simulationData.parcels.filter((_, i) => i !== index);
            setSimulationData({...simulationData, parcels: updatedParcels});
        }
    };

    if (isLoading) {
        return (
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                className="flex items-center justify-center min-h-screen"
            >
                <motion.div
                    animate={{rotate: 360}}
                    transition={{repeat: Infinity, duration: 1, ease: 'linear'}}
                    className="rounded-full h-16 w-16 border-4 border-transparent border-b-blue-500"
                />
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2}}
            className="p-6 bg-white rounded-md shadow-md"
        >
            <motion.h2
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.1}}
                className="text-center text-3xl font-bold text-blue-600"
            >
                Détails de votre simulation <br/>

            </motion.h2>

            <form className="space-y-6">
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
                        />
                        <AgencySelect
                            label="Agence de départ"
                            value={departure.agencyName}
                            onChange={(e) => handleDepartureChange('agencyName', e.target.value)}
                            agencies={options.departureAgencies}
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
                        />
                        <AgencySelect label="Agence de destination"
                                      value={destination.agencyName}
                                      onChange={(e) => handleDestinationChange('agencyName', e.target.value)}
                                      agencies={options.destinationAgencies}
                        />
                    </div>
                </motion.div>

                {/* Parcels Section */}
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>
                            <Package className="h-5 w-5 text-blue-500"/> Colis
                        </CardTitle>
                        <Button onClick={handleAddParcel}>
                            <PlusCircle className="h-4 w-4"/> Ajouter un Colis
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <CardBody className="grid md:grid-cols-2 gap-4">
                            {results?.parcels.map((_parcel, index) => (
                                <div key={index}
                                     className="relative p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Button
                                            className="p-1 bg-blue-500 text-white rounded-full"
                                            onClick={() => handleParcelEdit(index)}
                                        >
                                            <Edit className="h-4 w-4"/>
                                        </Button>
                                        <Button
                                            className="p-1 bg-red-500 text-white rounded-full"
                                            onClick={() => handleRemoveParcel(index)}
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                    <p className="text-sm font-medium">Colis {index + 1}</p>
                                    <p>Hauteur: {_parcel.height} cm</p>
                                    <p>Largeur: {_parcel.width} cm</p>
                                    <p>Longueur: {_parcel.length} cm</p>
                                    <p>Poids: {_parcel.weight} kg</p>
                                </div>
                            ))}
                        </CardBody>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="submit">Enregistrer</Button>
                    <Button type="button" variant="destructive" onClick={() => router.back()}>
                        Annuler
                    </Button>
                </div>
            </form>
        </motion.div>
    );
};

export default SimulationEditForm;
