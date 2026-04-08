/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        /* 🔥 FLEXIBLE + SCALABLE (IMPORTANT) */
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**", // 🔥 allow all HTTPS images (best for news apps)
            },

            /* (OPTIONAL - unaweza kubakiza hizi kama explicit whitelist) */
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "cdn.pixabay.com",
            },
            {
                protocol: "https",
                hostname: "finnhub.io",
            },
            {
                protocol: "https",
                hostname: "static01.nyt.com",
            },
            {
                protocol: "https",
                hostname: "media.cnn.com",
            },
            {
                protocol: "https",
                hostname: "gizmodo.com",
            },
            {
                protocol: "https",
                hostname: "*.gizmodo.com",
            },
        ],

        /* ⚡ PERFORMANCE */
        formats: ["image/avif", "image/webp"],

        /* 📏 RESPONSIVE BREAKPOINTS */
        deviceSizes: [640, 768, 1024, 1280, 1600],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

        /* 🚫 SECURITY */
        dangerouslyAllowSVG: false,

        /* ⚡ CACHE */
        minimumCacheTTL: 60,
    },

    /* 🔥 GENERAL OPTIMIZATION */
    reactStrictMode: true,

    experimental: {
        optimizeCss: true,
    },
};

module.exports = nextConfig;