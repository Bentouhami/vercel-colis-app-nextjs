// path: src/services/mappers/user.mapper.ts

import {ProfileDto, RoleDto, UserAddressDto} from "@/services/dtos";

export function mapUserToProfileDto(user: any): ProfileDto {
    const pivot = user.userAddresses?.[0];
    const address: UserAddressDto = {
        id: pivot?.address?.id ?? 0,
        street: pivot?.address?.street ?? '',
        complement: pivot?.address?.complement ?? undefined,
        streetNumber: pivot?.address?.streetNumber ?? undefined,
        boxNumber: pivot?.address?.boxNumber ?? undefined,
        cityId: pivot?.address?.cityId ?? 0,
        city: pivot?.address?.city,
    };

    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        name: user.name ? `${user.lastName} ${user.firstName}` : '',
        birthDate: user.birthDate!,
        phoneNumber: user.phoneNumber ?? '',
        userAddresses: address,
        image: user.image ?? null,
        role: user.role as RoleDto,
        isVerified: user.isVerified || false,
    };
}
