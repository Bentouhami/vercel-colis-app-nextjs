// path: src/components/forms/SimulationForms/SimulationEditForm.tsx

'use client';

import React, {
    useCallback,
    useEffect,
    useState,
    useTransition,
} from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import {
    PartielUpdateSimulationDto,
    SimulationResponseDto,
    CreateParcelDto,
} from '@/services/dtos';

import {
    getSimulation,
    updateSimulationEdited,
} from '@/services/frontend-services/simulation/SimulationService';
import {
    getAgenciesByCityId,
    getCitiesByCountryId,
    getAllCountries,
    getDestinationCountries,
} from '@/services/frontend-services/AddressService';

import { updateSimulationUserId } from '@/services/backend-services/Bk_SimulationService';
import { checkAuthStatus } from '@/lib/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ArrowRight,
    Calculator,
    Edit,
    MapPin,
    Package,
    PlusCircle,
    Trash2,
    Truck,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

// Custom form components
import CountrySelect from '@/components/forms/SimulationForms/CountrySelectForm';
import CitySelect from '@/components/forms/SimulationForms/CitySelectForm';
import AgencySelect from '@/components/forms/SimulationForms/AgencySelectForm';

// Zod schema for parcel validation (if you want to keep it)
import { parcelsSchema } from '@/utils/validationSchema';
import { z } from 'zod';
import SimulationSkeleton from "@/components/skeletons/SimulationSkeleton";

// Add these type definitions at the top of the file, after the imports
type Country = { id: number; name: string };
type City = { id: number; name: string };
type Agency = { id: number; name: string };

/**
 * Simulation Edit Form
 */
const SimulationEditForm = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Authentication
    const [userId, setUserId] = useState<string | number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // The entire simulation object from the backend
    const [simulation, setSimulation] = useState<SimulationResponseDto | null>(null);

    // Loading indicator while fetching
    const [isLoading, setIsLoading] = useState(true);

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

    // For the dropdown options
    const [options, setOptions] = useState<{
        departureCountries: { id: number; name: string }[];
        destinationCountries: { id: number; name: string }[];
        departureCities: { id: number; name: string }[];
        departureAgencies: { id: number; name: string }[];
        destinationCities: { id: number; name: string }[];
        destinationAgencies: { id: number; name: string }[];
    }>({
        departureCountries: [],
        destinationCountries: [],
        departureCities: [],
        departureAgencies: [],
        destinationCities: [],
        destinationAgencies: [],
    });

    // Parcels
    const [parcels, setParcels] = useState<CreateParcelDto[]>([
        { height: 0, width: 0, length: 0, weight: 0 },
    ]);
    // Track which parcel is being edited
    const [editingParcel, setEditingParcel] = useState<{
        index: number;
        parcel: CreateParcelDto;
    } | null>(null);

    /**
     * Check user auth
     */
    useEffect(() => {
        const checkAuth = async () => {
            const authResult = await checkAuthStatus(false);
            setIsAuthenticated(authResult.isAuthenticated);
            setUserId(authResult.userId || null);
        };
        checkAuth();
    }, []);

    /**
     * On mount, retrieve the existing simulation and fill states
     */
    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Simulation
            const simData = await getSimulation();
            if (!simData) {
                toast.error('No simulation to edit. Redirecting...');
                router.push('/client/simulation');
                return;
            }

            // 2. Link user if not yet linked
            if (isAuthenticated && userId && !simData.userId) {
                await updateSimulationUserId(simData.id, Number(userId));
                simData.userId = Number(userId);
            }

            setSimulation(simData);

            // 3. Departure countries
            const countries = await getAllCountries();
            setOptions(prev => ({ ...prev, departureCountries: countries }));

            const departureCountry = countries.find((c: { name: string | null; }) => c.name === simData.departureCountry);
            if (!departureCountry) return;
            setDeparture(prev => ({ ...prev, country: departureCountry.id.toString() }));

            // 4. Departure cities
            const cities = await getCitiesByCountryId(departureCountry.id);
            setOptions(prev => ({ ...prev, departureCities: cities }));

            const departureCity = cities.find((c: { name: string | null; }) => c.name === simData.departureCity);
            if (!departureCity) return;
            setDeparture(prev => ({ ...prev, city: departureCity.id.toString() }));

            // 5. Departure agencies
            const agencies = await getAgenciesByCityId(departureCity.id);
            setOptions(prev => ({ ...prev, departureAgencies: agencies }));

            const departureAgency = agencies.find((a: { name: string | null; }) => a.name === simData.departureAgency);
            if (!departureAgency) return;
            setDeparture(prev => ({ ...prev, agencyName: departureAgency.id.toString() }));

            // 6. Destination countries
            const destCountries = await getDestinationCountries(departureCountry.id);
            setOptions(prev => ({ ...prev, destinationCountries: destCountries }));

            const destinationCountry = destCountries.find((c: { name: string | null; }) => c.name === simData.destinationCountry);
            if (!destinationCountry) return;
            setDestination(prev => ({ ...prev, country: destinationCountry.id.toString() }));

            // 7. Destination cities
            const destCities = await getCitiesByCountryId(destinationCountry.id);
            setOptions(prev => ({ ...prev, destinationCities: destCities }));

            const destinationCity = destCities.find((c: { name: string | null; }) => c.name === simData.destinationCity);
            if (!destinationCity) return;
            setDestination(prev => ({ ...prev, city: destinationCity.id.toString() }));

            // 8. Destination agencies
            const destAgencies = await getAgenciesByCityId(destinationCity.id);
            setOptions(prev => ({ ...prev, destinationAgencies: destAgencies }));

            const destinationAgency = destAgencies.find((a: { name: string | null; }) => a.name === simData.destinationAgency);
            if (!destinationAgency) return;
            setDestination(prev => ({ ...prev, agencyName: destinationAgency.id.toString() }));

            // 9. Parcels
            if (simData.parcels?.length > 0) {
                setParcels(simData.parcels);
            }
        } catch (error) {
            console.error('Error fetching initial data:', error);
            toast.error('Error loading simulation data. Redirecting...');
            router.push('/client/simulation');
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, userId, router]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    //==================================
    //   FETCH DEPARTURE CITIES
    //==================================
    useEffect(() => {
        if (!departure.country) {
            setOptions(prev => ({ ...prev, departureCities: [] }));
            return;
        }

        (async () => {
            try {
                const countryId = Number(departure.country);
                const data = await getCitiesByCountryId(countryId);
                setOptions(prev => ({ ...prev, departureCities: data }));
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
            return;
        }

        (async () => {
            try {
                const cityObj = options.departureCities.find(c => c.id.toString() === departure.city);
                if (cityObj) {
                    const data = await getAgenciesByCityId(cityObj.id);
                    setOptions(prev => ({ ...prev, departureAgencies: data }));
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
            setOptions(prev => ({ ...prev, destinationCountries: [] }));
            return;
        }

        (async () => {
            try {
                const data = await getDestinationCountries(departure.country);
                setOptions(prev => ({ ...prev, destinationCountries: data }));
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
            return;
        }

        (async () => {
            try {
                const countryId = Number(destination.country);
                const data = await getCitiesByCountryId(countryId);
                setOptions(prev => ({ ...prev, destinationCities: data }));
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
            return;
        }

        (async () => {
            try {
                const cityObj = options.destinationCities.find(c => c.id.toString() === destination.city);
                if (cityObj) {
                    const data = await getAgenciesByCityId(cityObj.id);
                    setOptions(prev => ({ ...prev, destinationAgencies: data }));
                }
            } catch (error) {
                console.error("Error fetching destination agencies:", error);
                toast.error("Failed to fetch destination agencies. Please try again.");
            }
        })();
    }, [destination.city, options.destinationCities]);

    /**
     * Handlers for departure/destination changes
     */
    const handleDepartureChange = (field: keyof typeof departure, value: string) => {
        setDeparture((prev) => ({ ...prev, [field]: value }));
    };
    const handleDestinationChange = (
        field: keyof typeof destination,
        value: string
    ) => {
        setDestination((prev) => ({ ...prev, [field]: value }));
    };

    /**
     * Add a new parcel
     */
    const handleAddParcel = () => {
        setParcels((prev) => [
            ...prev,
            { height: 0, width: 0, length: 0, weight: 0 },
        ]);
    };

    /**
     * Remove a parcel
     */
    const handleRemoveParcel = (index: number) => {
        if (parcels.length <= 1) {
            toast.error('You must have at least one parcel');
            return;
        }
        setParcels(parcels.filter((_, i) => i !== index));
        toast.success('Parcel removed successfully');
    };

    /**
     * Start editing a parcel
     */
    const handleEditParcel = (index: number) => {
        setEditingParcel({
            index,
            parcel: { ...parcels[index] },
        });
    };

    /**
     * Save changes to the currently editing parcel
     */
    const handleParcelUpdate = () => {
        if (!editingParcel) return;
        const updatedParcels = [...parcels];
        updatedParcels[editingParcel.index] = editingParcel.parcel;

        // Optional: if you want to validate with zod
        const parcelsArraySchema = z.array(parcelsSchema);
        const validated = parcelsArraySchema.safeParse(updatedParcels);
        if (!validated.success) {
            toast.error(validated.error.errors[0].message);
            return;
        }

        setParcels(updatedParcels);
        setEditingParcel(null);
        toast.success('Parcel updated successfully');
    };

    /**
     * Submit the edited simulation
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!simulation) {
            toast.error('No simulation found to update.');
            return;
        }
        setIsLoading(true);

        startTransition(() => {
            (async () => {
                try {
                    // Get the names for the agencies
                    const departureAgency = options.departureAgencies.find(a => a.id.toString() === departure.agencyName);
                    const destinationAgency = options.destinationAgencies.find(a => a.id.toString() === destination.agencyName);

                    if (!departureAgency || !destinationAgency) {
                        toast.error('Invalid agency selection');
                        setIsLoading(false);
                        return;
                    }

                    // Get the names for the cities
                    const departureCity = options.departureCities.find(c => c.id.toString() === departure.city);
                    const destinationCity = options.destinationCities.find(c => c.id.toString() === destination.city);

                    if (!departureCity || !destinationCity) {
                        toast.error('Invalid city selection');
                        setIsLoading(false);
                        return;
                    }

                    // Get the names for the countries
                    const departureCountry = options.departureCountries.find(c => c.id.toString() === departure.country);
                    const destinationCountry = options.destinationCountries.find(c => c.id.toString() === destination.country);

                    if (!departureCountry || !destinationCountry) {
                        toast.error('Invalid country selection');
                        setIsLoading(false);
                        return;
                    }

                    const simulationData: PartielUpdateSimulationDto = {
                        id: simulation.id,
                        userId: simulation.userId,
                        destinataireId: simulation.destinataireId,
                        departureCountry: departure.country,
                        departureCity: departure.city,
                        departureAgency: departure.agencyName,
                        destinationCountry: destination.country,
                        destinationCity: destination.city,
                        destinationAgency: destination.agencyName,
                        parcels: parcels,
                        simulationStatus: simulation.simulationStatus,
                        envoiStatus: simulation.envoiStatus,
                    };

                    // Actually call the update service
                    const response = await updateSimulationEdited(simulationData);
                    if (!response) {
                        toast.error('Error while updating simulation.');
                        setIsLoading(false);
                        return;
                    }

                    toast.success('Simulation updated successfully!');
                    router.push('/client/simulation/results');
                } catch (error) {
                    console.error('Error updating simulation:', error);
                    toast.error('An error occurred while updating the simulation.');
                } finally {
                    setIsLoading(false);
                }
            })();
        });
    };

    /**
     * Render the Parcel-Edit modal if editingParcel is set
     */
    const renderParcelEditDialog = () => {
        if (!editingParcel) return null;
        return (
            <Dialog
                open={!!editingParcel}
                onOpenChange={() => setEditingParcel(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier le colis</DialogTitle>
                        <DialogDescription>
                            Mettez à jour les dimensions et le poids du colis
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="height" className="text-right">
                                Hauteur (cm)
                            </label>
                            <Input
                                id="height"
                                type="number"
                                value={editingParcel.parcel.height}
                                onChange={(e) =>
                                    setEditingParcel((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                parcel: {
                                                    ...prev.parcel,
                                                    height: Number(e.target.value),
                                                },
                                            }
                                            : null
                                    )
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="width" className="text-right">
                                Largeur (cm)
                            </label>
                            <Input
                                id="width"
                                type="number"
                                value={editingParcel.parcel.width}
                                onChange={(e) =>
                                    setEditingParcel((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                parcel: {
                                                    ...prev.parcel,
                                                    width: Number(e.target.value),
                                                },
                                            }
                                            : null
                                    )
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="length" className="text-right">
                                Longueur (cm)
                            </label>
                            <Input
                                id="length"
                                type="number"
                                value={editingParcel.parcel.length}
                                onChange={(e) =>
                                    setEditingParcel((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                parcel: {
                                                    ...prev.parcel,
                                                    length: Number(e.target.value),
                                                },
                                            }
                                            : null
                                    )
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="weight" className="text-right">
                                Poids (kg)
                            </label>
                            <Input
                                id="weight"
                                type="number"
                                value={editingParcel.parcel.weight}
                                onChange={(e) =>
                                    setEditingParcel((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                parcel: {
                                                    ...prev.parcel,
                                                    weight: Number(e.target.value),
                                                },
                                            }
                                            : null
                                    )
                                }
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setEditingParcel(null)}>
                            Annuler
                        </Button>
                        <Button onClick={handleParcelUpdate}>Enregistrer</Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    // Add a useEffect to log state changes
    useEffect(() => {
        console.log('Current state:', {
            departure,
            destination,
            options,
            parcels
        });
    }, [departure, destination, options, parcels]);

    /**
     * If loading, show a spinner or skeleton
     */
    if (isLoading) {
        return <SimulationSkeleton />;
    }

    /**
     * Render
     */
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-white rounded-md shadow-md"
        >
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center text-3xl font-bold text-blue-600"
            >
                Modifier la Simulation
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Departure */}
                <div className="p-6 bg-white rounded-md shadow-md">
                    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                        <MapPin className="text-blue-500" />
                        Informations de Départ
                    </h3>
                    <CountrySelect
                        label="Pays de départ"
                        value={departure.country}
                        onChange={(e) => handleDepartureChange('country', e.target.value)}
                        // We pass in the entire array of departureCountries from state
                        countries={options.departureCountries}
                        disabled={isPending}
                        placeholder="Sélectionnez un pays de départ"
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

                {/* Destination */}
                <div className="p-6 bg-white rounded-md shadow-md">
                    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                        <Truck className="text-blue-500" />
                        Informations de Destination
                    </h3>
                    <CountrySelect
                        label="Pays de destination"
                        value={destination.country}
                        onChange={(e) =>
                            handleDestinationChange('country', e.target.value)
                        }
                        countries={options.destinationCountries}
                        disabled={!departure.agencyName || isPending}
                        placeholder="Sélectionnez d'abord un pays de départ"
                    />
                    <CitySelect
                        label="Ville de destination"
                        value={destination.city}
                        onChange={(e) =>
                            handleDestinationChange('city', e.target.value)
                        }
                        cities={options.destinationCities}
                        disabled={!destination.country}
                    />
                    <AgencySelect
                        label="Agence d'arrivée"
                        value={destination.agencyName}
                        onChange={(e) =>
                            handleDestinationChange('agencyName', e.target.value)
                        }
                        agencies={options.destinationAgencies}
                        disabled={!destination.city || isPending}
                    />
                </div>

                {/* Parcels */}
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Package className="text-blue-500" />
                            Colis
                        </CardTitle>
                        <Button type="button" onClick={handleAddParcel}>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Ajouter un Colis
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                            {parcels.map((parcel, index) => (
                                <div
                                    key={index}
                                    className="relative p-4 bg-white border border-gray-200 rounded-md shadow-sm"
                                >
                                    {/* Edit / Remove buttons */}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Button
                                            type="button"
                                            className="p-1 bg-blue-500 text-white rounded-full"
                                            onClick={() => handleEditParcel(index)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            className="p-1 bg-red-500 text-white rounded-full"
                                            onClick={() => handleRemoveParcel(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <p className="text-sm font-medium">Colis {index + 1}</p>
                                    <p>Hauteur: {parcel.height} cm</p>
                                    <p>Largeur: {parcel.width} cm</p>
                                    <p>Longueur: {parcel.length} cm</p>
                                    <p>Poids: {parcel.weight} kg</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="text-center">
                    <Button type="submit" disabled={isPending} className="flex items-center gap-2">
                        {isPending ? (
                            <>
                                <Calculator className="h-4 w-4" />
                                Mise à jour...
                            </>
                        ) : (
                            <>
                                <ArrowRight className="h-4 w-4" />
                                Mettre à jour la simulation
                            </>
                        )}
                    </Button>
                </div>
            </form>

            {/* Parcel edit modal */}
            {renderParcelEditDialog()}
        </motion.div>
    );
};

export default SimulationEditForm;