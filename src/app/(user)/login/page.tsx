
import Image from "next/image";
import LoginForm from "@/components/forms/LoginForm";
import React from "react";

const LoginPage = () => {
    return (
        <div className="container">
            <h1 className="text-center mt-5 text-6xl">Se connecter à votre compte</h1>
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-center">
                <Image priority
                       className="p-3 d-flex flex-column flex-sm-row align-items-center justify-content-center order-1 order-md-2"
                       src="/svg/login/login.svg" alt="Welcome" width={500} height={500}/>
                <div className="text-center order-2 order-md-1 mb-5">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default LoginPage;
