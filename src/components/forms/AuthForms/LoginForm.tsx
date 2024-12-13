// path: src/components/forms/LoginForm.tsx
'use client';

import {Button, Form, InputGroup, Spinner} from "react-bootstrap";
import React, {useState, useTransition} from "react";
import {toast, ToastContainer} from "react-toastify";
import {useRouter, useSearchParams} from "next/navigation";
import {FaEnvelope, FaEye, FaEyeSlash, FaLock} from 'react-icons/fa';
import {LoginUserDto} from "@/services/dtos/users/UserDto";
import {loginUserSchema} from "@/utils/validationSchema";
import {motion} from "framer-motion";
import Image from "next/image";
import {login} from "@/actions/UserActions";
import Link from "next/link";

interface LoginFormProps {
    onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const loginData: LoginUserDto = {email, password};
        const validated = loginUserSchema.safeParse(loginData);

        if (!validated.success) {
            toast.error(validated.error.errors[0].message);
            return;
        }

        // @ts-ignore
        startTransition(async () => {
            try {
                const result = await login(email, password);

                if (result?.error) {
                    toast.error(result.error);
                } else {
                    toast.success("Connexion réussie");
                    const redirectUrl = searchParams.get("redirect") || "/client/simulation";
                    setTimeout(() => {
                        router.replace(redirectUrl);
                        router.refresh();
                    }, 600);
                }
            } catch (error) {
                toast.error("Erreur lors de la connexion");
            }
        });
    }

    return (
        <motion.div
            initial={{opacity: 0, scale: 0.95}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.6}}
            className="container mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8"
        >
            {/* Image Section */}
            <div className="flex-shrink-0">
                <Image
                    src="/svg/login/login.svg"
                    alt="Welcome"
                    width={300}
                    height={300}
                    priority
                    className="rounded-md"
                />
            </div>

            {/* Form Section */}
            <div className="flex-grow">

                <Form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5, delay: 0.2}}
                    >
                        <Form.Group controlId="loginEmail" className="mb-4">
                            <Form.Label disabled={isPending} className="text-gray-700 font-medium">
                                Adresse Email
                            </Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="bg-blue-50 border-0 text-blue-600">
                                    <FaEnvelope/>
                                </InputGroup.Text>
                                <Form.Control
                                    disabled={isPending}
                                    type="email"
                                    placeholder="Entrez votre email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="border border-gray-300 rounded-r-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </InputGroup>
                        </Form.Group>
                    </motion.div>

                    {/* Password Input */}
                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5, delay: 0.3}}
                    >
                        <Form.Group controlId="loginPassword" className="mb-4">
                            <Form.Label disabled={isPending} className="text-gray-700 font-medium">
                                Mot de Passe
                            </Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="bg-blue-50 border-0 text-blue-600">
                                    <FaLock/>
                                </InputGroup.Text>
                                <Form.Control
                                    disabled={isPending}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Entrez votre mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="border border-gray-300 rounded-r-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                                <Button
                                    disabled={isPending}
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                    className="border-l-0 rounded-r-lg"
                                >
                                    {showPassword ? <FaEyeSlash/> : <FaEye/>}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.4}}
                        className="text-center"
                    >
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isPending}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-150 ease-in-out shadow-sm hover:shadow-md"
                        >
                            {isPending ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="mr-2"
                                    />
                                    <span>  Connexion en cours...</span>
                                </>
                            ) : (

                                "Se connecter"

                            )}
                        </Button>

                    </motion.div>
                </Form>

                {/* Toast Notification */}
                <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar theme="colored"/>

                {/* Helpful Tips */}
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.6, delay: 0.5}}
                    className="mt-6 text-center text-sm text-gray-500"
                >
                    <Link href="/client/auth/login">
                        Vous avez oublié votre mot de passe ? <span className="text-blue-600 hover:underline">Cliquez ici <br/> </span>
                    </Link>

                    <Link href="/client/auth/register">
                        Pas encore inscrit ? <span className="text-blue-600 hover:underline">Créez
                            un compte</span>
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default LoginForm;
