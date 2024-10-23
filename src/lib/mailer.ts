// path: src/utils/email.utils.ts

import nodemailer from "nodemailer";

// Transporteur Nodemailer configuré
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});


/**
 * Envoie un email de vérification générique pour tous les utilisateurs
 * @param name
 * @param email - L'adresse email de l'utilisateur
 * @param token - Le token de vérification
 */
export async function sendVerificationEmail(name: string, email: string, token: string) {
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/client/verify-email?token=${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Verify your email address",
        html: `<><strong>${name}</strong> Welcome to ColisApp, Ans thank you for registering. Please click <a href="${verificationUrl}">here</a> to verify your email address, this link is actif for 15 minutes. </>`,
    });
}
