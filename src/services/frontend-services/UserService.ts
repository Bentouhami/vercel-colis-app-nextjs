// path: src/services/users/UserService.ts

import {JWTPayload} from "@/utils/types";
import {setCookie} from "@/utils/generateToken";
import { RegisterUserBackendType} from "@/utils/validationSchema";
import {DOMAIN} from "@/utils/constants";
import {BaseDestinataireDto} from "@/utils/dtos";

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

export async function getUserById(id: number): Promise<BaseDestinataireDto> {
    console.log("log ====> getUserById called in src/services/frontend-services/UserService.ts")

    try {
        const response = await fetch(`${DOMAIN}/api/v1/users/${id}`, { // L'ID est maintenant dans l'URL
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }

        const userData = await response.json();

        if (!userData || !userData.data) {
            throw new Error("User not found");
        }

        console.log("userData in getUserById function:", userData.data);
        return userData.data as BaseDestinataireDto;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
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


export async function addDestinataire(newUser: BaseDestinataireDto) : Promise<number>{
    console.log("log ====> addDestinataire function called");

    try {
        const response = await fetch(`${DOMAIN}/api/v1/users/destinataires`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(newUser),
        });

        console.log("log ====> response status: ", response.status);  // Log status
        console.log("log ====> response headers: ", response.headers);  // Log headers

        if (!response.ok) {
            // Gestion des erreurs en cas de réponse non OK
            console.log("log ====> response in addDestinataire function failed, status:", response.status);
            const errorData = await response.json();
            throw new Error(errorData.error || 'Une erreur est survenue lors de l\'enregistrement.');
        }

        // Si la réponse est OK, log et parse le JSON
        const data = await response.json();
        console.log("log ====> data in addDestinataire function: ", data);

        return data.data;
    } catch (error) {
        console.error('Error in addDestinataire function:', error);
        throw error;
    }
}


