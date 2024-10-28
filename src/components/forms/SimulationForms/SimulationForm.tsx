// path: src/components/forms/SimulationForm.tsx
'use client';


import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Pagination, Row } from 'react-bootstrap';
import PackageForm from './PackageForm';
import CountrySelect from "@/components/forms/SimulationForms/CountrySelectForm";
import CitySelect from "@/components/forms/SimulationForms/CitySelectForm";
import AgencySelect from "@/components/forms/SimulationForms/AgencySelectForm";
import {  submitSimulation } from "@/services/frontend-services/simulation/SimulationService";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from 'next/navigation';
import { simulationEnvoisSchema } from "@/utils/validationSchema";
import {
    fetchAgencies,
    fetchCities,
    fetchCountries,
    fetchDestinationCountries
} from "@/services/frontend-services/AddresseService";
import {BaseSimulationDto} from "@/utils/dtos";


const SimulationForm = () => {
    const router = useRouter();

    // États regroupés pour les informations de départ et de destination
    const [departure, setDeparture] = useState({
        country: '',
        city: '',
        agency: ''
    });

    const [destination, setDestination] = useState({
        country: '',
        city: '',
        agency: ''
    });

    // États regroupés pour les options de pays, villes et agences
    const [options, setOptions] = useState({
        countries: [], // tous les pays
        destinationCountries: [], // les pays de destination
        departureCities: [],
        departureAgencies: [],
        destinationCities: [],
        destinationAgencies: []
    });

    const [packageCount, setPackageCount] = useState(1);
    const [parcels, setParcels] = useState([{ height: 0, width: 0, length: 0, weight: 0 }]);
    const [currentPackage, setCurrentPackage] = useState(0);

    // Récupérer les pays de départ disponibles
    useEffect(() => {
        // appel de service pour récupérer les pays de départ
        fetchCountries().then((data) => setOptions((prev) => ({ ...prev, countries: data }))).catch(console.error);
    }, []);

    // Récupérer les pays de destination disponibles
    useEffect(() => {
        // vérification si le pays de départ est bien choisi
        if (departure.country) {

            // appel la méthod de la couche service
            fetchDestinationCountries(departure.country).then((data) =>
                setOptions((prev) => ({ ...prev, destinationCountries: data }))
            ).catch(console.error);
        }
    }, [departure.country]);

    // Récupérer les villes disponibles pour le départ
    useEffect(() => {
        if (departure.country) {
            fetchCities(departure.country).then((data) =>
                setOptions((prev) => ({ ...prev, departureCities: data }))
            ).catch(console.error);
            setDeparture((prev) => ({ ...prev, city: '', agency: '' }));
        }
    }, [departure.country]);

    // Récupérer les agences disponibles pour le départ
    useEffect(() => {
        if (departure.city && departure.country) {
            console.log("Fetching agencies for city:", departure.city);
            fetchAgencies(departure.city).then((data) =>
                setOptions((prev) => ({ ...prev, departureAgencies: data }))
            ).catch(console.error);
            setDeparture((prev) => ({ ...prev, agency: '' }));
        }
    }, [departure.city, departure.country]);


    // Récupérer les villes disponibles pour la destination
    useEffect(() => {
        if (destination.country) {
            fetchCities(destination.country).then((data) =>
                setOptions((prev) => ({ ...prev, destinationCities: data }))
            ).catch(console.error);
            setDestination((prev) => ({ ...prev, city: '', agency: '' }));
        }
    }, [destination.country]);

    // Récupérer les agences disponibles pour la destination
    useEffect(() => {
        if (destination.city) {
            // Passez uniquement la ville à la fonction fetchAgencies
            fetchAgencies(destination.city).then((data) =>
                setOptions((prev) => ({ ...prev, destinationAgencies: data }))
            ).catch(console.error);
            setDestination((prev) => ({ ...prev, agency: '' }));
        }
    }, [destination.city]);


    // Mise à jour des états pour les informations de départ et de destination
    const handleDepartureChange = (field: keyof typeof departure, value: string) => {
        setDeparture((prev) => ({ ...prev, [field]: value }));
    };

    const handleDestinationChange = (field: keyof typeof destination, value: string) => {
        setDestination((prev) => ({ ...prev, [field]: value }));
    };

    // Mettre à jour les dimensions du colis en fonction de l'index
    const handlePackageChange = (index: number, field: string, value: number) => {
        const updatedPackages = parcels.map((pkg, i) => (i === index ? { ...pkg, [field]: value } : pkg));
        setParcels(updatedPackages);
    };

    // Mettre à jour le nombre de colis en fonction de l'entrée de l'utilisateur
    const handlePackageCountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const count = parseInt(e.target.value, 10);
        setPackageCount(count);
        const newPackages = Array.from({ length: count }, (_, i) => parcels[i] || { height: 0, width: 0, length: 0, weight: 0 });
        setParcels(newPackages);
    };

    const handlePageChange = (pageIndex: number) => {
        setCurrentPackage(pageIndex);
    };

    // Fonction pour soumettre le formulaire
    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("handleSubmit function called");
        // Préparer les types de données pour l'envoi de la simulation
        const simulationData: BaseSimulationDto = {
            departureCountry: departure.country,
            departureCity: departure.city,
            departureAgency: departure.agency,
            destinationCountry: destination.country,
            destinationCity: destination.city,
            destinationAgency: destination.agency,
            parcels
        };


        // log ⇒ simulationData in handleSubmit function:
        console.log("simulationData in handleSubmit function: ", simulationData);

        // validation avec ZOD
        const validated = simulationEnvoisSchema.safeParse(simulationData);

        if (!validated.success) {
            toast.error(validated.error.errors[0].message);
            return;
        }


        // log ⇒ validated in handleSubmit function:
        console.log("validated in handleSubmit function: ", validated.data);

        try {
            console.log("trying to submit simulationData to function submitSimulation in SimulationService.ts");

            // apple le service de simulation pour envoyer la simulation et retourné l'id de la simulation
            console.log("about to send simulationData to submitSimulation function in SimulationService.ts from the frontend side as BaseSimulationDto");
            const simulation = await submitSimulation(simulationData);
            console.log("simulation in handleSubmit function: ", simulation);

            if(!simulation) {
                toast.error(" 1 . An error occurred while submitting the simulation.");
                return;
            }

            // ici, j'appelle la function de calcul de simulation en passant son id et je renvoie les résultats de la simulation


            toast.success("Simulation successful!");
            const query = new URLSearchParams({ data: JSON.stringify(simulation) }).toString();
            router.push(`/client/simulation/results?${query}`);
        } catch (error) {
            console.error('Error submitting simulation:', error);
            toast.error('An error occurred while submitting the simulation.');
        }
    };

    return (
        <Container className="mt-2 mb-5 bg-purple-800 text-white p-5 rounded-3 drop-shadow-2xl shadow border border-purple-700">
            <Form className="w-100" onSubmit={handleSubmit}>
                <Row>
                    <Col lg={6} xs={12}>
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
                    </Col>
                    <Col lg={6} xs={12} className="mt-3 mt-lg-0">
                        <Form.Group controlId="packageCount">
                            <Form.Label>Nombre de colis</Form.Label>
                            <Form.Control
                                type="number"
                                max="5"
                                value={packageCount}
                                onChange={handlePackageCountChange}
                                min="1"
                            />
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
                                <Pagination className="justify-content-center mt-3 mt-lg-0">
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
                        </Form.Group>
                    </Col>
                </Row>
                <div className="d-flex justify-content-center mt-3">
                    <Button className="me-2" type="submit" variant="primary">Soumettre</Button>
                </div>
            </Form>
            <ToastContainer
                theme="colored"
                position={"bottom-right"}
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={true}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </Container>
    );
};

export default SimulationForm;
