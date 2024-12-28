// path: src/services/mappers/AgencyMapper.ts

import {AgencyDto, AgencyResponseDto} from "@/services/dtos";
import {AddressMapper} from "@/services/mappers/AddressMapper";

export class AgencyMapper {
    /**
     * Maps raw agency data to AgencyResponseDto
     * @returns Mapped AgencyResponseDto
     * @param rawAgency
     */
    static toAgencyResponseDto(rawAgency: any): AgencyResponseDto | null {

        if (!rawAgency) {
            return null;
        }

        const {
            id,
            name,
            location,
            address,
            capacity,
            availableSlots,
        } = rawAgency;

        return {
            id,
            name,
            location,
            address: {
                street: address.street,
                number: address.number,
                city: address.city,
                zipCode: address.zipCode,
                country: address.country,
            },

            capacity,
            availableSlots,
        };
    }

    static toDto(agency: any): AgencyDto | null {
        if (!agency) {
            return null;
        }
        const {
            id,
            name,
            location,
            address,
            capacity,
            availableSlots,
        } = agency;

        return {
            id,
            name,
            location,
            address: AddressMapper.toDto(agency.address),
            addressId: agency.addressId as number,
            capacity,
            availableSlots,
        };
    }

}

