import React from 'react'
import {Form} from "react-bootstrap";

export default function AddReceiverForm() {
    return (

        <Form className={"container"}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email du destinataire</Form.Label>
                <Form.Control type="email" placeholder="Email du destinataire" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Message</Form.Label>
                <Form.Control type="text" placeholder="Message" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Nombre de colis</Form.Label>
                <Form.Control type="number" placeholder="Nombre de colis" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Prix par colis</Form.Label>
                <Form.Control type="number" placeholder="Prix par colis" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Date de départ</Form.Label>
                <Form.Control type="date" placeholder="Date de départ" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Date d&apos;arrivée</Form.Label>
                <Form.Control type="date" placeholder="Date d'arrivée" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Adresse de livraison</Form.Label>
                <Form.Control type="text" placeholder="Adresse de livraison" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Adresse de destination</Form.Label>
                <Form.Control type="text" placeholder="Adresse de destination" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Commentaires</Form.Label>
                <Form.Control type="text" placeholder="Commentaires" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Envoi</Form.Label>
                <Form.Control type="text" placeholder="Envoi" />
            </Form.Group>
        </Form>
    )
}
