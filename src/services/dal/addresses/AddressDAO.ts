import {CreateAddressDto, CreatedAddressDto, FoundAddressDto, UpdateAddressDto} from "@/services/dtos";
import {IAddressDAO} from "@/services/dal/addresses/IAddressDAO";
import prisma from "@/utils/db";
import {AddressMapper} from "@/services/mappers/AddressMapper";

export class AddressDAO implements IAddressDAO {
    createAddress(data: CreateAddressDto): Promise<CreatedAddressDto> {
        const createdAddress = prisma.address.create({
            data
        });

        return  AddressMapper.toCreatedAddressDto(createdAddress) ;
    }

    deleteAddress(id: number): Promise<void> {
        return Promise.resolve(undefined);
    }

    getAddressById(id: number): Promise<FoundAddressDto | null> {
        return Promise.resolve(undefined);
    }

    getAllAddresses(): Promise<FoundAddressDto[]> {
        return Promise.resolve([]);
    }

    updateAddress(id: number, data: Partial<UpdateAddressDto>): Promise<UpdateAddressDto | null> {
        return Promise.resolve(undefined);
    }



}