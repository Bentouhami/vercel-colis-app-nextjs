// -------------------- Country DTOs --------------------

export interface CountryDto {
    id: number;
    name: string;
    iso2?: string | null;
    iso3?: string | null;
    phonecode?: string | null;
    capital?: string | null;
    currency?: string | null;
    latitude?: string | null;
    longitude?: string | null;
}

export interface CountryResponseDto {
    id: number;
    name: string;
}

