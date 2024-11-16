// path: src/app/client/(user)/register/page.tsx
'use client';
import RegisterForm from "@/components/forms/RegisterForm";
import React from "react";
import {motion} from "framer-motion";

const RegisterPage = () => {
    return (
        <div className="container mx-auto px-4 mt-10 md:mt-20 flex justify-center">
            <div className="w-full max-w-6xl p-4">
                <motion.h2
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.1}}
                    className="text-center text-3xl font-bold text-gray-800 mb-6"
                >
                    Créez votre compte <span className="text-blue-600">ColisApp</span>
                </motion.h2>
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;
