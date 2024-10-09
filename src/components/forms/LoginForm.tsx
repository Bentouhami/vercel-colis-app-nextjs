// /src/components/forms/LoginForm.tsx
'use client'; // Ce composant est client side

import {Button, Form, InputGroup} from "react-bootstrap";
import React, {useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import {login} from "@/utils/api";
import {useRouter, useSearchParams} from "next/navigation";
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import {LoginUserDto} from "@/utils/dtos";
import {loginUserSchema} from "@/utils/validationSchema";

interface LoginFormProps {
    onSuccess?: () => void; // Propriété pour gérer la redirection
}

const LoginForm: React.FC<LoginFormProps> = ({onSuccess}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const loginData: LoginUserDto = {email, password};
        const validated = loginUserSchema.safeParse(loginData);

        if (!validated.success) {
            toast.error(validated.error.errors[0].message);
            return;
        }

        try {
            setLoading(true);
            await login(email, password);
            toast.success("Connexion réussie");

            if (onSuccess) {
                onSuccess();
            } else {
                //
                const redirectUrl = searchParams.get('redirect') || '/client/simulation';
                router.replace(redirectUrl);
                router.refresh();
            }
        } catch (error) {
            toast.error("Erreur lors de la connexion");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Control type="email" placeholder="Entrez votre email" onChange={(e) => setEmail(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <InputGroup>
                    <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Entrez votre mot de passe"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash/> : <FaEye/>}
                    </Button>
                </InputGroup>
            </Form.Group>
            <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
            <ToastContainer position="bottom-right"/>
        </Form>
    );
};

export default LoginForm;
