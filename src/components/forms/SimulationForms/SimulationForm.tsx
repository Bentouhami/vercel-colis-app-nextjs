// "use client";
// import {useState} from 'react';
// import {Button, Col, Container, Form, Pagination, Row} from 'react-bootstrap';
// import PackageForm from './PackageForm';
// import CountrySelect from "@/components/forms/SimulationForms/CountrySelectForm";
// import CitySelect from "@/components/forms/SimulationForms/CitySelectForm";
// import AgencySelect from "@/components/forms/SimulationForms/AgencySelectForm";
//
// const SimulationForm = () => {
//     const [departureCountry, setDepartureCountry] = useState('');
//     const [departureCity, setDepartureCity] = useState('');
//     const [departureAgency, setDepartureAgency] = useState('');
//     const [destinationCountry, setDestinationCountry] = useState('');
//     const [destinationCity, setDestinationCity] = useState('');
//     const [destinationAgency, setDestinationAgency] = useState('');
//     const [packageCount, setPackageCount] = useState(1);
//     const [packages, setPackages] = useState([{height: '', width: '', length: '', weight: ''}]);
//     const [currentPackage, setCurrentPackage] = useState(0);
//
//     const countries = ['Maroc', 'Belgique'];
//     const cities = {
//         Maroc: ['Casablanca', 'Rabat', 'Marrakech'],
//         Belgique: ['Bruxelles', 'Anvers', 'Gand']
//     };
//     const agencies = {
//         Casablanca: ['Agence 1', 'Agence 2'],
//         Rabat: ['Agence 3', 'Agence 4'],
//         Marrakech: ['Agence 5', 'Agence 6'],
//         Bruxelles: ['Agence 7', 'Agence 8'],
//         Anvers: ['Agence 9', 'Agence 10'],
//         Gand: ['Agence 11', 'Agence 12']
//     };
//
//     const handlePackageChange = (index, field, value) => {
//         const updatedPackages = packages.map((pkg, i) => (
//             i === index ? {...pkg, [field]: value} : pkg
//         ));
//         setPackages(updatedPackages);
//     };
//
//     const handlePackageCountChange = (e) => {
//         const count = parseInt(e.target.value, 10);
//         setPackageCount(count);
//         const newPackages = Array.from({length: count}, (_, i) => packages[i] || {
//             height: '',
//             width: '',
//             length: '',
//             weight: ''
//         });
//         setPackages(newPackages);
//     };
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log('Form submitted', {
//             departureCountry,
//             departureCity,
//             departureAgency,
//             destinationCountry,
//             destinationCity,
//             destinationAgency,
//             packages,
//         });
//     };
//
//     const handlePageChange = (pageIndex) => {
//         setCurrentPackage(pageIndex);
//     };
//
//     return (
//         <Container
//             className="mt-2 mb-5 bg-purple-800 text-white p-5 rounded-3 drop-shadow-2xl shadow border border-purple-700">
//             <Form className="w-100" onSubmit={handleSubmit}>
//                 <Row>
//                     <Col lg={6} xs={12}>
//                         <CountrySelect
//                             label="Pays de départ"
//                             value={departureCountry}
//                             onChange={(e) => setDepartureCountry(e.target.value)}
//                             countries={countries}
//                         />
//                         <CitySelect
//                             label="Ville de départ"
//                             value={departureCity}
//                             onChange={(e) => setDepartureCity(e.target.value)}
//                             cities={departureCountry ? cities[departureCountry] : []}
//                             disabled={!departureCountry}
//                         />
//                         <AgencySelect
//                             label="Agence de départ"
//                             value={departureAgency}
//                             onChange={(e) => setDepartureAgency(e.target.value)}
//                             agencies={departureCity ? agencies[departureCity] : []}
//                             disabled={!departureCity}
//                         />
//                         <CountrySelect
//                             label="Pays de destination"
//                             value={destinationCountry}
//                             onChange={(e) => setDestinationCountry(e.target.value)}
//                             countries={countries}
//                         />
//                         <CitySelect
//                             label="Ville de destination"
//                             value={destinationCity}
//                             onChange={(e) => setDestinationCity(e.target.value)}
//                             cities={destinationCountry ? cities[destinationCountry] : []}
//                             disabled={!destinationCountry}
//                         />
//                         <AgencySelect
//                             label="Agence d'arrivée"
//                             value={destinationAgency}
//                             onChange={(e) => setDestinationAgency(e.target.value)}
//                             agencies={destinationCity ? agencies[destinationCity] : []}
//                             disabled={!destinationCity}
//                         />
//                     </Col>
//                     <Col lg={6} xs={12} className="mt-3 mt-lg-0">
//                         <Form.Group controlId="packageCount">
//                             <Form.Label>Nombre de colis</Form.Label>
//                             <Form.Control
//                                 type="number"
//                                 max="5"
//                                 value={packageCount}
//                                 onChange={handlePackageCountChange}
//                                 min="1"
//                             />
//
//                             {packages.map((pkg, index) => (
//                                 index === currentPackage && (
//                                     <PackageForm
//
//                                         key={index}
//                                         index={index}
//                                         pkg={pkg}
//                                         onChange={handlePackageChange}
//                                     />
//                                 )
//                             ))}
//                             {packages.length > 1 && (
//                                 <Pagination className="justify-content-center mt-3 mt-lg-0">
//                                     {packages.map((_, index) => (
//                                         <Pagination.Item
//                                             key={index}
//                                             active={
//                                                 index === currentPackage
//                                             }
//                                             onClick={
//                                                 () => handlePageChange(index)
//                                             }
//                                         >
//                                             {index + 1}
//                                         </Pagination.Item>
//                                     ))}
//                                 </Pagination>
//                             )}
//                         </Form.Group>
//                     </Col>
//                 </Row>
//                 <div className="d-flex justify-content-center mt-3">
//                     <Button className="me-2" type="submit" variant="primary">Soumettre</Button>
//                 </div>
//             </Form>
//         </Container>
//     );
// };
//
// export default SimulationForm;
"use client";
import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Pagination, Row } from 'react-bootstrap';
import PackageForm from './PackageForm';
import CountrySelect from "@/components/forms/SimulationForms/CountrySelectForm";
import CitySelect from "@/components/forms/SimulationForms/CitySelectForm";
import AgencySelect from "@/components/forms/SimulationForms/AgencySelectForm";
import {fetchAgencies, fetchCities, fetchCountries} from "@/app/utils/api";

const SimulationForm = () => {
    const [departureCountry, setDepartureCountry] = useState('');
    const [departureCity, setDepartureCity] = useState('');
    const [departureAgency, setDepartureAgency] = useState('');
    const [destinationCountry, setDestinationCountry] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [destinationAgency, setDestinationAgency] = useState('');
    const [packageCount, setPackageCount] = useState(1);
    const [packages, setPackages] = useState([{ height: '', width: '', length: '', weight: '' }]);
    const [currentPackage, setCurrentPackage] = useState(0);

    const [countries, setCountries] = useState([]);
    const [departureCities, setDepartureCities] = useState([]);
    const [departureAgencies, setDepartureAgencies] = useState([]);
    const [destinationCities, setDestinationCities] = useState([]);
    const [destinationAgencies, setDestinationAgencies] = useState([]);

    useEffect(() => {
        fetchCountries().then(setCountries).catch(console.error);
    }, []);

    useEffect(() => {
        if (departureCountry) {
            fetchCities(departureCountry).then(setDepartureCities).catch(console.error);
            setDepartureCity('');
            setDepartureAgency('');
        }
    }, [departureCountry]);

    useEffect(() => {
        if (departureCity) {
            fetchAgencies(departureCountry, departureCity).then(setDepartureAgencies).catch(console.error);
            setDepartureAgency('');
        }
    }, [departureCity]);

    useEffect(() => {
        if (destinationCountry) {
            fetchCities(destinationCountry).then(setDestinationCities).catch(console.error);
            setDestinationCity('');
            setDestinationAgency('');
        }
    }, [destinationCountry]);

    useEffect(() => {
        if (destinationCity) {
            fetchAgencies(destinationCountry, destinationCity).then(setDestinationAgencies).catch(console.error);
            setDestinationAgency('');
        }
    }, [destinationCity]);

    const handlePackageChange = (index, field, value) => {
        const updatedPackages = packages.map((pkg, i) => (
            i === index ? { ...pkg, [field]: value } : pkg
        ));
        setPackages(updatedPackages);
    };

    const handlePackageCountChange = (e) => {
        const count = parseInt(e.target.value, 10);
        setPackageCount(count);
        const newPackages = Array.from({ length: count }, (_, i) => packages[i] || {
            height: '',
            width: '',
            length: '',
            weight: ''
        });
        setPackages(newPackages);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted', {
            departureCountry,
            departureCity,
            departureAgency,
            destinationCountry,
            destinationCity,
            destinationAgency,
            packages,
        });
    };

    const handlePageChange = (pageIndex) => {
        setCurrentPackage(pageIndex);
    };

    return (
        <Container className="mt-2 mb-5 bg-purple-800 text-white p-5 rounded-3 drop-shadow-2xl shadow border border-purple-700">
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
                            countries={countries}
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
        </Container>
    );
};

export default SimulationForm;
