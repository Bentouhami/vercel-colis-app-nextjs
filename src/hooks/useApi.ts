// src/hooks/useApi.ts

import {useCallback} from "react";
import {useLoading} from "@/contexts/LoadingContext";

export const useApi = () => {
    const { setIsLoading } = useLoading();

    const call = useCallback(async <T>(fn: () => Promise<T>): Promise<T | null> => {
        try {
            setIsLoading(true);
            return await fn();
        } catch (err) {
            console.error('Erreur API :', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading]);

    return { call };
};
