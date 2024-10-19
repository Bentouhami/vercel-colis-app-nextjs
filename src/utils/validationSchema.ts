import {z} from "zod";

// Constants for validation
const PASSWORD_MIN_LENGTH = 8;
const PHONE_REGEX = /^\+?\d{1,3}[ -]?\d{9,12}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&+]{8,}$/;

// Liste des domaines d'emails temporaires
const TEMP_EMAIL_DOMAINS = [
    'tempmail.com', 'temp-mail.org', 'throwawaymail.com',
    'yopmail.com', 'guerrillamail.com', '10minutemail.com'
];

// Base validations
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

const passwordValidation = z.string()
    .min(PASSWORD_MIN_LENGTH, {message: `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères`})
    .regex(PASSWORD_REGEX, {
        message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
    });

const phoneValidation = z.string()
    .regex(PHONE_REGEX, {
        message: "Le numéro de téléphone doit être au format international, commencer par un '+' suivi de l'indicatif du pays (1 à 3 chiffres), et contenir entre 9 et 12 chiffres."
    });


// Address schema
export const addressSchema = z.object({
    street: z.string().min(1, {message: "La rue est requise"}),
    number: z.string().min(1, {message: "Le numéro est requis"}), // Assurez-vous que c'est `string`
    zipCode: z.string().min(1, {message: "Le code postal est requis"}),
    city: z.string().min(1, {message: "La ville est requise"}),
    country: z.string().min(1, {message: "Le pays est requis"}),
});


// Schema pour l'inscription frontend
export const registerUserFrontendSchema = z.object({
    firstName: z.string().min(1, {message: "Le prénom est requis"}),
    lastName: z.string().min(1, {message: "Le nom est requis"}),
    birthDate: z.string()
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
        }, {message: "Vous devez avoir au moins 18 ans pour vous inscrire"}),
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
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {message: "La date de naissance est invalide"}),
    phoneNumber: phoneValidation,
    email: emailValidation,
    password: passwordValidation,
    address: addressSchema,
});


// Schema pour la connexion
export const loginUserSchema = z.object({
    email: emailValidation,
    password: passwordValidation,
});


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

// Simulation Envois schema
export const simulationEnvoisSchema = z.object({
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
    packages: z.array(parcelsSchema),
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
    firstName: z.string().min(1, {message: "Nom is required"}),
    lastName: z.string().min(1, {message: "Prenom is required"}),
    email: emailValidation,
    phoneNumber: phoneValidation,
})


// Types exportés
export type RegisterUserType = z.infer<typeof registerUserFrontendSchema>;
export type LoginUserType = z.infer<typeof loginUserSchema>;
export type AddressType = z.infer<typeof addressSchema>;
export type RegisterUserBackendType = z.infer<typeof registerUserBackendSchema>;

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

