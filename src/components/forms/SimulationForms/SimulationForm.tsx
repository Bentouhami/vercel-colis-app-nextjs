"use client";
// SimulationForm.tsx : Formulaire de simulation
import React, {ChangeEvent, useEffect, useState} from 'react';
import {Button, Col, Container, Form, Pagination, Row} from 'react-bootstrap';
import PackageForm from './PackageForm';
import CountrySelect from "@/components/forms/SimulationForms/CountrySelectForm";
import CitySelect from "@/components/forms/SimulationForms/CitySelectForm";
import AgencySelect from "@/components/forms/SimulationForms/AgencySelectForm";
import {fetchAgencies, fetchCities, fetchCountries, fetchDestinationCountries, submitSimulation} from "@/app/utils/api";
import {toast, ToastContainer} from "react-toastify";
import {useRouter} from 'next/navigation';
import {SimulationEnvoisDto} from "@/app/utils/dtos";

const SimulationForm = () => {
    const router = useRouter(); // Initialize useRouter
    const [departureCountry, setDepartureCountry] = useState('');
    const [departureCity, setDepartureCity] = useState('');
    const [departureAgency, setDepartureAgency] = useState('');
    const [destinationCountry, setDestinationCountry] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [destinationAgency, setDestinationAgency] = useState('');
    const [packageCount, setPackageCount] = useState(1);
    const [packages, setPackages] = useState([{height: 0, width: 0, length: 0, weight: 0}]);
    const [currentPackage, setCurrentPackage] = useState(0);


    // pays / villes / agences de départ
    const [countries, setCountries] = useState([]);
    const [destinationCountries, setDestinationCountries] = useState([]);
    const [departureCities, setDepartureCities] = useState([]);
    const [departureAgencies, setDepartureAgencies] = useState([]);
    const [destinationCities, setDestinationCities] = useState([]);
    const [destinationAgencies, setDestinationAgencies] = useState([]);


    // Récupérer les pays de départ disponibles pour le départ d'envoi
    useEffect(() => {
        fetchCountries().then(setCountries).catch(console.error);
    }, []);

    // Récupérer les pays de destination disponibles pour le départ d'envoi
    useEffect(() => {
        fetchDestinationCountries(departureCountry).then(setDestinationCountries).catch(console.error);
    }, [ departureCountry]);

    // Récupérer les villes disponibles pour le départ d'envoi
    useEffect(() => {
        if (departureCountry) {
            fetchCities(departureCountry).then(setDepartureCities).catch(console.error);
            setDepartureCity('');
            setDepartureAgency('');
        }
    }, [departureCountry]);

    // Récupérer les agences disponibles pour la destination
    useEffect(() => {
        if (departureCity && departureCountry) {
            fetchAgencies(departureCountry, departureCity).then(setDepartureAgencies).catch(console.error);
            setDepartureAgency('');
        }
    }, [departureCity, departureCountry]);

    // Récupérer les villes disponibles pour la destination
    useEffect(() => {
        if (destinationCountry) {
            fetchCities(destinationCountry).then(setDestinationCities).catch(console.error);
            setDestinationCity('');
            setDestinationAgency('');
        }
    }, [destinationCountry]);

    // Récupérer les agences disponibles pour la destination
    useEffect(() => {
        if (destinationCity && destinationCountry) {
            fetchAgencies(destinationCountry, destinationCity).then(setDestinationAgencies).catch(console.error);
            setDestinationAgency('');
        }
    }, [destinationCity, destinationCountry]);


    // Mettre à jour les dimensions du colis en fonction de l'index
    const handlePackageChange = (index: number, field: string, value: number) => {
        const updatedPackages = packages.map((pkg, i) => (
            i === index ? {...pkg, [field]: value} : pkg
        ));
        setPackages(updatedPackages);
    };

    // Mettre à jour le nombre de colis en fonction de l'entrée de l'utilisateur
    const handlePackageCountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const count = parseInt(e.target.value, 10);
        setPackageCount(count);
        const newPackages = Array.from({length: count}, (_, i) => packages[i] || {
            height: 0,
            width: 0,
            length: 0,
            weight: 0
        });
        setPackages(newPackages);
    };

// Function to handle form submission
    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const simulationData: SimulationEnvoisDto = {
            departureCountry,
            departureCity,
            departureAgency,
            destinationCountry,
            destinationCity,
            destinationAgency,
            packages,
        };

        try {
            const result = await submitSimulation(simulationData);

            toast.success("Simulation successful!");
            const query = new URLSearchParams({ data: JSON.stringify(result) }).toString();
            router.push(`/simulation/results?${query}`);
        } catch (error) {
            console.error('Error submitting simulation:', error);

            if (error instanceof Error) {
                toast.error(`Error: ${error.message}`);
            } else {
                toast.error('An unexpected error occurred.');
            }
        }
    };

    const handlePageChange = (pageIndex: number) => {
        setCurrentPackage(pageIndex);
    };

    return (
        <Container
            className="mt-2 mb-5 bg-purple-800 text-white p-5 rounded-3 drop-shadow-2xl shadow border border-purple-700">

            <Form className="w-100" onSubmit={handleSubmit}>
                <Row>
                    <Col lg={6} xs={12}>
                        <CountrySelect
                            label="Pays de départ"
                            value={departureCountry}
                            onChange={(e) => setDepartureCountry(e.target.value)}
                            countries={countries}
                        />
                        <CitySelect
                            label="Ville de départ"
                            value={departureCity}
                            onChange={(e) => setDepartureCity(e.target.value)}
                            cities={departureCities}
                            disabled={!departureCountry}
                        />
                        <AgencySelect
                            label="Agence de départ"
                            value={departureAgency}
                            onChange={(e) => setDepartureAgency(e.target.value)}
                            agencies={departureAgencies}
                            disabled={!departureCity}
                        />
                        <CountrySelect
                            label="Pays de destination"
                            value={destinationCountry}
                            onChange={(e) => setDestinationCountry(e.target.value)}
                            countries={destinationCountries}
                        />
                        <CitySelect
                            label="Ville de destination"
                            value={destinationCity}
                            onChange={(e) => setDestinationCity(e.target.value)}
                            cities={destinationCities}
                            disabled={!destinationCountry}
                        />
                        <AgencySelect
                            label="Agence d'arrivée"
                            value={destinationAgency}
                            onChange={(e) => setDestinationAgency(e.target.value)}
                            agencies={destinationAgencies}
                            disabled={!destinationCity}
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

                            {packages.map((pkg, index) => (
                                index === currentPackage && (
                                    <PackageForm
                                        key={index}
                                        index={index}
                                        pkg={pkg}
                                        onChange={handlePackageChange}
                                    />
                                )
                            ))}
                            {packages.length > 1 && (
                                <Pagination className="justify-content-center mt-3 mt-lg-0">
                                    {packages.map((_, index) => (
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
