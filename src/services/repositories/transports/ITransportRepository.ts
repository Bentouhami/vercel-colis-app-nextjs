// path: src/services/repositories/transports/ITransportRepository.ts

import {ProfileDto, TransportResponseDto, UpdateTransportRequestDto} from "@/services/dtos";

export interface ITransportRepository {
    getTransports(): Promise<TransportResponseDto[] | null>;

    updateTransport(transport: UpdateTransportRequestDto): Promise<TransportResponseDto | null>;

}