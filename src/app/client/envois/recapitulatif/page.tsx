'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RecapitulatifPage() {
    const searchParams = useSearchParams();
    const [simulationData, setSimulationData] = useState(null);

    useEffect(() => {
        // Récupérer le paramètre "data" depuis l'URL
        const data = searchParams.get('data');

        if (data) {
            // Décoder et parser les données JSON
            try {
                const parsedData = JSON.parse(decodeURIComponent(data));
                setSimulationData(parsedData);
            } catch (error) {
                console.error("Erreur lors de la lecture des données:", error);
            }
        }
    }, [searchParams]);

    return (
        <div>
            <h1>Récapitulatif de la simulation</h1>
            {simulationData ? (
                <pre>{JSON.stringify(simulationData, null, 2)}</pre> // Affiche les données pour l'instant
            ) : (
                <p>Aucune donnée trouvée.</p>
            )}
        </div>
    );
}
