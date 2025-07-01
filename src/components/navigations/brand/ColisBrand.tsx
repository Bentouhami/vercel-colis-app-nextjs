// path: src/components/navigations/brand/ColisBrand.tsx
"use client";
import styles from "./brand.module.css";
import { RiSendToBack } from "react-icons/ri";

const ColisBrand = () => {
    return (
        <div className={`${styles.logoBrand} flex items-center`}>
            <span>Colis</span>
            <RiSendToBack className={styles.logo} />
            <span>App</span>
        </div>
    );
};

export default ColisBrand;
