// path: src/services/dal/DAO/transports/ITransportDAO.ts

import {TransportResponseDto} from "@/services/dtos";
import {Transport as TransportPrisma} from "@prisma/client";

export interface ITransportDAO {
    getTransports(): Promise<TransportPrisma[] | null>
}