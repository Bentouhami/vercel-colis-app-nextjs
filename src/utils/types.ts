// path: src/utils/types.ts
export type JWTPayload = {
    id: number;
    firstName: string;
    lastName: string;
    name: string;
    userEmail: string;
    phoneNumber: string;
    image?: string | null;
    role: string;
};

export type Country = {
    name: string;
}

// Define a type for the form data that matches the structure we're using
export type FormData = {
    firstName: string;
    lastName: string;
    birthDate: string;
    phoneNumber: string;
    email: string;
    password: string;
    checkPassword: string;
    address: {
        street: string;
        number: string;
        city: string;
        zipCode: string;
        country: string;
    };
};


export type VerificationDataType = {
    verificationToken: string;
    verificationTokenExpires: Date;
}
