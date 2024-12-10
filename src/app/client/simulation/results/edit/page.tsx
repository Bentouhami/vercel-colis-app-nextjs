'use client';

import React, { useEffect, useState, useTransition} from 'react';
import {motion} from 'framer-motion';
import {Button, Spinner} from 'react-bootstrap';
import CountrySelect from "@/components/forms/SimulationForms/CountrySelectForm";
import CitySelect from "@/components/forms/SimulationForms/CitySelectForm";
import AgencySelect from "@/components/forms/SimulationForms/AgencySelectForm";
import {
    fetchAgencies,
    fetchCities,
    fetchCountries,
    fetchDestinationCountries
} from "@/services/frontend-services/AddresseService";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {FullSimulationDto} from "@/services/dtos";
import {getSimulation} from "@/services/frontend-services/simulation/SimulationService";
import ParcelsManager from "@/components/forms/parcels/ParcelsManager";

import {updateSimulationWithSenderAndDestinataireIds} from "@/services/backend-services/simulationService";

import {SimulationStatus , EnvoiStatus} from "@/services/dtos";

const EditSimulationPage = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Form state
    const [departure, setDeparture] = useState({country: '', city: '', agencyName: ''});
    const [destination, setDestination] = useState({country: '', city: '', agencyName: ''});
    const [parcels, setParcels] = useState([
        {height: 0, width: 0, length: 0, weight: 0}
    ]);
    const maxParcels = 5;

    // Dropdown options
    const [options, setOptions] = useState({
        countries: [],
        destinationCountries: [],
        departureCities: [],
        departureAgencies: [],
        destinationCities: [],
        destinationAgencies: []
    });

    // Fetch simulation data and pre-fill the form
    useEffect(() => {
        const loadInitialSimulation = async () => {
            try {
                const simulationData = await getSimulation();
                if (!simulationData) {
                    toast.error("Aucune simulation trouvée.");
                    router.push('/client/simulation');
                    return;
                }

// Populate state with existing data
                setParcels(simulationData.parcels || []);
                // Set form state with initial data
                setDeparture({
                    country: simulationData.departureCountry || '',
                    city: simulationData.departureCity || '',
                    agencyName: simulationData.departureAgency || ''
                });
                setDestination({
                    country: simulationData.destinationCountry || '',
                    city: simulationData.destinationCity || '',
                    agencyName: simulationData.destinationAgency || ''
                });

                // Pre-fetch dropdown options
                fetchCountries().then((data) =>
                    setOptions((prev) => ({...prev, countries: data}))
                );
                if (simulationData.departureCountry) {
                    fetchDestinationCountries(simulationData.departureCountry).then((data) =>
                        setOptions((prev) => ({...prev, destinationCountries: data}))
                    );
                    fetchCities(simulationData.departureCountry).then((data) =>
                        setOptions((prev) => ({...prev, departureCities: data}))
                    );
                }
                if (simulationData.departureCity) {
                    fetchAgencies(simulationData.departureCity).then((data) =>
                        setOptions((prev) => ({...prev, departureAgencies: data}))
                    );
                }
                if (simulationData.destinationCountry) {
                    fetchCities(simulationData.destinationCountry).then((data) =>
                        setOptions((prev) => ({...prev, destinationCities: data}))
                    );
                }
                if (simulationData.destinationCity) {
                    fetchAgencies(simulationData.destinationCity).then((data) =>
                        setOptions((prev) => ({...prev, destinationAgencies: data}))
                    );
                }
            } catch (error) {
                console.error("Erreur lors du chargement de la simulation:", error);
                toast.error("Impossible de charger la simulation.");
            }
        };
        loadInitialSimulation();
    }, [router]);

    const handleDepartureChange = (field: keyof typeof departure, value: string) => {
        setDeparture((prev) => ({...prev, [field]: value}));
        if (field === 'country') {
            fetchCities(value).then((data) =>
                setOptions((prev) => ({...prev, departureCities: data, departureAgencies: []}))
            );
            setDeparture((prev) => ({...prev, city: '', agencyName: ''}));
        }
        if (field === 'city') {
            fetchAgencies(value).then((data) =>
                setOptions((prev) => ({...prev, departureAgencies: data}))
            );
            setDeparture((prev) => ({...prev, agencyName: ''}));
        }
    };

    const handleDestinationChange = (field: keyof typeof destination, value: string) => {
        setDestination((prev) => ({...prev, [field]: value}));
        if (field === 'country') {
            fetchCities(value).then((data) =>
                setOptions((prev) => ({...prev, destinationCities: data, destinationAgencies: []}))
            );
            setDestination((prev) => ({...prev, city: '', agencyName: ''}));
        }
        if (field === 'city') {
            fetchAgencies(value).then((data) =>
                setOptions((prev) => ({...prev, destinationAgencies: data}))
            );
            setDestination((prev) => ({...prev, agencyName: ''}));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        startTransition(() => {
            (async () => {
                try {
                    // Convert parcel dimensions to numbers
                    const normalizedParcels = parcels.map((parcel) => ({
                        height: Number(parcel.height),
                        width: Number(parcel.width),
                        length: Number(parcel.length),
                        weight: Number(parcel.weight),
                    }));

                    // Prepare the updated simulation data
                    const simulationData: FullSimulationDto = {
                        departureCountry: departure.country,
                        departureCity: departure.city,
                        departureAgency: departure.agencyName,
                        destinationCountry: destination.country,
                        destinationCity: destination.city,
                        destinationAgency: destination.agencyName,
                        parcels: normalizedParcels,
                        userId: null, // Set this based on your application logic
                        destinataireId: null, // Set this based on your application logic
                        totalWeight: normalizedParcels.reduce((sum, parcel) => sum + parcel.weight, 0),
                        totalVolume: normalizedParcels.reduce(
                            (sum, parcel) => sum + parcel.height * parcel.width * parcel.length,
                            0
                        ),
                        totalPrice: 0, // This should be calculated based on your business logic
                        departureDate: new Date(), // Set the correct departure date
                        arrivalDate: new Date(), // Set the correct arrival date
                        simulationStatus: SimulationStatus.DRAFT,
                        status: EnvoiStatus.PENDING,
                        id: 0,
                        departureAgencyId: null,
                        arrivalAgencyId: null
                    };

                    console.log("Prepared simulation data for update:", simulationData);

                    // Call the update function
                    await updateSimulationWithSenderAndDestinataireIds(simulationData);

                    toast.success("Simulation mise à jour avec succès !");
                    router.push('/client/simulation/results');
                } catch (error) {
                    console.error("Error updating the simulation:", error);
                    toast.error("Erreur lors de la mise à jour de la simulation.");
                }
            })();
        });
    };




    const handleCancel = () => {
        router.push('/client/simulation/results');
    };

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="container mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg"
        >
            <motion.h2
                initial={{y: -20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                className="text-center text-3xl font-bold text-blue-600 mb-8"
            >
                Modifier la Simulation
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Departure Information */}
                <div className="p-6 bg-white rounded-md shadow-md">
                    <h3 className="text-lg font-semibold text-blue-700 mb-4">Informations de Départ</h3>
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

                {/* Destination Information */}
                <div className="p-6 bg-white rounded-md shadow-md">
                    <h3 className="text-lg font-semibold text-blue-700 mb-4">Informations de Destination</h3>
                    <CountrySelect
                        label="Pays de destination"
                        value={destination.country}
                        onChange={(e) => handleDestinationChange('country', e.target.value)}
                        countries={options.countries}
                    />
                    <CitySelect
                        label="Ville de destination"
                        value={destination.city}
                        onChange={(e) => handleDestinationChange('city', e.target.value)}
                        cities={options.destinationCities}
                    />
                    <AgencySelect
                        label="Agence de destination"
                        value={destination.agencyName}
                        onChange={(e) => handleDestinationChange('agencyName', e.target.value)}
                        agencies={options.destinationAgencies}
                    />
                </div>

                {/* Parcel Management */}
                <div className="p-6 bg-white rounded-md shadow-md">
                    <ParcelsManager
                        parcels={parcels}
                        setParcels={setParcels}
                        maxParcels={maxParcels}
                    />
                </div>

                <div className="flex justify-between">
                    <Button
                        type="button"
                        variant="outline-danger"
                        className="px-6 py-2"
                        onClick={handleCancel}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="px-6 py-2"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Spinner as="span" animation="border" size="sm" role="status"/>
                        ) : (
                            "Mettre à jour"
                        )}
                    </Button>
                </div>
            </form>
        </motion.div>
    );
};

export default EditSimulationPage;
