// path: src/services/dtos/tarifs/TarifDto.ts

// Tarifs and results
export interface TarifsDto {
    id?: number;
    weightRate: number;
    volumeRate: number;
    baseRate: number;
    fixedRate: number;
}

export interface TarifsResponseDto {
    id: number;
    weightRate: number;
    volumeRate: number;
    baseRate: number;
    fixedRate: number;
}