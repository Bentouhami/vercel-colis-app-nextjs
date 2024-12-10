// path: src/services/dal/addresses/IAddressDAO.ts

import {CreateAddressDto, CreatedAddressDto, FoundAddressDto, UpdateAddressDto} from "@/services/dtos";

export interface IAddressDAO {
    getAllAddresses(): Promise<FoundAddressDto[]>;
    getAddressById(id: number): Promise<FoundAddressDto | null>;
    createAddress(data: CreateAddressDto): Promise<CreatedAddressDto>;
    updateAddress(id: number, data: Partial<UpdateAddressDto>): Promise<UpdateAddressDto | null>;
    deleteAddress(id: number): Promise<void>;
}

