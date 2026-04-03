import "./styles/globals.css";
import Script from "next/script";
import Analytics from "@/components/Analytics";
import { Suspense } from "react";

const GA_ID =
    process.env.NEXT_PUBLIC_GA_ID || "G-VMWD4KBDS7";

/* =========================================================
   🔥 SEO METADATA (GLOBAL)
========================================================= */
export const metadata = {
    title: "Velmenora — Trade Smarter",
    description:
        "Access top brokers and smarter trading tools with Velmenora.",
    openGraph: {
        title: "Velmenora",
        description: "Trade Smarter. Grow Stronger.",
        url: "https://velmenora.com",
        siteName: "Velmenora",
    },
};

/* =========================================================
   🔥 ROOT LAYOUT
========================================================= */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                {/* 🔥 GOOGLE ANALYTICS SCRIPT */}
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                    strategy="afterInteractive"
                />

                {/* 🔥 GA INIT (SPA SAFE) */}
                <Script id="gtag-init" strategy="afterInteractive">
                    {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;

            gtag('js', new Date());

            // ❗ Disable auto page view (we handle it manually)
            gtag('config', '${GA_ID}', {
              send_page_view: false
            });
          `}
                </Script>
            </head>

            <body className="bg-[#0B0F14] text-white">
                {/* 🔥 ROUTE TRACKING (FIXED WITH SUSPENSE) */}
                <Suspense fallback={null}>
                    <Analytics />
                </Suspense>

                {/* 🔥 GLOBAL WRAPPER */}
                <div className="container">
                    {children}
                </div>
            </body>
        </html>
    );
}