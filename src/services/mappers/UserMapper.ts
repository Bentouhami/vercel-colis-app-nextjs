// path: src/services/mappers/UserMapper.ts
import {User as UserPrisma} from '@prisma/client'
import {FullUserResponseDto, ProfileDto, UserDto, UserLoginResponseDto} from '@/services/dtos/users/UserDto'
import {RoleMapper} from "@/services/mappers/enums/RoleMapper";
import {AddressMapper} from "@/services/mappers/AddressMapper";

import {Address as AddressPrisma} from "@prisma/client";
import {AddressResponseDto} from "@/services/dtos";


export class UserMapper {
    // Map Prisma User to UserDto
    static toDto(user: UserPrisma): UserDto {
        return {
            id: user.id,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            name: user.name || '',
            birthDate: user.birthDate || new Date(),
            email: user.email,
            phoneNumber: user.phoneNumber || '',
            image: user.image,
            roles: RoleMapper.toRolesEnum(user.roles), // Assuming Roles enum is imported
            isVerified: user.isVerified || false,
            emailVerified: user.emailVerified || new Date(),
            verificationToken: user.verificationToken || '',
            verificationTokenExpires: user.verificationTokenExpires || new Date(),
            addressId: user.addressId || 0,
            // address: AddressMapper.toDto(user.Address) as AddressResponseDto,
            // Note: Address mapping would be done separately if needed
        }
    }

    // Map Prisma User to Full User Response DTO
    static toFullUserResponseDto(user: UserPrisma & { Address: AddressPrisma }): FullUserResponseDto {
        return {
            id: user.id,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            name: user.name || '',
            birthDate: user.birthDate || new Date(),
            email: user.email,
            phoneNumber: user.phoneNumber || '',
            image: user.image,
            roles: RoleMapper.toRolesEnum(user.roles), // Assuming Roles enum is imported
            isVerified: user.isVerified || false,
            emailVerified: user.emailVerified || new Date(),
            verificationToken: user.verificationToken || '',
            verificationTokenExpires: user.verificationTokenExpires || new Date(),
            address: AddressMapper.toDto(user.Address),
        }
    }

    // Map Prisma User to Login Response DTO
    static toLoginResponseDto(user: UserPrisma & { Address?: AddressPrisma }): UserLoginResponseDto | null {
        console.log("log ====> user in toLoginResponseDto function called in path: src/services/mappers/UserMapper.ts", user)
        if (!user) {
            return null;
        }
        const userDto = {
            id: (user.id).toString(),
            email: user.email,
            password: user.password || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            name: user.name || '',
            phoneNumber: user.phoneNumber || '',
            image: user.image,
            roles: RoleMapper.toRolesEnum(user.roles),
            Address: AddressMapper.toResponseDto(user.Address!),
            isVerified: user.isVerified || false,
            emailVerified: user.emailVerified,
            verificationToken: user.verificationToken,
            verificationTokenExpires: user.verificationTokenExpires
        };

        console.log("log ====> userDto in toLoginResponseDto function called in path: src/services/mappers/UserMapper.ts", userDto)
        return userDto;
    }

    // Map multiple users to DTOs
    static toDtos(users: UserPrisma[]): UserDto[] {
        return users.map(this.toDto)
    }

    // Create DTO to Prisma User creation input
    static toCreateInput(createDto: Partial<UserDto>) {
        return {
            firstName: createDto.firstName,
            lastName: createDto.lastName,
            name: createDto.name,
            birthDate: createDto.birthDate,
            email: createDto.email,
            phoneNumber: createDto.phoneNumber,
            password: createDto.password,
            image: createDto.image,
            roles: createDto.roles
                ? RoleMapper.toPrismaRoles(createDto.roles)
                : undefined,
            isVerified: createDto.isVerified,
            emailVerified: createDto.emailVerified,
            verificationToken: createDto.verificationToken,
            verificationTokenExpires: createDto.verificationTokenExpires,
            addressId: createDto.addressId
        }
    }

    static toUserProfile(user: UserPrisma & { Address?: AddressPrisma }): ProfileDto {
        return {
            id: user.id!,
            firstName: user?.firstName!,
            lastName: user.lastName!,
            name: user.name!,
            birthDate: user.birthDate!,
            email: user.email!,
            phoneNumber: user.phoneNumber!,
            image: user.image || null,
            roles: RoleMapper.toRolesEnum(user.roles),
            Address: AddressMapper.toResponseDto(user.Address!),
            isVerified: user.isVerified || false,
        };
    }
}