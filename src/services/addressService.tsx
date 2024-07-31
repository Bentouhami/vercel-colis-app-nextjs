import prisma from "@/app/utils/db";

export async function getDistinctCities() {
    const cities = await prisma.address.groupBy({
        by: ["city"],
        _count: {
            _all: true
        }
    });
    return cities;
}