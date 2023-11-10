/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/.well-known/:path',
                destination: '/api/well-known',
            },
            {
                source: '/activitypub',
                destination: '/api/activitypub',
            },
            {
                source: '/activitypub/:path',
                destination: '/api/activitypub',
            }
        ]
    },
}

module.exports = nextConfig
