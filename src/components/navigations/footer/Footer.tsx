// path: src/components/Footer.tsx
'use client';
import {Col, Container, Row} from "react-bootstrap";
import {Facebook, Instagram, Mail, Twitter} from "lucide-react";

const Footer = () => {
    return (
        <footer className=" bg-gray-900 text-gray-400 py-4 mt-10">
            <Container>
                <Row className="align-items-center">
                    {/* Logo and Copyright */}
                    <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
                        <a href="https://www.colisapp.com" className="text-gray-400 text-decoration-none">
                            <h5 className="text-white font-semibold">ColisApp</h5>
                        </a>
                        <p className="small">
                            © 2024 ColisApp. Tous droits réservés.
                        </p>
                    </Col>

                    {/* Navigation Links */}
                    <Col md={4} className="text-center mb-3 mb-md-0">
                        <Row>
                            <Col className="mb-2">
                                <a href="/about" className="text-gray-400 hover:text-white text-decoration-none small">À
                                    propos</a>
                            </Col>
                            <Col className="mb-2">
                                <a href="/contact"
                                   className="text-gray-400 hover:text-white text-decoration-none small">Contact</a>
                            </Col>
                            <Col className="mb-2">
                                <a href="/privacy-policy"
                                   className="text-gray-400 hover:text-white text-decoration-none small">Politique de
                                    confidentialité</a>
                            </Col>
                            <Col className="mb-2">
                                <a href="/terms" className="text-gray-400 hover:text-white text-decoration-none small">Conditions
                                    d&#39;utilisation</a>
                            </Col>
                        </Row>
                    </Col>

                    {/* Social Media Links */}
                    <Col md={4} className="flex  text-center text-md-end">
                        <a href={`mailto:${process.env.NEXT_PUBLIC_MY_CONTACT_EMAIL}`} className="text-gray-400 me-3">
                            <Mail className="h-5 w-5"/>
                        </a>
                        <a href="https://facebook.com/colisapp" className="text-gray-400 me-3" target="_blank"
                           rel="noopener noreferrer">
                            <Facebook className="h-5 w-5"/>
                        </a>
                        <a href="https://twitter.com/colisapp" className="text-gray-400 me-3" target="_blank"
                           rel="noopener noreferrer">
                            <Twitter className="h-5 w-5"/>
                        </a>
                        <a href="https://instagram.com/colisapp" className="text-gray-400" target="_blank"
                           rel="noopener noreferrer">
                            <Instagram className="h-5 w-5"/>
                        </a>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
