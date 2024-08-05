import {prisma} from "@/app/utils/db";
import {SimulationEnvoisDto, TarifsDto} from "@/app/utils/dtos";
import {parcelsSchema, simulationEnvoisSchema, tarifsSchema} from "@/app/utils/validationSchema";

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
async function getTarifs() {
    const tarifs = await prisma.tarifs.findFirst() as TarifsDto;
    if (!tarifs) {
        throw new Error("Tarifs not found");
    }

    const validated = tarifsSchema.safeParse(tarifs);
    if (!validated.success) {
        console.log('tarifs non valider', tarifs);
        throw new Error(validated.error.errors[0].message);
    }
    return tarifs;
}

/**
 * @description Calculer les détails de l'envoi
 * @param envoiData
 */
export const calculateEnvoiDetails = async (envoiData: SimulationEnvoisDto) => {

        // validation envoisData
        const validated =
            simulationEnvoisSchema.safeParse(envoiData);
        if (!validated.success) {
            // console.log('envoiData non valider', envoiData);
            throw new Error(validated.error.errors[0].message);
        }
        const {packages} = envoiData;

        // Valider chaque colis avec Zod
        for (let i = 0; i < packages.length; i++) {
            const validated =
                parcelsSchema.safeParse(packages[i]);
            if (!validated.success) {
                console.log('colis non valider', packages[i]);
                throw new Error(validated.error.errors[0].message);
            }
        }

        // Récupérer les tarifs de la base de données
        const tarifs = await getTarifs();

        // Calcul du poids total
        const totalWeight = parseFloat(packages.reduce((acc, pkg) =>
            acc + pkg.weight, 0).toFixed(2));

        // Calcul du volume total en m²
        const totalVolume = (parseFloat(packages.reduce((acc, pkg) =>
            acc + (pkg.height * pkg.width), 0).toFixed(2)) / 10000).toFixed(2); // Convert from cm² to m²

        // Calcul du prix total
        let totalPrice = 0;
        if (totalWeight <= 10) {
            totalPrice = tarifs.fixedRate;
        } else {
            totalPrice = totalWeight * tarifs.weightRate;
        }

        // Round to two decimal places
        totalPrice = parseFloat(totalPrice.toFixed(2));

        // Calculer les dates de départ et d'arrivée
        const today = new Date();
        const departureDate = getNextTuesday(today);
        const arrivalDate = getNextMondayAfter(departureDate);

        return {
            ...envoiData,
            totalWeight,
            totalVolume,
            totalPrice,
            departureDate,
            arrivalDate
        };
    }
;
