// path: src/services/frontend-services/TarifsService.ts

// Récupérer les tarifs de la base de données
import {TarifsDto} from "@/services/dtos";
import {DOMAIN} from "@/utils/constants";

export async function getTarifs(): Promise<TarifsDto> {
    try {
        const response = await fetch(`${DOMAIN}/api/v1/tarifs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get tarifs');
        }

        const tarifs = await response.json();

        return tarifs as TarifsDto; // This should now be properly typed as TarifsDto
    } catch (error) {
        console.error('Error getting tarifs:', error);
        throw error;
    }
}

