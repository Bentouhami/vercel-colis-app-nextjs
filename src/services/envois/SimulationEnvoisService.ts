// path: src/services/envois/SimulationEnvoisService.ts

import {SimulationEnvoisDto, TarifsDto} from "@/utils/dtos";
import {parcelsSchema, simulationEnvoisSchema} from "@/utils/validationSchema";
import prisma from "@/utils/db";

// Trouver le prochain mardi à partir d'une date donnée
function getNextTuesday(date: Date): Date {
    const resultDate = new Date(date);
    resultDate.setDate(date.getDate() + (9 - date.getDay()) % 7);
    return resultDate;
}

// Trouver le prochain lundi après un mardi donné
function getNextMondayAfter(date: Date): Date {
    const resultDate = new Date(date);
    resultDate.setDate(date.getDate() + 6); // Le lundi suivant le mardi
    return resultDate;
}

// Récupérer les tarifs de la base de données
async function getTarifs(agencyId?: number) {

    try {
        // debug starting getTarifs function
        console.log("starting getTarifs function");

        // Récupérer les tarifs de la base de données

        console.log("next line will use prisma.tarifs.findFirst");
        const tarifs = await prisma.tarifs.findFirst({
            where: {
                OR: [
                    { agencyId: agencyId ?? null },  // Utilisez le tarif pour l'agence spécifique si agencyId est défini, sinon recherchez les tarifs globaux
                    { agencyId: null },              // Sinon, utilisez les tarifs globaux
                ],
            },
            select : {
                weightRate: true,
                volumeRate: true,
                baseRate: true,
                fixedRate: true,
            }
        });
    
        console.log("prisma.tarifs.findFirst passed");
        
    
        // Valider les tarifs
        if (!tarifs) {
            console.log("no tarifs found");
            throw new Error("Aucun tarif trouvé.");
        }
    
        console.log("tarifs found", tarifs);
        // Convert to DTO
        const tarifsDto : TarifsDto ={
            weightRate: tarifs.weightRate.toNumber(),
            volumeRate: tarifs.volumeRate.toNumber(),
            baseRate: tarifs.baseRate.toNumber(),
            fixedRate: tarifs.fixedRate.toNumber(),
        }
    
        console.log("Tarifs récupérés:", tarifsDto);
    
        // const validated = tarifsSchema.safeParse(tarifs);
        // if (!validated.success) {
        //     console.log('tarifs non valider', tarifs);
        //     throw new Error(validated.error.errors[0].message);
        // }
    
        return tarifsDto;
        
    } catch (error) {
        return error;
    }
}


/**
 * @description Calculer les détails de l'envoi
 * @param envoiData
 */
export const calculateEnvoiDetails = async (envoiData: SimulationEnvoisDto) => {

    console.log("Calculating envoi details with:", envoiData); // Log the input

    console.log(" validation of simulationEnvoisSchema starts here")
    // validation envoisData
    const validated =
        simulationEnvoisSchema.safeParse(envoiData);
    if (!validated.success) {
        // console.log('envoiData non valider', envoiData);
        throw new Error(validated.error.errors[0].message);
    }
    const {packages} = envoiData;

    // Valider chaque colis avec Zod
    for (let i = 0; i< packages.length; i++) {
        const validated =
            parcelsSchema.safeParse(packages[i]);
        if (!validated.success) {
            console.log('colis non valider', packages[i]);
            throw new Error(validated.error.errors[0].message);
        }
    }

    // Récupérer les tarifs de la base de données
    console.log(" je tente de récupérer les tarifs de la base de données");
    const agencyid = undefined
    const tarifs = await getTarifs(agencyid) as TarifsDto;
    console.log("getTarifs est passé et les données des tarifs sont récupérés:", tarifs);

    if (!tarifs) {

        console.log("no tarifs found");
        throw new Error("Les tarifs n'ont pas pu être récupérés.");
    }

    console.log("i will start to calculate the total weight");
    // Calcul du poids total
    const totalWeight = parseFloat(packages.reduce((acc, pkg) =>
        acc + pkg.weight, 0).toFixed(2));

    console.log("totalWeight calculated: ", totalWeight);

    console.log("i will start to calculate the total volume");
    // Calcul du volume total en m²
    const totalVolume = (parseFloat(packages.reduce((acc, pkg) =>
        acc + (pkg.height * pkg.width), 0).toFixed(2)) / 10000).toFixed(2); // Convert from cm² to m²

    console.log("totalVolume calculated: ", totalVolume);
    // Calcul du prix total
    let totalPrice = 0;
    if (totalWeight <= 10) {
        totalPrice = tarifs.fixedRate;
    } else {
        totalPrice = totalWeight * tarifs.weightRate;
    }

    console.log("condition if to calculate totalPrice passed : ", totalPrice);

    // Round to two decimal places
    totalPrice = parseFloat(totalPrice.toFixed(2));
    
    console.log("Round to tow decimal  :", totalPrice);

    // Calculer les dates de départ et d'arrivée
    const today = new Date();
    const departureDate = getNextTuesday(today);
    const arrivalDate = getNextMondayAfter(departureDate);


    console.log("try to return   return  ...envoiData totalWeight totalVolume totalPrice departureDate arrivalDate")
    return {
        ...envoiData,
        totalWeight,
        totalVolume,
        totalPrice,
        departureDate,
        arrivalDate
    };
};
