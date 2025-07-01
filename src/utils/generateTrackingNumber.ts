// path: src/utils/generateTrackingNumber.ts

export function generateTrackingNumber(
    departureCountry: string,
    departureCity: string,
    destinationCountry: string,
    destinationCity: string,
): string {

    const randomCode = generateRandomAlphanumeric(6); // Function to generate random code

    // Example: Format `[DepartureISO]-[DepartureCity]-[ArrivalISO]-[ArrivalCity]-[RandomCode]`
    return `${departureCountry.slice(0, 2).toUpperCase()}-${departureCity.slice(0, 3).toUpperCase()}-${
        destinationCountry.slice(0, 2).toUpperCase()
    }-${destinationCity.slice(0, 3).toUpperCase()}-${randomCode}`;
}

function generateRandomAlphanumeric(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
