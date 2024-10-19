// path: src/services/address/AddresseService.ts


import {CreateAddressDto} from "@/utils/dtos";
import prisma from "@/utils/db";

export async function isAddressAlreadyExist(address: CreateAddressDto) {
    return await prisma.address.findFirst({
        where: {
            street: address.street,
            number: address.number,
            city: address.city,
            zipCode: address.zipCode,
            country: address.country
        }
    });
}


export async function createAddress(address: CreateAddressDto) {
    return await prisma.address.create({
        data: address
    });
}