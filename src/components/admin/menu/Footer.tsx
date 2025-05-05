import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import {adminPath} from "@/utils/constants";

export function Footer() {
    return (
        <footer className="bg-background border-t mt-10 mb-5">
            <div className="container mx-auto py-8 px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">À propos</h3>
                        <p className="text-muted-foreground">
                           ColisApp est votre espace professionnel pour la gestion facile de votre agence.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href={adminPath()} className="text-muted-foreground hover:text-primary">Tableau de bord</Link>
                            </li>
                            <li>
                                <Link href={adminPath("users")} className="text-muted-foreground hover:text-primary">Utilisateurs</Link>
                            </li>
                            <li>
                                <Link href={adminPath("envois")} className="text-muted-foreground hover:text-primary">Envois</Link>
                            </li>

                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <p className="text-muted-foreground">Email: help@colisApp.com</p>
                        <p className="text-muted-foreground">Téléphone: +33 1 23 45 67 89</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Facebook size={24} />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Twitter size={24} />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Instagram size={24} />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Linkedin size={24} />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} ColisApp Gestion. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    )
}
