// path: components/forms/ContactComponent.tsx
'use client';

import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { motion } from "framer-motion";
import { sendContactEmail } from "@/services/frontend-services/contact/ContactService";
import { getCurrentUserId } from "@/lib/auth";
import { getUserProfileById } from "@/services/frontend-services/UserService";
import { ProfileDto } from "@/services/dtos";

function ContactComponent() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [userData, setUserData] = useState<ProfileDto | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const userId = await getCurrentUserId();
                if (!userId) {
                    setUserData(null);
                    setIsLoading(false);
                    return;
                }
                const user = await getUserProfileById(Number(userId));
                if (user) {
                    setUserData(user);
                    setName(user.name ?? "");
                    setEmail(user.email ?? "");
                    setPhone(user.phoneNumber ?? "");
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);

    if (isLoading) return <div>Chargement...</div>;

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        const messageBody = { name, email, phone, subject, message };
        try {
            const mailSent = await sendContactEmail(messageBody);
            if (mailSent) {
                toast.success("Votre message a été envoyé !");
                setName('');
                setEmail('');
                setPhone('');
                setSubject('');
                setMessage('');
            } else {
                toast.error("Erreur lors de l'envoi du message.");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
            toast.error("Une erreur est survenue.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                        Contactez-nous
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                        Nous sommes là pour répondre à toutes vos questions
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Infos de contact */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-1"
                    >
                        <Card className="bg-white dark:bg-gray-800 shadow">
                            <CardHeader>
                                <CardTitle className="text-gray-900 dark:text-white">Informations de contact</CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-300">
                                    Plusieurs façons de nous joindre
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <Phone className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Téléphone</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">+32 xxx xxx xxx</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">contact@example.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Adresse</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Rue xxx, 12345 Ville</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Formulaire */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-2"
                    >
                        <Card className="bg-white dark:bg-gray-800 shadow">
                            <CardHeader>
                                <CardTitle className="text-gray-900 dark:text-white">Envoyez-nous un message</CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-300">
                                    Remplissez le formulaire ci-dessous
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Ligne 1 */}
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                Nom
                                            </label>
                                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                Email
                                            </label>
                                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                        </div>
                                    </div>

                                    {/* Ligne 2 */}
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label htmlFor="phone" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                Téléphone
                                            </label>
                                            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                Objet
                                            </label>
                                            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            Message
                                        </label>
                                        <Textarea
                                            id="message"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows={5}
                                            required
                                        />
                                    </div>

                                    {/* Bouton */}
                                    <div>
                                        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                                            <Send className="w-4 h-4 mr-2" />
                                            {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                                        </Button>
                                    </div>
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
