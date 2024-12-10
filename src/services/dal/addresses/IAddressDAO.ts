// path: src/services/dal/addresses/IAddressDAO.ts

import {AddressDto} from "@/services/dtos";

export interface IAddressDAO {
    getAllAddresses() : Promise<any[]>;
}

