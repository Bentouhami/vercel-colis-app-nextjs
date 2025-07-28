"use client"

import { type FormEvent, useEffect, useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone, Send, Sparkles } from "lucide-react"
import { sendContactEmail } from "@/services/frontend-services/contact/ContactService"
import { getCurrentUserId } from "@/lib/auth-utils"
import { getUserProfileById } from "@/services/frontend-services/UserService"
import type { ProfileDto } from "@/services/dtos"

function ContactComponent() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [userData, setUserData] = useState<ProfileDto | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [formSubmitted, setFormSubmitted] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true)
                const userId = await getCurrentUserId()
                if (!userId) {
                    setUserData(null)
                    setIsLoading(false)
                    return
                }
                const user = await getUserProfileById(Number(userId))
                if (user) {
                    setUserData(user)
                    setName(user.name ?? "")
                    setEmail(user.email ?? "")
                    setPhone(user.phoneNumber ?? "")
                }
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching user data:", error)
                setIsLoading(false)
            }
        }

        fetchUserData()

        // Déclencher les animations après un court délai
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <div
                            className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animate-reverse"
                            style={{ animationDelay: "0.5s" }}
                        ></div>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse">Chargement...</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Préparation de votre espace</p>
                    </div>
                </div>
            </div>
        )
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setIsSubmitting(true)
        const messageBody = { name, email, phone, subject, message }

        try {
            const mailSent = await sendContactEmail(messageBody)
            if (mailSent) {
                toast.success("Votre message a été envoyé !")
                setFormSubmitted(true)
                // Animation de succès
                setTimeout(() => {
                    setName("")
                    setEmail("")
                    setPhone("")
                    setSubject("")
                    setMessage("")
                    setFormSubmitted(false)
                }, 2000)
            } else {
                toast.error("Erreur lors de l'envoi du message.")
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error)
            toast.error("Une erreur est survenue.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header avec animation de particules */}
                <div
                    className={`text-center mb-16 relative transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                        }`}
                >
                    {/* Particules décoratives */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div
                            className="absolute top-10 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0s" }}
                        ></div>
                        <div
                            className="absolute top-20 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: "1s" }}
                        ></div>
                        <div
                            className="absolute top-5 right-1/4 w-3 h-3 bg-blue-300 rounded-full animate-bounce"
                            style={{ animationDelay: "2s" }}
                        ></div>
                    </div>

                    <div className="relative">
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
                            Contactez-nous
                        </h2>
                        <div className="flex items-center justify-center space-x-2 mb-6">
                            <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Nous sommes là pour répondre à toutes vos questions
                            </p>
                            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" style={{ animationDelay: "0.5s" }} />
                        </div>
                        {/* Ligne décorative */}
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Infos de contact avec animations améliorées */}
                    <div
                        className={`lg:col-span-1 transition-all duration-800 ease-out ${isVisible ? "opacity-100 translate-x-0 rotate-0" : "opacity-0 -translate-x-12 -rotate-3"
                            }`}
                        style={{ transitionDelay: "300ms" }}
                    >
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 border-0 hover:scale-105 group">
                            <CardHeader className="relative overflow-hidden">
                                {/* Gradient de fond animé */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-500"></div>
                                <CardTitle className="text-gray-900 dark:text-white relative z-10 flex items-center space-x-2">
                                    <Mail className="w-5 h-5 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
                                    <span>Informations de contact</span>
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-300 relative z-10">
                                    Plusieurs façons de nous joindre
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 relative">
                                {[
                                    { icon: Phone, title: "Téléphone", value: "+32 xxx xxx xxx", color: "text-blue-600" },
                                    { icon: Mail, title: "Email", value: "contact@example.com", color: "text-purple-600" },
                                    { icon: MapPin, title: "Adresse", value: "Rue xxx, 12345 Ville", color: "text-green-600" },
                                ].map((item, index) => (
                                    <div
                                        key={item.title}
                                        className={`flex items-center space-x-4 group/item p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                                            }`}
                                        style={{ transitionDelay: `${500 + index * 100}ms` }}
                                    >
                                        <div className="relative">
                                            <item.icon
                                                className={`h-6 w-6 ${item.color} group-hover/item:scale-125 group-hover/item:rotate-12 transition-all duration-300`}
                                            />
                                            <div
                                                className={`absolute inset-0 ${item.color.replace("text-", "bg-")} opacity-20 rounded-full scale-0 group-hover/item:scale-150 transition-transform duration-300`}
                                            ></div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white group-hover/item:text-blue-600 transition-colors duration-200">
                                                {item.title}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Formulaire avec animations avancées */}
                    <div
                        className={`lg:col-span-2 transition-all duration-800 ease-out ${isVisible ? "opacity-100 translate-x-0 rotate-0" : "opacity-0 translate-x-12 rotate-3"
                            }`}
                        style={{ transitionDelay: "500ms" }}
                    >
                        <Card
                            className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 border-0 ${formSubmitted ? "ring-4 ring-green-400 ring-opacity-50" : ""
                                }`}
                        >
                            <CardHeader className="relative overflow-hidden">
                                {/* Gradient de fond animé */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-500"></div>
                                <CardTitle className="text-gray-900 dark:text-white relative z-10 flex items-center space-x-2">
                                    <Send className="w-5 h-5 text-purple-600 hover:rotate-12 transition-transform duration-300" />
                                    <span>Envoyez-nous un message</span>
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-300 relative z-10">
                                    Remplissez le formulaire ci-dessous
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Ligne 1 avec animations staggerées */}
                                    <div
                                        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 transition-all duration-600 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                                            }`}
                                        style={{ transitionDelay: "700ms" }}
                                    >
                                        <div className="space-y-2 group">
                                            <label
                                                htmlFor="name"
                                                className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors duration-200"
                                            >
                                                Nom
                                            </label>
                                            <Input
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                className="transition-all duration-300 focus:scale-105 focus:shadow-lg hover:shadow-md border-gray-200 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label
                                                htmlFor="email"
                                                className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-purple-600 transition-colors duration-200"
                                            >
                                                Email
                                            </label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="transition-all duration-300 focus:scale-105 focus:shadow-lg hover:shadow-md border-gray-200 focus:border-purple-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Ligne 2 */}
                                    <div
                                        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 transition-all duration-600 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                                            }`}
                                        style={{ transitionDelay: "800ms" }}
                                    >
                                        <div className="space-y-2 group">
                                            <label
                                                htmlFor="phone"
                                                className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-green-600 transition-colors duration-200"
                                            >
                                                Téléphone
                                            </label>
                                            <Input
                                                id="phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="transition-all duration-300 focus:scale-105 focus:shadow-lg hover:shadow-md border-gray-200 focus:border-green-500"
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label
                                                htmlFor="subject"
                                                className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-orange-600 transition-colors duration-200"
                                            >
                                                Objet
                                            </label>
                                            <Input
                                                id="subject"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                required
                                                className="transition-all duration-300 focus:scale-105 focus:shadow-lg hover:shadow-md border-gray-200 focus:border-orange-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Message avec animation spéciale */}
                                    <div
                                        className={`space-y-2 group transition-all duration-600 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                                            }`}
                                        style={{ transitionDelay: "900ms" }}
                                    >
                                        <label
                                            htmlFor="message"
                                            className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors duration-200"
                                        >
                                            Message
                                        </label>
                                        <Textarea
                                            id="message"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows={5}
                                            required
                                            className="transition-all duration-300 focus:scale-105 focus:shadow-lg hover:shadow-md border-gray-200 focus:border-indigo-500 resize-none"
                                        />
                                    </div>

                                    {/* Bouton avec animation complexe */}
                                    <div
                                        className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-90"
                                            }`}
                                        style={{ transitionDelay: "1000ms" }}
                                    >
                                        <Button
                                            type="submit"
                                            className={`w-full sm:w-auto relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transition-all duration-500 transform hover:scale-110 hover:rotate-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl group ${formSubmitted ? "animate-pulse bg-green-500" : ""
                                                }`}
                                            disabled={isSubmitting}
                                        >
                                            {/* Effet de brillance */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                            <div className="relative flex items-center space-x-2">
                                                <Send
                                                    className={`w-4 h-4 transition-all duration-300 ${isSubmitting ? "animate-bounce" : "group-hover:translate-x-1"}`}
                                                />
                                                {isSubmitting ? (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span className="animate-pulse">Envoi en cours...</span>
                                                    </div>
                                                ) : formSubmitted ? (
                                                    <span className="text-white font-medium">Message envoyé ! ✨</span>
                                                ) : (
                                                    <span>Envoyer le message</span>
                                                )}
                                            </div>
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Section décorative en bas */}
                <div
                    className={`mt-16 text-center transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                    style={{ transitionDelay: "1200ms" }}
                >
                    <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full">
                        <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Réponse garantie sous 24h</span>
                        <Sparkles className="w-4 h-4 text-purple-600 animate-spin" style={{ animationDirection: "reverse" }} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ContactComponent
