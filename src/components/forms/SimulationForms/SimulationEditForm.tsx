'use client';

import React, {ChangeEvent, useEffect, useState, useTransition} from 'react';
import {motion} from 'framer-motion';
import {useRouter} from 'next/navigation';
import {CreateParcelDto, SimulationDtoRequest,} from '@/services/dtos';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Edit, MapPin, Package, PlusCircle, Trash2, Truck} from 'lucide-react';
import {toast} from 'react-toastify';
import {
    fetchAgencies,
    fetchCities,
    fetchCountries,
    fetchDestinationCountries
} from "@/services/frontend-services/AddresseService";
import {getSimulation, submitSimulation} from "@/services/frontend-services/simulation/SimulationService";
import AgencySelect from "@/components/forms/SimulationForms/AgencySelectForm";
import CitySelect from "@/components/forms/SimulationForms/CitySelectForm";
import CountrySelect from "@/components/forms/SimulationForms/CountrySelectForm";
import {CardBody} from "react-bootstrap";
import {simulationEnvoisSchema} from "@/utils/validationSchema";

const SimulationEditForm = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // States
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

    const [parcels, setParcels] = useState<CreateParcelDto[]>([{height: 0, width: 0, length: 0, weight: 0}]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingParcel, setEditingParcel] = useState<{ index: number, parcel: CreateParcelDto } | null>(null);

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

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const countries = await fetchCountries();

                setOptions((prev) => ({
                    ...prev,
                    countries,
                    filteredDestinationCountries: countries,
                }));
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };

        fetchInitialData();
    }, []);

    // Fetch simulation data on mount
    useEffect(() => {
        const fetchSimulationData = async () => {
            try {
                const simulationData = await getSimulation();

                if (!simulationData) {
                    router.push('/client/simulation');
                    return;
                }

                const countries = await fetchCountries();
                const departureCities = simulationData.departureCountry
                    ? await fetchCities(simulationData.departureCountry)
                    : [];
                const destinationCities = simulationData.destinationCountry
                    ? await fetchCities(simulationData.destinationCountry)
                    : [];
                const departureAgencies = simulationData.departureCity
                    ? await fetchAgencies(simulationData.departureCity)
                    : [];
                const destinationAgencies = simulationData.destinationCity
                    ? await fetchAgencies(simulationData.destinationCity)
                    : [];

                setOptions({
                    countries,
                    destinationCountries: countries,
                    departureCities,
                    destinationCities,
                    departureAgencies,
                    destinationAgencies,
                });

                setDeparture({
                    country: simulationData.departureCountry || '',
                    city: simulationData.departureCity || '',
                    agencyName: simulationData.departureAgency || '',
                });

                setDestination({
                    country: simulationData.destinationCountry || '',
                    city: simulationData.destinationCity || '',
                    agencyName: simulationData.destinationAgency || '',
                });

                setParcels(simulationData.parcels || []);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                toast.error("Erreur lors du chargement des résultats.");
                router.push('/client/simulation');
            }
        };

        fetchSimulationData();
    }, [router]);

    const handleDepartureChange = (field: keyof typeof departure, value: string) => {
        setDeparture(prev => ({...prev, [field]: value}));
    };

    const handleDestinationChange = (field: keyof typeof destination, value: string) => {
        setDestination(prev => ({...prev, [field]: value}));
    };

    const handleParcelEdit = (index: number) => {
        setEditingParcel({
            index,
            parcel: {...parcels[index]}
        });
    };

    const handleParcelRemove = (index: number) => {
        // Prevent removing the last parcel
        if (parcels.length > 1) {
            setParcels(parcels.filter((_, i) => i !== index));
            toast.success("Colis supprimé avec succès");
        } else {
            toast.error("Vous devez avoir au moins un colis");
        }
    };

    const handleParcelUpdate = () => {
        if (editingParcel) {
            const updatedParcels = [...parcels];
            updatedParcels[editingParcel.index] = editingParcel.parcel;

            // Validate parcel dimensions
            const {height, width, length, weight} = editingParcel.parcel;
            if (height <= 0 || width <= 0 || length <= 0 || weight <= 0) {
                toast.error("Toutes les dimensions et le poids doivent être supérieurs à zéro");
                return;
            }

            setParcels(updatedParcels);
            setEditingParcel(null);
            toast.success("Colis mis à jour avec succès");
        }
    };

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("save btn clicked");

        startTransition(() => {
            (async () => {
                const simulationData: SimulationDtoRequest = {
                    departureCountry: departure.country,
                    departureCity: departure.city,
                    departureAgency: departure.agencyName,
                    destinationCountry: destination.country,
                    destinationCity: destination.city,
                    destinationAgency: destination.agencyName,
                    parcels,
                };
                console.log("log ====> simulationData in handleSubmit function before calling submitSimulation function: ", simulationData);

                // validate data with zod schema
                const validated = simulationEnvoisSchema.safeParse(simulationData);

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
                }
            })();
        });
    };

    const renderParcelEditDialog = () => {
        if (!editingParcel) return null;

        return (
            <Dialog open={!!editingParcel} onOpenChange={() => setEditingParcel(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier le colis</DialogTitle>
                        <DialogDescription>
                            Mettez à jour les dimensions et le poids du colis
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="height" className="text-right">Hauteur (cm)</label>
                            <Input
                                id="height"
                                type="number"
                                value={editingParcel.parcel.height}
                                onChange={(e) => setEditingParcel(prev => prev ? {
                                    ...prev,
                                    parcel: {...prev.parcel, height: Number(e.target.value)}
                                } : null)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="width" className="text-right">Largeur (cm)</label>
                            <Input
                                id="width"
                                type="number"
                                value={editingParcel.parcel.width}
                                onChange={(e) => setEditingParcel(prev => prev ? {
                                    ...prev,
                                    parcel: {...prev.parcel, width: Number(e.target.value)}
                                } : null)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="length" className="text-right">Longueur (cm)</label>
                            <Input
                                id="length"
                                type="number"
                                value={editingParcel.parcel.length}
                                onChange={(e) => setEditingParcel(prev => prev ? {
                                    ...prev,
                                    parcel: {...prev.parcel, length: Number(e.target.value)}
                                } : null)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="weight" className="text-right">Poids (kg)</label>
                            <Input
                                id="weight"
                                type="number"
                                value={editingParcel.parcel.weight}
                                onChange={(e) => setEditingParcel(prev => prev ? {
                                    ...prev,
                                    parcel: {...prev.parcel, weight: Number(e.target.value)}
                                } : null)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setEditingParcel(null)}>Annuler</Button>
                        <Button onClick={handleParcelUpdate}>Enregistrer</Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
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
                Modifier la Simulation
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Departure Section */}
                <div className="p-6 bg-white rounded-md shadow-md">
                    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                        <MapPin className="text-blue-500"/> Informations de Départ
                    </h3>
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

                {/* Destination Section */}
                <div className="p-6 bg-white rounded-md shadow-md">
                    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                        <Truck className="text-blue-500"/> Informations de Destination
                    </h3>

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

                {/* Parcels Section */}
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>
                            <Package className="h-5 w-5 text-blue-500"/> Colis
                        </CardTitle>
                        <Button
                            type="button"
                            onClick={() => setParcels([
                                ...parcels,
                                {height: 0, width: 0, length: 0, weight: 0}
                            ])}
                        >
                            <PlusCircle className="h-4 w-4 mr-2"/> Ajouter un Colis
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <CardBody className="grid md:grid-cols-2 gap-4">
                            {parcels.map((parcel, index) => (
                                <div
                                    key={index}
                                    className="relative p-4 bg-white border border-gray-200 rounded-md shadow-sm"
                                >
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Button
                                            type="button"
                                            className="p-1 bg-blue-500 text-white rounded-full"
                                            onClick={() => handleParcelEdit(index)}
                                        >
                                            <Edit className="h-4 w-4"/>
                                        </Button>
                                        <Button
                                            type="button"
                                            className="p-1 bg-red-500 text-white rounded-full"
                                            onClick={() => handleParcelRemove(index)}
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                    <p className="text-sm font-medium">Colis {index + 1}</p>
                                    <p>Hauteur: {parcel.height} cm</p>
                                    <p>Largeur: {parcel.width} cm</p>
                                    <p>Longueur: {parcel.length} cm</p>
                                    <p>Poids: {parcel.weight} kg</p>
                                </div>
                            ))}
                        </CardBody>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="submit" variant="default">
                        Enregistrer
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => router.back()}
                    >
                        Annuler
                    </Button>
                </div>
            </form>

            {/* Render the Parcel Edit Dialog */}
            {renderParcelEditDialog()}
        </motion.div>
    );
};

export default SimulationEditForm;