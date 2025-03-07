// path: src/services/repositories/users/IUserRepository.ts

import {ProfileDto, UserLoginResponseDto, UserResponseDto} from "@/services/dtos";

export interface IUserRepository {
    findUserByEmail(email: string): Promise<UserLoginResponseDto | null>;
    getUserProfileById(userId: number): Promise<ProfileDto | null>;

}