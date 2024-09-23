import {z} from "zod";


/**
 * Address schema
 * @type {z.ZodType<any, any, any>}
 * @constant addressSchema
 * @desc Address schema
 */
export const addressSchema = z.object({
    street: z.string().min(1, {message: "Street is required"}),
    number: z.string().min(1, {message: "Number is required"}),
    zipCode: z.string().min(1, {message: "Zip code is required"}),
    city: z.string().min(1, {message: "City is required"}),
    country: z.string().min(1, {message: "Country is required"}),
});

/**
 * User schema
 * @type {z.ZodType<any, any, any>}
 * @constant userSchema
 * @desc User schema
 */
export const userSchema = z.object({
    firstName: z.string().min(1, {message: "First name is required"}),
    lastName: z.string().min(1, {message: "Last name is required"}),
    birthDate: z.string().min(1, {message: "Birth date is required"}),
    gender: z.boolean().optional(),
    phoneNumber: z.string().min(1, {message: "Phone number is required"}),
    email: z.string().min(1, {message: "Email is required"}),
    password: z.string().min(1, {message: "Password is required"}),
    confirmPassword: z.string().min(1, {message: "Confirm password is required"}),
    address: addressSchema,
});

/**
 * Create user schema
 * @type {z.ZodType<any, any, any>}
 * @constant createUserSchema
 * @desc Create user schema
 */
export const createUserSchema = z.object({
    firstName: z.string().min(1, {message: "First name is required"}),
    lastName: z.string().min(1, {message: "Last name is required"}),
    birthDate: z.string().min(1, {message: "Birth date is required"}),
    gender: z.string()
        .min(1, {message: "Gender is required"}).optional(),
    phoneNumber: z.string().min(1, {message: "Phone number is required"}),
    email: z.string().min(1, {message: "Email is required"}),
    password: z.string().min(1, {message: "Password is required"}),
    confirmPassword: z.string().min(1, {message: "Confirm password is required"}),
    address: addressSchema.optional(),
});

/**
 * Update user schema
 * @type {z.ZodType<any, any, any>}
 * @constant updateUserSchema
 * @desc Update user schema
 */
export const updateUserSchema = z.object({
    firstName: z.string()
        .min(1, {message: "First name is required"}).optional(),
    lastName: z.string()
        .min(1, {message: "Last name is required"}).optional(),
    birthDate: z.string()
        .min(1, {message: "Birth date is required"}).optional(),
    gender: z.string()
        .min(1, {message: "Gender is required"}).optional(),
    phoneNumber: z.string()
        .min(1, {message: "Phone number is required"}).optional(),
    email: z.string()
        .min(1, {message: "Email is required"}).optional(),
    password: z.string()
        .min(1, {message: "Password is required"}).optional(),
    confirmPassword: z.string()
        .min(1, {message: "Confirm password is required"}).optional(),
    address: addressSchema.optional(),
});

/**
 * registerUserSchema
 * @type {z.ZodType<any, any, any>}
 * @constant registerUserSchema
 * @desc Register user schema
 *
 */
export const registerUserSchema = z.object({
    firstName: z.string().min(1, {message: "First Name is required"}),
    lastName: z.string().min(1, {message: "Last Name is required"}),
    birthDate: z.string().min(1, {message: "Birth Date is required"}).refine((val) => !isNaN(Date.parse(val)), {
        message: "Birth Date must be a valid date",
    }),
    gender: z.string().min(1, {message: "Gender is required"}).optional(),

    // Validation du numéro de téléphone avec un format international général
    phoneNumber: z.string().min(1, {message: "Phone Number is required"})
        .regex(/^\+\d{1,3}\d{9,12}$/, {message: "Invalid phone number, must be in format +[country code][number]"}),

    email: z.string().email({message: "Email is invalid"}),

    password: z.string()
        .min(8, {message: "Password must be at least 8 characters"})
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"}),

    checkPassword: z.string(),

    address: addressSchema,
})
    .refine((data) => data.password === data.checkPassword, {
        message: "Passwords don't match!",
        path: ["confirmPassword"],
    });


/**
 * Login user schema
 * @type {z.ZodType<any, any, any>}
 * @constant loginUserSchema
 * @desc Login user schema
 */
export const loginUserSchema = z.object({
    email: z.string().min(1, {message: "Email is required"}).email({message: "Invalid email address"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"}),
});
// export type loginUserDto = z.infer<typeof loginUserSchema>;

// user profile schema
export const userProfileSchema = z.object({
    firstName: z.string()
        .min(1, {message: "First Name is required"})
        .optional(),
    lastName: z.string()
        .min(1, {message: "Last Name is required"})
        .optional(),
    birthDate: z.string()
        .min(1, {message: "Birth Date is required"})
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Birth Date must be a valid date",
        }).optional(),
    gender: z.boolean({message: "Gender is required"})
        .optional(),
    phoneNumber: z.string()
        .min(1, {message: "Phone Number is required"})
        .optional(),
    email: z.string()
        .email({message: "Email is invalid"})
        .optional(),
    password: z.string()
        .min(8, {message: "Password must be at least 8 characters"})
        .optional(),
    confirmPassword: z.string()
        .min(8, {message: "Password must be at least 8 characters"})
        .optional(),
    address: addressSchema,
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ["confirmPassword"],
});

// agency schema
export const agenceyShcema = z.object({
    name: z.string()
        .min(1, {message: "Agency name is required"}),
    location: z.string()
        .min(1, {message: " Agency location is required"}),
    address: addressSchema,
})
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