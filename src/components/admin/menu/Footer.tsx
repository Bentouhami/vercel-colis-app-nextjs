import Link from "next/link"
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    BarChart3,
    Users,
    Package,
    Heart,
} from "lucide-react"
import { adminPath } from "@/utils/constants"

export function Footer() {
    return (
        <footer className="bg-gradient-to-r from-background to-secondary/10 border-t mt-auto">
            <div className="container mx-auto py-12 px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* À propos */}
                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700">
                        <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>À propos
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            ColisApp est votre solution professionnelle pour la gestion complète et efficace de votre agence de
                            transport et logistique.
                        </p>
                        <div className="pt-2">
                            <span className="inline-flex items-center gap-2 text-xs text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
                                <Heart className="w-3 h-3" />
                                Fait en Belgique
                            </span>
                        </div>
                    </div>

                    {/* Liens rapides */}
                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-100">
                        <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            Navigation
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href={adminPath()}
                                    className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 flex items-center gap-3 group"
                                >
                                    <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>Tableau de bord</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={adminPath("users")}
                                    className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 flex items-center gap-3 group"
                                >
                                    <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>Utilisateurs</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={adminPath("envois")}
                                    className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 flex items-center gap-3 group"
                                >
                                    <Package className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>Envois</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={adminPath("stats")}
                                    className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 flex items-center gap-3 group"
                                >
                                    <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>Statistiques</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                        <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            Contact
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-muted-foreground group">
                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <Mail className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-xs">help@colisapp.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground group">
                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <Phone className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Téléphone</p>
                                    <p className="text-xs">+32 65 12 34 56</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground group">
                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <MapPin className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Adresse</p>
                                    <p className="text-xs">Mons, Belgique</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Réseaux sociaux */}
                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                        <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            Réseaux sociaux
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="#"
                                className="p-3 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg group"
                            >
                                <Facebook className="w-5 h-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link
                                href="#"
                                className="p-3 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg group"
                            >
                                <Twitter className="w-5 h-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link
                                href="#"
                                className="p-3 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg group"
                            >
                                <Instagram className="w-5 h-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link
                                href="#"
                                className="p-3 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg group"
                            >
                                <Linkedin className="w-5 h-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                        <div className="pt-2">
                            <p className="text-xs text-muted-foreground">
                                Suivez-nous pour les dernières actualités et mises à jour.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Séparateur avec gradient */}
                <div className="mt-12 mb-8">
                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                </div>

                {/* Copyright */}
                <div className="text-center animate-in slide-in-from-bottom-4 duration-700 delay-400">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} ColisApp Administration. Tous droits réservés.
                        </p>
                        <div className="flex items-center gap-6 text-xs text-muted-foreground">
                            <Link href="#" className="hover:text-primary transition-colors">
                                Politique de confidentialité
                            </Link>
                            <Link href="#" className="hover:text-primary transition-colors">
                                Conditions d&apos;utilisation
                            </Link>
                            <Link href="#" className="hover:text-primary transition-colors">
                                Support technique
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
