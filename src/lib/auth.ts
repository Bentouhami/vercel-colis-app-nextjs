// path: src/lib/auth.ts


import bcrypt from "bcryptjs";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";

/**
 * Hash a password with bcrypt
 * @param password
 * @returns {Promise<string>} hashed password
 */
export function saltAndHashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        // Utiliser bcrypt pour générer un salt avec 10 rounds (nombre de tours recommandé)
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return reject(err);

            // Utiliser le salt généré pour hashes le mot de passe
            bcrypt.hash(password, salt, (err, hashedPassword) => {
                if (err) return reject(err);
                resolve(hashedPassword);
            });
        });
    });
}




interface AuthCheckResult {
    isAuthenticated: boolean;
    userId?: string;
    email?: string;
    error?: string;
}
export async function checkAuthStatus(showToast: boolean = true): Promise<AuthCheckResult> {
    try {
        const session = await getSession();

        if (!session) {
            if (showToast) {
                toast.error("Vous devez être connecté pour effectuer cette action");
            }
            return {
                isAuthenticated: false,
                error: "Not authenticated"
            };
        }

        return {
            isAuthenticated: true,
            userId: session.user?.id,
            email: session.user?.email!
        };
    } catch (error) {
        if (showToast) {
            toast.error("Une erreur est survenue lors de la vérification de l'authentification");
        }
        return {
            isAuthenticated: false,
            error: "Authentication check failed"
        };
    }
}

// Optional: Helper for getting just the userId
export async function getCurrentUserId(): Promise<string | null> {
    const { userId } = await checkAuthStatus(false);
    return userId || null;
}





