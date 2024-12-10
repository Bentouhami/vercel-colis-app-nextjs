// path: src/services/dal/users/IUserDAO.ts


import {CreatedUserDto, CreateUserDto, UserDto} from "@/services/dtos/users/UserDto";

export interface IUserDAO {
    getAllUsers(): Promise<UserDto[]>;
    getUserById(id: number): Promise<UserDto | null>;
    createUser(newUser: CreateUserDto & { Address?: any }) : Promise<any | null>;
    updateUser(id: number, data: Partial<UserDto>): Promise<UserDto | null>;
    deleteUser(id: number): Promise<void>;
}