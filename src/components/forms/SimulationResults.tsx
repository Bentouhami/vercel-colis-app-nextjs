'use client';
import {useRouter, useSearchParams} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {Button, Card, Row} from 'react-bootstrap';
import styles from './SimulationResults.module.css';
import {SimulationResultsDto} from "@/app/utils/dtos";
import {submitSimulation} from "@/app/utils/api";
import LoginPromptModal from '@/components/LoginPromptModal'; // Assurez-vous que le chemin est correct

const SimulationResults = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [results, setResults] = useState<SimulationResultsDto | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false); // État pour le modal

    // Effect to handle simulation results retrieval
    useEffect(() => {
        const data = searchParams.get('data');
        if (data) {
            setResults(JSON.parse(data));
        } else {
            const savedResults = localStorage.getItem('simulationResults');
            if (savedResults) {
                setResults(JSON.parse(savedResults));
                // localStorage.removeItem('simulationResults'); // Supprimer après récupération
            } else {
                router.push('/simulation');
            }
        }
    }, [searchParams, router]);

    // Separate effect to handle authentication check
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch('/api/v1/auth/status');
                const authStatus = await response.json();
                setIsAuthenticated(authStatus.isAuthenticated);
                console.log("Auth status:", authStatus.isAuthenticated);
            } catch (error) {
                console.error("Erreur lors de la vérification de l'authentification", error);
                setIsAuthenticated(false);
            }
        };

        checkAuthStatus();
    }, []); // Dependency array empty to run this effect only once on mount

    if (!results) {
        return <p className={styles.loading}>Loading...</p>;
    }

    // Fonction de validation
    async function handleValidate() {


        if (isAuthenticated) {
            try {
                if (results) {
                    await submitSimulation(results);
                    router.push('/payment');
                }
            } catch (error) {
                console.error("Erreur lors de la soumission de la simulation", error);
            }
        } else {
            // Sauvegarder les résultats dans localStorage avant d'afficher le modal de connexion
            localStorage.setItem('simulationResults', JSON.stringify(results));
            setShowLoginPrompt(true); // Afficher le modal de connexion
        }
    }

    // Fonction pour rediriger vers la page de login avec un paramètre de redirection
    const handleLoginRedirect = () => {
        setShowLoginPrompt(false); // Fermer le modal
        // Rediriger vers la page de login avec un paramètre `redirect`
        const redirectUrl = encodeURIComponent('/simulation/results');
        router.push(`/login?redirect=${redirectUrl}`);
    };

    function handleCancel() {
        // supprimer les résultats de la simulation
        localStorage.removeItem('simulationResults');
        router.push('/simulation');
    }

    return (
        <div className={`container mb-40 ${styles.container}`}>
            <h2 className={styles.heading}>Résultats de la Simulation</h2>
            <Row>
                <Card className={styles.card}>
                    <Card.Body>
                        <h4>Informations de l&apos;envoi</h4>
                        <p><strong>Pays de départ:</strong> {results.departureCountry}</p>
                        <p><strong>Ville de départ:</strong> {results.departureCity}</p>
                        <p><strong>Agence de départ:</strong> {results.departureAgency}</p>
                        <p><strong>Pays de destination:</strong> {results.destinationCountry}</p>
                        <p><strong>Ville de destination:</strong> {results.destinationCity}</p>
                        <p><strong>Agence de destination:</strong> {results.destinationAgency}</p>

                        <h4>Résultats des Colis</h4>
                        {results.packages.map((pkg, index) => (
                            <div key={index} className={styles['package-info']}>
                                <p><strong>Colis {index + 1}:</strong></p>
                                <p>Hauteur: {pkg.height} cm</p>
                                <p>Largeur: {pkg.width} cm</p>
                                <p>Longueur: {pkg.length} cm</p>
                                <p>Poids: {pkg.weight} kg</p>
                            </div>
                        ))}

                        <h4>Calculs</h4>
                        <p><strong>Poids total:</strong> {results.totalWeight} kg</p>
                        <p><strong>Volume total:</strong> {results.totalVolume} cm²</p>
                        <p><strong>Prix total:</strong> {results.totalPrice} €</p>
                        <p><strong>Date de départ:</strong> {new Date(results.departureDate).toLocaleDateString()}</p>
                        <p><strong>Date d&apos;arrivée:</strong> {new Date(results.arrivalDate).toLocaleDateString()}
                        </p>
                    </Card.Body>
                </Card>
            </Row>

            <div className="d-flex justify-content-center m-3 gap-3">
                <Button className="m-5" title="Valider votre envoi et payer" onClick={handleValidate} variant="primary">
                    Valider
                </Button>

                <Button className="m-5" title="Annuler l&apos;envoi, et revenir à la page de simulation"
                        onClick={handleCancel} type="button" variant="secondary">Annuler</Button>
            </div>

            {/* Ajouter le LoginPromptModal */}
            <LoginPromptModal
                show={showLoginPrompt}
                handleClose={() => setShowLoginPrompt(false)}
                handleLoginRedirect={handleLoginRedirect}
            />
        </div>
    );
};

export default SimulationResults;
