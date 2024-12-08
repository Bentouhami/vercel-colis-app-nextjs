// path: src/services/dtos/transports/TransportDto.ts


// DTO for a transport
export interface TransportDto extends BaseTransportDto {
    id: number;
}

export interface BaseTransportDto {
    number: string;
    baseVolume: number;
    baseWeight: number;
    currentVolume: number;
    currentWeight: number;
    isAvailable: boolean;
}