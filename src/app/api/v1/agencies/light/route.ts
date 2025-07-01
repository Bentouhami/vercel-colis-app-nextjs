// E:\fullstack_project\NextJs_Projects\newColiApp\src\app\api\v1\agencies\light\route.ts

import { NextRequest, NextResponse } from "next/server";
import { getLightAgencies } from "@/services/backend-services/Bk_AgencyService";

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
