// path: src/backend-services/AddressService.ts
'use server';
import {
    AddressDto,
    CreateAddressDto,
    CreatedAddressDto,

} from "@/services/dtos";
import {AddressDAO} from "@/services/dal/addresses/AddressDAO";
import {AddressMapper} from "@/services/mappers/AddressMapper";

// get instance of AddressDAO
let addressDAO = new AddressDAO();

/**
 * Check if address already exists in the database by street, number, city, zipCode and country fields
 * @param address - address object
 * @returns {Promise<UpdateAddressDto | null>} address or null
 */
export async function isAddressAlreadyExist(address: CreateAddressDto): Promise<CreatedAddressDto | null> {
    try {
        const addressFound = await addressDAO.findAddressByFields(address);

        if (!addressFound) {
            return null;
        }

        console.log("addressFound returned from findAddressByFields function in path: src/services/backend-services/AddressService.ts: ", addressFound);

        return AddressMapper.toFoundAddressDto(addressFound);

    } catch (error) {
        console.error("Error checking address:", error);
        throw error;
    }
}

/**
 * Create address in the database
 * @param address - address object
 * @param address
 * @returns {Promise<UpdateAddressDto | null>} address or null
 */
export async function createAddress(address: CreateAddressDto): Promise<CreatedAddressDto | null> {
    try {

        const createdAddress = await addressDAO.createAddress(address);

        if (!createdAddress) {
            return null;
        }
        const mappedAddress = AddressMapper.toCreatedAddressDto(createdAddress);

        return mappedAddress;

    } catch (error) {
        console.error("Error creating address:", error);
        throw error;
    }
}

export async function getAllAddresses(): Promise<AddressDto[]> {
    try {
        const addresses = await addressDAO.getAllAddresses();
        return AddressMapper.toAddressesDtos(addresses);
    } catch (error) {
        console.error("Error getting all addresses:", error);
        throw error;
    }
}