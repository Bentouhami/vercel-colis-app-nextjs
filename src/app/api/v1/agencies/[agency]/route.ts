// path: src/app/api/v1/agencies/[agency]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { findAgencyByName } from '@/services/backend-services/Bk_AgencyService'

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ agency: string }> }
) {
    try {
        const { agency } = await params
        const decodedAgency = decodeURIComponent(agency)
        const result = await findAgencyByName(decodedAgency)

        if (!result) {
            return NextResponse.json({ error: 'Agency not found' }, { status: 404 })
        }

        return NextResponse.json({ agencyId: result.id })
    } catch (error) {
        console.error('Error in GET /agencies/[agency]:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
