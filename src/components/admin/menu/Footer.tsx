import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto py-8 px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">À propos</h3>
                        <p className="text-muted-foreground">
                            GestFact est votre solution complète pour la gestion de facturation, conçue pour simplifier vos processus financiers.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
                        <ul className="space-y-2">
                            <li><Link href="/dashboard" className="text-muted-foreground hover:text-primary">Tableau de bord</Link></li>
                            <li><Link href="/dashboard/users" className="text-muted-foreground hover:text-primary">Clients</Link></li>
                            <li><Link href="/dashboard/items" className="text-muted-foreground hover:text-primary">Articles</Link></li>
                            <li><Link href="/dashboard/invoices" className="text-muted-foreground hover:text-primary">Factures</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <p className="text-muted-foreground">Email: contact@gestfact.com</p>
                        <p className="text-muted-foreground">Téléphone: +33 1 23 45 67 89</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-muted-foreground hover:text-primary">
                                <Facebook size={24} />
                                <span className="sr-only">Facebook</span>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary">
                                <Twitter size={24} />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary">
                                <Instagram size={24} />
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary">
                                <Linkedin size={24} />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} GestFact. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    )
}
