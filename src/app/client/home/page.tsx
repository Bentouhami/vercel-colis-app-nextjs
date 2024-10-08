// path : src/app/home/page.tsx

// home page component for the home page of the application
import Image from "next/image";
import Pricing from "@/components/pricing/Pricing";
import Styles from "./Home.module.css";
import Link from "next/link";
import {Button} from "react-bootstrap";


const HomePage = async () => {


    return (
        <div className="container">
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-center my-5">
                <Image priority
                       className="p-3 d-flex flex-column flex-sm-row align-items-center justify-content-center order-1 order-md-2"
                       src="/svg/home/welcome.svg" alt="Welcome" width={500} height={500}/>
                <div className="text-center order-2 order-md-1">
                    <h1 className={Styles.description}>
                        Bienvenue sur Colis App, une application de gestion de colis.
                        La solution la plus simple et la plus rapide pour gérer vos colis.
                    </h1>
                    <Link href="/client/simulation" passHref>
                        <Button variant="primary" className="mt-3 mb-5">Faire une simulation</Button>
                    </Link>
                </div>
            </div>
            <div className="my-5">
                <Pricing />
            </div>
        </div>
    )
}

export default HomePage;
