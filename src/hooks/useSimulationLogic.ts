// path: src/hooks/useSimulationLogic.ts
import { useState, useEffect, useTransition } from 'react';
import {
    fetchCountries,
    fetchCities,
    fetchAgencies,
    fetchDestinationCountries
} from "@/services/frontend-services/AddressService";
import { toast } from "react-toastify";

export function useSimulationLogic() {
    const [isPending, startTransition] = useTransition();

    const [departure, setDeparture] = useState({ country: '', city: '', agencyName: '' });
    const [destination, setDestination] = useState({ country: '', city: '', agencyName: '' });
    const [options, setOptions] = useState({
        countries: [] as { id: number; name: string }[],
        destinationCountries: [] as { id: number; name: string }[],
        departureCities: [] as { id: number; name: string }[],
        departureAgencies: [] as { id: number; name: string }[],
        destinationCities: [] as { id: number; name: string }[],
        destinationAgencies: [] as { id: number; name: string }[],
    });

    // Fetch countries
    useEffect(() => {
        (async () => {
            try {
                const data = await fetchCountries();
                setOptions(prev => ({ ...prev, countries: data }));
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        })();
    }, []);

    // Fetch departure cities
    useEffect(() => {
        if (!departure.country) return;
        const countryId = Number(departure.country);
        fetchCities(countryId)
            .then(data => setOptions(prev => ({ ...prev, departureCities: data })))
            .catch(console.error);
        setDeparture(prev => ({ ...prev, city: '', agencyName: '' }));
    }, [departure.country]);

    // Fetch departure agencies
    useEffect(() => {
        if (!departure.city) return;
        const cityId = options.departureCities.find(c => c.name === departure.city)?.id;
        if (!cityId) return;
        fetchAgencies(cityId)
            .then(data => setOptions(prev => ({ ...prev, departureAgencies: data })))
            .catch(console.error);
        setDeparture(prev => ({ ...prev, agencyName: '' }));
    }, [departure.city, options.departureCities]);

    // Fetch destination countries based on departure country
    useEffect(() => {
        if (!departure.country) return;
        fetchDestinationCountries(departure.country)
            .then(data => setOptions(prev => ({ ...prev, destinationCountries: data })))
            .catch(console.error);
    }, [departure.country]);

    // Fetch destination cities
    useEffect(() => {
        if (!destination.country) return;
        const countryId = Number(destination.country);
        fetchCities(countryId)
            .then(data => setOptions(prev => ({ ...prev, destinationCities: data })))
            .catch(console.error);
        setDestination(prev => ({ ...prev, city: '', agencyName: '' }));
    }, [destination.country]);

    // Fetch destination agencies
    useEffect(() => {
        if (!destination.city) return;
        const cityId = options.destinationCities.find(c => c.name === destination.city)?.id;
        if (!cityId) return;
        fetchAgencies(cityId)
            .then(data => setOptions(prev => ({ ...prev, destinationAgencies: data })))
            .catch(console.error);
        setDestination(prev => ({ ...prev, agencyName: '' }));
    }, [destination.city, options.destinationCities]);

    return {
        isPending,
        departure,
        destination,
        options,
        setDeparture,
        setDestination,
    };
}
