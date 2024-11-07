// path: src/app/client/(user)/register/page.tsx
'use client'
import RegisterForm from "@/components/forms/RegisterForm";
import React from "react";

const RegisterPage = () => {
    return (
        <div className="container mx-auto mt-10">

                <div className="order-2 order-md-1">
                    <RegisterForm />
                </div>

        </div>
    );
};

export default RegisterPage;
