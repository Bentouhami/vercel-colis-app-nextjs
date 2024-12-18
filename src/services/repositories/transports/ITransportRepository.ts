// path: src/services/repositories/transports/ITransportRepository.ts

import {TransportResponseDto} from "@/services/dtos";

export interface ITransportRepository {
    getTransports(): Promise<TransportResponseDto[] | null>
}