// path: src/services/repositories/addresses/IAddressRepository.ts

import {AddressDto, AgencyAddressDto, CreateAddressDto, UpdateAddressDto, UserAddressDto} from "@/services/dtos";
import {FrontendAddressType} from "@/utils/validationSchema";

export interface IAddressRepository {
    createAddress (addressData : FrontendAddressType) : Promise <AddressDto | null>;
    updateAddress (addressData : UpdateAddressDto) : Promise <AddressDto | null>;
    getAddressByStreetAndCityId (street: string, cityId: number) : Promise <AddressDto | null>;
    deleteAddress (addressId : number) : Promise <void>;

}