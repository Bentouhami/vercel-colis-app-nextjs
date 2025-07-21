// src/app/client/tracking/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PackageSearch } from 'lucide-react';

export default function TrackingLookupPage() {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [error, setError] = useState<string | null>(null); // New state for error message
    const router = useRouter();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null); // Clear previous errors

        if (!trackingNumber.trim()) {
            setError('Veuillez entrer un numéro de suivi.');
            return;
        }

        router.push(`/client/tracking/${trackingNumber.trim()}`);
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <PackageSearch className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Suivre votre Colis</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                        Entrez le numéro de suivi de votre colis pour obtenir les dernières informations sur son statut et sa localisation.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="trackingNumber">Numéro de Suivi</Label>
                            <Input
                                id="trackingNumber"
                                type="text"
                                placeholder="Ex: COLIS123456789"
                                value={trackingNumber}
                                onChange={(e) => {
                                    setTrackingNumber(e.target.value);
                                    if (error) setError(null);
                                }}
                                className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
                                required
                            />
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Le numéro de suivi est généralement fourni par l&#39;expéditeur ou sur votre confirmation d&#39;expédition.
                            </p>
                        </div>
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                            Rechercher
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Pour toute question, veuillez contacter notre support client.
                </CardFooter>
            </Card>
        </div>
    );
}
