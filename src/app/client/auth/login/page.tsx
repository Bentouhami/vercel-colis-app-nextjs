// src/app/client/auth/login/page.tsx

"use client";
import React, { Suspense } from "react";
import LoginForm from "@/components/forms/AuthForms/LoginForm";

export default function LoginPage() {
    return (
        <div className="container mx-auto px-4 mt-10 md:mt-20 flex justify-center">
            <div className="w-full max-w-4xl p-4">
                <Suspense fallback={<div>Chargement...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
