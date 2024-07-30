'use client';
import {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ColisBrand from "@/components/brand/ColisBrand";
import {Button} from "react-bootstrap";
import Link from "next/link";
import styles from './Header.module.css'; // Assurez-vous d'importer le fichier CSS

const Header = () => {
    const [expanded, setExpanded] = useState(false);

    const handleSelect = () => {
        setExpanded(false);
    };

    return (
        <Navbar expand="lg" bg="light" data-bs-theme="light" expanded={expanded}>
            <Container>
                <Link href={"/home"} passHref>
                    <Navbar.Brand><ColisBrand/></Navbar.Brand>
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
                    <div className="d-flex flex-column flex-lg-row justify-content-end">
                        <Link href="/login" passHref>
                            <Button variant="outline-primary" className="me-lg-2 mb-2 mb-lg-0"
                                    onClick={handleSelect}>Login</Button>
                        </Link>
                        <Link href="/register" passHref>
                            <Button variant="outline-primary"
                                    onClick={handleSelect}>Sign Up</Button>
                        </Link>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
