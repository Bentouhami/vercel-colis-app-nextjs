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
    zipCode: z.string().min(1, {message: "ZipCode is required"}),
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
    gender: z.boolean().optional(),
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
    firstName: z.string().min(1, {message: "First name is required"}),
    lastName: z.string().min(1, {message: "Last name is required"}),
    birthDate: z.string().min(1, {message: "Birth date is required"}),
    gender: z.boolean().optional(),
    phoneNumber: z.string().min(1, {message: "Phone number is required"}),
    email: z.string().min(1, {message: "Email is required"}),
    password: z.string().min(1, {message: "Password is required"}),
    confirmPassword: z.string().min(1, {message: "Confirm password is required"}),
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
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    birthDate: z.string().min(1, { message: "Birth Date is required" }).refine((val) => !isNaN(Date.parse(val)), {
        message: "Birth Date must be a valid date",
    }),
    gender: z.boolean({ message: "Gender is required" }),
    phoneNumber: z.string().min(1, { message: "Phone Number is required" }),
    email: z.string().email({ message: "Email is invalid" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    address: addressSchema,
}).refine((data) => data.password === data.confirmPassword, {
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
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
});
// export type loginUserDto = z.infer<typeof loginUserSchema>;
