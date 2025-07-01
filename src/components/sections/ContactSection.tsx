// src/components/sections/ContactSection.tsx
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ContactSection() {
    return (
        <section id="contact" className="py-20 bg-gray-50">
            <div className="container px-4 md:px-6 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
                    Contactez-nous
                </h2>
                <p className="text-center text-gray-600 mb-8">
                    Une question ? Une suggestion ? N&#39;hésitez pas à nous écrire !
                </p>
                <form className="space-y-6">
                    <Input type="text" placeholder="Nom" required />
                    <Input type="email" placeholder="Email" required />
                    <Textarea placeholder="Votre message..." rows={5} required />
                    <div className="text-center">
                        <Button type="submit" className="px-8">
                            Envoyer
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    )
}
