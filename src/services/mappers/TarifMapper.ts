// Tarifs Mapper
import {TarifsDto} from "@/services/dtos";
import {Tarifs as TarifsPrisma} from "@prisma/client";

export class TarifMapper {
    static toDto(tarifs: TarifsPrisma): TarifsDto {
        return {
            id: tarifs.id,
            weightRate: Number(tarifs.weightRate),
            volumeRate: Number(tarifs.volumeRate),
            baseRate: Number(tarifs.baseRate),
            fixedRate: Number(tarifs.fixedRate)
        };
    }
}