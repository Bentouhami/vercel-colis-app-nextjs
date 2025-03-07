// path: src/services/repositories/addresses/IAddressRepository.ts

import {AgencyAddressDto, UserAddressDto} from "@/services/dtos";

export interface IAddressRepository {
    getAllUsersAddresses(): Promise<UserAddressDto | null>;
    getAllAgenciesAddresses(): Promise<AgencyAddressDto | null>;
    getUserAddressByUserId(userId : number) : Promise<UserAddressDto | null>;
    getAgencyAddressByAgencyId(agencyId : number) : Promise<AgencyAddressDto | null>;
    getAddressByStreetAndCityId (street: string, cityId: number) : Promise <void>;

}