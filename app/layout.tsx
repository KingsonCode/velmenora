import "./styles/globals.css";

export const metadata = {
    title: "Velmenora — Trade Smarter",
    description: "Access top brokers and smarter trading tools with Velmenora.",
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
            <body className="bg-[#0B0F14] text-white">

                {/* 🔥 GLOBAL CONTAINER */}
                <div className="container">
                    {children}
                </div>

            </body>
        </html>
    );
}