// Tarifs Mapper
import {TarifsDto} from "@/services/dtos";
import {Tarifs} from "@prisma/client";

export class TarifsMapper {
    static toDto(tarifs: Tarifs): TarifsDto {
        return {
            weightRate: Number(tarifs.weightRate),
            volumeRate: Number(tarifs.volumeRate),
            baseRate: Number(tarifs.baseRate),
            fixedRate: Number(tarifs.fixedRate)
        };
    }
}