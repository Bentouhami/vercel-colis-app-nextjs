// path: src/services/backend-services/TarifService.ts

'use server';

import prisma from "@/utils/db";
import { TarifsDto } from "@/utils/dtos";

export async function findTarifs(): Promise<TarifsDto | null> {
    console.log("getTarifs function called");
    try {

        const tarifs = await prisma.tarifs.findFirst();

        if (!tarifs) {
            console.log("Aucun tarif trouvé dans la base de données.");
            return null;
        }
        console.log("tarifs found in getTarifs backend function", tarifs);
        return tarifs;

    } catch (error) {
        console.error("Erreur lors de la récupération des tarifs:", error);
        return null;
    }
}
