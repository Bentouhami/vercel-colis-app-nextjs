// path: src/services/backend-services/Bk_SimulationService.ts
'use server';
import {
    BaseSimulationDto,
    CreatedSimulationResponseDto,
    FullSimulationDto,
    SimulationResponseDto,
} from "@/services/dtos";
import prisma from "@/utils/db";
import {getAgencyById} from "@/services/backend-services/Bk_AgencyService";
import {generateTrackingNumber} from "@/utils/generateTrackingNumber";
import {simulationRepository} from "@/services/repositories/simulations/SimulationRepository";
import {agencyRepository} from "@/services/repositories/agencies/AgencyRepository";


export async function getSimulationById(id: number): Promise<SimulationResponseDto | null> {

    try {
        // 1. Get simulation by using repository
        const simulation = await simulationRepository.getSimulationById(id);

        if (!simulation) {
            return null;
        }
        return simulation;
    } catch (error) {
        console.error('Error getting simulation:', error);
        throw error;
    }
}

export async function saveSimulation(simulationData: BaseSimulationDto): Promise<CreatedSimulationResponseDto | null> {
    console.log("log ====> simulationData in saveSimulation function called in src/services/backend-services/Bk_SimulationService.ts: ", simulationData);

    if (!simulationData.departureAgencyId) {
        return null;
    }
    try {
        //TODO: use repository to get agency by id


        const departureAgency = await agencyRepository.getAgencyById(simulationData.departureAgencyId);

        // 3. get arrived date city, country and agency name from simulation by agencyId
        if (!simulationData.arrivalAgencyId) {
            return null;
        }
        const arrivalAgency = await getAgencyById(simulationData.arrivalAgencyId);

        // 4. prepare needed data for simulation calculation and envoiStatus
        if (!departureAgency || !arrivalAgency) {
            return null;
        }

        console.log("log ====> departureAgency in saveSimulation function called in src/services/backend-services/Bk_SimulationService.ts: ", departureAgency);
        console.log("log ====> arrivalAgency in saveSimulation function called in src/services/backend-services/Bk_SimulationService.ts: ", arrivalAgency);

        if (!departureAgency.address.country || !departureAgency.address.city) {
            throw new Error("Departure agency country or city is missing.");
        }

        if (!arrivalAgency.address.country || !arrivalAgency.address.city) {
            throw new Error("Arrival agency country or city is missing.");
        }

        // generate tracking number
        const trackingNumber = generateTrackingNumber(
            departureAgency.address.country,
            departureAgency.address.city,
            arrivalAgency.address.country,
            arrivalAgency.address.city
        );

        if (!trackingNumber) {
            return null;
        }

        console.log("log ====> trackingNumber in saveSimulation function called in src/services/backend-services/Bk_SimulationService.ts: ", trackingNumber);

        const simulation = await prisma.envoi.create({
            data: {
                trackingNumber: trackingNumber,
                departureAgencyId: simulationData.departureAgencyId,
                arrivalAgencyId: simulationData.arrivalAgencyId,
                simulationStatus: simulationData.simulationStatus,
                envoiStatus: simulationData.envoiStatus,
                totalWeight: simulationData.totalWeight,
                totalVolume: simulationData.totalVolume,
                totalPrice: simulationData.totalPrice,
                departureDate: simulationData.departureDate,
                arrivalDate: simulationData.arrivalDate,
                parcels: {
                    create: simulationData.parcels.map(parcel => ({
                        height: parcel.height,
                        width: parcel.width,
                        length: parcel.length,
                        weight: parcel.weight,
                    })),
                },
            },
            select: {
                id: true,
                verificationToken: true,
            },
        });

        return simulation as CreatedSimulationResponseDto;

    } catch (error) {
        console.error("Erreur lors de la sauvegarde de la simulation:", error);
        throw error;
    }
}


export async function updateSimulationWithSenderAndDestinataireIds(simulation: FullSimulationDto) {

    console.log("log ====> updateSimulationWithSenderAndDestinataireIds function called in src/services/backend-services/Bk_SimulationService.ts", simulation);
    try {
        const updatedSimulation = await prisma.envoi.update({
            where: {id: simulation.id},
            data: {
                userId: simulation.userId,
                destinataireId: simulation.destinataireId,
                simulationStatus: simulation.simulationStatus,
                envoiStatus: simulation.envoiStatus,
            }
        });

        if (!updatedSimulation) {
            return null;

        }
    } catch (error) {
        console.error('Error during Prisma simulation update:', error);
        throw new Error("Error updating simulation");
    }
}


export async function updateSimulation(simulation: SimulationResponseDto, simulationIdAndToken: CreatedSimulationResponseDto) {
    console.log("log ====> updateSimulation function called in src/services/backend-services/Bk_SimulationService.ts", simulation);
    try {

        if (!simulationIdAndToken) {
            throw new Error("Simulation ID and token not found");
        }

        if (!simulation) {
            throw new Error("Simulation not found");
        }

        if (!simulation.simulationStatus || !simulation.envoiStatus) {
            throw new Error("Simulation envoiStatus or envoiStatus not found");
        }

        await prisma.envoi.update({
            where: {
                id: Number(simulationIdAndToken.id),
                verificationToken: simulationIdAndToken.verificationToken
            },
            data: {
                envoiStatus: simulation.envoiStatus,
                simulationStatus: simulation.simulationStatus,
                paid: true
            }

        });
    } catch (error) {
        console.error("Error updating simulation", error);
        throw new Error("Error updating simulation");
    }
}
