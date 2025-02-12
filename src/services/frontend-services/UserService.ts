// path: src/services/frontend-services/Bk_UserService.ts

import {JWTPayload} from "@/utils/types";
import {setCookie} from "@/utils/generateToken";
import {DOMAIN} from "@/utils/constants";
import {CreateDestinataireDto, ProfileDto, RegisterClientDto, Roles} from "@/services/dtos";
import axios from "axios";

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

export async function getUserProfileById(id: number): Promise<ProfileDto | null> {
    console.log("log ====> getUserProfileById called in src/services/frontend-services/Bk_UserService.ts")

    try {
        const response = await fetch(`${DOMAIN}/api/v1/users/${id}/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        return data.profile; // Return the user profile
    } catch (error) {
        console.error('Error fetching user profile:', error);
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
        // 1) POST the data
        const response = await axios.post(`${DOMAIN}/api/v1/users/register`, newUser, {
            headers: { "Content-Type": "application/json" },
            // withCredentials: true, // If you need cookies
        })

        // 2) The server should respond with {error?: string, message?: string}
        return response.data // We'll handle .error or .message in the component
    } catch (error: any) {
        // If the server returned a non-2xx status, axios throws
        console.error("Error registering user:", error)

        // If the backend sent a JSON error, we can pass that up
        if (error.response?.data?.error) {
            // Re-throw with the server's error message
            throw new Error(error.response.data.error)
        }
        // Otherwise, throw the generic error
        throw error
    }
}


export async function addDestinataire(newUser: CreateDestinataireDto): Promise<number | null> {
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
          return null;
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

