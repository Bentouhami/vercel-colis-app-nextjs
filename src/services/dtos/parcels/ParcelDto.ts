// path: src/services/dtos/parcels/ParcelDto.ts


// -------------------- Parcel DTOs --------------------
export interface ParcelDto {
    id?: number;
    height: number;
    weight: number;
    width: number;
    length: number;
    envoiId: number;
}

// DTO for creating a new parcel
export interface CreateParcelDto extends Omit<ParcelDto, "id" | "envoiId">
{
    envoiId?: number;
}

export type EditParcelDto = Partial<Omit<ParcelDto, "id" | "envoiId">> &
    { id: number };
