'use client'

import React from 'react';
import  MultiStepRegistrationForm  from './MultiStepRegistrationForm';

export const NewSuperAdmin: React.FC = () => {
    return (
        <div className="space-y-6 pt-4 sm:pt-6">
            <div className="border-b pb-4">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground/90">Create New Super Admin</h1>
            </div>
            <MultiStepRegistrationForm role="SUPER_ADMIN" />
        </div>
    );
};

