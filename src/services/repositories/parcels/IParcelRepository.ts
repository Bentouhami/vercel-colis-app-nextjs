// path: src/services/repositories/parcels/IParcelRespository.ts

import {ParcelDto} from "@/services/dtos";

export interface IParcelRepository {
    getParcelsBySimulationId(id: number): Promise<ParcelDto[] | null>;
}