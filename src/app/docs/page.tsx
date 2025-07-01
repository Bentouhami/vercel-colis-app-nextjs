'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import Link from 'next/link';

export default function ApiDocs() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    // Fetch the OpenAPI specification from the API
    fetch('/api/docs')
      .then((response) => response.json())
      .then((data) => setSpec(data))
      .catch((error) => console.error('Error loading API docs:', error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">ColiApp API Documentation</h1>
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Back to Application
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {spec ? (
          <div className="bg-white shadow rounded-lg p-6">
            <SwaggerUI spec={spec} />
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 bg-white shadow rounded-lg">
            <p className="text-lg">Loading API documentation...</p>
          </div>
        )}
      </main>

      {/* Footer with instructions */}
      <footer className="bg-white shadow-sm mt-8 py-6">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4">How to Document API Endpoints</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="mb-2">To document additional API endpoints, add JSDoc comments to your route handlers:</p>
            <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto text-sm">
              {`/**
 * @swagger
 * /your-endpoint:
 *   get:
 *     summary: Brief description
 *     description: Detailed description
 *     tags: [Category]
 *     parameters:
 *       - name: paramName
 *         in: query
 *         description: Parameter description
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 property:
 *                   type: string
 */
export async function GET(req) {
  // Your implementation
}`}
            </pre>
          </div>
        </div>
      </footer>
    </div>
  );
}
