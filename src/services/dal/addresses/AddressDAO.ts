import {IAddressDAO} from "@/services/dal/addresses/IAddressDAO";
import prisma from "@/utils/db";
import {CreateAddressDto} from "@/services/dtos";

export class AddressDAO implements IAddressDAO {

    async getAllAddresses() {
        return await prisma.address.findMany();
    }

    async createAddress(address: CreateAddressDto) {

        const addressCreated = await prisma.address.create({
            data: {
                street: address.street,
                number: address.number,
                city: address.city,
                zipCode: address.zipCode,
                country: address.country,
            }
        });

        return addressCreated;

    }

    async findAddressByFields(address: CreateAddressDto) {
        try {
            const addressFound = await prisma.address.findFirst({
                where: {
                    street: address.street,
                    number: address.number,
                    city: address.city,
                    zipCode: address.zipCode,
                    country: address.country,
                }
            });
            if (!addressFound) {
                return null;
            }
            return addressFound;
        } catch (error) {
            console.error("Error finding address by fields:", error);
            throw error;
        }

    }
}