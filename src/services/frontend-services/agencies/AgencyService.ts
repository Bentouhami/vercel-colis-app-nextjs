// path: src/services/frontend-services/agencies/AgencyService.ts


import {AgencyDto} from "@/services/dtos";
import {API_DOMAIN} from "@/utils/constants";
import axios from "axios";
import apiClient from "@/utils/axiosInstance";

export async function getAgenciesForAdmin({
                                              page = 1,
                                              limit = 10,
                                              search = '',
                                              sortKey = 'name',
                                              sortDir = 'asc',
                                          }: {
    page?: number;
    limit?: number;
    search?: string;
    sortKey?: keyof AgencyDto;
    sortDir?: 'asc' | 'desc';
}) {
    const url = `${API_DOMAIN}/agencies/admin-agencies?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search,
    )}&sortKey=${sortKey}&sortDir=${sortDir}`;

    const res = await axios.get(url, {
        headers: {'Content-Type': 'application/json', 'Cache-Control': 'no-cache'},
    });

    return res.data; // contient { data, total, page, totalPages }
}


export async function getAgenciesLight(params?: {
    countryId?: number;
    cityId?: number;
    search?: string;
}) {
    const res = await apiClient.get("/agencies/light", { params });
    return res.data as { id: number; name: string }[];
}
