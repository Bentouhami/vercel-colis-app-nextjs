

export default interface Address {
    id: number;
    street: string;
    number: string;
    city: string;
    zipCode: string;
    country: string;
}

export type JWTPayload = {
    id: number;
    role: string;
    userEmail: string;
};