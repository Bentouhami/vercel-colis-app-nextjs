"use client"

import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogIn, Shield, Clock, CreditCard } from "lucide-react"
import type React from "react"

interface LoginPromptModalProps {
    show: boolean
    handleClose: () => void
    handleLoginRedirect: () => void
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ show, handleClose, handleLoginRedirect }) => {
    return (
        <Dialog open={show} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                    <DialogHeader className="text-center">
                        <div className="flex flex-col items-center space-y-3">
                            <div className="bg-white/20 p-3 rounded-full">
                                <LogIn className="h-8 w-8 text-white" />
                            </div>
                            <DialogTitle className="text-2xl font-semibold text-white">Connexion requise</DialogTitle>
                            <p className="text-indigo-100">Connectez-vous pour valider votre simulation</p>
                        </div>
                    </DialogHeader>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="text-center text-muted-foreground mb-6">
                        <p>Pour continuer et finaliser votre simulation, veuillez vous connecter à votre compte.</p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <Shield className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="font-medium text-green-800 dark:text-green-200">Sécurisé</p>
                                <p className="text-sm text-green-600 dark:text-green-300">Vos données sont protégées</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Clock className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="font-medium text-blue-800 dark:text-blue-200">Suivi en temps réel</p>
                                <p className="text-sm text-blue-600 dark:text-blue-300">Suivez vos envois facilement</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <CreditCard className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="font-medium text-purple-800 dark:text-purple-200">Paiement sécurisé</p>
                                <p className="text-sm text-purple-600 dark:text-purple-300">Plusieurs moyens de paiement</p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex justify-center gap-4 p-6 pt-0">
                    <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                        Annuler
                    </Button>
                    <Button onClick={handleLoginRedirect} className="flex-1">
                        <LogIn className="h-4 w-4 mr-2" />
                        Se connecter
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default LoginPromptModal
