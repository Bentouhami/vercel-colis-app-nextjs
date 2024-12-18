// path: src/components/forms/EnvoiForms/AddReceiverForm.tsx

'use client';
import React, {ChangeEvent, useEffect, useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Loader2, Mail, Phone, User, UserPlus} from "lucide-react";
import {toast, ToastContainer} from "react-toastify";
import {DestinataireInput, destinataireSchema} from "@/utils/validationSchema";
import {addDestinataire} from "@/services/frontend-services/UserService";
import {Roles} from "@/services/dtos/enums/EnumsDto";
import {CreateDestinataireDto} from "@/services/dtos/users/UserDto";

import {
    updateSimulationDestination,
    assignTransportToSimulation
} from "@/services/frontend-services/simulation/SimulationService";
import {getSimulationFromCookie} from "@/lib/simulationCookie";
import {useSession} from "next-auth/react";

export default function AddReceiverForm() {
    const {data: session, status} = useSession();
    const isAuthenticated = status === "authenticated";
    const router = useRouter();
    const [isPending, startTransition] = useTransition()
    const [destinataireFormData, setDestinataireFormData] = useState<DestinataireInput>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const validateField = (name: string, value: string) => {
        try {
            const fieldSchema = destinataireSchema.shape[name as keyof DestinataireInput];
            fieldSchema.parse(value);
            setErrors((prev) => ({...prev, [name]: ''}));
        } catch (error: any) {
            setErrors((prev) => ({...prev, [name]: error.errors[0]?.message || 'Champ invalide'}));
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("Vous devez être connecté pour ajouter un destinataire");
            router.push("/client/auth/login");
            return;
        }
    }, [isAuthenticated, router]);


    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setDestinataireFormData(prev => ({...prev, [name]: value}));
        if (touched[name]) {
            validateField(name, value);
        }
    };

    const handleBlur = (name: string) => {
        setTouched(prev => ({...prev, [name]: true}));
        validateField(name, destinataireFormData[name as keyof DestinataireInput]);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validated = destinataireSchema.safeParse(destinataireFormData);

        if (!validated.success) {
            const newErrors: Record<string, string> = {};
            validated.error.errors.forEach(error => {
                if (error.path[0]) {
                    newErrors[error.path[0].toString()] = error.message;
                }
            });
            setErrors(newErrors);
            toast.error("Veuillez corriger les erreurs dans le formulaire");
            return;
        }

        setErrors({});
        startTransition(() => {
            (async () => {
                try {
                    // Format the destinataire data
                    const formattedDestinataireData: CreateDestinataireDto = {
                        ...destinataireFormData,
                        name: `${destinataireFormData.firstName} ${destinataireFormData.lastName}`,
                        image: "",
                        roles: [Roles.DESTINATAIRE],
                    };

                    // Add the destinataire to the database
                    const destinataireId = await addDestinataire(formattedDestinataireData);

                    if (!destinataireId) {
                        toast.error("Une erreur est survenue lors de l'enregistrement du destinataire.");
                        return;
                    }

                    const simulationResults = await getSimulationFromCookie()

                    if (simulationResults) {
                        // Update simulation status to CONFIRMED
                        const response = await updateSimulationDestination(simulationResults.id, destinataireId);

                        if (!response) {
                            toast.error("Une erreur est survenue lors de la mise à jour de la simulation. Vérifiez les informations saisies.");
                            return;
                        }

                        await assignTransportToSimulation(simulationResults.id);

                        toast.success("Destinataire ajouté avec succès à votre simulation.");
                    } else {
                        toast.error("Une erreur est survenue lors de l'ajout du destinataire, vérifier les informations saisies.");
                    }

                    // Attendre 3 secondes avant la redirection
                    setTimeout(() => {
                        router.push("/client/envois/recapitulatif");
                    }, 3000);
                } catch (error) {
                    console.error("Error updating simulation:", error);
                    toast.error("Une erreur est survenue lors de l'ajout du destinataire.");
                }
            })(); // Appelez l'IIFE (Immediately Invoked Function Expression)
        });

    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <Card className="w-full">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold text-blue-700 flex items-center justify-center gap-2">
                        <UserPlus className="h-6 w-6"/>
                        Ajouter un destinataire
                    </CardTitle>
                    <CardDescription>
                        Veuillez remplir les informations du destinataire
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="flex items-center gap-2">
                                    <User className="h-4 w-4"/>
                                    Nom
                                </Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={destinataireFormData.firstName}
                                    onChange={handleInputChange}
                                    onBlur={() => handleBlur('firstName')}
                                    placeholder="Entrez le nom"
                                    className={errors.firstName ? 'border-red-500' : ''}
                                    disabled={isPending}
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm">{errors.firstName}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="flex items-center gap-2">
                                    <User className="h-4 w-4"/>
                                    Prénom
                                </Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={destinataireFormData.lastName}
                                    onChange={handleInputChange}
                                    onBlur={() => handleBlur('lastName')}
                                    placeholder="Entrez le prénom"
                                    className={errors.lastName ? 'border-red-500' : ''}
                                    disabled={isPending}
                                />
                                {errors.lastName && (
                                    <p className="text-red-500 text-sm">{errors.lastName}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4"/>
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={destinataireFormData.email}
                                    onChange={handleInputChange}
                                    onBlur={() => handleBlur('email')}
                                    placeholder="exemple@email.com"
                                    className={errors.email ? 'border-red-500' : ''}
                                    disabled={isPending}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                                    <Phone className="h-4 w-4"/>
                                    Numéro de téléphone
                                </Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    value={destinataireFormData.phoneNumber}
                                    onChange={handleInputChange}
                                    onBlur={() => handleBlur('phoneNumber')}
                                    placeholder="+33 6 XX XX XX XX"
                                    className={errors.phoneNumber ? 'border-red-500' : ''}
                                    disabled={isPending}
                                />
                                {errors.phoneNumber && (
                                    <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-medium"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin"/>
                                    Ajout en cours...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <UserPlus className="h-4 w-4"/>
                                    Ajouter le destinataire
                                </span>
                            )}
                        </Button>
                    </form>
                    <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar theme="colored"/>

                </CardContent>
            </Card>
        </div>
    );
}
