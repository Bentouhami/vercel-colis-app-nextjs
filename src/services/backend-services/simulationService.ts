// path: src/services/backend-services/simulationService.ts
'use server';
import {FullSimulationDto, SimulationWithIds} from "@/utils/dtos";
import prisma from "@/utils/db";
import Decimal from "decimal.js";

export async function getSimulationById(simulationId: number): Promise<FullSimulationDto | null> {

    console.log("getSimulationById function called, simulationId: ", simulationId);
    try {
        const simulation = await prisma.simulation.findUnique(
            {
                where: {id: simulationId},

            }) as FullSimulationDto;

        if (!simulation) {
            return null;
        }

        console.log("simulation in getSimulationById function: ", simulation);

        // convert to FullSimulationDto
        const simulationDto: FullSimulationDto = {
            id: simulation.id,
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

        console.log("converted simulation in getSimulationById function: ", simulationDto);

        return simulationDto;

    } catch (error) {
        console.error('Error getting simulation:', error);
        throw error; // Relancer l'erreur pour qu'elle puisse être capturée par la fonction appelante
    }
}

export async function saveSimulation(simulationData: SimulationWithIds): Promise<number> {
    try {
        const simulationId = await prisma.simulation.create({
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
            }
        });

        if (!simulationId) {
            throw new Error("Erreur lors de la sauvegarde de la simulation");
        }

        return simulationId;
    } catch (error) {
        console.error("Erreur lors de la sauvegarde de la simulation:", error);
        throw error;
    }
}