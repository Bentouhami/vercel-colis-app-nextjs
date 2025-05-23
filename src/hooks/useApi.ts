// src/hooks/useApi.ts

import {useLoading} from "@/contexts/LoadingContext";

export const useApi = () => {
    const { setIsLoading } = useLoading();

    async function call<T>(fn: () => Promise<T>): Promise<T | null> {
        try {
            setIsLoading(true);
            return await fn();
        } catch (err) {
            console.error('Erreur API :', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    return { call };
};
