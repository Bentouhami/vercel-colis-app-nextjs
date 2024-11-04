// path: src/services/backend-services/simulationService.ts
'use server';
import {CreatedSimulationResponseDto, FullSimulationDto, SimulationStatus, SimulationWithIds} from "@/utils/dtos";
import prisma from "@/utils/db";
import Decimal from "decimal.js";

export async function getSimulationByIdAndToken(id: number, verificationToken: string):
    Promise<FullSimulationDto | null> {

    console.log("log ====> getSimulationById function called in path: src/services/backend-services/simulation/SimulationService.ts", "simulationId: ", id, "verificationToken: ", verificationToken);
    try {
        const simulation = await prisma.simulation.findUnique(
            {
                where: {
                    id,
                    verificationToken,
                }

            }) as FullSimulationDto;

        if (!simulation) {
            return null;
        }

        console.log("log ====> simulation found in getSimulationByIdAndToken function in path: src/services/backend-services/simulation/SimulationService.ts: ", simulation);

        // convert to FullSimulationDto
        const simulationDto: FullSimulationDto = {
            // id: simulation.id,
            userId: simulation.userId,
            destinataireId: simulation.destinataireId,
            departureCountry: simulation.departureCountry,
            departureCity: simulation.departureCity,
            departureAgency: simulation.departureAgency,
            destinationCountry: simulation.destinationCountry,
            destinationCity: simulation.destinationCity,
            destinationAgency: simulation.destinationAgency,
            parcels: JSON.parse(simulation.parcels),
            status: simulation.status,
            totalWeight: simulation.totalWeight,
            totalVolume: simulation.totalVolume,
            totalPrice: simulation.totalPrice,
            departureDate: simulation.departureDate,
            arrivalDate: simulation.arrivalDate,
        };

        if (!simulationDto) {
            throw new Error("Simulation not found");
        }

        console.log("log ====> converted simulation found in getSimulationByIdAndToken function in path: src/services/backend-services/simulation/SimulationService.ts: ", simulationDto);

        return simulationDto;

    } catch (error) {
        console.error('Error getting simulation:', error);
        throw error; // Relancer l'erreur pour qu'elle puisse être capturée par la fonction appelante
    }
}

export async function saveSimulation(simulationData: SimulationWithIds): Promise<CreatedSimulationResponseDto> {
    try {
        const simulation = await prisma.simulation.create({
            data: {
                userId: simulationData.userId,
                destinataireId: simulationData.destinataireId,
                departureCountry: simulationData.departureCountry,
                departureCity: simulationData.departureCity,
                departureAgency: simulationData.departureAgency,
                destinationCountry: simulationData.destinationCountry,
                destinationCity: simulationData.destinationCity,
                destinationAgency: simulationData.destinationAgency,
                parcels: JSON.stringify(simulationData.parcels),
                status: simulationData.status,
                totalWeight: new Decimal(simulationData.totalWeight),
                totalVolume: new Decimal(simulationData.totalVolume),
                totalPrice: simulationData.totalPrice ? new Decimal(simulationData.totalPrice) : null,
                departureDate: new Date(simulationData.departureDate),
                arrivalDate: new Date(simulationData.arrivalDate),
            },
            select: {
                id: true,
                verificationToken: true,
            }
        });

        if (!simulation) {
            throw new Error("Erreur lors de la sauvegarde de la simulation");
        }

        return simulation as CreatedSimulationResponseDto;
    } catch (error) {
        console.error("Erreur lors de la sauvegarde de la simulation:", error);
        throw error;
    }
}


export async function updateSimulationWithSenderAndDestinataireIds(simulation: FullSimulationDto) {
    try {
        const updatedSimulation = await prisma.simulation.update({
            where: {
                id: simulation.id,
            },
            data: {
                userId: simulation.userId.id,
                destinataireId: simulation.destinataireId,
                status: SimulationStatus.CONFIRMED
            },

        }) as FullSimulationDto;

        if(!updatedSimulation){
            throw new Error("Error updating simulation");
        }

        return updatedSimulation as FullSimulationDto;

    } catch (error) {
        console.error('Error updating simulation with update simulation', error);
        return null;
    }

}