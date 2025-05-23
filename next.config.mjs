// path: next.config.mjs

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
    webpack: (config, { isServer }) => {
        // Ignore problematic directories
        config.watchOptions = {
            ...config.watchOptions,
            ignored: [
                '**/node_modules',
                '**/.git',
                '**/Application Data',
                '**/AppData',
            ],
        };
        return config;
    },
};

export default nextConfig;
