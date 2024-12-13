// path: src/services/mappers/SimulationMapper.ts

import {SimulationResponseDto} from "@/services/dtos";
import {EnvoiStatusMapper, SimulationStatusMapper} from "@/services/mappers/enums";


export class SimulationMapper {
    /**
     * Maps raw simulation data to SimulationRequestDto
     * @returns Mapped SimulationRequestDto
     * @param rawSimulation
     */
    static toSimulationRequestDto(rawSimulation: any): SimulationResponseDto | null {

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
                volume: Number(parcel.volume),
                price: Number(parcel.price),
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

}