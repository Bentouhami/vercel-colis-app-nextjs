// path: src/services/mappers/SimulationMapper.ts

import {CreatedSimulationResponseDto, SimulationResponseDto, SimulationSummaryDto} from "@/services/dtos";
import {EnvoiStatusMapper, SimulationStatusMapper} from "@/services/mappers/enums";
import {Envoi as EnvoiPrisma} from "@prisma/client";


export class SimulationMapper {
    /**
     * Maps raw simulation data to SimulationRequestDto
     * @returns Mapped SimulationRequestDto
     * @param rawSimulation
     */
    static toSimulationResponseDto(rawSimulation: any): SimulationResponseDto | null {

        if (!rawSimulation) {
            return null;
        }
        console.log("log ====> rawSimulation in SimulationMapper.ts is : ", rawSimulation);

        //TODO: get the simulation object need to be mapped
        const {
            id,
            userId,
            destinataireId,
            departureAgency,
            arrivalAgency,
            parcels,
            totalWeight,
            totalVolume,
            totalPrice,
            departureDate,
            arrivalDate,
            simulationStatus,
            envoiStatus,
        } = rawSimulation;

        return {
            id,
            userId,
            destinataireId,
            departureAgency: departureAgency.name,
            destinationAgency: arrivalAgency.name,
            departureCountry: departureAgency.address?.country,
            destinationCountry: arrivalAgency.address?.country,
            departureCity: departureAgency.address?.city,
            destinationCity: arrivalAgency.address?.city,

            parcels: parcels.map((parcel: any) => ({
                height: Number(parcel.height),
                width: Number(parcel.width),
                length: Number(parcel.length),
                weight: Number(parcel.weight),
            })),
            totalWeight: Number(totalWeight),
            totalVolume: Number(totalVolume),
            totalPrice: Number(totalPrice),
            departureDate: new Date(departureDate),
            arrivalDate: new Date(arrivalDate),
            simulationStatus: SimulationStatusMapper.toDtoStatus(simulationStatus),
            envoiStatus: EnvoiStatusMapper.toDtoStatus(envoiStatus),

        };
    }

    /**
     * map the envoi prisma to created simulation response dto
     * @param simulation
     */
    static toCreatedSimulationResponseDto(simulation: EnvoiPrisma): CreatedSimulationResponseDto {

        return {
            id: simulation.id,
            verificationToken: simulation.verificationToken,
        };
    }

    /**
     * map envoi prisma to simulation summary dto
     * @param simulation
     */
    static toSimulationSummaryDto(simulation: EnvoiPrisma): SimulationSummaryDto {
        const {
            id,
            transportId,
            simulationStatus,
            envoiStatus,
            totalWeight,
            totalVolume,
            totalPrice,
            departureDate,
            arrivalDate
        } = simulation;

        return {
            id,
            transportId,
            simulationStatus: SimulationStatusMapper.toDtoStatus(simulationStatus),
            envoiStatus: EnvoiStatusMapper.toDtoStatus(envoiStatus),
            totalWeight : Number(totalWeight),
            totalVolume : Number(totalVolume),
            totalPrice : Number(totalPrice),
            departureDate,
            arrivalDate
        }

    }
}