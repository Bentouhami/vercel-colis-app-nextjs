// path: src/app/api/v1/cities/[countryId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCitiesPerCountry } from "@/services/backend-services/Bk_CityService";

/**
 * @method GET
 * @route /api/v1/cities/[countryId]
 * @desc Get cities for a given country
 * @access public
 */
export async function GET(req: NextRequest, props: { params: Promise<{ countryId: string }> }) {
    const params = await props.params;
    try {
        // Vérification et conversion de `countryId`
        const countryId = parseInt(params.countryId, 10);

        if (isNaN(countryId)) {
            return NextResponse.json({ error: "Invalid country ID" }, { status: 400 });
        }

        const cities = await getCitiesPerCountry(countryId);

        if (!cities || cities.length === 0) {
            return NextResponse.json({ error: "No cities found" }, { status: 404 });
        }

        return NextResponse.json(cities, { status: 200 });
    } catch (error) {
        console.error("❌ Error in cities API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
