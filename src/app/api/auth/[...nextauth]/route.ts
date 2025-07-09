// path: /api/auth/[...nextauth]
import { handlers } from "@/auth/auth"

export const { GET, POST } = handlers

// Enable edge runtime for better performance
export const runtime = "edge"

