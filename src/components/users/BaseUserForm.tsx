// src/components/users/BaseUserForm.tsx
'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FaEnvelope, FaLock, FaPhone, FaUser } from 'react-icons/fa';
import { RegisterUserFrontendFormType } from '@/utils/validationSchema';
import { PhoneInput } from '@/components/phone-input';

type BaseUserFormProps = {
    role: 'CLIENT' | 'AGENCY_ADMIN' | 'ACCOUNTANT' | 'SUPER_ADMIN';
};

export const BaseUserForm: React.FC<BaseUserFormProps> = ({ role }) => {
    const { control } = useFormContext<RegisterUserFrontendFormType>();
    const isClient = role === 'CLIENT';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prénom */}
            <FormField
                control={control}
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Prénom <span className="text-red-500 ml-1">*</span></FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input placeholder="Prénom" {...field} className="pl-3" />
                                <FaUser className="absolute top-3 right-3 text-muted-foreground" />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Nom */}
            <FormField
                control={control}
                name="lastName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nom <span className="text-red-500 ml-1">*</span></FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input placeholder="Nom" {...field} className="pl-3" />
                                <FaUser className="absolute top-3 right-3 text-muted-foreground" />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Email */}
            <FormField
                control={control}
                name="email"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input placeholder="exemple@mail.com" {...field} className="pl-3" />
                                <FaEnvelope className="absolute top-3 right-3 text-muted-foreground" />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Téléphone */}
            <FormField
                control={control}
                name="phoneNumber"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Téléphone <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                            <div className="relative">
                                <PhoneInput {...field} defaultCountry="BE" className="w-full" />
                                <FaPhone className="absolute top-3 right-3 text-muted-foreground" />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Mot de passe & confirmation (STAFF uniquement) */}
            {!isClient && (
                <>
                    {/* Password */}
                    <FormField
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="md:col-span-1">
                                <FormLabel>Mot de passe <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type="password"
                                            placeholder="********"
                                            {...field}
                                            className="pl-3"
                                        />
                                        <FaLock className="absolute top-3 right-3 text-muted-foreground" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Confirmation */}
                    <FormField
                        control={control}
                        name="checkPassword"
                        render={({ field }) => (
                            <FormItem className="md:col-span-1">
                                <FormLabel>Confirmez le mot de passe <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type="password"
                                            placeholder="********"
                                            {...field}
                                            className="pl-3"
                                        />
                                        <FaLock className="absolute top-3 right-3 text-muted-foreground" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
            )}
        </div>
    );
};

