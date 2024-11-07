// path: components/forms/ContactComponent.tsx
'use client';

import React, {FormEvent, useState} from "react";
import {toast} from "react-toastify";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Mail, MapPin, Phone, Send} from "lucide-react";
import {motion} from "framer-motion";
import {sendContactEmail} from "@/services/frontend-services/contact/ContactService";

function ContactComponent() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        const messageBody = {name, email, phone, subject, message};

        try {
            const mailSent = await sendContactEmail(messageBody);
            toast.success("Votre message a été envoyé !");
            setName('');
            setEmail('');
            setPhone('');
            setSubject('');
            setMessage('');

            if (mailSent) {
                toast.success("Votre message a été envoyé !");
            } else {

                toast.error("Erreur lors de l'envoi du message.");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Contactez-nous</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Nous sommes là pour répondre à toutes vos questions
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5}}
                        className="lg:col-span-1"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations de contact</CardTitle>
                                <CardDescription>
                                    Plusieurs façons de nous joindre
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <Phone className="h-5 w-5 text-blue-600"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Téléphone</p>
                                        <p className="text-sm text-gray-600">+32 xxx xxx xxx</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Mail className="h-5 w-5 text-blue-600"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Email</p>
                                        <p className="text-sm text-gray-600">contact@example.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <MapPin className="h-5 w-5 text-blue-600"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Adresse</p>
                                        <p className="text-sm text-gray-600">Rue xxx, 12345 Ville</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5}}
                        className="lg:col-span-2"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Envoyez-nous un message</CardTitle>
                                <CardDescription>
                                    Remplissez le formulaire ci-dessous
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <motion.div
                                        initial={{opacity: 0, y: 10}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{duration: 0.3}}
                                        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                                    >
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium text-gray-900">
                                                Nom
                                            </label>
                                            <Input
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Votre nom"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-gray-900">
                                                Email
                                            </label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="votre@email.com"
                                                required
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{opacity: 0, y: 10}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{duration: 0.3, delay: 0.1}}
                                        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                                    >
                                        <div className="space-y-2">
                                            <label htmlFor="phone" className="text-sm font-medium text-gray-900">
                                                Téléphone
                                            </label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+32 xxx xxx xxx"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium text-gray-900">
                                                Objet
                                            </label>
                                            <Input
                                                id="subject"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                placeholder="Objet de votre message"
                                                required
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{opacity: 0, y: 10}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{duration: 0.3, delay: 0.2}}
                                        className="space-y-2"
                                    >
                                        <label htmlFor="message" className="text-sm font-medium text-gray-900">
                                            Message
                                        </label>
                                        <Textarea
                                            id="message"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Votre message..."
                                            className="h-32"
                                            required
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{opacity: 0, y: 10}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{duration: 0.3, delay: 0.3}}
                                    >
                                        <Button
                                            type="submit"
                                            className="w-full sm:w-auto"
                                            disabled={isSubmitting}
                                        >
                                            <Send className="w-4 h-4 mr-2"/>
                                            {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                                        </Button>
                                    </motion.div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default ContactComponent;
