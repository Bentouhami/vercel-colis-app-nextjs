'use client';
import {Button, Form, InputGroup} from "react-bootstrap";
import React, {useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import {login} from "@/app/utils/api";
import {useRouter} from "next/navigation";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importer les icônes FaEye et FaEyeSlash de react-icons

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // État pour contrôler la visibilité du mot de passe
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (email === "") {
            toast.error("Veuillez entrer votre email");
            return;
        }
        if (password === "") {
            toast.error("Veuillez entrer votre mot de passe");
            return;
        }

        try {
            await login(email, password);
            toast.success("Connexion réussie");
            router.replace('/');
        } catch (error) {
            if (error.message === 'Invalid credentials, please try again or register') {
                toast.error("Email ou mot de passe incorrect.");
            } else {
                toast.error("Une erreur est survenue. Veuillez réessayer.");
            }
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

            <Button type="submit" variant="primary" className="mb-3">
                Se connecter
            </Button>
            <ToastContainer
                theme="colored"
                position="bottom-right"
            />
        </Form>
    );
}
export default LoginForm;
