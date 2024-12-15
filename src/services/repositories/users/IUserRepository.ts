// path: src/services/repositories/users/IUserRepository.ts

import {UserLoginResponseDto, UserResponseDto} from "@/services/dtos";

export interface IUserRepository {
    findUserByEmail(email: string): Promise<UserLoginResponseDto | null>;
}