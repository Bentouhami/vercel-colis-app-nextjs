// path: src/components/forms/SimulationForms/SimulationEditForm.tsx

'use client';

import React, {
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
    fetchAgencies,
    fetchCities,
    fetchCountries,
    fetchDestinationCountries,
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
     * Fetch initial departure countries
     */
    useEffect(() => {
        fetchCountries()
            .then((data) => {
                setOptions((prev) => ({
                    ...prev,
                    departureCountries: data,
                }));
            })
            .catch((err) => {
                console.error('Error fetching departure countries:', err);
                toast.error('Error fetching departure countries');
            });
    }, []);

    /**
     * On mount, retrieve the existing simulation and fill states
     */
    useEffect(() => {
        const fetchSimulation = async () => {
            setIsLoading(true);
            try {
                const simData = await getSimulation();
                if (!simData) {
                    toast.error('No simulation to edit. Redirecting...');
                    router.push('/client/simulation');
                    return;
                }

                if (isAuthenticated && userId && !simData.userId) {
                    await updateSimulationUserId(simData.id, Number(userId));
                    simData.userId = Number(userId);
                }

                setSimulation(simData);

                // Fetch countries first (ensures country exists before setting cities)
                const countries = await fetchCountries();
                setOptions((prev) => ({ ...prev, departureCountries: countries }));

                // Find the correct country object
                const departureCountry = countries.find((c: { name: string | null; }) => c.name === simData.departureCountry);
                if (departureCountry) {
                    setDeparture((prev) => ({ ...prev, country: departureCountry.id.toString() }));

                    // Fetch cities for the selected country
                    const cities = await fetchCities(departureCountry.id);
                    setOptions((prev) => ({ ...prev, departureCities: cities }));

                    // Find and set the correct city
                    const departureCity = cities.find((c: { name: string | null; }) => c.name === simData.departureCity);
                    if (departureCity) {
                        setDeparture((prev) => ({ ...prev, city: departureCity.id.toString() }));

                        // Fetch agencies for the selected city
                        const agencies = await fetchAgencies(departureCity.id);
                        setOptions((prev) => ({ ...prev, departureAgencies: agencies }));

                        // Find and set the correct agency
                        const departureAgency = agencies.find((a: { name: string | null; }) => a.name === simData.departureAgency);
                        if (departureAgency) {
                            setDeparture((prev) => ({ ...prev, agencyName: departureAgency.id.toString() }));
                        }
                    }
                }

                // Repeat the same logic for destination
                const destinationCountry = countries.find((c: { name: string | null; }) => c.name === simData.destinationCountry);
                if (destinationCountry) {
                    setDestination((prev) => ({ ...prev, country: destinationCountry.id.toString() }));

                    const destCities = await fetchCities(destinationCountry.id);
                    setOptions((prev) => ({ ...prev, destinationCities: destCities }));

                    const destinationCity = destCities.find((c: { name: string | null; }) => c.name === simData.destinationCity);
                    if (destinationCity) {
                        setDestination((prev) => ({ ...prev, city: destinationCity.id.toString() }));

                        const destAgencies = await fetchAgencies(destinationCity.id);
                        setOptions((prev) => ({ ...prev, destinationAgencies: destAgencies }));

                        const destinationAgency = destAgencies.find((a: { name: string | null; }) => a.name === simData.destinationAgency);
                        if (destinationAgency) {
                            setDestination((prev) => ({ ...prev, agencyName: destinationAgency.id.toString() }));
                        }
                    }
                }

                // Set parcels
                if (simData.parcels && simData.parcels.length > 0) {
                    setParcels(simData.parcels);
                }

            } catch (error) {
                console.error('Error fetching simulation:', error);
                toast.error('Error fetching simulation. Redirecting...');
                router.push('/client/simulation');
            }
            setIsLoading(false);
        };

        fetchSimulation();
    }, [isAuthenticated, userId, router]);



    //==================================
    //   FETCH DEPARTURE COUNTRIES
    //==================================
    useEffect(() => {
        (async () => {
            try {
                const data = await fetchCountries();
                setOptions(prev => ({ ...prev, countries: data }));
                setIsLoading(false); // when countries are loaded
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

                    // (Optional) Validate with zod if you have a schema

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

    /**
     * If loading, show a spinner or skeleton
     */
    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-screen"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="rounded-full h-16 w-16 border-4 border-transparent border-b-blue-500"
                />
            </motion.div>
        );
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
                        placeholder="Sélectionnez d’abord un pays de départ"
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
