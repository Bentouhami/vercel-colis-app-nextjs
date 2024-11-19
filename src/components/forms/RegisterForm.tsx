'use client';

import React, {ChangeEvent, useState, useTransition} from 'react';
import {Button, Col, Form, InputGroup, Row, Spinner} from "react-bootstrap";
import {toast, ToastContainer} from "react-toastify";
import {useRouter} from "next/navigation";
import {
    FaBuilding,
    FaCalendar,
    FaCity,
    FaEnvelope,
    FaGlobe,
    FaLock,
    FaMapMarkerAlt,
    FaPhone,
    FaUser
} from 'react-icons/fa';
import {RegisterUserBackendType, registerUserFrontendSchema, validateForm} from "@/utils/validationSchema";
import {registerUser} from "@/services/frontend-services/UserService";
import {motion} from "framer-motion";
import Image from "next/image";
import {RegisterClientDto} from "@/utils/dtos";

const RegisterForm = () => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", birthDate: "", phoneNumber: "", email: "", password: "", checkPassword: "",
        address: {street: "", number: "", city: "", zipCode: "", country: ""}
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if (name.startsWith("address.")) {
            const addressField = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                address: {...prev.address, [addressField]: value}
            }));
        } else {
            setFormData(prev => ({...prev, [name]: value}));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationResult = validateForm(registerUserFrontendSchema, formData);

        if (!validationResult.success || !validationResult.data) {
            toast.error(validationResult.error || "Erreur lors de la validation du formulaire");
            return;
        }

        const {
            firstName,
            lastName,
            birthDate,
            phoneNumber,
            email,
            password,
            address
        } = validationResult.data as RegisterUserBackendType;

        startTransition(async () => {
            try {
                const newUser: RegisterClientDto = {
                    firstName,
                    lastName,
                    birthDate,
                    phoneNumber,
                    email,
                    password,
                    address
                };

                const result = await registerUser(newUser);
                if (result) {
                    toast.success("Compte créé avec succès ! Email de confirmation envoyé à " + email);
                   setTimeout(() => {
                       router.push('/');
                   }, 3000);
                } else {
                    toast.error("Erreur lors de la création du compte");
                }
            } catch (error) {
                toast.error("Erreur lors de la création du compte");
            }
        });
    };


    return (
        <motion.div
            initial={{opacity: 0, scale: 0.95}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.6}}
            className="container mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8"
        >
            {/* Image Section */}
            <motion.div
                initial={{opacity: 0, x: -50}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.7, ease: "easeOut"}}
                className="flex-shrink-0"
            >
                <Image
                    priority
                    className="p-3 rounded-md"
                    src="/svg/login/register.svg"
                    alt="Register Illustration"
                    width={450}
                    height={450}
                />
            </motion.div>

            {/* Form Section */}
            <div className="flex-grow">


                <Form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Fields */}
                    <Row>
                        <Col md={6}>
                            <motion.div
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.5, delay: 0.2}}
                            >
                                <InputGroup className="mb-3">
                                    <InputGroup.Text className="bg-blue-50 text-blue-600">
                                        <FaUser/>
                                    </InputGroup.Text>
                                    <Form.Control
                                        disabled={isPending}
                                        type="text"
                                        name="firstName"
                                        placeholder="Prénom"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                            </motion.div>
                        </Col>
                        <Col md={6}>
                            <motion.div
                                initial={{opacity: 0, x: 20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.5, delay: 0.2}}
                            >
                                <InputGroup className="mb-3">
                                    <InputGroup.Text className="bg-blue-50 text-blue-600">
                                        <FaUser/>
                                    </InputGroup.Text>
                                    <Form.Control
                                        disabled={isPending}

                                        type="text"
                                        name="lastName"
                                        placeholder="Nom"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                            </motion.div>
                        </Col>
                    </Row>

                    {/* Birthdate Field */}
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5, delay: 0.3}}
                    >
                        <InputGroup className="mb-3">
                            <InputGroup.Text className="bg-blue-50 text-blue-600">
                                <FaCalendar/>
                            </InputGroup.Text>
                            <Form.Control
                                disabled={isPending}

                                type="date"
                                name="birthDate"
                                placeholder="Date de naissance"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                required
                            />
                        </InputGroup>
                    </motion.div>

                    {/* Contact Fields */}
                    <Row>
                        <Col md={6}>
                            <motion.div
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.5, delay: 0.4}}
                            >
                                <InputGroup className="mb-3">
                                    <InputGroup.Text className="bg-blue-50 text-blue-600">
                                        <FaPhone/>
                                    </InputGroup.Text>
                                    <Form.Control
                                        disabled={isPending}

                                        type="text"
                                        name="phoneNumber"
                                        placeholder="Numéro de téléphone"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                            </motion.div>
                        </Col>
                        <Col md={6}>
                            <motion.div
                                initial={{opacity: 0, x: 20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.5, delay: 0.4}}
                            >
                                <InputGroup className="mb-3">
                                    <InputGroup.Text className="bg-blue-50 text-blue-600">
                                        <FaEnvelope/>
                                    </InputGroup.Text>
                                    <Form.Control
                                        disabled={isPending}

                                        type="email"
                                        name="email"
                                        placeholder="Adresse e-mail"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                            </motion.div>
                        </Col>
                    </Row>

                    {/* Address Fields */}
                    <Row>
                        <Col md={6}>
                            <motion.div
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.5, delay: 0.4}}
                            >
                                <InputGroup className="mb-3">
                                    <InputGroup.Text className="bg-blue-50 text-blue-600">
                                        <FaMapMarkerAlt/>
                                    </InputGroup.Text>
                                    <Form.Control
                                        disabled={isPending}

                                        type="text"
                                        name="address.street"
                                        placeholder="Rue"
                                        value={formData.address.street}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                            </motion.div>
                        </Col>
                        <Col md={6}>
                            <motion.div
                                initial={{opacity: 0, x: 20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.5, delay: 0.4}}
                            >
                                <InputGroup className="mb-3">
                                    <InputGroup.Text className="bg-blue-50 text-blue-600">
                                        <FaBuilding/>
                                    </InputGroup.Text>
                                    <Form.Control
                                        disabled={isPending}

                                        type="text"
                                        name="address.number"
                                        placeholder="Numéro de rue"
                                        value={formData.address.number}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                            </motion.div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <motion.div
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.5, delay: 0.5}}
                            >
                                <InputGroup className="mb-3">
                                    <InputGroup.Text className="bg-blue-50 text-blue-600">
                                        <FaCity/>
                                    </InputGroup.Text>
                                    <Form.Control
                                        disabled={isPending}

                                        type="text"
                                        name="address.city"
                                        placeholder="Ville"
                                        value={formData.address.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                            </motion.div>
                        </Col>

                        <Col md={6}>
                            <motion.div
                                initial={{opacity: 0, x: 20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.5, delay: 0.5}}
                            >
                                <InputGroup className="mb-3">
                                    <InputGroup.Text className="bg-blue-50 text-blue-600">
                                        <FaGlobe/>
                                    </InputGroup.Text>
                                    <Form.Control
                                        disabled={isPending}

                                        type="text"
                                        name="address.zipCode"
                                        placeholder="Code postal"
                                        value={formData.address.zipCode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                            </motion.div>
                        </Col>

                        <Col md={6}>
                            <motion.div
                                initial={{opacity: 0, x: 20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.5, delay: 0.5}}
                            >
                                <InputGroup className="mb-3">
                                    <InputGroup.Text className="bg-blue-50 text-blue-600">
                                        <FaGlobe/>
                                    </InputGroup.Text>
                                    <Form.Control
                                        disabled={isPending}

                                        type="text"
                                        name="address.country"
                                        placeholder="Pays"
                                        value={formData.address.country}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                            </motion.div>
                        </Col>
                    </Row>

                    {/* Password Fields */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.6}}
                    >
                        <InputGroup className="mb-3">
                            <InputGroup.Text className="bg-blue-50 text-blue-600">
                                <FaLock/>
                            </InputGroup.Text>
                            <Form.Control
                                disabled={isPending}

                                type="password"
                                name="password"
                                placeholder="Mot de passe"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </InputGroup>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.7}}
                    >
                        <InputGroup className="mb-3">
                            <InputGroup.Text className="bg-blue-50 text-blue-600">
                                <FaLock/>
                            </InputGroup.Text>
                            <Form.Control
                                disabled={isPending}

                                type="password"
                                name="checkPassword"
                                placeholder="Confirmez le mot de passe"
                                value={formData.checkPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </InputGroup>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.8}}
                        className="text-center"
                    >
                        <Button
                            disabled={isPending}

                            type="submit"
                            className="w-full py-2 mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                        >
                            {isPending ? <Spinner animation="border" size="sm" className="mr-2"/> : "Créer mon compte"}
                        </Button>
                    </motion.div>
                </Form>
                <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar theme="colored"/>
            </div>
        </motion.div>
    );
};

export default RegisterForm;
