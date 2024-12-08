// Agency Mapper
import {Address, Agency} from "@prisma/client";
import {AgencyDto} from "@/services/dtos";
import {AddressMapper} from "@/services/mappers/AddressMapper";

export class AgencyMapper {
    static toDto(agency: Agency & { address?: Address }): AgencyDto {
        return {
            id: agency.id,
            name: agency.name,
            location: agency.location || undefined,
            addressId: agency.addressId,
            address: agency.address ? AddressMapper.toDto(agency.address) : undefined,
            capacity: agency.capacity,
            availableSlots: agency.availableSlots
        };
    }
}