// path     : src/app/client/(user)/register/page.tsx


"use client";

import React, {ChangeEvent, useState} from 'react';
import { Button, Col, Form, Row } from "react-bootstrap";
import { Slide, toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { registerUser } from "@/utils/api";
import {validateForm, registerUserFrontendSchema, RegisterUserBackendType} from "@/utils/validationSchema";
import {FormData} from "@/utils/types";
import {CreateUserDto} from "@/utils/dtos";



const RegisterForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({

        firstName: "",
        lastName: "",
        birthDate: "",
        phoneNumber: "",
        email: "",
        password: "",
        checkPassword: "",
        address: {
            street: "",
            number: "",
            city: "",
            zipCode: "",
            country: "",
        },
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: ChangeEvent<any>) => {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const addressField = name.split(".")[1] as keyof FormData['address'];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validation du formulaire
        const validationResult = validateForm(registerUserFrontendSchema, formData);

        // Si la validation a échoué, envoyer une erreur avec le message d'erreur fourni par Zod
        if (!validationResult.success || !validationResult.data) {
            toast.error(validationResult.error || "Une erreur est survenue lors de la validation du formulaire");
            return;
        }

        // Envoi du formulaire de création de compte
        try {
            setLoading(true);
            const {firstName, lastName, birthDate, phoneNumber, email, password, address} = validationResult.data;

            const newUser: RegisterUserBackendType = {
                firstName,
                lastName,
                birthDate,
                phoneNumber,
                email,
                password,
                address: {
                    street:address.street,
                    number:address.number,
                    city:address.city,
                    zipCode:address.zipCode,
                    country:address.country
                }
            }
            // Envoi du formulaire de création de compte
            await registerUser(newUser); // Utilisation de "as CreateUserDto" pour garantir le type correct
            toast.success("Compte créé avec succès !");

            const lastSimulation = localStorage.getItem('lastSimulation');
            if (lastSimulation) {
                router.push('/client/simulation/results?data=' + encodeURIComponent(lastSimulation));
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
        } finally {
            setLoading(false);
        }

    };

    return (
        <Form onSubmit={handleSubmit} className="mt-5">
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="firstName"
                            placeholder="Votre prénom"
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="lastName"
                            placeholder="Votre nom"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="date"
                            name="birthDate"
                            placeholder="Votre date de naissance"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Col>

            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="phoneNumber"
                            placeholder="Votre numéro de téléphone"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Votre adresse e-mail"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            {/* Adresse */}
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="address.street"
                            placeholder="Votre rue"
                            value={formData.address?.street}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="address.number"
                            placeholder="Votre numéro de rue"
                            value={formData.address?.number}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="address.city"
                            placeholder="Votre ville"
                            value={formData.address?.city}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="address.zipCode"
                            placeholder="Votre code postal"
                            value={formData.address?.zipCode}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    name="address.country"
                    placeholder="Votre pays"
                    value={formData.address?.country}
                    onChange={handleInputChange}
                />
            </Form.Group>

            {/* Mot de passe */}
            <Form.Group className="mb-3">
                <Form.Control
                    type="password"
                    name="password"
                    placeholder="Votre mot de passe"
                    value={formData.password}
                    onChange={handleInputChange}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Control
                    type="password"
                    name="checkPassword"
                    placeholder="Confirmez votre mot de passe"
                    value={formData.checkPassword}
                    onChange={handleInputChange}
                />
            </Form.Group>

            <Button type="submit" disabled={loading}>
                {loading ? "Création en cours..." : "Créer mon compte"}
            </Button>

            <ToastContainer position="bottom-right" transition={Slide} />
        </Form>
    );
};

export default RegisterForm;
