// API.ts : API pour les fonctions de simulation

// Récupérer les pays de départ disponibles pour la simulation
import {SimulationEnvoisDto} from "@/app/utils/dtos";

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

        // Vérifier que la réponse HTTP est bien une réponse 200 (succès)
        if (!response.ok) {
            throw new Error('Failed to submit simulation');
        }

        return await response.json();
    } catch (error) {
        console.error('Error submitting simulation:', error);
        throw error; // Re-throw the error so it can be caught by the calling function
    }
}

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

       // Vérifier que la réponse HTTP est bien une réponse 200 (succès)
       if (!response.ok) {
           throw new Error('Failed to login');
       }

       return await response.json();
   } catch (error) {
       console.error('Error logging in:', error);
       throw error; // Re-throw the error so it can be caught by the calling function
   }
}
