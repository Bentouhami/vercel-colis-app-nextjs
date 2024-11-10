// path: src/services/users/AuthService.ts


/** Login user via API
 * @param email - email of the user
 * @param password - password of the user
 * @returns - the user object
 */
// Login user via API
export async function login(email: string, password: string) {
    try {

        // log email and password
        console.log("email", email);
        console.log("password", password);
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
