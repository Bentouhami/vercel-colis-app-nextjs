// path: src/services/frontend-services/UserService.ts

import {JWTPayload} from "@/utils/types";
import {setCookie} from "@/utils/generateToken";
import {API_DOMAIN, DOMAIN} from "@/utils/constants";
import {CreateDestinataireDto, ProfileDto, RoleDto, UserDto} from "@/services/dtos";
import axios from "axios";
import {RegisterUserBackendType} from "@/utils/validationSchema";

/**
 * Generate JWTPayload object and setCookies with JWT token and cookie
 * @param userId
 * @param role
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
    role: RoleDto,
    image: string | null
): Promise<string> {

    const jwtPayload: JWTPayload = {
        id: userId,
        userEmail: userEmail,
        firstName: firstName,
        lastName: lastName,
        name: name,
        phoneNumber: phoneNumber,
        image: image,
        role: role,
    };

    // return cookie
    return setCookie(jwtPayload);
}

export async function getConnectedUser() {
    try {
        const response = await fetch(`${API_DOMAIN}/auth/status`, {
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

    try {
        const response = await fetch(`${API_DOMAIN}/users/${id}/profile`, {
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

        return userData.data as CreateDestinataireDto;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}

// register new user via API
export async function registerUser(newUser: RegisterUserBackendType) {
    try {
        // 1) POST the data
        const response = await axios.post(`${API_DOMAIN}/users/register`, newUser, {
            headers: {"Content-Type": "application/json"},
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

    try {
        const response = await axios.post(`${API_DOMAIN}/users/destinataires`, {
            newUser,
            headers: {
                'Content-Type': 'application/json',
                'cache': 'no-cache',
            },
        });
        // Si la réponse est OK, log et parse le JSON
        const data = await response.data;

        return data.data.id as number;
    } catch (error) {

        console.error('Error in addDestinataire function:', error);
        throw error;
    }
}

/**
 * get users list based on the userRole
 */
export async function getUsers(): Promise<ProfileDto[] | null> {
    try {

        const response = await axios.get(`${API_DOMAIN}/users/list`, {
            headers: {
                // assure que le cache ne garde pas les réponses
                'Cache-Control': 'no-store'
            },
            withCredentials: true,
        });


        if (!response.data)
            return null;

        return response.data;
    } catch (e) {
        return null;
    }
}

export async function updateUserProfile(data: Partial<ProfileDto>) {
    try {
        const response = await fetch(`${API_DOMAIN}/users/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Échec de la mise à jour du profil.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur dans updateUserProfile:', error);
        throw error;
    }
}



