/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
                pathname: '/**', // Autorise toutes les images de ce domaine
            },
        ],
    },
};

export default nextConfig;
