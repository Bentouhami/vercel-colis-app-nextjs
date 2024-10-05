// API.ts : API pour les fonctions de simulation
// path : src/app/utils/api.ts

// Récupérer les pays de départ disponibles pour la simulation
import {CreateUserDto, SimulationEnvoisDto} from "@/utils/dtos";

export async function fetchCountries() {

    const response = await fetch('/api/v1/simulation');
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch countries');
    }
}

// Récupérer les pays de destination disponibles pour la simulation
export async function fetchDestinationCountries(departureCountry: string) {
    const response = await fetch('/api/v1/simulation',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({departureCountry})
        });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch countries');
    }
}


// Récupérer les villes disponibles pour un pays donné
export async function fetchCities(country: string) {
    const response = await fetch(`/api/v1/simulation/${encodeURIComponent(country)}/cities`);
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch cities');
    }
}

// Récupérer les agences disponibles pour une ville donnée
export async function fetchAgencies(country:string, city:string) {
    const response = await fetch(`/api/v1/simulation/${encodeURIComponent(country)}/cities/${encodeURIComponent(city)}/agencies`);
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch agencies');
    }
}

// Envoyer les données de la simulation au serveur via l'API
export async function submitSimulation(simulationData: SimulationEnvoisDto) {
    try {
        // Envoyer les données de la simulation au serveur via l'API
        const response = await fetch('/api/v1/simulation/results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(simulationData),
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to submit simulation');
        }
    } catch (error) {
        console.error('Error submitting simulation:', error);
        throw error; // Re-throw the error so it can be caught by the calling function
    }
}


/** Login user via API
 * @param email - email of the user
 * @param password - password of the user
 * @returns - the user object
 */
// Login user via API
export async function login(email: string, password: string) {
   try {
       // envoyer l'email et le mot de passe au serveur via l'API /api/v1/users/login : route pour la connexion d'un utilisateur
       const response = await fetch('/api/v1/users/login', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify({email, password}),
       });

       // Lire la réponse et la retourner directement
       const data = await response.json();

       if (!response.ok) {
           // Si la réponse n'est pas ok (2xx), lever une erreur avec le message retourné par l'API
           throw new Error(data.error || 'Une erreur est survenue lors de l\'enregistrement.');
       }

       return data;
   } catch (error) {
       console.error('Error logging in:', error);
       throw error; // Re-throw the error so it can be caught by the calling function
   }
}

// register new user via API
export async function registerUser(newUser: CreateUserDto) {
    try {
        const response = await fetch('/api/v1/users/register', {
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

// Récupérer les informations de l'utilisateur connecté
export async function getUserProfile() {
    try {
        const response = await fetch('/api/v1/users/profile/{id}');
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to fetch user profile');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error; // Re-throw the error so it can be caught by the calling function
    }
}



