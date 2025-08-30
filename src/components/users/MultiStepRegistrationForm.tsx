// path: src/components/users/MultiStepRegistrationForm.tsx

'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
    RegisterUserFrontendFormType,
    registerUserFrontendSchema,
    registerUserFrontendSchemaAdmin,
} from '@/utils/validationSchema';
import { registerUser, createUserByAdmin } from '@/services/frontend-services/UserService';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { StepIndicator } from '@/components/users/StepIndicator';
import PersonalInformationForm from '@/components/auth/PersonalInformationForm';
import AddressForm from '@/components/address/AddressForm';
import LoginInformationForm from '@/components/auth/LoginInformationForm';

type Props = {
    role: 'CLIENT' | 'AGENCY_ADMIN' | 'ACCOUNTANT' | 'SUPER_ADMIN';
    askPassword?: boolean; // if false, admin flow: no password, send reset email
};

export default function MultiStepRegisterForm({ role, askPassword = true }: Props) {
    const [step, setStep] = useState(1);
    const [isPending, startTransition] = useTransition();
    const totalSteps = askPassword ? 3 : 2;

    const resolver = useMemo(
        () => zodResolver(askPassword ? registerUserFrontendSchema : registerUserFrontendSchemaAdmin),
        [askPassword]
    );

    const form = useForm<any>({
        resolver,
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

    const onSubmit = (values: any) => {
        startTransition(async () => {
            try {
                if (!askPassword) {
                    // Require agency for specific roles
                    if ((role === 'AGENCY_ADMIN' || role === 'ACCOUNTANT') && !values.agencyId) {
                        toast.error("Veuillez sélectionner une agence");
                        return;
                    }
                    // Admin flow: create user without password and email reset link
                    const { password, checkPassword, ...rest } = values as any;
                    const result = await createUserByAdmin({
                        ...(rest as Omit<RegisterUserFrontendFormType, 'password' | 'checkPassword'>),
                        role,
                    } as any);

                    if (!result) {
                        toast.error('Réponse inattendue du serveur.');
                        return;
                    }
                    if (result.error) {
                        toast.error(result.error);
                        return;
                    }
                    toast.success(result.message || 'Utilisateur créé. Un email a été envoyé pour définir le mot de passe.');
                    setTimeout(() => {
                        window.location.href = '/admin/users';
                    }, 1500);
                    return;
                }

                // Self-registration flow (asks for password)
                const payload = {
                    ...values,
                    role,
                } as any;

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
                        <PersonalInformationForm form={form} isPending={isPending} includeEmail={!askPassword} role={role} />
                    )}

                    {step === 2 && <AddressForm form={form} isPending={isPending} />}

                    {askPassword && step === 3 && (
                        <LoginInformationForm form={(form as unknown) as UseFormReturn<RegisterUserFrontendFormType>} isPending={isPending} />
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
