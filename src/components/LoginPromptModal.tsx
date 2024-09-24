// path: /src/components/LoginPromptModal.tsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface LoginPromptModalProps {
    show: boolean;
    handleClose: () => void;
    handleLoginRedirect: () => void;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ show, handleClose, handleLoginRedirect }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Connexion requise</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Veuillez vous connecter pour valider la simulation.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="primary" onClick={handleLoginRedirect}>
                    Se connecter
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LoginPromptModal;
