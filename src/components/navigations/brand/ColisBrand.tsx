'use client';
import styles from './brand.module.css';
import {RiSendToBack} from "react-icons/ri";

const ColisBrand = () => {
    return (
        <div className={styles.logoBrand}>
            <span>Colis</span>
            <RiSendToBack className={styles.logo}/>
            <span>App</span>
        </div>
    );
}
export default ColisBrand;
