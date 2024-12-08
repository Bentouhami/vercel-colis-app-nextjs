// path: src/services/backend-services/simulationService.ts
'use server';
import {
    BaseSimulationDto,
    CreatedSimulationResponseDto,
    CreateParcelDto,
    EnvoiStatus,
    FullSimulationDto,
    SimulationDto,
    SimulationStatus
} from "@/services/dtos";
import prisma from "@/utils/db";
import {getAgencyById} from "@/services/backend-services/AgencyService";
import {generateTrackingNumber} from "@/utils/generateTrackingNumber";

export async function getSimulationByIdAndToken(id: number, verificationToken: string): Promise<SimulationDto | null> {

    console.log("log ====> getSimulationById function called in path: src/services/backend-services/simulation/SimulationService.ts", "simulationId: ", id, "verificationToken: ", verificationToken);

    try {

        // 1. Get simulation by ID and verification token
        const simulation = await prisma.envoi.findUnique({
            where: {
                id,
                verificationToken,
            },
            include: { // Include all related data
                // user: true,
                arrivalAgency: true,
                departureAgency: true, //
                parcels: true
            }
        });

        if (!simulation) {
            return null;
        }

        console.log("log ====> simulation found in getSimulationByIdAndToken function: ", simulation);

        // 2. get departed date city, country and agency name from simulation by agencyId
        const departureAgency = await getAgencyById(simulation.departureAgencyId);

        // 3. get arrived date city, country and agency name from simulation by agencyId
        const arrivalAgency = await getAgencyById(simulation.arrivalAgencyId);

        // 4. prepare needed data for simulation calculation and status
        if (!departureAgency || !arrivalAgency) {
            return null;
        }

        // prepare parcels as CreateParcelDto[] for simulationDto
        // Map the parcels array to CreateParcelDto format
        const parcels: CreateParcelDto[] = simulation.parcels.map((parcel: any) => ({
            height: parcel.height,
            width: parcel.width,
            length: parcel.length,
            weight: parcel.weight,
        }));

        const simulationDto: SimulationDto = {
            userId: simulation.userId,
            destinataireId: simulation.destinataireId,
            departureCountry: departureAgency.address.country ?? null, // Handle undefined
            departureCity: departureAgency.address.city ?? null, // Handle undefined
            departureAgency: departureAgency.name ?? null, // Handle undefined
            destinationCountry: arrivalAgency.address.country ?? null, // Handle undefined
            destinationCity: arrivalAgency.address.city ?? null, // Handle undefined
            destinationAgency: arrivalAgency.name ?? null, // Handle undefined
            parcels,
            simulationStatus: simulation.simulationStatus as SimulationStatus | null,
            status: simulation.status as EnvoiStatus | null,
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

export async function saveSimulation(simulationData: BaseSimulationDto): Promise<CreatedSimulationResponseDto | null> {
    try {
        console.log("log ====> simulationData in saveSimulation function called in src/services/backend-services/simulationService.ts: ", simulationData);
        // Ensure all required string fields have default values if null

        //  get departed date city, country and agency name from simulation by agencyId

        if (!simulationData.departureAgencyId) {
            return null;
        }
        const departureAgency = await getAgencyById(simulationData.departureAgencyId);

        // 3. get arrived date city, country and agency name from simulation by agencyId
        if (!simulationData.arrivalAgencyId) {
            return null;
        }
        const arrivalAgency = await getAgencyById(simulationData.arrivalAgencyId);

        // 4. prepare needed data for simulation calculation and status
        if (!departureAgency || !arrivalAgency) {
            return null;
        }

        console.log("log ====> departureAgency in saveSimulation function called in src/services/backend-services/simulationService.ts: ", departureAgency);
        console.log("log ====> arrivalAgency in saveSimulation function called in src/services/backend-services/simulationService.ts: ", arrivalAgency);

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

        console.log("log ====> trackingNumber in saveSimulation function called in src/services/backend-services/simulationService.ts: ", trackingNumber);

        const simulation = await prisma.envoi.create({
            data: {
                trackingNumber: trackingNumber,
                departureAgencyId: simulationData.departureAgencyId,
                arrivalAgencyId: simulationData.arrivalAgencyId,
                simulationStatus: simulationData.simulationStatus,
                status: simulationData.status,
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

    console.log("log ====> updateSimulationWithSenderAndDestinataireIds function called in src/services/backend-services/simulationService.ts", simulation);
    try {
        const updatedSimulation = await prisma.envoi.update({
            where: {id: simulation.id},
            data: {
                userId: simulation.userId,
                destinataireId: simulation.destinataireId,
                simulationStatus: simulation.simulationStatus,
                status: simulation.status,
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


export async function updateSimulation(simulation: SimulationDto, simulationIdAndToken: CreatedSimulationResponseDto) {
    console.log("log ====> updateSimulation function called in src/services/backend-services/simulationService.ts", simulation);
    try {

        if (!simulationIdAndToken) {
            throw new Error("Simulation ID and token not found");
        }

        if (!simulation) {
            throw new Error("Simulation not found");
        }

        if (!simulation.simulationStatus || !simulation.status) {
            throw new Error("Simulation status or status not found");
        }

        await prisma.envoi.update({
            where: {
                id: Number(simulationIdAndToken.id),
                verificationToken: simulationIdAndToken.verificationToken
            },
            data: {
                status: simulation.status,
                simulationStatus: simulation.simulationStatus,
                paid: true
            }

        });
    } catch (error) {
        console.error("Error updating simulation", error);
        throw new Error("Error updating simulation");
    }
}
