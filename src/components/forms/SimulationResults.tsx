'use client';
import {useRouter, useSearchParams} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Row} from 'react-bootstrap';
import styles from './SimulationResults.module.css';
import {SimulationResultsDto} from "@/utils/dtos";
import {submitSimulation} from "@/utils/api";
import LoginPromptModal from '@/components/LoginPromptModal';
import {CiCalculator2, CiCircleInfo} from "react-icons/ci";
import {MdEmojiSymbols} from "react-icons/md";
import {motion} from 'framer-motion';  // Import Framer Motion

const SimulationResults = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [results, setResults] = useState<SimulationResultsDto | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        const data = searchParams.get('data');
        if (data) {
            setResults(JSON.parse(data));
        } else {
            const savedResults = localStorage.getItem('simulationResults');
            if (savedResults) {
                setResults(JSON.parse(savedResults));
            } else {
                router.push('/simulation');
            }
        }
    }, [searchParams, router]);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch('/api/auth/status');
                const authStatus = await response.json();
                setIsAuthenticated(authStatus.isAuthenticated);
            } catch (error) {
                console.error("Erreur lors de la vérification de l'authentification", error);
                setIsAuthenticated(false);
            }
        };
        checkAuthStatus();
    }, []);

    if (!results) {
        return <p className={styles.loading}>Loading...</p>;
    }

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
            localStorage.setItem('simulationResults', JSON.stringify(results));
            setShowLoginPrompt(true);
        }
    }

    const handleLoginRedirect = () => {
        setShowLoginPrompt(false);
        const redirectUrl = encodeURIComponent('/simulation/results');
        router.push(`/login?redirect=${redirectUrl}`);
    };

    function handleCancel() {
        localStorage.removeItem('simulationResults');
        router.push('/simulation');
    }

    return (
        <motion.div
            className={`mb-40 ${styles.container}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className={styles.heading}>Résultats de la Simulation</h2>

            <Row>
                <Card className={styles.card}>
                    <Card.Header className="text-center bg-blue-600 text-white p-5  mb-3">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Récapitulatif de votre envoi
                        </motion.h2>
                    </Card.Header>

                    <Card.Body>
                        {/* Informations de l'envoi */}
                        <motion.div
                            className="bg-blue-600 d-flex align-items-center mb-3 p-3 "
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <CiCircleInfo className="size-5 mt-3 me-2" />
                            <h4 className="text-white">Informations de l&apos;envoi</h4>
                        </motion.div>

                        <Row>
                            <motion.div
                                className=" p-5 rounded-3 shadow mb-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <p><strong>Pays de départ:</strong> {results.departureCountry}</p>
                                <p><strong>Ville de départ:</strong> {results.departureCity}</p>
                                <p><strong>Agence de départ:</strong> {results.departureAgency}</p>
                            </motion.div>

                            <motion.div
                                className="p-5 rounded-3 shadow mb-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                            >
                                <p><strong>Pays de destination:</strong> {results.destinationCountry}</p>
                                <p><strong>Ville de destination:</strong> {results.destinationCity}</p>
                                <p><strong>Agence de destination:</strong> {results.destinationAgency}</p>
                            </motion.div>
                        </Row>

                        {/* Résultats des Colis */}
                        <motion.div
                            className="d-flex align-items-center mb-3 bg-green-600 text-white p-3 rounded"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 }}
                        >
                            <MdEmojiSymbols className="size-5 mt-3 me-2" />
                            <h4 className="text-white">Résultats des Colis</h4>
                        </motion.div>

                        <Row>
                            {results.packages.map((pkg, index) => (
                                <motion.div
                                    key={index}
                                    className="p-5 rounded-3 shadow mb-3"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.3 }}
                                >
                                    <p><strong>Colis {index + 1}:</strong></p>
                                    <p>Hauteur: {pkg.height} cm</p>
                                    <p>Largeur: {pkg.width} cm</p>
                                    <p>Longueur: {pkg.length} cm</p>
                                    <p>Poids: {pkg.weight} kg</p>
                                </motion.div>
                            ))}
                        </Row>

                        {/* Calculs */}
                        <motion.div
                            className="d-flex align-items-center mb-3 bg-orange-600 text-white p-3 rounded"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.5 }}
                        >
                            <CiCalculator2 className="size-5 mt-3 me-2" />
                            <h4 className="text-white">Calculs</h4>
                        </motion.div>

                        <Row>
                            <motion.div
                                className=" p-5 rounded-3 shadow mb-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.7 }}
                            >
                                <p><strong>Poids total:</strong> {results.totalWeight} kg</p>
                                <p><strong>Volume total:</strong> {results.totalVolume} cm²</p>
                            </motion.div>

                            <motion.div
                                className="p-5 rounded-3 shadow mb-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.9 }}
                            >
                                <p><strong>Prix total:</strong> {results.totalPrice} €</p>
                                <p><strong>Date de départ:</strong> {new Date(results.departureDate).toLocaleDateString()}</p>
                                <p><strong>Date d&apos;arrivée:</strong> {new Date(results.arrivalDate).toLocaleDateString()}</p>
                            </motion.div>
                        </Row>
                    </Card.Body>
                </Card>
            </Row>

            <div className="d-flex justify-content-center m-3 gap-3">
                <Button className="m-5" title="Valider votre envoi et payer" onClick={handleValidate} variant="primary">
                    Valider
                </Button>

                <Button className="m-5" title="Annuler l&apos;envoi, et revenir à la page de simulation"
                        onClick={handleCancel} type="button" variant="secondary">
                    Annuler
                </Button>
            </div>

            <LoginPromptModal
                show={showLoginPrompt}
                handleClose={() => setShowLoginPrompt(false)}
                handleLoginRedirect={handleLoginRedirect}
            />
        </motion.div>
    );
};

export default SimulationResults;
