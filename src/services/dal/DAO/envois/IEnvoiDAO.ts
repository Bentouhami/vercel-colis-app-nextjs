// path: src/services/frontend-services/envoi/IEnvoiDAO.ts

import {Envoi as EnvoiPrisma} from "@prisma/client";

export interface IEnvoiDAO {
    getEnvoiById(id: number): Promise<EnvoiPrisma | null>

    updateEnvoi(id: number, data: any ): Promise<EnvoiPrisma | null>

    cancelSimulation(envoiId: number): Promise<void>;

    deleteParcelsByEnvoiId(envoiId: number): Promise<void>;
}