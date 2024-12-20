// path: src/components/navigations/header/HeaderNavbar.tsx
"use client";

import React, {useState} from 'react';
import {Button, Container, Nav, Navbar} from 'react-bootstrap';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import styles from './Header.module.css';
import LogoutButton from '../../buttons/LogoutButton';
import ColisBrand from "@/components/navigations/brand/ColisBrand";
import Image from "next/image";

interface NavbarProps {
    isLoggedIn: boolean;
    isAgencyAdmin: boolean;
    isSuperAdmin: boolean;
    firstName: string;
    lastName: string;
    name: string;
    email: string | null;
    image: string;

}

const HeaderNavbar: React.FC<NavbarProps> = ({
                                                 isAgencyAdmin,
                                                 isSuperAdmin,
                                                 isLoggedIn,
                                                 name,
                                                 firstName,
                                                 lastName,
                                                 email,
                                                 image
                                             }) => {
    const [expanded, setExpanded] = useState(false);
    const pathname = usePathname();


    const handleSelect = () => {
        setExpanded(false);
    };

    return (
        <Navbar className="sticky-top" expand="lg" bg="light" data-bs-theme="light" expanded={expanded}>
            <Container>
                <Link href={"/client"} passHref>
                    <Navbar.Brand onClick={handleSelect}><ColisBrand/></Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)}/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className={`mx-auto justify-content-center flex-lg-row flex-column ${styles.navLinks}`}
                         onClick={handleSelect}>
                        <Link href="/client/home" className={`me-lg-2 my-1 my-lg-0 ${styles.navLink}`}
                              onClick={handleSelect}>Accueil</Link>
                        <Link href="/client/simulation" className={`me-lg-2 my-1 my-lg-0 ${styles.navLink}`}
                              onClick={handleSelect}>Simulation</Link>
                        <Link href="/client/services" className={`me-lg-2 my-1 my-lg-0 ${styles.navLink}`}
                              onClick={handleSelect}>Services</Link>
                        <Link href="/client/tarifs" className={`me-lg-2 my-1 my-lg-0 ${styles.navLink}`}
                              onClick={handleSelect}>Tarifs</Link>
                        <Link href="/client/contact-us" className={`me-lg-2 my-1 my-lg-0 ${styles.navLink}`}
                              onClick={handleSelect}>Contact-nous</Link>
                    </Nav>
                    <div className="d-flex flex-column flex-lg-row justify-content-end align-items-center">
                        {isLoggedIn ? (
                            <div className="d-flex flex-column justify-content-center align-items-center mt-3">
                                <Image src={image} priority={true} alt={"avatar"}
                                       width={50} height={50}/>
                                <strong>
                                    {`Bienvenue: ${name}`}
                                    {isSuperAdmin && ' (SUPER_ADMIN)'}
                                    {!isSuperAdmin && isAgencyAdmin && ' (AGENCY_ADMIN)'}
                                    {!isSuperAdmin && !isAgencyAdmin && ' (utilisateur)'}
                                </strong>

                                <strong>{email}</strong>

                                {(isSuperAdmin) && pathname !== '/admin/super-admin' && (
                                    <Link href="/admin/super-admin" passHref legacyBehavior>
                                        <Button variant="primary" onClick={handleSelect}
                                                className="mt-3 mb-3 bg-pink-500 border-0">Dashboard</Button>
                                    </Link>
                                )}
                                {(isAgencyAdmin) && pathname !== '/admin/agency-admin' && (
                                    <Link href="/admin/agency-admin" passHref legacyBehavior>
                                        <Button variant="primary" onClick={handleSelect}
                                                className="mt-3 mb-3 bg-pink-500 border-0">Dashboard</Button>
                                    </Link>
                                )}

                                <LogoutButton />
                            </div>
                        ) : (
                            <>
                                <Link href="/client/auth/login" passHref legacyBehavior>
                                    <Button variant="outline-primary" onClick={handleSelect}
                                            className="btn-custom me-lg-2 mb-2 mb-lg-0">
                                        SE CONNECTER
                                    </Button>
                                </Link>
                                <Link href="/client/auth/register" passHref legacyBehavior>
                                    <Button variant="outline-primary" onClick={handleSelect} className="btn-custom">
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