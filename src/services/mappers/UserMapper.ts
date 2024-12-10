// path: src/services/mappers/UserMapper.ts
import {User as PrismaUser} from '@prisma/client'
import {CreatedUserDto, FullUserResponseDto, UserDto, UserLoginResponseDto} from '@/services/dtos/users/UserDto'
import {RoleMapper} from "@/services/mappers/enums/RoleMapper";
import {AddressMapper} from "@/services/mappers/AddressMapper";

export class UserMapper {
    // Map Prisma User to UserDto
    static toDto(user: PrismaUser & { Address?: any }): UserDto {
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
            Address: AddressMapper.toDto(user.Address),
        }
    }

    // Map Prisma User to Full User Response DTO
    static toFullUserResponseDto(user: PrismaUser & { Address?: any }): FullUserResponseDto {
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
            Address: AddressMapper.toCreatedAddressDto(user.Address),
        }
    }

    // Map Prisma User to Created User DTO
    static toCreatedUserDto(user: PrismaUser & { Address?: any }): CreatedUserDto {
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
            addressId: user.addressId || 0,
            Address: AddressMapper.toDto(user.Address),
        }
    }

    // Map Prisma User to Login Response DTO
    static toLoginResponseDto(user: PrismaUser): UserLoginResponseDto {
        return {
            id: user.id,
            email: user.email,
            password: user.password || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            name: user.name || '',
            phoneNumber: user.phoneNumber || '',
            image: user.image,
            roles: RoleMapper.toRolesEnum(user.roles),
            isVerified: user.isVerified || false,
            emailVerified: user.emailVerified,
            verificationToken: user.verificationToken,
            verificationTokenExpires: user.verificationTokenExpires
        }
    }

    // Map multiple users to DTOs
    static toDtos(users: PrismaUser[]): UserDto[] {
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
}