// path: src/components/users/MultiStepRegistrationForm.tsx

'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
    RegisterUserFrontendFormType,
    registerUserFrontendSchema,
} from '@/utils/validationSchema';
import { registerUser } from '@/services/frontend-services/UserService';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { StepIndicator } from '@/components/users/StepIndicator';
import PersonalInformationForm from '@/components/auth/PersonalInformationForm';
import AddressForm from '@/components/address/AddressForm';
import LoginInformationForm from '@/components/auth/LoginInformationForm';

type Props = {
    role: 'CLIENT' | 'AGENCY_ADMIN' | 'ACCOUNTANT' | 'SUPER_ADMIN';
};

export default function MultiStepRegisterForm({ role }: Props) {
    const [step, setStep] = useState(1);
    const [isPending, startTransition] = useTransition();
    const totalSteps = 3;

    const form = useForm<RegisterUserFrontendFormType>({
        resolver: zodResolver(registerUserFrontendSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            birthDate: '',
            phoneNumber: '',
            email: '',
            password: '',
            checkPassword: '',
            address: {
                street: '',
                complement: '',
                streetNumber: '',
                boxNumber: '',
                city: '',
                country: '',
            },
        },
    });

    const onSubmit = (values: RegisterUserFrontendFormType) => {
        startTransition(async () => {
            try {
                const payload = {
                    ...values,
                    role, // tu peux gérer `agencyId` dynamiquement ici plus tard si agency admin
                };

                const result = await registerUser(payload);

                if (!result) {
                    toast.error("Réponse inattendue du serveur.");
                    return;
                }
                if (result.error) {
                    toast.error(result.error);
                    return;
                }
                if (result.message) {
                    toast.success(result.message);
                    setTimeout(() => {
                        window.location.href = '/admin/users'; // redirige vers la page utilisateurs
                    }, 2000);
                } else {
                    toast.error("Erreur inconnue du serveur.");
                }
            } catch (err: any) {
                toast.error(err.message || 'Erreur lors de la création de l’utilisateur.');
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto py-4 space-y-6">
            <StepIndicator currentStep={step} totalSteps={totalSteps} />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {step === 1 && (
                        <PersonalInformationForm form={form} isPending={isPending} />
                    )}

                    {step === 2 && <AddressForm form={form} isPending={isPending} />}

                    {step === 3 && (
                        <LoginInformationForm form={form} isPending={isPending} />
                    )}

                    <div className="flex justify-between mt-6">
                        {step > 1 && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setStep((s) => s - 1)}
                            >
                                Précédent
                            </Button>
                        )}
                        {step < totalSteps ? (
                            <Button
                                type="button"
                                onClick={() => setStep((s) => s + 1)}
                                disabled={isPending}
                            >
                                Suivant
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Création...' : 'Créer le compte'}
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
}
