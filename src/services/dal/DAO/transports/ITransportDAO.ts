// path: src/services/dal/DAO/transports/ITransportDAO.ts

import { UpdateTransportRequestDto} from "@/services/dtos";
import {Transport as TransportPrisma} from "@prisma/client";

export interface ITransportDAO {
    getTransports(): Promise<TransportPrisma[] | null>
    updateTransport(transport: UpdateTransportRequestDto): Promise<TransportPrisma | null>
}