// path: src/app/auth/login/LoginPageClient.tsx
"use client";

import { Suspense } from "react";
import LoginForm from "@/components/forms/AuthForms/LoginForm";
import LoginSkeleton from "@/app/auth/login/LoginSkeleton";

export default function LoginPageClient() {
    return (
        <div className="container mx-auto px-4 mt-10 md:mt-20 flex justify-center">
            <div className="w-full max-w-4xl p-4">
                <Suspense fallback={<LoginSkeleton />}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
