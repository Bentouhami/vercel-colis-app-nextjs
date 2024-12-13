// path: src/services/dtos/parcels/ParcelDto.ts


// -------------------- Parcel DTOs --------------------
export interface ParcelDto {
    id?: number;
    height: number;
    weight: number;
    width: number;
    length: number;
    envoiId?: number;
}

// DTO for creating a new parcel
export type CreateParcelDto = Omit<ParcelDto, "id" | "envoiId">;
export type ParcelDtoEdit = Partial<Omit<ParcelDto, "id" | "envoiId">> &
    { id: number };
