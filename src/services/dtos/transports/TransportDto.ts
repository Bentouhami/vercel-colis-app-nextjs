// path: src/services/dtos/transports/TransportDto.ts


// DTO for a transport
export interface TransportResponseDto extends CreateTransportRequestDto {
    id: number;
}

export interface CreateTransportRequestDto {
    number: string;
    baseVolume: number;
    baseWeight: number;
    currentVolume: number;
    currentWeight: number;
    isAvailable: boolean;
}

export interface UpdateTransportRequestDto {
    id: number;
    number?: string;
    baseVolume?: number;
    baseWeight?: number;
    currentVolume?: number;
    currentWeight?: number;
    isAvailable?: boolean;
}