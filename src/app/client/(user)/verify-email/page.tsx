'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const VerifyEmail = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Vérifier si le token est présent dans l'URL
        if (!token) {
            setMessage("Token manquant.");
            setLoading(false);
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await fetch('/api/v1/users/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (response.ok) {
                    setMessage("Votre email a été vérifié avec succès.");
                } else {
                    setMessage(data.message || "Le lien de vérification est invalide ou expiré.");
                }
            } catch (error) {
                console.error("Erreur lors de la vérification de l'email:", error);
                setMessage("Une erreur est survenue. Veuillez réessayer plus tard.");
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            {loading ? (
                <p>Vérification en cours...</p>
            ) : (
                <p>{message}</p>
            )}
        </div>
    );
};

export default VerifyEmail;
