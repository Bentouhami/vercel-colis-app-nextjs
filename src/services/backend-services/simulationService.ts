// path: src/services/backend-services/simulationService.ts
'use server';
import {CreateSimulationDto, FullSimulationDto} from "@/utils/dtos";
import prisma from "@/utils/db";
import Decimal from "decimal.js";

export async function getSimulationById(simulationId: number): Promise<FullSimulationDto | null> {
    try {
        const simulation = await prisma.simulation.findOne(
            {
                where: {id: simulationId},
                select: {
                    id: true,
                    departureAgency: true,
                    destinationAgency: true,
                }
            }) as FullSimulationDto;

        if (!simulation) {
            return null;
        }
        return simulation;

    } catch (error) {
        console.error('Error getting simulation:', error);
        throw error; // Relancer l'erreur pour qu'elle puisse être capturée par la fonction appelante
    }
}

export async function saveSimulation(simulationData: CreateSimulationDto): Promise<any> {
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
        });
        return simulation;
    } catch (error) {
        console.error("Erreur lors de la sauvegarde de la simulation:", error);
        throw error;
    }
}