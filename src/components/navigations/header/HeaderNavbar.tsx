// path : /src/components/navigations/header/HeaderNavbar.tsx


"use client";
import React, {useState} from 'react';
import {Button, Container, Nav, Navbar} from 'react-bootstrap';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import styles from './Header.module.css';
import LogoutButton from './LogoutButton';
import ColisBrand from "@/components/navigations/brand/ColisBrand";

interface NavbarProps {
    isLoggedIn: boolean;
    userEmail: string | null;
    isAdmin: boolean;
    firstName: string;
    lastName: string;
}

const HeaderNavbar: React.FC<NavbarProps> = ({ isAdmin, isLoggedIn, userEmail, firstName, lastName }) => {
    const [expanded, setExpanded] = useState(false);
    const pathname = usePathname();

    const handleSelect = () => {
        setExpanded(false);
    };

    return (
        <Navbar className="sticky-top" expand="lg" bg="light" data-bs-theme="light" expanded={expanded}>
            <Container>
                <Link href={"/"} passHref>
                    <Navbar.Brand><ColisBrand /></Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)}/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className={`mx-auto justify-content-center flex-lg-row flex-column ${styles.navLinks}`}
                         onSelect={handleSelect}>
                        <Link href="/home" className={`me-lg-2 my-1 my-lg-0 ${styles.navLink}`}
                              onClick={handleSelect}>Accueil</Link>
                        <Link href="/simulation" className={`me-lg-2 my-1 my-lg-0 ${styles.navLink}`}
                              onClick={handleSelect}>Simulation</Link>
                        <Link href="/services" className={`me-lg-2 my-1 my-lg-0 ${styles.navLink}`}
                              onClick={handleSelect}>Services</Link>
                        <Link href="/tarifs" className={`me-lg-2 my-1 my-lg-0 ${styles.navLink}`}
                              onClick={handleSelect}>Tarifs</Link>
                        <Link href="/about" className={`me-lg-2 my-1 my-lg-0 ${styles.navLink}`}
                              onClick={handleSelect}>About</Link>
                    </Nav>
                    <div className="d-flex flex-column flex-lg-row justify-content-end align-items-center">
                        {isLoggedIn ? (
                            <div className="d-flex flex-column justify-content-center align-items-center mt-3">
                                <strong>
                                    {`Bienvenue: ${firstName} ${lastName}`}
                                    {isAdmin ? ' (admin)' : ' (utilisateur)'}
                                </strong>
                                <strong>{userEmail}</strong>

                                {isAdmin && pathname !== '/admin' && (
                                    <Link href="/admin" passHref legacyBehavior>
                                        <Button variant="primary" className="mt-3 mb-3 bg-pink-500 border-0">Dashboard</Button>
                                    </Link>
                                )}

                                <LogoutButton />
                            </div>
                        ) : (
                            <>
                                <Link href="/login" passHref legacyBehavior>
                                    <Button variant="outline-primary" className="btn-custom me-lg-2 mb-2 mb-lg-0">
                                        SE CONNECTER
                                    </Button>
                                </Link>
                                <Link href="/register" passHref legacyBehavior>
                                    <Button variant="outline-primary" className="btn-custom">
                                        S&apos;INSCRIRE
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default HeaderNavbar;
