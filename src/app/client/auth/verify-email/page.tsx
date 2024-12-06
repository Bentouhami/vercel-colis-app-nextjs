// path: src/app/client/(user)/verify-email/page.tsx

"use client";
import {Suspense, useCallback, useEffect, useState} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, AlertCircle, ArrowRight, RotateCcw, MailCheck  } from 'lucide-react';
const VerifyEmailContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');
    const [message, setMessage] = useState<string>("");
    const [countdown, setCountdown] = useState(5);

    // Define startCountdown with useCallback
    const startCountdown = useCallback(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/client/auth//login');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [router]);

    useEffect(() => {
        if (!token) {
            setStatus('invalid');
            setMessage("Le lien de vérification est invalide. Veuillez vérifier votre email et utiliser le lien complet.");
            return;
        }

        const verifyEmail = async () => {
            try {
                console.log('verify email function called and will send api requst with token : ', token);

                const response = await fetch('/api/v1/users/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();
                console.log("data returned after the request")

                if (response.ok) {
                    setStatus('success');
                    setMessage("Votre adresse email a été vérifiée avec succès !");
                    // Start countdown for redirect
                    startCountdown();
                } else {
                    setStatus('error');
                    setMessage(data.message || "Le lien de vérification est invalide ou a expiré.");
                }
            } catch (error) {
                console.error("Erreur lors de la vérification:", error);
                setStatus('error');
                setMessage("Une erreur est survenue lors de la vérification. Veuillez réessayer.");
            }
        };

        verifyEmail();
    }, [startCountdown, token]);


    const handleRetry = () => {
        setStatus('loading');
        setMessage("");
        window.location.reload();
    };

    const handleRedirect = () => {
        router.push('/client//auth/login');
    };

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            Vérification en cours...
                        </h2>
                        <p className="text-gray-500">
                            Veuillez patienter pendant que nous vérifions votre email
                        </p>
                    </div>
                );

            case 'success':
                return (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            Email vérifié avec succès !
                        </h2>
                        <p className="text-gray-500 mb-4">{message}</p>
                        <p className="text-sm text-gray-400">
                            Redirection dans {countdown} secondes...
                        </p>
                        <button
                            onClick={handleRedirect}
                            className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Aller à la connexion
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                    </div>
                );

            case 'error':
                return (
                    <div className="flex flex-col items-center">
                        <XCircle className="w-16 h-16 text-red-500 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            Échec de la vérification
                        </h2>
                        <p className="text-gray-500 mb-4 text-center max-w-md">{message}</p>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleRetry}
                                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <RotateCcw className="mr-2 w-4 h-4" />
                                Réessayer
                            </button>
                            <button
                                onClick={handleRedirect}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Retour à la connexion
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </button>
                        </div>
                    </div>
                );

            case 'invalid':
                return (
                    <div className="flex flex-col items-center">
                        <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            Lien invalide
                        </h2>
                        <p className="text-gray-500 mb-4 text-center max-w-md">{message}</p>
                        <button
                            onClick={handleRedirect}
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Retour à la connexion
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <MailCheck className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900">
                        Vérification de l&#39;email
                    </h1>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

const VerifyEmail = () => {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );

};

export default VerifyEmail;