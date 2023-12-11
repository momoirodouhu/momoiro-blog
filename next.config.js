/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/.well-known/:path',
                destination: '/api/well-known',
            }
        ]
    },
}

module.exports = nextConfig
