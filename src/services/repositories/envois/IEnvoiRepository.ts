// path: src/services/repositories/envois/IEnvoiRepository.ts

import {EnvoiDto, UpdateEnvoiDto} from "@/services/dtos";

export interface IEnvoiRepository {
    getEnvoiById(envoiId: number): Promise<EnvoiDto | null>;

    updateEnvoi (id:number , envoi: any): Promise<EnvoiDto | null>;

    cancelSimulation(envoiId: number): Promise<void>;

    deleteParcelsByEnvoiId(envoiId: number): Promise<void>;
}