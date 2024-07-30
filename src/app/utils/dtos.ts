

export interface CreateAddressDto {

    street: string;
    number: string;
    city: string;
    zipCode: string;
    country: string;
}
export interface UpdateAddressDto {

    street: string;
    number: string;
    city: string;
    zipCode: string;
    country: string;
}

export interface CreateUserDto {
    firstName : string;
    lastName : string;
    birthDate : string;
    gender : boolean;
    phoneNumber : string;
    email : string;
    password : string;
    confirmPassword : string;
    address : CreateAddressDto;
}

export interface UserResponseDto {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: boolean;
    phoneNumber: string;
    email: string;
    role: string;
}

export interface LoginUserDto {
    email: string;
    password: string;
}
//
// export interface UserResponseDto {
//     id: number;
//     email: string;
//     password: string;
// }