// path: src/components/navigations/footer/Footer.tsx
'use client';

import { Facebook, Instagram, Mail, Package, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";
import { clientPath } from "@/utils/constants";

const Footer = () => {
    return (
        <footer className="bg-gray-800 dark:bg-black text-white py-12 mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo + Description */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Package className="h-6 w-6 text-indigo-400" />
                            <span className="text-xl font-bold">ColisApp</span>
                        </div>
                        <div className="text-gray-400 text-sm leading-relaxed dark:text-gray-300">
                            La solution complète pour la gestion et le suivi de vos colis entre le Maroc et la Belgique.
                        </div>
                    </div>

                    {/* Liens rapides */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href={clientPath()} className="text-gray-300 hover:text-white transition">
                                    Accueil
                                </Link>
                            </li>
                            <li>
                                <Link href={clientPath("features")} className="text-gray-300 hover:text-white transition">
                                    Fonctionnalités
                                </Link>
                            </li>
                            <Link href={clientPath("about")} className="text-gray-300 hover:text-white transition">
                                À propos
                            </Link>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href={clientPath("help")} className="text-gray-300 hover:text-white transition">
                                    Aide
                                </Link>
                            </li>
                            <li>
                                <Link href={clientPath("faq")} className="text-gray-300 hover:text-white transition">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href={clientPath("contact-us")} className="text-gray-300 hover:text-white transition">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Légal */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Légal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href={clientPath("terms")} className="text-gray-300 hover:text-white transition">
                                    Conditions d&#39;utilisation
                                </Link>
                            </li>
                            <li>
                                <Link href={clientPath("privacy-policy")} className="text-gray-300 hover:text-white transition">
                                    Politique de confidentialité
                                </Link>
                            </li>
                            <li>
                                <Link href={clientPath("legal")} className="text-gray-300 hover:text-white transition">
                                    Mentions légales
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bas de page */}
                <div className="mt-10 border-t border-gray-700 dark:border-gray-600 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 dark:text-gray-400">
                    <span>&copy; {new Date().getFullYear()} ColisApp. Tous droits réservés.</span>
                    <div className="mt-4 md:mt-0 flex space-x-4">
                        <Link
                            href={`mailto:${process.env.NEXT_PUBLIC_MY_CONTACT_EMAIL || "contact@colisapp.com"}`}
                            aria-label="email"
                        >
                            <Mail className="w-5 h-5 hover:text-white" />
                        </Link>
                        <Link href="https://facebook.com/colisapp" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <Facebook className="w-5 h-5 hover:text-white" />
                        </Link>
                        <Link href="https://twitter.com/colisapp" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <Twitter className="w-5 h-5 hover:text-white" />
                        </Link>
                        <Link href="https://instagram.com/colisapp" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <Instagram className="w-5 h-5 hover:text-white" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
