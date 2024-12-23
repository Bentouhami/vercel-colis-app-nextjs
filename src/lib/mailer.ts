// path: src/utils/email.utils.ts


/**
 * Envoie un email de vérification générique pour tous les utilisateurs
 * @param name
 * @param email - L'adresse email de l'utilisateur
 * @param token - Le token de vérification
 */
// src/lib/mailer.ts

import axios from 'axios';
import {DOMAIN} from "@/utils/constants";

export async function sendVerificationEmail(name: string, email: string, token: string) {
    console.log("log ====> sendVerificationEmail function called in src/lib/mailer.ts");

    try {
        console.log("log ====> sending request in process in function sendVerificationEmail in src/lib/mailer.ts", {name, email, token});

        await axios.post(`${DOMAIN}/api/send-email`, {name, email, token});
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}
