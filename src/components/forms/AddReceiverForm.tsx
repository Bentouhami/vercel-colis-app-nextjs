// path: src/components/forms/AddReceiverForm.tsx

'use client';
import {Button, Form} from "react-bootstrap";
import {DestinataireInput, destinataireSchema} from "@/utils/validationSchema";
import {Slide, toast, ToastContainer} from "react-toastify";
import React, {ChangeEvent, useState} from "react";
import {useRouter} from "next/navigation";

export default function AddReceiverForm() {
    const router = useRouter();
    const [destinataireFormData, setDestinataireFormData] = useState<DestinataireInput>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Validation avec Zod
        const validated = destinataireSchema.safeParse(destinataireFormData);

        if (!validated.success) {
            toast.error(validated.error.errors[0].message);
            return;
        }

        // Si la validation réussit, vider les erreurs
        setErrors({});

        try {
            setLoading(true);
            // Appel API pour envoyer les données vers le backend
            const response = await fetch('/api/v1/users/destinataires', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(destinataireFormData),
            });


            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error) {
                    // Affiche l'erreur spécifique retournée par le backend
                    toast.error(errorData.error);
                } else {
                    throw new Error('Une erreur est survenue lors de la création du destinataire');
                }
                return; // Arrête l'exécution en cas d'erreur
            }

            // Récupérer les données du destinataire créées via l'API
            const sendingData = await response.json();
            console.log("Received sendingData from API:", sendingData);


            // Récupérer les données de la simulation
            let simulationResults = localStorage.getItem('simulationResults');

            // Si la simulation existe, ajouter le destinataire à la simulation
            if (simulationResults) {
                let simulationData = JSON.parse(simulationResults);

                // Remplacer ou ajouter les données du destinataire et du sender
                simulationData.senderData = sendingData.data.sender;
                simulationData.destinataireData = sendingData.data.destinataire;

                console.log("simulationData: ", simulationData.destinataireData, simulationData.senderData);


                // Enregistrer les nouvelles données de simulation dans localStorage
                localStorage.setItem('simulationResults', JSON.stringify(simulationData));


                // Rediriger vers la page recapitulatif
                toast.success("Destinataire ajouté avec succès !");
                router.push("/client/envois/recapitulatif?data=" + encodeURIComponent(JSON.stringify(simulationData)));
            } else {
                // Gérer le cas où il n'y a pas de données de simulation
                toast.error("Aucune simulation trouvée.");
            }
        } catch (error) {
            toast.error("Erreur lors de l'ajout du destinataire.");
        } finally {
            setLoading(false);
        }
    }

    function handleInputChange(e: ChangeEvent<any>) {
        const {name, value} = e.target;

        setDestinataireFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    return (
        <div className="container mb-40 mt-40">
            <h1 className="text-center container-fluid p-5 text-6xl rounded-top-5 shadow max-w-6xl">
                Ajouter un destinataire
            </h1>

            <Form onSubmit={handleSubmit} className="container rounded-bottom-5 mt-5 shadow p-5 border-black max-w-6xl">
                <Form.Group className="mb-3">
                    <Form.Control
                        name="firstName"
                        onChange={handleInputChange}
                        value={destinataireFormData.firstName}
                        type="text"
                        placeholder="Nom"
                        isInvalid={!!errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.lastName}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        name="lastName"
                        onChange={handleInputChange}
                        value={destinataireFormData.lastName}
                        type="text"
                        placeholder="Prénom"
                        isInvalid={!!errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.lastName}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        name="email"
                        onChange={handleInputChange}
                        value={destinataireFormData.email}
                        type="email"
                        placeholder="Email"
                        isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.email}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        name="phoneNumber"
                        onChange={handleInputChange}
                        value={destinataireFormData.phoneNumber}
                        type="text"
                        placeholder="Numéro de téléphone"
                        isInvalid={!!errors.phoneNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.phoneNumber}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" disabled={loading}>
                    {loading ? "l'Ajout est en cours" : "Ajouter"}
                </Button>
                <ToastContainer position="bottom-right" transition={Slide}/>
            </Form>
        </div>
    );
}
