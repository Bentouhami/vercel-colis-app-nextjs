// src/app/client/tracking/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // Corrected import for App Router

export default function TrackingLookupPage() {
    const [trackingNumber, setTrackingNumber] = useState('');
    const router = useRouter();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (trackingNumber.trim()) {
            router.push(`/client/tracking/${trackingNumber.trim()}`);
        }
    };

    return (
        <div className="container mx-auto mt-10 p-5 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-8 text-center">
                Suivre votre Colis
            </h1>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white shadow-md rounded-lg p-8"
            >
                <div className="mb-6">
                    <label
                        htmlFor="trackingNumber"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Numéro de Suivi
                    </label>
                    <input
                        type="text"
                        id="trackingNumber"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Entrez votre numéro de suivi"
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
                    >
                        Rechercher
                    </button>
                </div>
            </form>
        </div>
    );
}
