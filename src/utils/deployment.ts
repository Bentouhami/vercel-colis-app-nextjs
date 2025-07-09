// Utility functions for production deployment
export const isProduction = process.env.NODE_ENV === "production"
export const isDevelopment = process.env.NODE_ENV === "development"

// Vercel-specific environment checks
export const isVercelDeployment = !!process.env.VERCEL
export const isVercelPreview = process.env.VERCEL_ENV === "preview"
export const isVercelProduction = process.env.VERCEL_ENV === "production"

// Database connection optimization for Vercel
export const getOptimalConnectionString = () => {
    if (isVercelDeployment) {
        // Use connection pooling for Vercel
        return process.env.DATABASE_URL
    }
    return process.env.DATABASE_URL
}

// Logging configuration for production
export const shouldLogInProduction = (pathname: string) => {
    if (!isProduction) return true

    // Only log important events in production
    return pathname.startsWith("/admin") || pathname.startsWith("/client/auth/") || pathname === "/"
}
