// E:\fullstack_project\NextJs_Projects\newColiApp\src\app\api\v1\agencies\light\route.ts

import { NextRequest, NextResponse } from "next/server";
import { getLightAgencies } from "@/services/backend-services/Bk_AgencyService";
import { AgencyDto } from "@/services/dtos"; // Import AgencyDto

type LightAgenciesQueryParams = {
    countryId?: number; // ID of the country
    cityId?: number; // ID of the city
    search?: string; // Search term for agency name
};

/**
 * Get light agencies list
 * @description Retrieves a lightweight list of agencies, filterable by country ID, city ID, and search term.
 * @params LightAgenciesQueryParams
 * @response 200:AgencyDto[]:Lightweight list of agencies
 * @response 500:{ error: string }:Failed to fetch agencies
 * @openapi
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const countryId = searchParams.get("countryId");
        const cityId = searchParams.get("cityId");
        const search = searchParams.get("search") || "";

        const agencies = await getLightAgencies({
            countryId: countryId ? Number(countryId) : undefined,
            cityId: cityId ? Number(cityId) : undefined,
            search: search || undefined,
        });

        return NextResponse.json(agencies);
    } catch (error) {
        console.error("Error in agencies/light route:", error);
        return NextResponse.json({ error: "Failed to fetch agencies" }, { status: 500 });
    }
}
