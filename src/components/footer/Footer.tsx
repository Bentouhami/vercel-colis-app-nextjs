'use client';
import Container from "react-bootstrap/Container";
import {Col, Row} from "react-bootstrap";

const Footer = () => {
    return (
        // add footer
        <footer className="bg-body-tertiary fixed-bottom">
            <Container>
                <Row>
                    <Col>
                        <p className="text-center text-muted">
                            © 2024 Copyright:
                            <a href="https://www.colisapp.com" className="text-muted">
                                Colisapp
                            </a>
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}
export default Footer
