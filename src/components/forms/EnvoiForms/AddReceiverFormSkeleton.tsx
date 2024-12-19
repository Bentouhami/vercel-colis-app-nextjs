// path: src/components/forms/EnvoiForms/AddReceiverFormSkeleton.tsx
'use client';

import React from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Loader2, Mail, Phone, User, UserPlus} from "lucide-react";
import {ToastContainer} from "react-toastify";

export default function AddReceiverFormSkeleton() {
    // Placeholder state for skeleton loading effect
    const isPending = false;

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <Card className="w-full">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold text-blue-700 flex items-center justify-center gap-2">
                        <UserPlus className="h-6 w-6"/>
                        Ajouter un destinataire
                    </CardTitle>
                    <CardDescription className="h-6">

                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="flex items-center gap-2">
                                    <User className="h-4 w-4"/>
                                    Nom
                                </Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    placeholder="Entrez le nom"
                                    className="border-gray-300"
                                    disabled={isPending}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="flex items-center gap-2">
                                    <User className="h-4 w-4"/>
                                    Prénom
                                </Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Entrez le prénom"
                                    className="border-gray-300"
                                    disabled={isPending}
                                />
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
                                    placeholder="exemple@email.com"
                                    className="border-gray-300"
                                    disabled={isPending}
                                />
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
                                    placeholder="+33 6 XX XX XX XX"
                                    className="border-gray-300"
                                    disabled={isPending}
                                />
                            </div>
                        </div>

                        <Button
                            type="button"
                            className="w-full h-11 text-base font-medium"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin"/>
                                    Chargement...
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
