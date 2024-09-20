"use client";
// SimulationResults.tsx : Page de résultats de simulation d'envoi
// api/v1/simulation/results/route.ts : Route de résultats de simulation d'envoi
import {useRouter, useSearchParams} from 'next/navigation';
import React, {Suspense, useEffect, useState} from 'react';
import {Button, Card, Row} from 'react-bootstrap';
import styles from './SimulationResults.module.css';
import {SimulationResultsDto} from "@/app/utils/dtos";
import {verifyToken} from "@/app/utils/verifyToken";


const SimulationResults = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [results, setResults] = useState<SimulationResultsDto | null>(null);

    useEffect(() => {
        const data = searchParams.get('data');
        if (data) {
            setResults(JSON.parse(data));
        } else {
            // Redirect immediately if no data
            router.push('/simulation');
        }
    }, [searchParams, router]);

    if (!results) {
        return <p className={styles.loading}>Loading...</p>;
    }

    // Function to handle form submission
    function handelValidate() {
        
    }

    function handleCancel() {
        router.back();
    }

    return (
        <div className={ `container mb-40 ${styles.container}` }>
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
                        <p><strong>Date de départ:</strong> {new Date(results.departureDate).toLocaleDateString()}
                        </p>
                        <p><strong>Date
                            d&apos;arrivée:</strong> {new Date(results.arrivalDate).toLocaleDateString()}</p>
                    </Card.Body>
                </Card>
            </Row>

            <div className="d-flex justify-content-center m-3 gap-3">
                <Button className="m-5" title="Valider votre envoi et payer" onClick={handelValidate} variant="primary">Valider</Button>

                <Button className="m-5" title="Annuler l&apos;envoi, et revenir à la page de simulation" onClick={handleCancel} type="cancel" variant="secondary">Annuler</Button>

            </div>
        </div>
    );
};

// Wrapping the main export in a Suspense boundary
export default function WrappedSimulationResults() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SimulationResults />
        </Suspense>
    );
}
