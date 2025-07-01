import { NextResponse } from 'next/server';
import { getApiDocs } from '@/utils/swagger';

// This endpoint serves the OpenAPI specification
export async function GET() {
  const spec = getApiDocs();
  return NextResponse.json(spec);
}