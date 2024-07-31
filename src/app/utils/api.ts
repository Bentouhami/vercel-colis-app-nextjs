// src/utils/api.ts
export async function fetchCountries() {
    const response = await fetch('/api/v1/simulation');
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch countries');
    }
}

export async function fetchCities(country) {
    const response = await fetch(`/api/v1/simulation/${encodeURIComponent(country)}/cities`);
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch cities');
    }
}

export async function fetchAgencies(country, city) {
    const response = await fetch(`/api/v1/simulation/${encodeURIComponent(country)}/cities/${encodeURIComponent(city)}/agencies`);
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch agencies');
    }
}
