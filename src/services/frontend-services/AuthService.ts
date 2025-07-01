// src/services/users/AuthService.ts

import apiClient from "@/utils/axiosInstance"

/**
 * Authentifie l'utilisateur via email et mot de passe
 */
// export async function login(email: string, password: string) {
//     try {
//         const response = await fetch("/api/v1/users/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email, password }),
//         })
//
//         const message = await response.json()
//
//         if (!response.ok) {
//             throw new Error(message.error || "Erreur lors de la connexion.")
//         }
//
//         return message
//     } catch (error) {
//         console.error("Erreur login:", error)
//         throw error
//     }
// }

/**
 * Envoie un lien de réinitialisation de mot de passe si l’email est valide
 */
export async function sendResetEmail(email: string) {
    if (!email) {
        return { message: "L'email est requis" }
    }

    try {
        const res = await apiClient.post(`/forgot-password`, { email })

        if (res.status !== 200) {
            throw new Error(res.statusText)
        }

        return { message: "Si l’adresse existe, un lien de réinitialisation a été envoyé." }
    } catch (error) {
        console.error("Erreur sendResetEmail:", error)
        throw new Error("Impossible d'envoyer l'email de réinitialisation")
    }
}

/**
 * Réinitialise le mot de passe avec un token valide
 */
export async function resetPassword(token: string, password: string) {
    if (!token || !password) {
        throw new Error("Token et mot de passe requis")
    }

    try {
        const response = await apiClient.post(`/reset-password`, {
            token,
            password,
        })

        if (response.status !== 200) {
            throw new Error(response.data.message || "Erreur lors de la réinitialisation")
        }

        return response.data
    } catch (error: any) {
        console.error("Erreur resetPassword:", error)
        throw new Error(error.message || "Erreur réseau")
    }
}


export async function checkResetToken(token: string): Promise<boolean> {
    try {
        const response = await apiClient.get(`/check-reset-token?token=${token}`)
        return response.data.valid
    } catch (error) {
        console.error("Erreur checkResetToken:", error)
        return false
    }
}
