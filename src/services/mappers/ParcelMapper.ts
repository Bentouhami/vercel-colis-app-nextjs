// Parcel Mapper
import {Parcel as ParcelPrisma} from "@prisma/client";
import {CreateParcelDto, ParcelDto} from "@/services/dtos";

export class ParcelMapper {
    static toDto(parcel: ParcelPrisma): ParcelDto {
        return {
            id: parcel.id,
            height: Number(parcel.height),
            weight: Number(parcel.weight),
            width: Number(parcel.width),
            length: Number(parcel.length),
            envoiId: parcel.envoiId
        };
    }

    static toCreateDto(parcel: ParcelPrisma): CreateParcelDto {
        return {
            height: Number(parcel.height),
            weight: Number(parcel.weight),
            width: Number(parcel.width),
            length: Number(parcel.length)
        };
    }

    // map many parcels to DTO
    static toDtos(parcels: ParcelPrisma[]): ParcelDto[] {
        return parcels.map(parcel => ParcelMapper.toDto(parcel));
    }

}
