// path: /src/components/SimulationConfirmationModal.tsx
"use client";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

interface SimulationConfirmationModalProps {
    show: boolean;
    handleClose: () => void;
    handleConfirm: () => void;
    handleCreateNew: () => void;
}


const SimulationConfirmationModal = ({
                                         show,
                                         handleClose,
                                         handleConfirm,
                                         handleCreateNew,
                                     }: SimulationConfirmationModalProps) => {
    if (!show) return null;

    return (
        <Dialog open={show} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Simulation Existante</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <p>Une simulation existante a été trouvée. Voulez-vous la conserver ou créer une nouvelle simulation
                        ?</p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCreateNew}>
                        Nouvelle Simulation
                    </Button>
                    <Button onClick={handleConfirm}>Garder la Simulation</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SimulationConfirmationModal;
