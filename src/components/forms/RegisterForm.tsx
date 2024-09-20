// src/app/forms/RegisterForm.tsx

"use client";

import React, {useState} from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import {Slide, toast, ToastContainer} from "react-toastify";
import {CreateUserDto} from "@/app/utils/dtos";
import {registerUserSchema} from "@/app/utils/validationSchema";
import {useRouter} from "next/navigation";
import {registerUser} from "@/app/utils/api";

const RegisterForm = () => {
    const router = useRouter();
    // user information
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");

    // user address information
    const [streetName, setStreetName] = useState("");
    const [streetNumber, setStreetNumber] = useState("");
    const [city, setCity] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("");

    // user login information
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const [loading, setLoading] = useState(false);
    // async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    //     event.preventDefault();
    //
    //     // Créer l'objet newUser
    //     const newUser: CreateUserDto = {
    //         firstName: firstName,
    //         lastName: lastName,
    //         birthDate: birthDate,
    //         gender: gender,
    //         phoneNumber: phone,
    //         email: email,
    //         password: password,
    //         checkPassword: checkPassword,
    //         address: {
    //             street: streetName,
    //             number: streetNumber,
    //             city: city,
    //             zipCode: zipCode,
    //             country: country,
    //         }
    //     };
    //
    //     // Validation des données
    //     const validated = registerUserSchema.safeParse(newUser);
    //     if (!validated.success) {
    //         toast.error(validated.error.errors[0].message, {
    //             autoClose: 5000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //         });
    //         return;
    //     }
    //
    //     // Enregistrement de l'utilisateur
    //     try {
    //         setLoading(true);
    //         const response = await registerUser(newUser);
    //
    //         if (response.status === 201) {
    //             toast.success("Utilisateur enregistré avec succès");
    //             // Vérifier si l'utilisateur a une simulation en cours (dans localStorage)
    //             const lastSimulation = localStorage.getItem('lastSimulation');
    //             if (lastSimulation) {
    //                 // Rediriger vers la page de simulation avec les derniers résultats
    //                 router.push('/simulation/results?data=' + encodeURIComponent(lastSimulation));
    //             } else {
    //                 // Rediriger vers la page de connexion
    //                 router.push('/login');
    //             }
    //         } else if (response.status === 400) {
    //             toast.error(response.error);
    //         } else {
    //             toast.error("Une erreur est survenue lors de l'enregistrement de votre compte");
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Erreur lors de l'inscription");
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    // async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    //     event.preventDefault();
    //
    //     // newUser est un objet qui contient toutes les informations de l'utilisateur qui a été saisie dans le formulaire de création de compte.
    //     // J'ai créé un nouvel objet newUser qui contient toutes les informations de l'utilisateur pour la vérification de la saisie puis l'envoie au serveur via l'API de l'application.
    //     const newUser: CreateUserDto = {
    //         firstName: firstName,
    //         lastName: lastName,
    //         birthDate: birthDate,
    //         gender: gender,
    //         phoneNumber: phone,
    //         email: email,
    //         password: password,
    //         checkPassword: checkPassword,
    //         address: {
    //             street: streetName,
    //             number: streetNumber,
    //             city: city,
    //             zipCode: zipCode,
    //             country: country,
    //         }
    //     }
    //
    //     // validation du nouvel utilisateur
    //     const validated = registerUserSchema.safeParse(newUser);
    //
    //     if (!validated.success) {
    //         toast.error(validated.error.errors[0].message, {
    //             autoClose: 5000, // 5 seconds
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //         });
    //         return;
    //     }
    //
    //     // Si la validation est réussie, vous pouvez effectuer d'autres actions ici
    //     try {
    //         setLoading(true);
    //         const response = await registerUser(newUser); // Appeler la fonction registerUser pour enregistrer l'utilisateur
    //
    //         // Vérifier le statut de la réponse HTTP (201 pour création réussie, 400 pour erreur de validation)
    //         if (response.status === 201) {
    //             toast.success("Utilisateur enregistré avec succès");
    //             // Vérifier si l'utilisateur a une simulation en cours (dans localStorage)
    //             const lastSimulation = localStorage.getItem('lastSimulation');
    //             if (lastSimulation) {
    //                 // Rediriger vers la page de simulation avec les derniers résultats (en utilisant l'URL de l'API)
    //                 router.push('/simulation/results?data=' + encodeURIComponent(lastSimulation));
    //             } else {
    //                 // Rediriger vers la page de connexion
    //                 router.push('/login');
    //             }
    //
    //         } else {
    //             toast.error("Une erreur est survenue lors de l'enregistrement de votre compte");
    //         }
    //     } catch (error) {
    //         toast.error(error?.response?.data.message);
    //         console.log(error);
    //     }
    //
    // }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const newUser: CreateUserDto = {
            firstName,
            lastName,
            birthDate,
            gender,
            phoneNumber: phone,
            email,
            password,
            checkPassword,
            address: {
                street: streetName,
                number: streetNumber,
                city,
                zipCode,
                country,
            },
        };

        // Valider les données
        const validated = registerUserSchema.safeParse(newUser);

        if (!validated.success) {
            toast.error(validated.error.errors[0].message, {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        try {
            setLoading(true);
            const response = await registerUser(newUser); // Appel de la fonction d'enregistrement

            toast.success("Utilisateur enregistré avec succès");

            const lastSimulation = localStorage.getItem('lastSimulation');
            if (lastSimulation) {
                router.push('/simulation/results?data=' + encodeURIComponent(lastSimulation));
            } else {
                router.push('/login');
            }

        } catch (error) {
            // Afficher un message d'erreur si l'enregistrement échoue
            toast.error(error.message || "Une erreur est survenue lors de l'enregistrement de votre compte");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form onSubmit={handleSubmit} className="mt-5">

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicFirstName">
                        {/*<Form.Label>Nom</Form.Label>*/}
                        <Form.Control type="text" placeholder="Enter votre nom"
                                      onChange={(e) => setFirstName(e.target.value)}/>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicLastName">
                        {/*<Form.Label>Prénom</Form.Label>*/}
                        <Form.Control type="text" placeholder="Enter votre prénom"
                                      onChange={(e) => setLastName(e.target.value)}/>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicBirthDate">
                        {/*<Form.Label>Date de naissance</Form.Label>*/}
                        <Form.Control type="date" placeholder="Enter votre date de naissance"
                                      onChange={(e) => setBirthDate(e.target.value)}/>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicGender">
                        {/*<Form.Label>Sexe</Form.Label>*/}
                        <Form.Control as="select" onChange={(e) => setGender(e.target.value)}>
                            <option>Choisir un sexe...</option>
                            <option>Masculin</option>
                            <option>Féminin</option>
                            <option>Autre</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicPhone">
                        {/*<Form.Label>Téléphone</Form.Label>*/}
                        <Form.Control type="text" placeholder="Enter votre numéro de téléphone"
                                      onChange={(e) => setPhone(e.target.value)}/>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        {/*<Form.Label>Adresse e-mail</Form.Label>*/}
                        <Form.Control type="email" placeholder="Enter votre email"
                                      onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicStreetName">
                        {/*<Form.Label>Rue</Form.Label>*/}
                        <Form.Control type="text" placeholder="Enter votre rue"
                                      onChange={(e) => setStreetName(e.target.value)}/>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicStreetNumber">
                        {/*<Form.Label>Numéro</Form.Label>*/}
                        <Form.Control type="text" placeholder="Enter votre numéro de rue"
                                      onChange={(e) => setStreetNumber(e.target.value)}/>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicCity">
                        {/*<Form.Label>Ville</Form.Label>*/}
                        <Form.Control type="text" placeholder="Enter votre ville"
                                      onChange={(e) => setCity(e.target.value)}/>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicZipCode">
                        {/*<Form.Label>Code postal</Form.Label>*/}
                        <Form.Control type="text" placeholder="Enter votre code postal"
                                      onChange={(e) => setZipCode(e.target.value)}/>
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="mb-3" controlId="formBasicCountry">
                {/*<Form.Label>Pays</Form.Label>*/}
                <Form.Control type="text" placeholder="Enter votre pays" onChange={(e) => setCountry(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                {/*<Form.Label>Mot de passe</Form.Label>*/}
                <Form.Control type="password" placeholder="Enter votre mot de passe"
                              onChange={(e) => setPassword(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckPassword">
                {/*<Form.Label>Confirmer mot de passe</Form.Label>*/}
                <Form.Control type="password" placeholder="Enter votre mot de passe à nouveau"
                              onChange={(e) => setCheckPassword(e.target.value)}/>
            </Form.Group>

            <Button type="submit" variant="primary" className="mb-3">Créer mon compte</Button>
            <ToastContainer
                theme="colored"
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Slide}
            />
        </Form>
    )
}
export default RegisterForm;
