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
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

/* =========================
   SEO (UPDATED FOR FOREX)
========================= */
export const metadata: Metadata = {
    title: {
        default: "Velmenora — Best Forex Brokers in Tanzania",
        template: "%s | Velmenora",
    },
    description:
        "Compare the best forex brokers in Tanzania. Trade with verified platforms, fast withdrawals, and low spreads.",
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
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#020617] text-white`}
            >
                <div className="flex flex-col min-h-screen">

                    {/* 🔥 NAVBAR (FULL WIDTH) */}
                    <Navbar />

                    {/* 🔥 MAIN (GLOBAL CENTER FIX) */}
                    <main className="flex-1 flex justify-center">
                        <div className="w-full max-w-7xl px-6">
                            {children}
                        </div>
                    </main>

                    {/* 🔻 FOOTER */}
                    <Footer />

                </div>

                {/* ✅ GOOGLE ANALYTICS */}
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
              anonymize_ip: true
            });
          `}
                </Script>
            </body>
        </html>
    );
}