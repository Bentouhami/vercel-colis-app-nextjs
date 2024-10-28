// path: src/services/users/UserService.ts

'use server';
import {JWTPayload} from "@/utils/types";
import {setCookie} from "@/utils/generateToken";
import {RegisterUserBackendType} from "@/utils/validationSchema";
import {DOMAIN} from "@/utils/constants";

/**
 * Generate JWTPayload object and setCookies with JWT token and cookie
 * @param userId
 * @param role
 * @param userEmail
 * @param firstName
 * @param lastName
 * @param phoneNumber
 * @param image
 * @returns {string} cookie
 */
export async function generateJWTPayloadAndSetCookie(
    userId: number,
    role: string,
    userEmail: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    image: string) {

    const jwtPayload: JWTPayload = {
        id: userId,
        role: role,
        userEmail: userEmail,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        image: image
    };

    // return cookie
    return setCookie(jwtPayload);
}


// register new user via API
export async function registerUser(newUser: RegisterUserBackendType) {
    try {
        const response = await fetch(`${DOMAIN}/api/v1/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        // Lire la réponse et la retourner directement
        const data = await response.json();

        if (!response.ok) {
            // Si la réponse n'est pas ok (2xx), lever une erreur avec le message retourné par l'API
            throw new Error(data.error || 'Une erreur est survenue lors de l\'enregistrement.');
        }

        // Retourner les données en cas de succès
        return data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error; // Relancer l'erreur pour la capturer dans RegisterForm
    }
}



