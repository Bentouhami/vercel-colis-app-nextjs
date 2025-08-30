// path: src/app/api/v1/countries/all/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAllCountries } from "@/services/backend-services/Bk_CountryService";

/**
 * Get all countries
 * @description Retrieves a list of all countries in the system.
 * @response 200:CountryDto[]:List of all countries
 * @response 404:{ error: string }:No countries found
 * @response 405:{ error: string }:Method not allowed
 * @response 500:{ error: string }:Internal server error
 * @openapi
 */
export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const countries = await getAllCountries();

    if (!countries) {
      return NextResponse.json(
        { error: "No countries found" },
        { status: 404 }
      );
    }
    return NextResponse.json(countries, { status: 200 });
  } catch (error) {
    console.error("Erreur dans l'API countries:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
