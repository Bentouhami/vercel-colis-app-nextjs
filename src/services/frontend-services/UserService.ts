import type { JWTPayload } from "@/utils/types";
import { setCookie } from "@/utils/generateToken";
import { API_DOMAIN } from "@/utils/constants";
import {
  type CreateDestinataireDto,
  type ProfileDto,
  RoleDto,
} from "@/services/dtos";
import axios, { type AxiosError } from "axios";
import type { RegisterUserBackendType } from "@/utils/validationSchema";

// Interface pour la mise à jour du profil
interface UpdateProfileRequestDto {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: Date | string;
  image?: string;
}

// Interface pour l'inscription
interface RegisterUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

/**
 * Generate JWTPayload object and setCookies with JWT token and cookie
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
  return setCookie(jwtPayload);
}

export async function getConnectedUser() {
  try {
    const response = await fetch(`${API_DOMAIN}/auth/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user authentication status");
    }
    const data = await response.json();
    if (data.isAuthenticated) {
      return data.user;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching connected user:", error);
    return null;
  }
}

export async function getUserProfileById(
  id: number
): Promise<ProfileDto | null> {
  try {
    const response = await axios.get(`${API_DOMAIN}/users/${id}/profile`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch user profile");
    }
    return response.data.profile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

/**
 * Get user by ID - returns CreateDestinataireDto format
 */
export async function getUserById(
  id: number
): Promise<CreateDestinataireDto | null> {
  try {
    if (!id || isNaN(id) || id <= 0) {
      console.error(" Invalid user ID:", id);
      throw new Error("ID utilisateur invalide");
    }

    const response = await axios.get(`${API_DOMAIN}/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 10000,
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`Statut de réponse inattendu: ${response.status}`);
    }

    if (!response.data) {
      throw new Error("Aucune donnée dans la réponse");
    }

    // Adapter la réponse selon la structure de votre API
    const userData = response.data.user || response.data.data || response.data;

    if (!userData) {
      throw new Error("Données utilisateur manquantes dans la réponse");
    }

    // Transformer les données au format CreateDestinataireDto
    const destinataireData: CreateDestinataireDto = {
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      name:
        userData.name ||
        `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
      email: userData.email || "",
      phoneNumber: userData.phoneNumber || "",
      image: userData.image || "",
      role: userData.role || RoleDto.DESTINATAIRE,
    };

    return destinataireData;
  } catch (error: unknown) {
    console.error(" Error in getUserById:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error(" Axios Error Details:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });

      if (axiosError.response?.status === 404) {
        throw new Error("Utilisateur non trouvé");
      } else if (axiosError.response?.status === 401) {
        throw new Error("Non autorisé. Veuillez vous reconnecter.");
      } else if (axiosError.response?.status === 403) {
        throw new Error("Accès interdit");
      } else if (
        axiosError.response?.status &&
        axiosError.response.status >= 500
      ) {
        throw new Error("Erreur serveur. Veuillez réessayer plus tard.");
      }
    }

    if (error instanceof Error) {
      throw new Error(`Erreur: ${error.message}`);
    }

    throw new Error("Une erreur inconnue s'est produite");
  }
}

export async function updateUserProfile(
  userId: number,
  data: UpdateProfileRequestDto
): Promise<ProfileDto | null> {
  try {
    const response = await axios.put(
      `${API_DOMAIN}/users/${userId}/profile`,
      data
    );
    if (response.status !== 200) {
      throw new Error("Échec de la mise à jour du profil.");
    }
    return response.data.profile;
  } catch (error) {
    console.error("Erreur dans updateUserProfile:", error);
    throw error;
  }
}

/**
 * Alternative updateUserProfile function using fetch (from GitHub version)
 */
export async function updateUserProfileMe(data: Partial<ProfileDto>) {
  try {
    const response = await fetch(`${API_DOMAIN}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Échec de la mise à jour du profil.");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur dans updateUserProfile:", error);
    throw error;
  }
}

/**
 * Register new user via API (for clients)
 */
export async function registerUser(newUser: RegisterUserBackendType) {
  try {
    const response = await axios.post(`${API_DOMAIN}/users/register`, newUser, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error registering user:", error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
}

/**
 * Create new user by an Admin
 */
export async function createUserByAdmin(newUser: Omit<RegisterUserBackendType, 'password'>) {
  try {
    const response = await axios.post(`${API_DOMAIN}/admin/users/create`, newUser, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // Needed to authorize the admin
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating user by admin:", error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
}

/**
 * Register user with detailed error handling (enhanced version)
 */
export async function registerUserEnhanced(
  data: RegisterUserDto
): Promise<{ success: boolean; message: string; userId?: number }> {
  try {
    // Validation des données avant envoi
    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.phoneNumber ||
      !data.password
    ) {
      const missingFields = {
        firstName: !!data.firstName,
        lastName: !!data.lastName,
        email: !!data.email,
        phoneNumber: !!data.phoneNumber,
        password: !!data.password,
      };
      console.error(" Missing required fields:", missingFields);
      throw new Error(
        `Champs requis manquants: ${Object.entries(missingFields)
          .filter(([_, exists]) => !exists)
          .map(([field]) => field)
          .join(", ")}`
      );
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      console.error(" Invalid email format:", data.email);
      throw new Error("Format d'email invalide");
    }

    // Validation mot de passe
    if (data.password !== data.confirmPassword) {
      throw new Error("Les mots de passe ne correspondent pas");
    }

    if (data.password.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères");
    }

    // Nettoyage des données
    const cleanData = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phoneNumber: data.phoneNumber.trim(),
      password: data.password,
    };

    // Configuration de la requête
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 15000,
      withCredentials: true,
    };

    // Effectuer la requête

    const response = await axios.post(
      `${API_DOMAIN}/auth/register`,
      cleanData,
      config
    );

    if (response.status !== 201 && response.status !== 200) {
      console.error(" Unexpected status code:", response.status);
      throw new Error(`Statut de réponse inattendu: ${response.status}`);
    }

    // Vérification de la structure de réponse
    if (!response.data) {
      console.error(" No response data");
      throw new Error("Aucune donnée dans la réponse");
    }

    const userData = response.data.user || response.data.data || response.data;
    const userId = userData?.id || response.data.userId;

    return {
      success: true,
      message: "Inscription réussie ! Vous pouvez maintenant vous connecter.",
      userId: userId,
    };
  } catch (error: unknown) {
    console.error(" Error in registerUser:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error(" Axios Error Details:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });

      if (axiosError.response?.status === 400) {
        const errorData = axiosError.response.data as any;
        if (errorData?.error) {
          throw new Error(`Erreur de validation: ${errorData.error}`);
        } else if (errorData?.message) {
          throw new Error(`Erreur de validation: ${errorData.message}`);
        } else {
          throw new Error(
            "Données invalides. Veuillez vérifier vos informations."
          );
        }
      } else if (axiosError.response?.status === 409) {
        throw new Error("Un utilisateur avec cette adresse email existe déjà.");
      } else if (axiosError.response?.status === 422) {
        throw new Error("Format des données incorrect.");
      } else if (
        axiosError.response?.status &&
        axiosError.response.status >= 500
      ) {
        throw new Error("Erreur serveur. Veuillez réessayer plus tard.");
      } else {
        throw new Error(
          `Erreur HTTP ${axiosError.response?.status || "inconnue"}: ${
            axiosError.message
          }`
        );
      }
    } else if (error instanceof Error) {
      throw new Error(`Erreur: ${error.message}`);
    } else {
      throw new Error("Une erreur inconnue s'est produite");
    }
  }
}

export async function addDestinataire(
  data: CreateDestinataireDto
): Promise<number | null> {
  try {
    console.log(
      " addDestinataire called with data:",
      JSON.stringify(data, null, 2)
    );

    // Validation des données avant envoi
    if (!data.firstName || !data.lastName || !data.email || !data.phoneNumber) {
      const missingFields = {
        firstName: !!data.firstName,
        lastName: !!data.lastName,
        email: !!data.email,
        phoneNumber: !!data.phoneNumber,
      };
      console.error(" Missing required fields:", missingFields);
      throw new Error(
        `Champs requis manquants: ${Object.entries(missingFields)
          .filter(([_, exists]) => !exists)
          .map(([field]) => field)
          .join(", ")}`
      );
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      console.error(" Invalid email format:", data.email);
      throw new Error("Format d'email invalide");
    }

    // Nettoyage des données
    const cleanData: CreateDestinataireDto = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      name:
        data.name?.trim() || `${data.firstName.trim()} ${data.lastName.trim()}`,
      email: data.email.trim().toLowerCase(),
      phoneNumber: data.phoneNumber.trim(),
      image: data.image || "",
      role: data.role || RoleDto.DESTINATAIRE,
    };

    // Configuration de la requête
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 15000,
      withCredentials: true, // Important pour les cookies de session
    };

    // Effectuer la requête
    const response = await axios.post(
      `${API_DOMAIN}/users/destinataires`,
      cleanData,
      config
    );

    //  CORRECTION: L'API retourne 200, pas 201
    if (response.status !== 200) {
      console.error(" Unexpected status code:", response.status);
      throw new Error(`Statut de réponse inattendu: ${response.status}`);
    }

    // Vérification de la structure de réponse
    if (!response.data) {
      console.error(" No response data");
      throw new Error("Aucune donnée dans la réponse");
    }

    //  CORRECTION: La structure est {data: destinataireData}
    const destinataireData = response.data.data;
    if (!destinataireData) {
      console.error(" No data field in response:", response.data);
      throw new Error("Champ 'data' manquant dans la réponse");
    }

    //  CORRECTION: L'ID est dans destinataireData.id
    const destinataireId = destinataireData.id;
    if (!destinataireId) {
      console.error(" No id in destinataire data:", destinataireData);
      throw new Error("ID du destinataire manquant dans les données");
    }

    console.log(
      "🎉 Destinataire created successfully with ID:",
      destinataireId
    );
    return destinataireId;
  } catch (error: unknown) {
    console.error(" Error in addDestinataire:", error);

    // Type guard pour AxiosError
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error(" Axios Error Details:");
      console.error("  - Message:", axiosError.message);
      console.error("  - Code:", axiosError.code);
      console.error("  - Status:", axiosError.response?.status);
      console.error("  - Status Text:", axiosError.response?.statusText);
      console.error(
        "  - Response Data:",
        JSON.stringify(axiosError.response?.data, null, 2)
      );
      console.error("  - Request URL:", axiosError.config?.url);
      console.error("  - Request Method:", axiosError.config?.method);
      console.error(
        "  - Request Headers:",
        JSON.stringify(axiosError.config?.headers, null, 2)
      );
      console.error("  - Request Data:", axiosError.config?.data);

      // Gestion spécifique des erreurs selon le status
      if (axiosError.response?.status === 400) {
        const errorData = axiosError.response.data as any;
        console.error("🔍 Analyzing 400 error:", errorData);
        if (errorData?.error) {
          throw new Error(`Erreur de validation: ${errorData.error}`);
        } else if (errorData?.message) {
          throw new Error(`Erreur de validation: ${errorData.message}`);
        } else if (errorData?.errors) {
          const errorMessages = Array.isArray(errorData.errors)
            ? errorData.errors.join(", ")
            : JSON.stringify(errorData.errors);
          throw new Error(`Erreurs de validation: ${errorMessages}`);
        } else if (errorData?.details) {
          throw new Error(
            `Détails de l'erreur: ${JSON.stringify(errorData.details)}`
          );
        } else {
          throw new Error(
            `Données invalides (400). Réponse serveur: ${JSON.stringify(
              errorData
            )}`
          );
        }
      } else if (axiosError.response?.status === 401) {
        throw new Error("Non autorisé. Veuillez vous reconnecter.");
      } else if (axiosError.response?.status === 403) {
        throw new Error(
          "Accès interdit. Vous n'avez pas les permissions nécessaires."
        );
      } else if (axiosError.response?.status === 409) {
        throw new Error("Un utilisateur avec cette adresse email existe déjà.");
      } else if (axiosError.response?.status === 422) {
        throw new Error("Format des données incorrect.");
      } else if (
        axiosError.response?.status &&
        axiosError.response.status >= 500
      ) {
        throw new Error("Erreur serveur. Veuillez réessayer plus tard.");
      } else if (axiosError.code === "ECONNABORTED") {
        throw new Error("Timeout: La requête a pris trop de temps.");
      } else if (axiosError.code === "NETWORK_ERROR") {
        throw new Error("Erreur réseau. Vérifiez votre connexion internet.");
      } else {
        throw new Error(
          `Erreur HTTP ${axiosError.response?.status || "inconnue"}: ${
            axiosError.message
          }`
        );
      }
    } else if (error instanceof Error) {
      // Erreur JavaScript standard
      console.error(" Standard Error:", error.message);
      console.error(" Stack:", error.stack);
      throw new Error(`Erreur: ${error.message}`);
    } else {
      // Erreur inconnue
      console.error(" Unknown Error:", error);
      throw new Error("Une erreur inconnue s'est produite");
    }
  }
}

/**
 * Get users list based on the userRole (from GitHub version)
 */
export async function getUsers(): Promise<ProfileDto[] | null> {
  try {
    const response = await axios.get(`${API_DOMAIN}/users/list`, {
      headers: {
        // assure que le cache ne garde pas les réponses
        "Cache-Control": "no-store",
      },
      withCredentials: true,
    });
    if (!response.data) return null;
    return response.data;
  } catch (e) {
    return null;
  }
}