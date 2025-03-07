import {z} from "zod";
import {
    MAX_TRANSPORT_VOLUME,
    MAX_TRANSPORT_WEIGHT,
    PASSWORD_MIN_LENGTH,
    PASSWORD_REGEX,
    PHONE_REGEX
} from "./constants";


// Constants for validation


// Liste des domaines d'emails temporaires
const TEMP_EMAIL_DOMAINS = [
    'tempmail.com', 'temp-mail.org', 'throwawaymail.com',
    'yopmail.com', 'guerrillamail.com', '10minutemail.com'
];

// region Base validations

// Email validation
const emailValidation = z.string()
    .min(1, {message: "L'email est requis"})
    .email({message: "Format d'email invalide"})
    .refine(
        (email) => {
            const domain = email.toLowerCase().split('@')[1];
            return !TEMP_EMAIL_DOMAINS.includes(domain);
        },
        {message: "Les adresses email temporaires ne sont pas acceptées"}
    );

// Password validation
const passwordValidation = z.string()
    .min(PASSWORD_MIN_LENGTH, {message: `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères`})
    .regex(PASSWORD_REGEX, {
        message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
    });

// Phone number validation
const phoneValidation = z.string()
    .regex(PHONE_REGEX, {
        message: "Le numéro de téléphone doit être au format international, commencer par un '+' suivi de l'indicatif du pays (1 à 3 chiffres), et contenir entre 9 et 12 chiffres."
    });

// Old +18 birthdate validation
const oldBirthDateValidation = z.string()
    .min(1, {message: "La date de naissance est requise"})
    .refine((val) => !isNaN(Date.parse(val)), {
        message: "La date de naissance doit être une date valide"
    })
    .refine((val) => {
        const date = new Date(val);
        const now = new Date();
        const minAge = 18;
        const userAge = now.getFullYear() - date.getFullYear();
        return userAge >= minAge;
    }, {message: "Vous devez avoir au moins 18 ans pour vous inscrire"});

// parcels schema
const parcelsList = z.array(
    z.object({
        height: z.number().positive({message: "Parcel height must be a positive number"}),
        width: z.number().positive({message: "Parcel width must be a positive number"}),
        length: z.number().positive({message: "Parcel length must be a positive number"}),
        weight: z.number().positive({message: "Parcel weight must be a positive number"}),
    })
);
// endregion

// region Address schema
export const addressSchema = z.object({
    street: z.string().min(1, { message: "La rue est requise" }),
    // Optional
    complement: z.string().optional(),
    streetNumber: z.string().optional(),
    boxNumber: z.string().optional(),
    // If city is mandatory in the DB, keep it required:
    city: z.string().min(1, { message: "La ville est requise" }),
    country: z.string().min(1, { message: "Le pays est requis" }),
});

// endregion


// region User Schemas
export const registerUserFrontendSchema = z.object({
    firstName: z.string().min(1, {message: "Le prénom est requis"}),
    lastName: z.string().min(1, {message: "Le nom est requis"}),
    birthDate: oldBirthDateValidation,
    phoneNumber: phoneValidation,
    email: emailValidation,
    password: passwordValidation,
    checkPassword: z.string(),
    address: addressSchema,
}).refine((data) => data.password === data.checkPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["checkPassword"],
});

// Schema pour l'inscription backend
export const registerUserBackendSchema = z.object({
    firstName: z.string().min(1, {message: "Le prénom est requis"}),
    lastName: z.string().min(1, {message: "Le nom est requis"}),
    birthDate: oldBirthDateValidation,
    phoneNumber: phoneValidation,
    email: emailValidation,
    role: z.string().nonempty().optional(),
    password: passwordValidation,
    address: addressSchema,
});



// Schema pour la connexion
export const loginUserSchema = z.object({
    email: emailValidation,
    password: passwordValidation,
});

// endregion

// region Parcels schema
export const parcelsSchema = z.object({
    height: z.number()
        .positive("Height must be positive"),
    width: z.number()
        .positive("Width must be positive"),
    length: z.number()
        .positive("Length must be positive"),
    weight: z.number()
        .min(1, "Weight must be at least 1kg")
        .max(70, "Weight must be at most 70kg"),
}).refine(pkg => pkg.height + pkg.width + pkg.length < 360, {
    message: "The sum of dimensions (L + W + H) must be less than 360 cm",
}).refine(pkg => Math.max(pkg.height, pkg.width, pkg.length) <= 120, {
    message: "The largest side must be at most 120 cm",
}).refine(pkg => pkg.height * pkg.width * pkg.length >= 1728, {
    message: "The volume must be at least 1728 cm³",
});

// endregion

// region Simulation and Envoi schemas
// Updated Simulation Envois schema
export const simulationEnvoisSchema = z.object({
    id: z.number()
        .int()
        .positive({message: "Simulation ID must be a positive integer"}),
    userId: z.number()
        .int()
        .positive({message: "User ID must be a positive integer"})
        .optional(), // Optional if user might not always be associated
    destinataireId: z.number()
        .int()
        .positive({message: "Destinataire ID must be a positive integer"})
        .optional(), // Optional if destinataire might not always be assigned
    departureCountry: z.string()
        .min(1, {message: "Departure country is required"}),
    departureCity: z.string()
        .min(1, {message: "Departure city is required"}),
    departureAgency: z.string()
        .min(1, {message: "Departure agency is required"}),
    destinationCountry: z.string()
        .min(1, {message: "Destination country is required"}),
    destinationCity: z.string()
        .min(1, {message: "Destination city is required"}),
    destinationAgency: z.string()
        .min(1, {message: "Destination agency is required"}),
    parcels: parcelsList,
    simulationStatus: z.string()
        .min(1, {message: "Simulation status is required"})
        .optional(), // Optional if status might not always be available
    envoiStatus: z.string()
        .min(1, {message: "Envoi status is required"})
        .optional(), // Optional if status might not always be available
});

// Schema for the simulation request
export const simulationRequestSchema = z.object({
    departureCountry: z.string().min(1, {message: "Departure country is required"}),
    departureCity: z.string().min(1, {message: "Departure city is required"}),
    departureAgency: z.string().min(1, {message: "Departure agency is required"}),
    destinationCountry: z.string().min(1, {message: "Destination country is required"}),
    destinationCity: z.string().min(1, {message: "Destination city is required"}),
    destinationAgency: z.string().min(1, {message: "Destination agency is required"}),
    parcels: z.array(parcelsSchema), // USE parcelsSchema instead of redefining it
    simulationStatus: z.string().min(1, {message: "Simulation status is required"}).optional(),
    envoiStatus: z.string().min(1, {message: "Envoi status is required"}).optional(),
});


// Schéma pour valider les tarifs
export const tarifsSchema = z.object({
    weightRate: z.number()
        .min(1, {message: "Weight rate is required"})
        .max(70, {message: "Weight rate must be between 1kg and 70kg"}),
    volumeRate: z.number()
        .max(120, {message: "Volume rate must be between 1 and 120"})
        .default(0),
    baseRate: z.number({message: "Base rate is required"})
        .default(0),
    fixedRate: z.number({message: "Fixed rate is required"})
        .default(0),
});


// Schema pour la formule de destinataire
export const destinataireSchema = z.object({
    firstName: z.string().min(1, {message: "First name is required"}),
    lastName: z.string().min(1, {message: "Last name is required"}),
    email: emailValidation,
    phoneNumber: phoneValidation,
})


// Types exportés

export type DestinataireInput = z.infer<typeof destinataireSchema>;


// Fonction utilitaire pour la validation
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: boolean;
    data?: T;
    error?: string;
} {
    const result = schema.safeParse(data);
    if (!result.success) {
        const errorMessage = result.error.errors[0].message;
        return {success: false, error: errorMessage};
    }
    return {success: true, data: result.data};
}


// Validation for transport
export const transportSchema = z.object({
    id: z.number()
        .int({message: "The ID must be an integer"})
        .positive({message: "The ID must be a positive number"}),
    number: z.string().min(1, {message: "The vehicle number is required"}),
    baseVolume: z.number()
        .min(1, {message: "The base capacity of the vehicle is required"})
        .max(MAX_TRANSPORT_VOLUME, {message: `Base volume cannot exceed ${MAX_TRANSPORT_VOLUME} cm³`}),
    baseWeight: z.number()
        .min(1, {message: "The base weight of the vehicle is required"})
        .max(MAX_TRANSPORT_WEIGHT, {message: `Base weight cannot exceed ${MAX_TRANSPORT_WEIGHT} kg`}),
    currentVolume: z.number()
        .min(0, {message: "The current capacity cannot be negative"})
        .max(MAX_TRANSPORT_VOLUME, {message: `Current volume cannot exceed ${MAX_TRANSPORT_VOLUME} cm³`}),
    currentWeight: z.number()
        .min(0, {message: "The current weight cannot be negative"})
        .max(MAX_TRANSPORT_WEIGHT, {message: `Current weight cannot exceed ${MAX_TRANSPORT_WEIGHT} kg`}),
    isAvailable: z.boolean().default(true),
});

export type RegisterUserFrontendFormType = z.infer<typeof registerUserFrontendSchema>;
export type RegisterUserBackendType = z.infer<typeof registerUserBackendSchema>;


