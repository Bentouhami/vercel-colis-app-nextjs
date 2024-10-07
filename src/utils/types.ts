// path: src/utils/types.ts
export type JWTPayload = {
    id: number;
    role: string;
    userEmail: string;
    firstName: string;
    lastName: string;
};

export type Country = {
    name: string;
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