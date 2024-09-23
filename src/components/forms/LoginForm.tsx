'use client';
import { Button, Form, InputGroup } from "react-bootstrap";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { login } from "@/app/utils/api";
import { useRouter } from "next/navigation"; // Déplacer useRouter au début du composant
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { LoginUserDto } from "@/app/utils/dtos";
import { loginUserSchema } from "@/app/utils/validationSchema";

const LoginForm = () => {
    const router = useRouter(); // Utiliser useRouter au niveau supérieur du composant
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // État pour contrôler la visibilité du mot de passe
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const loginData: LoginUserDto = {
            email,
            password,
        };

        const validated = loginUserSchema.safeParse(loginData);

        if (!validated.success) {
            toast.error(validated.error.errors[0].message, {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        try {
            setLoading(true);
            await login(email, password);

            toast.success("Connexion réussie", {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Redirection vers la page de simulation
            router.replace("/simulation"); // Utiliser router ici, après la validation du login
            router.refresh(); // Rafraîchir la page pour afficher les nouveaux composants
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message || "Une erreur s'est produite lors de la connexion", {
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error("Erreur inconnue", {
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form onSubmit={handleSubmit} className="mt-3">
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                    type="email"
                    placeholder="Entrez votre email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <InputGroup>
                    <Form.Control
                        type={showPassword ? "text" : "password"} // Changer le type de champ en fonction de showPassword
                        placeholder="Entrez votre mot de passe"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)} // Inverser l'état de showPassword
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Utiliser les icônes FaEye et FaEyeSlash de react-icons */}
                    </Button>
                </InputGroup>
            </Form.Group>

            <Button type="submit" variant="primary" className="mb-3" disabled={loading}>
                {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
            <ToastContainer
                theme="colored"
                position="bottom-right"
            />
        </Form>
    );
}

export default LoginForm;
