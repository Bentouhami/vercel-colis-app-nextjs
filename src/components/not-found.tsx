// path: src/components/NotFound.tsx

'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

interface NotFoundProps {
    redirectPath?: string; // Optional path to redirect to
    message?: string;      // Optional custom message
    countdownSeconds?: number; // Optional countdown duration
}

export default function NotFound({
                                     redirectPath = '/', // Default to homepage
                                     message = "La page que vous recherchez n'existe pas ou a été déplacée.",
                                     countdownSeconds = 5, // Default countdown is 5 seconds
                                 }: NotFoundProps) {
    const [countdown, setCountdown] = useState(countdownSeconds);
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push(redirectPath); // Redirect to specified path
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer); // Cleanup timer on unmount
    }, [router, redirectPath]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Introuvable</h1>
            <p className="text-gray-400 mb-6">{message}</p>
            <p className="mb-6">
                Vous serez redirigé dans{' '}
                <span className="text-blue-400 font-semibold">{countdown}</span> secondes.
            </p>
            <button
                onClick={() => router.push(redirectPath)}
                className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition ease-in-out"
            >
                Retourner
            </button>

        </div>
    );
}