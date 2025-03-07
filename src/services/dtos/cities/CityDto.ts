// path: src/services/dtos/cities/CityDto.ts

// -------------------- City DTOs --------------------

import {CountryDto} from "@/services/dtos/countries/CountryDto";

export interface CityDto {
    id: number;
    name: string;
    country: CountryDto;
}