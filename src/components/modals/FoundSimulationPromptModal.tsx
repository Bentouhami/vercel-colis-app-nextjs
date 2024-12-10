// path: /src/components/FoundSimulationPromptModal.tsx
import React from 'react';
import {Button, Modal} from 'react-bootstrap';

interface FoundSimulationPromptModalProps {
    show: boolean;
    handleClose: () => void;
    handleSimulationRedirect: () => void;
}

const FoundSimulationPromptModal: React.FC<FoundSimulationPromptModalProps> = ({show, handleClose, handleSimulationRedirect}) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Simulation trouvée</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Une simulation existe déjà. Voulez-vous la modifier ?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="primary" onClick={handleSimulationRedirect}>
                    Modifier
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FoundSimulationPromptModal;