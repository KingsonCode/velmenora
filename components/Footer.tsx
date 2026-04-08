import Link from "next/link";
import { africaCountries } from "@/lib/countries";

export default function Footer() {
    return (
        <footer className="border-t border-[#1f2a36] bg-[#020617] text-gray-400 text-sm mt-20">

            {/* ================= MAIN GRID ================= */}
            <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* 🔥 BRAND + TRUST */}
                <div>
                    <h3 className="text-white text-lg font-semibold mb-4">
                        Velmenora
                    </h3>

                    <p className="leading-relaxed">
                        Helping traders across Africa find trusted forex brokers,
                        fast withdrawals, and powerful trading platforms.
                    </p>

                    {/* 🔥 TRUST BADGES */}
                    <div className="mt-6 flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="border border-white/10 px-3 py-1 rounded-full">
                            ✔ Verified Brokers
                        </span>
                        <span className="border border-white/10 px-3 py-1 rounded-full">
                            ✔ Fast Withdrawals
                        </span>
                        <span className="border border-white/10 px-3 py-1 rounded-full">
                            ✔ Low Spreads
                        </span>
                    </div>
                </div>

                {/* 🔥 COUNTRIES (SEO ENGINE) */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Top Markets</h4>

                    <div className="flex flex-col gap-2">
                        {africaCountries.slice(0, 6).map((c) => (
                            <Link
                                key={c.code}
                                href={`/${c.slug}`}
                                className="hover:text-white transition"
                            >
                                Trade in {c.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 🔥 QUICK LINKS */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Quick Links</h4>

                    <ul className="space-y-2">
                        <li>
                            <Link href="/" className="hover:text-white transition">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog" className="hover:text-white transition">
                                Blog
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog/best-brokers" className="hover:text-white transition">
                                Best Brokers
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* 🔥 LEGAL + CTA */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Legal</h4>

                    <ul className="space-y-2">
                        <li>
                            <Link href="/privacy-policy" className="hover:text-white transition">
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link href="/terms" className="hover:text-white transition">
                                Terms of Service
                            </Link>
                        </li>
                    </ul>

                    {/* 🔥 CTA INSIDE FOOTER */}
                    <div className="mt-6">
                        <Link
                            href="/compare"
                            className="block text-center bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:scale-105 transition-all"
                        >
                            Start Trading →
                        </Link>
                    </div>

                    {/* 🔥 EXTRA SEO LINK */}
                    <div className="mt-4">
                        <Link
                            href="/blog/forex-for-beginners"
                            className="text-xs hover:text-white transition"
                        >
                            Forex for Beginners
                        </Link>
                    </div>
                </div>

            </div>

            {/* ================= TRUST STRIP ================= */}
            <div className="border-t border-[#1f2a36] py-6 text-center text-xs text-gray-500 px-6">
                Trusted by traders across Africa • Independent broker reviews • Real withdrawal testing
            </div>

            {/* ================= DISCLAIMER ================= */}
            <div className="px-6 py-6 text-center text-xs text-gray-500 max-w-4xl mx-auto leading-relaxed">
                Trading forex involves significant risk and may not be suitable for all investors.
                Velmenora may receive commissions from affiliate partners. Always trade responsibly.
            </div>

            {/* ================= COPYRIGHT ================= */}
            <div className="text-center text-xs text-gray-600 pb-6">
                © {new Date().getFullYear()} Velmenora. All rights reserved.
            </div>

        </footer>
    );
}