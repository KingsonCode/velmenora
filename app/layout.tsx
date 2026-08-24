import VelmenoraSitewideJsonLd from "@/components/seo/VelmenoraSitewideJsonLd";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RefCapture from "@/components/affiliate/RefCapture";

/* =========================
   FONTS (OPTIMIZED)
========================= */
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

/* =========================
   SEO (UPGRADED)
========================= */
const IS_INDEXABLE_DEPLOYMENT =
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV !== "preview" &&
    process.env.VERCEL_ENV !== "development";

export const metadata: Metadata = {
    metadataBase: new URL("https://velmenora.com"),

    title: {
        default: "Velmenora — Best Forex Brokers in Africa",
        template: "%s | Velmenora",
    },

    description:
        "Compare the best forex brokers in Africa. Trade with trusted platforms, low spreads, and fast withdrawals.",

    keywords: [
        "forex brokers Africa",
        "best forex brokers",
        "Exness review",
        "XM broker",
        "forex trading beginners",
    ],

    icons: {
        icon: "/logo.svg",
        shortcut: "/logo.svg",
        apple: "/logo.svg",
    },

    openGraph: {
        title: "Velmenora — Best Forex Brokers",
        description:
            "Find top forex brokers with fast withdrawals and low spreads.",
        url: "https://velmenora.com",
        siteName: "Velmenora",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Velmenora",
            },
        ],
        locale: "en_US",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Velmenora — Best Forex Brokers",
        description:
            "Compare forex brokers and trade safely.",
        images: ["/og-image.jpg"],
    },

    robots: {
        index: IS_INDEXABLE_DEPLOYMENT,
        follow: IS_INDEXABLE_DEPLOYMENT,
    },
};

/* =========================
   ROOT LAYOUT
========================= */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            data-scroll-behavior="smooth"
            suppressHydrationWarning
        >
            <head>
                {/* 🔥 PERFORMANCE BOOST */}
                <link rel="preconnect" href="https://www.googletagmanager.com" />
                <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

                {/* 🔥 PRELOAD (OPTIONAL FUTURE HERO IMAGE) */}
                {/* <link rel="preload" as="image" href="/hero.jpg" /> */}
            </head>

            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#020617] text-white`}
            >
                <VelmenoraSitewideJsonLd />
                <RefCapture />
                <div className="flex flex-col min-h-screen">

                    {/* 🔝 NAVBAR */}
                    <Navbar />

                    {/* 🔥 MAIN CONTENT (WIDER + BETTER) */}
                    <main className="flex-1 w-full">
                        <div className="max-w-7xl mx-auto px-6">
                            {children}
                        </div>
                    </main>

                    {/* 🔻 FOOTER */}
                    <Footer />
                </div>

                {/* =========================
           GOOGLE ANALYTICS (CLEAN)
        ========================= */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-VMWD4KBDS7"
                    strategy="afterInteractive"
                />

                <Script id="gtag-init" strategy="afterInteractive">
                    {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;

            gtag('js', new Date());
            gtag('config', 'G-VMWD4KBDS7', {
              anonymize_ip: true,
              page_path: window.location.pathname,
            });
          `}
                </Script>

            </body>
        </html>
    );
}