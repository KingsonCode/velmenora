import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

/* NAV + FOOTER */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* =========================
   FONTS
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
   SEO (PRO MAX)
========================= */
export const metadata: Metadata = {
    metadataBase: new URL("https://www.velmenora.com"),

    title: {
        default: "Velmenora — Best Forex Brokers in Tanzania",
        template: "%s | Velmenora",
    },

    description:
        "Compare the best forex brokers in Tanzania. Trade with verified platforms, fast withdrawals, and low spreads.",

    keywords: [
        "forex brokers Tanzania",
        "best forex brokers Africa",
        "Exness Tanzania",
        "XM broker review",
        "forex trading for beginners",
    ],

    /* 🔥 FAVICON */
    icons: {
        icon: "/logo.svg",
        shortcut: "/logo.svg",
        apple: "/logo.svg",
    },

    openGraph: {
        title: "Velmenora — Best Forex Brokers in Tanzania",
        description:
            "Find trusted forex brokers with fast withdrawals and low spreads.",
        url: "https://www.velmenora.com",
        siteName: "Velmenora",
        images: [
            {
                url: "/og-image.jpg", // 👉 add later
                width: 1200,
                height: 630,
                alt: "Velmenora Forex Platform",
            },
        ],
        locale: "en_US",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Velmenora — Best Forex Brokers",
        description:
            "Compare top forex brokers and trade safely.",
        images: ["/og-image.jpg"],
    },

    robots: {
        index: true,
        follow: true,
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
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* 🔥 PERFORMANCE BOOST */}
                <link rel="preconnect" href="https://www.googletagmanager.com" />
                <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
            </head>

            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#020617] text-white`}
            >
                <div className="flex flex-col min-h-screen">

                    {/* 🔝 NAVBAR */}
                    <Navbar />

                    {/* 🔥 MAIN CONTENT */}
                    <main className="flex-1 flex justify-center">
                        <div className="w-full max-w-7xl px-6">
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