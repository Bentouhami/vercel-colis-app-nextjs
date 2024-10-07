"use client";

import React, { useState } from 'react';
import { Button, Col, Form, Row } from "react-bootstrap";
import { Slide, toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { registerUser } from "@/utils/api";
import { RegisterUserInput, validateForm, registerUserSchema } from "@/utils/validationSchema";

const RegisterForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<Partial<RegisterUserInput>>({
        firstName: "",
        lastName: "",
        birthDate: "",
        gender: undefined,
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("address.")) {
            const addressField = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationResult = validateForm(registerUserSchema, formData);

        if (!validationResult.success) {
            toast.error(validationResult.error);
            return;
        }

        try {
            setLoading(true);
            await registerUser(validationResult.data);
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
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                        >
                            <option value="">Choisir un genre...</option>
                            <option value="Masculin">Masculin</option>
                            <option value="Féminin">Féminin</option>
                            <option value="Autre">Autre</option>
                        </Form.Select>
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
