// src/components/LoginPromptModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import React from "react"; // Icône de connexion

interface LoginPromptModalProps {
    show: boolean;
    handleClose: () => void;
    handleLoginRedirect: () => void;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ show, handleClose, handleLoginRedirect }) => {
    return (
        <Dialog open={show} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md p-6">
                <DialogHeader className="text-center">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <LogIn className="h-8 w-8 text-primary" />
                        </div>
                        <DialogTitle className="text-2xl font-semibold">
                            Connexion requise
                        </DialogTitle>
                    </div>
                </DialogHeader>
                <div className="py-4 text-center text-muted-foreground">
                    <p>Veuillez vous connecter pour valider la simulation.</p>
                </div>
                <DialogFooter className="flex justify-center gap-4">
                    <Button variant="outline" onClick={handleClose}>
                        Annuler
                    </Button>
                    <Button onClick={handleLoginRedirect}>
                        Se connecter
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LoginPromptModal;
