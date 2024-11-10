// path: src/utils/types.ts
export type JWTPayload = {
    id: number;
    roles: string[]; // Changed from `role` to `roles` for multiple roles
    phoneNumber: string;
    userEmail: string;
    firstName: string;
    lastName: string;
    image?: string | null;
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



// export interface SimulationResults {
//     departureCountry: string;
//     departureCity: string;
//     departureAgency: string;
//     destinationCountry: string;
//     destinationCity: string;
//     destinationAgency: string;
//     packages: CreateParcelDto[];
//     totalWeight: number;
//     totalVolume: number;
//     totalPrice: number;
//     departureDate: string;
//     arrivalDate: string;
// }