/** @type {import('next').NextConfig} */
const nextConfig = {
    /* =========================
       IMAGES (OPTIMIZED)
    ========================= */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**", // 🔥 flexible (ok for now, later unaweza restrict)
            },

            /* OPTIONAL WHITELIST */
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "cdn.pixabay.com" },
            { protocol: "https", hostname: "finnhub.io" },
            { protocol: "https", hostname: "static01.nyt.com" },
            { protocol: "https", hostname: "media.cnn.com" },
            { protocol: "https", hostname: "gizmodo.com" },
            { protocol: "https", hostname: "*.gizmodo.com" },
        ],

        formats: ["image/avif", "image/webp"],

        deviceSizes: [640, 768, 1024, 1280, 1600],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

        dangerouslyAllowSVG: false,

        minimumCacheTTL: 60,
    },

    /* =========================
       REACT / PERFORMANCE
    ========================= */
    reactStrictMode: true,

    /* 🔥 REMOVE CONSOLE IN PROD */
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },

    /* =========================
       CRITICAL FIX (DO NOT TOUCH)
    ========================= */
    experimental: {
        optimizeCss: false, // ❗ fixes "require is not defined"
    },

    /* =========================
       OPTIONAL (ADVANCED CONTROL)
    ========================= */
    poweredByHeader: false, // hide Next.js fingerprint
    compress: true, // gzip compression
};

module.exports = nextConfig;