// path: src/utils/types.ts
// import { DefaultSession } from "next-auth";
// declare module "next-auth" {
//     interface Session {
//         user: {
//             id: string; // S'assurer que ce type est cohérent
//             roles: string[];
//         } & DefaultSession["user"];
//     }
//
//     interface User {
//         id: string; // Synchroniser ici également
//         roles: string[];
//     }
// }

export type JWTPayload = {
    id: number;
    firstName: string;
    lastName: string;
    name: string;
    userEmail: string;
    phoneNumber: string;
    image?: string | null;
    roles: string[];
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