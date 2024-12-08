// path: src/services/dal/users/IUserDAO.ts


import {CreateUserDto, FullUserDto, UserDto} from "@/services/dtos/users/UserDto";

export interface IUserDAO {
    getAllUsers(): Promise<UserDto[]>;
    getUserById(id: number): Promise<UserDto | null>;
    createUser(data: FullUserDto): Promise<void>;
    updateUser(id: number, data: Partial<UserDto>): Promise<UserDto | null>;
    deleteUser(id: number): Promise<void>;
}