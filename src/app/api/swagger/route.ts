import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import YAML from 'yamljs';

export async function GET(req: NextRequest) {
  try {
    const yamlPath = path.join(process.cwd(), 'analyses', 'OpenAPI_ColisApp.yaml');
    const fileContents = fs.readFileSync(yamlPath, 'utf8');
    const swaggerDocument = YAML.parse(fileContents);

    return NextResponse.json(swaggerDocument);
  } catch (error) {
    console.error('Error serving Swagger JSON:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
