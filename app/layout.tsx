import "./styles/globals.css";
import Script from "next/script";
import Analytics from "@/components/Analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-VMWD4KBDS7";

/* ✅ SEO METADATA (GLOBAL) */
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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                {/* 🔥 GOOGLE ANALYTICS (PRO SETUP) */}
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                    strategy="afterInteractive"
                />

                <Script id="gtag-init" strategy="afterInteractive">
                    {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());

            // ❗ Disable auto page view
            gtag('config', '${GA_ID}', {
              send_page_view: false
            });
          `}
                </Script>
            </head>

            <body className="bg-[#0B0F14] text-white">
                {/* 🔥 ROUTE TRACKING */}
                <Analytics />

                {/* 🔥 GLOBAL CONTAINER */}
                <div className="container">
                    {children}
                </div>
            </body>
        </html>
    );
}