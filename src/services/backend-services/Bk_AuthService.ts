// path: src/services/backend-services/Bk_AuthService.ts
import { randomUUID } from "crypto"
import { addHours } from "date-fns"
import nodemailer from "nodemailer"
import { DOMAIN } from "@/utils/constants"
import bcrypt from "bcryptjs";
import prisma from '@/lib/prisma'


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
})

/**
 * Envoie un lien de réinitialisation de mot de passe à un utilisateur existant
 */
export async function sendResetPasswordEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        // 🔒 Ne rien faire si l'email n'existe pas (anti-user enumeration)
        return
    }

    // Génération du token
    const token = randomUUID()
    const expiresAt = addHours(new Date(), 2)

    // Sauvegarde en DB
    await prisma.passwordResetToken.create({
        data: {
            token,
            userId: user.id,
            expiresAt,
        },
    })

    // Génération du lien
    const resetUrl = `${DOMAIN}/client/auth/reset-password?token=${token}`

    // Envoi de l'email
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Réinitialisation de votre mot de passe - ColisApp",
        html: generateResetPasswordEmailHtml(user.firstName || "utilisateur", resetUrl),
    })
}

/**
 * Met à jour le mot de passe d’un utilisateur si le token est valide
 */
export async function resetPassword(token: string, newPassword: string) {
    // Cherche le token avec l'utilisateur associé
    const record = await prisma.passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
    })

    if (!record) {
        throw new Error("Lien de réinitialisation invalide.")
    }

    if (record.expiresAt < new Date()) {
        throw new Error("Le lien de réinitialisation a expiré.")
    }

    // Hash du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Mise à jour du mot de passe de l'utilisateur
    await prisma.user.update({
        where: { id: record.userId },
        data: { password: hashedPassword },
    })

    // Suppression du token utilisé
    await prisma.passwordResetToken.delete({
        where: { id: record.id },
    })
}

/**
 * Génère le contenu HTML du mail de réinitialisation
 */
function generateResetPasswordEmailHtml(name: string, resetUrl: string): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Réinitialisation de mot de passe</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff;">
    <h2 style="color: #1a73e8;">ColisApp</h2>
    <p>Bonjour ${name},</p>
    <p>Nous avons reçu une demande de réinitialisation de votre mot de passe.</p>
    <p>Si vous êtes à l’origine de cette demande, cliquez sur le bouton ci-dessous :</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="background-color: #1a73e8; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Réinitialiser le mot de passe</a>
    </div>
    <p>Ce lien est valable pendant 2 heures.</p>
    <p>Si vous n’avez pas demandé de réinitialisation, vous pouvez ignorer cet email.</p>
    <hr />
    <p style="font-size: 12px; color: #888;">ColisApp - Ne pas répondre à cet email.</p>
  </div>
</body>
</html>
    `
}


export async function checkResetToken(token: string): Promise<boolean> {
    if (!token) return false

    const record = await prisma.passwordResetToken.findUnique({
        where: { token }
    })

    // if (!record || record.expiresAt < new Date()) {
    //     return false
    // }

    // simplified
    return !(!record || record.expiresAt < new Date());


}

