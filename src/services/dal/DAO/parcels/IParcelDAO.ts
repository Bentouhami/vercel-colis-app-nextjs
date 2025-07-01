// path: src/services/dal/DAO/parcels/IParcelDAO.ts

import {ParcelDto} from "@/services/dtos";

export interface IParcelDAO {
    // getParcelsBySimulationId(id: number): Promise<ParcelDto[]>;

    updateParcels(id: number, parcels: ParcelDto[]): Promise<void>;
}