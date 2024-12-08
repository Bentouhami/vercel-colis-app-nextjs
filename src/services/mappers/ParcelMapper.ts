// Parcel Mapper
import {Parcel} from "@prisma/client";
import {CreateParcelDto, ParcelDto} from "@/services/dtos";

export class ParcelMapper {
    static toDto(parcel: Parcel): ParcelDto {
        return {
            id: parcel.id,
            height: Number(parcel.height),
            weight: Number(parcel.weight),
            width: Number(parcel.width),
            length: Number(parcel.length),
            envoiId: parcel.envoiId
        };
    }

    static toCreateDto(parcel: Parcel): CreateParcelDto {
        return {
            height: Number(parcel.height),
            weight: Number(parcel.weight),
            width: Number(parcel.width),
            length: Number(parcel.length)
        };
    }
}
