"use client";
import React, { useState } from 'react';
import { Button, Form, Row, Col } from "react-bootstrap";

const RegisterForm = () => {

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

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log("Email : " + email);
        console.log("Password : " + password);
    }

    return (
        <Form onSubmit={handleSubmit} className="mt-5">

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicFirstName">
                        {/*<Form.Label>Nom</Form.Label>*/}
                        <Form.Control type="text" placeholder="Enter votre nom" onChange={(e) => setFirstName(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicLastName">
                        {/*<Form.Label>Prénom</Form.Label>*/}
                        <Form.Control type="text" placeholder="Enter votre prénom" onChange={(e) => setLastName(e.target.value)} />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicBirthDate">
                        {/*<Form.Label>Date de naissance</Form.Label>*/}
                        <Form.Control type="date" placeholder="Enter votre date de naissance" onChange={(e) => setBirthDate(e.target.value)} />
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
                        <Form.Control type="text" placeholder="Enter votre numéro de téléphone" onChange={(e) => setPhone(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        {/*<Form.Label>Adresse e-mail</Form.Label>*/}
                        <Form.Control type="email" placeholder="Enter votre email" onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicStreetName">
                        {/*<Form.Label>Rue</Form.Label>*/}
                        <Form.Control type="text" placeholder="Enter votre rue" onChange={(e) => setStreetName(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicStreetNumber">
                        {/*<Form.Label>Numéro</Form.Label>*/}
                        <Form.Control type="text" placeholder="Enter votre numéro de rue" onChange={(e) => setStreetNumber(e.target.value)} />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicCity">
                        {/*<Form.Label>Ville</Form.Label>*/}
                        <Form.Control type="text" placeholder="Enter votre ville" onChange={(e) => setCity(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicZipCode">
                        {/*<Form.Label>Code postal</Form.Label>*/}
                        <Form.Control type="text" placeholder="Enter votre code postal" onChange={(e) => setZipCode(e.target.value)} />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="mb-3" controlId="formBasicCountry">
                {/*<Form.Label>Pays</Form.Label>*/}
                <Form.Control type="text" placeholder="Enter votre pays" onChange={(e) => setCountry(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                {/*<Form.Label>Mot de passe</Form.Label>*/}
                <Form.Control type="password" placeholder="Enter votre mot de passe" onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckPassword">
                {/*<Form.Label>Confirmer mot de passe</Form.Label>*/}
                <Form.Control type="password" placeholder="Enter votre mot de passe à nouveau" onChange={(e) => setCheckPassword(e.target.value)} />
            </Form.Group>

            <Button type="submit" variant="primary" className="mb-3">Créer mon compte</Button>
        </Form>
    )
}
export default RegisterForm;
