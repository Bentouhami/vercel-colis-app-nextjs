// path: src/services/envois/SimulationCalculationService.ts

import {CreateParcelDto, SimulationCalculationTotalsDto, TarifsDto} from "@/utils/dtos";
import Decimal from "decimal.js";

// import Decimal from 'decimal.js';

function calculateTotalWeight(parcels: CreateParcelDto[]): number {
    // this function is to calculate the total weight of the parcels by summing up the weights of each parcel
    console.log("log ====> calculateTotalWeight function called");
    return parcels.reduce((acc, pkg) => acc + pkg.weight, 0) as number;
}


function calculateTotalVolume(parcels: CreateParcelDto[]): number {
    console.log("log ====> calculateTotalVolume function called");
    const totalVolume = parcels.reduce((acc, pkg) => {
        const volume = new Decimal(pkg.height)
            .times(pkg.width)
            .times(pkg.length)
            .div(1000000); // Convert cm³ to m²
        return acc.plus(volume);
    }, new Decimal(0));

    return totalVolume.toDecimalPlaces(2).toNumber(); // Return as number with two decimal places
}


function calculateTotalPrice(totalWeight: number, tarifs: TarifsDto): number {


    if (totalWeight <= 10) {
        return Number(tarifs.fixedRate);
    }

    // Using Decimal.js for precision and keeping result as a number
    const total = new Decimal(totalWeight).times(tarifs.weightRate).toDecimalPlaces(2);
    console.log("log ====> total in calculateTotalPrice is : ", total);

    return total.toNumber(); // Convert Decimal back to number
}

export async function calculateEnvoiDetails(parcels: CreateParcelDto[], tarifs: TarifsDto): Promise<SimulationCalculationTotalsDto> {

    console.log("log ====> parcels in calculateEnvoiDetails function: ", parcels);

    console.log("log ====> tarifs in calculateEnvoiDetails function: ", tarifs);

    console.log(tarifs.baseRate);
    console.log(tarifs.volumeRate);
    console.log(tarifs.weightRate);
    console.log(tarifs.fixedRate);


    const totalWeight: number = calculateTotalWeight(parcels);
    const totalVolume: number = calculateTotalVolume(parcels);
    const totalPrice: number = calculateTotalPrice(totalWeight, tarifs);


    console.log("log ====> totalPrice in calculateEnvoiDetails function: ", totalPrice);
    console.log("log ====> totalVolume in calculateEnvoiDetails function: ", totalVolume);
    console.log("log ====> totalWeight in calculateEnvoiDetails function: ", totalWeight);

    // Ajouter les dates de départ et d’arrivée
    const today: Date = new Date();
    const departureDate: Date = getNextTuesday(today);
    const arrivalDate: Date = getNextMondayAfter(departureDate);

    const formatedCalculationResults: SimulationCalculationTotalsDto = {
        totalWeight,
        totalVolume,
        totalPrice,
        departureDate,
        arrivalDate,
    };

    console.log("log ====> formatedCalculationResults in calculateEnvoiDetails function: ", formatedCalculationResults);

    return formatedCalculationResults;
}

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
