'use client';
import {Button, Form} from "react-bootstrap";
import React, {useState} from "react";
import {toast, ToastContainer} from "react-toastify";
// import {router} from "next/client";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (email === "") {
            toast.error("Veuillez entrer votre email");
            return;
        }
        if (password === "") {
            toast.error("Veuillez entrer votre mot de passe");
            return;
        }

        toast.success("Connexion réussie");
        console.log("Email : " + email);
        console.log("Password : " + password);
        // router.replace('/');
    }

    return (
        <Form onSubmit={handleSubmit} className="mt-3">
            <Form.Group className="mb-3" controlId="formBasicEmail">
                {/*<Form.Label>Email address</Form.Label>*/}
                <Form.Control type="email"
                              placeholder="Enter votre email"
                              onChange={(e) => setEmail(e.target.value)}
                />
                <Form.Text className="text-muted">
                    We&apos;ll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                {/*<Form.Label>Password</Form.Label>*/}
                <Form.Control type="password"
                              placeholder="Enter votre mot de passe"
                              onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            <Button type={"submit"} variant="primary" className="mb-3">Se connecter</Button>
            <ToastContainer
                theme="colored"
                position={"bottom-right"}
            />
        </Form>
    )
}
export default LoginForm
