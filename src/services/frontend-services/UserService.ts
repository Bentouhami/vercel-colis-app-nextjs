// path: src/services/frontend-services/Bk_UserService.ts

import {JWTPayload} from "@/utils/types";
import {setCookie} from "@/utils/generateToken";
import {DOMAIN} from "@/utils/constants";
import {CreateDestinataireDto, RegisterClientDto, Roles} from "@/services/dtos";

/**
 * Generate JWTPayload object and setCookies with JWT token and cookie
 * @param userId
 * @param roles
 * @param userEmail
 * @param name
 * @param firstName
 * @param lastName
 * @param phoneNumber
 * @param image
 * @returns {string} cookie
 */
export async function generateJWTPayloadAndSetCookie(
    userId: number,
    userEmail: string,
    firstName: string,
    lastName: string,
    name: string,
    phoneNumber: string,
    roles: Roles[],
    image: string | null
) {

    const jwtPayload: JWTPayload = {
        id: userId,
        userEmail: userEmail,
        firstName: firstName,
        lastName: lastName,
        name: name,
        phoneNumber: phoneNumber,
        image: image,
        roles: roles,
    };

    // return cookie
    return setCookie(jwtPayload);
}

export async function getConnectedUser() {
    try {
        const response = await fetch(`${DOMAIN}/api/v1/auth/status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Ensure cookies are included in the request
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user authentication status');
        }

        const data = await response.json();
        if (data.isAuthenticated) {
            return data.user; // Return the user payload if authenticated
        } else {
            return null; // Return null if not authenticated
        }
    } catch (error) {
        console.error('Error fetching connected user:', error);
        return null;
    }
}

export async function getUserById(id: number): Promise<CreateDestinataireDto> {
    console.log("log ====> getUserById called in src/services/frontend-services/Bk_UserService.ts")

    try {
        const response = await fetch(`${DOMAIN}/api/v1/users/${id}`, {
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
        return userData.data as CreateDestinataireDto;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}

// register new user via API
export async function registerUser(newUser: RegisterClientDto) {
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
        console.log("log ====> data in registerUser function after parsing JSON in path src/services/frontend-services/Bk_UserService.ts: ", data);

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


export async function addDestinataire(newUser: CreateDestinataireDto): Promise<number> {
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
            const errorData = await response.json();
            throw new Error(errorData.error || 'Une erreur est survenue lors de l\'enregistrement.');
        }

        // Si la réponse est OK, log et parse le JSON
        const data = await response.json();
        console.log("log ====> data.data in addDestinataire function after parsing JSON: ", data);

        return data.data.id as number;
    } catch (error) {
        console.error('Error in addDestinataire function:', error);
        throw error;
    }
}

