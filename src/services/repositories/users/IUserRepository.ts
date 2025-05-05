// path: src/services/repositories/users/IUserRepository.ts

import {ProfileDto, RoleDto, UserLoginResponseDto, UserResponseDto} from "@/services/dtos";

export interface IUserRepository {
    findUserByEmail(email: string): Promise<UserLoginResponseDto | null>;
    getUserProfileById(userId: number): Promise<ProfileDto | null>;
    getAllUsers(): Promise<ProfileDto[] | null>;
    getUsersByAgencyAdmin(adminId: number): Promise<ProfileDto[] | null>;

}