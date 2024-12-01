'use client';
import React, { Suspense } from "react";
import LoginForm from "@/components/forms/LoginForm";
import {motion} from "framer-motion";

const LoginContent = () => {
    return (
        <div className="container mx-auto px-4 mt-10 md:mt-20 flex justify-center">
            <div className="w-full max-w-4xl p-4">
                <motion.h2
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.1}}
                    className="text-center text-3xl font-bold text-gray-800 mb-6"
                >
                    Bienvenue sur <span className="text-blue-600">ColisApp</span>
                </motion.h2>
                <LoginForm />
            </div>
        </div>
    );
};

const LoginPage = () => {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <LoginContent />
        </Suspense>
    );
};

export default LoginPage;