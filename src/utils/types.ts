// path: src/utils/types.ts
export type JWTPayload = {
    id: number;
    role: string;
    phoneNumber: string;
    userEmail: string;
    firstName: string;
    lastName: string;
    imageUrl?: string | null;
};

export type Country = {
    name: string;
}

// Define a type for the form data that matches the structure we're using
export type FormData = {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: "Masculin" | "Féminin" | "Autre" | "";
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

export type DestinataireData = {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
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