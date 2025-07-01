import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
                pathname: '/**',
            },
        ],
    },

    // Nouvelle section pour Turbopack (équivalent de Webpack config.watchOptions.ignored)
    turbopack: {
        // root: path.resolve(__dirname),
        rules: {},
        resolveAlias: {},
        resolveExtensions: [
            '.tsx', '.ts', '.jsx', '.js', '.json'
        ],
        // ⚠️ Il n'y a pas d'équivalent direct pour `watchOptions.ignored` dans Turbopack pour l'instant.
        // Turbopack gère automatiquement les dossiers à ignorer comme node_modules, .git, etc.
    },
};

export default nextConfig;