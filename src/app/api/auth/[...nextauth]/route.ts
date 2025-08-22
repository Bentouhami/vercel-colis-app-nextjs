// path: /api/auth/[...nextauth]
import { handlers } from "@/auth/auth-edge";

export const { GET, POST } = handlers;

// 🚀 Keep edge runtime for auth routes
export const runtime = "edge";
