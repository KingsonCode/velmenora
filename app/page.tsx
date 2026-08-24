import type { Metadata } from "next";
import HomeShell from "@/components/home/HomeShell";


export const metadata: Metadata = {
  title: "Velmenora | Compare Forex Brokers & Trading Platforms",
  description:
    "Compare forex brokers, trading platforms, spreads, withdrawals, funded challenges, and practical trading education with Velmenora.",
  alternates: {
    canonical: "https://velmenora.com/",
  },
  openGraph: {
    title:
      "Velmenora | Compare Forex Brokers & Trading Platforms",
    description:
      "Independent forex broker comparisons, trading guides, market education, and funded challenge information.",
    url: "https://velmenora.com/",
    siteName: "Velmenora",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt:
          "Velmenora forex broker comparison and trading education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Velmenora | Compare Forex Brokers & Trading Platforms",
    description:
      "Independent forex broker comparisons, trading guides, and market education.",
    images: ["/og-image.jpg"],
  },
};

/* ================= ROOT HOMEPAGE ================= */
export default function Home() {
    return <HomeShell lang="en" />;
}