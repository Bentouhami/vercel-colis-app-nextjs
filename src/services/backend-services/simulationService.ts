// path: src/services/backend-services/simulationService.ts
'use server';
import {
    CreatedSimulationResponseDto,
    CreateParcelDto,
    FullSimulationDto,
    SimulationStatus,
    SimulationWithIds
} from "@/utils/dtos";
import prisma from "@/utils/db";
import Decimal from "decimal.js";

export async function getSimulationByIdAndToken(id: number, verificationToken: string): Promise<FullSimulationDto | null> {
    console.log("log ====> getSimulationById function called in path: src/services/backend-services/simulation/SimulationService.ts", "simulationId: ", id, "verificationToken: ", verificationToken);

    try {
        const simulation = await prisma.simulation.findUnique({
            where: {
                id,
                verificationToken,
            }
        });

        if (!simulation) {
            return null;
        }

        console.log("log ====> simulation found in getSimulationByIdAndToken function: ", simulation);

        const parcelsData = typeof simulation.parcels === 'string'
            ? JSON.parse(simulation.parcels)
            : simulation.parcels;

        // Explicitly convert the status to your DTO enum
        const status = simulation.status as keyof typeof SimulationStatus;

        const simulationDto: FullSimulationDto = {
            id: simulation.id,
            userId: simulation.userId,
            destinataireId: simulation.destinataireId,
            departureCountry: simulation.departureCountry,
            departureCity: simulation.departureCity,
            departureAgency: simulation.departureAgency,
            destinationCountry: simulation.destinationCountry,
            destinationCity: simulation.destinationCity,
            destinationAgency: simulation.destinationAgency,
            parcels: parcelsData,
            status: status ? SimulationStatus[status] : SimulationStatus.DRAFT,
            totalWeight: simulation.totalWeight,
            totalVolume: simulation.totalVolume,
            totalPrice: simulation.totalPrice,
            departureDate: simulation.departureDate,
            arrivalDate: simulation.arrivalDate,
        };

        console.log("log ====> converted simulation found in getSimulationByIdAndToken function: ", simulationDto);

        return simulationDto;

    } catch (error) {
        console.error('Error getting simulation:', error);
        throw error;
    }
}

export async function saveSimulation(simulationData: SimulationWithIds): Promise<CreatedSimulationResponseDto> {
    try {
        // Ensure all required string fields have default values if null
        const simulation = await prisma.simulation.create({
            data: {
                userId: simulationData.userId,
                destinataireId: simulationData.destinataireId,
                departureCountry: simulationData.departureCountry ?? '',
                departureCity: simulationData.departureCity ?? '',
                departureAgency: simulationData.departureAgency ?? '',
                destinationCountry: simulationData.destinationCountry ?? '',
                destinationCity: simulationData.destinationCity ?? '',
                destinationAgency: simulationData.destinationAgency ?? '',
                parcels: JSON.stringify(simulationData.parcels ?? []),
                status: simulationData.status ?? SimulationStatus.DRAFT,
                totalWeight: new Decimal(simulationData.totalWeight).toNumber(), // Convert to number
                totalVolume: new Decimal(simulationData.totalVolume).toNumber(), // Convert to number
                totalPrice: simulationData.totalPrice ? new Decimal(simulationData.totalPrice).toNumber() : null, // Convert to number or use null
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
    console.log("Attempting to update simulation with:", simulation);

    try {
        const updatedSimulation = await prisma.simulation.update({
            where: { id: simulation.id },
            data: {
                userId: simulation.userId,
                destinataireId: simulation.destinataireId,
                status: SimulationStatus.CONFIRMED
            },
            select: {
                id: true,
                userId: true,
                destinataireId: true,
                departureCountry: true,
                departureCity: true,
                departureAgency: true,
                destinationCountry: true,
                destinationCity: true,
                destinationAgency: true,
                parcels: true,
                status: true,
                totalWeight: true,
                totalVolume: true,
                totalPrice: true,
                departureDate: true,
                arrivalDate: true,
            },
        });

        console.log("Updated simulation data from Prisma:", updatedSimulation);

        // Parse parcels only if it is a JSON string
        const parsedParcels = typeof updatedSimulation.parcels === "string"
            ? JSON.parse(updatedSimulation.parcels)
            : updatedSimulation.parcels;

        // Construct the FullSimulationDto with parsed parcels
        const simulationDto = {
            ...updatedSimulation,
            parcels: parsedParcels as CreateParcelDto[] // Explicitly cast to match the expected type
        };

        console.log("Formatted simulation data:", simulationDto);
        console.log("Formatted parcels:", simulationDto.parcels);


        return simulationDto;

    } catch (error) {
        console.error('Error during Prisma simulation update:', error);
        throw new Error("Error updating simulation");
    }
}
