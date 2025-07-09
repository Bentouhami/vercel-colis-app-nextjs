// path: src/app/client/unauthorized/page.tsx

'use client';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from "next/link";
import {FaHome} from 'react-icons/fa';

export default function UnauthorizedPage() {
    const [countdown, setCountdown] = useState(5);
    const router = useRouter();

    useEffect(() => {
        // Countdown logic
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        // Navigate when countdown reaches 0
        if (countdown === 0) {
            router.push('/');
        }

        return () => clearInterval(timer);
    }, [countdown, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 max-w-md w-full">
                <h1 className="text-4xl font-bold text-red-600 mb-4">Accès refusé</h1>
                <p className="text-gray-700 text-lg mb-6">
                    Vous n&#39;avez pas les droits nécessaires pour accéder à cette page.
                </p>
                <p className="text-gray-600 mb-6">
                    Vous serez redirigé vers la page d&#39;accueil dans <span
                    className="font-semibold text-blue-600">{countdown}</span> secondes.
                </p>
                {/* Progress Bar */}
                <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden mb-4">
                    <div
                        className="bg-blue-600 h-full transition-all duration-1000 ease-linear"
                        style={{width: `${(countdown / 5) * 100}%`}}
                    ></div>
                </div>
                <div className="flex justify-center mt-4">
                    <Link href="/"
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition ease-in-out duration-150">
                        <FaHome className="mr-2"/>
                        Retourner à l&#39;accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
