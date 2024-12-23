// path: /src/components/SimulationConfirmationModal.tsx
'use client';
import React from "react";
import { Button, Modal } from "react-bootstrap";

interface SimulationConfirmationModalProps {
    show: boolean;
    handleClose: () => void;
    handleConfirm: () => void; // Keep existing simulation
    handleCreateNew: () => void; // Create a new simulation
}

const SimulationConfirmationModal: React.FC<SimulationConfirmationModalProps> = ({
                                                                                     show,
                                                                                     handleClose,
                                                                                     handleConfirm,
                                                                                     handleCreateNew,
                                                                                 }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Simulation Existante</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Une simulation existante a été trouvée. Voulez-vous la conserver ou créer une nouvelle simulation ?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleConfirm}>
                    Garder la Simulation
                </Button>
                <Button variant="danger" onClick={handleCreateNew}>
                    Nouvelle Simulation
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SimulationConfirmationModal;
