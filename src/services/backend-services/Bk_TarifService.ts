// path: src/services/backend-services/Bk_TarifService.ts

'use server';

import prisma from "@/utils/db";
import {TarifsDto} from "@/services/dtos";
import Decimal from "decimal.js";

export async function findTarifs(): Promise<TarifsDto | null> {
    try {

        const tarifs = await prisma.tarifs.findFirst();

        if (!tarifs) {
            return null;
        }

        // Convert `Decimal` fields to `number`
        const formattedTarifs: TarifsDto = {
            weightRate: (tarifs.weightRate as Decimal).toNumber(),
            volumeRate: (tarifs.volumeRate as Decimal).toNumber(),
            baseRate: (tarifs.baseRate as Decimal).toNumber(),
            fixedRate: (tarifs.fixedRate as Decimal).toNumber(),
        };

        return formattedTarifs;

    } catch (error) {
        return null;
    }
}
