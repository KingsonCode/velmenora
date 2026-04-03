import Link from "next/link";
import { africaCountries } from "@/lib/countries";

export default function Footer() {
    return (
        <footer className="border-t border-[#1f2a36] bg-[#020617] text-gray-400 text-sm mt-20">

            <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* 🔥 BRAND */}
                <div>
                    <h3 className="text-white font-semibold mb-3">Velmenora</h3>
                    <p>
                        Helping traders across Africa find trusted forex brokers, fast withdrawals,
                        and powerful trading platforms.
                    </p>
                </div>

                {/* 🔥 COUNTRIES (SEO GOLD) */}
                <div>
                    <h4 className="text-white font-semibold mb-3">Top Countries</h4>
                    <div className="flex flex-col gap-2">
                        {africaCountries.slice(0, 6).map((c) => (
                            <Link key={c.code} href={`/${c.slug}`} className="hover:text-white">
                                Trade in {c.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 🔥 QUICK LINKS */}
                <div>
                    <h4 className="text-white font-semibold mb-3">Quick Links</h4>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/" className="hover:text-white">Home</Link>
                        </li>
                        <li>
                            <Link href="/blog" className="hover:text-white">Blog</Link>
                        </li>
                        <li>
                            <Link href="/blog/best-brokers" className="hover:text-white">
                                Best Brokers
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* 🔥 LEGAL + SEO */}
                <div>
                    <h4 className="text-white font-semibold mb-3">Legal</h4>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/privacy-policy" className="hover:text-white">
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link href="/terms" className="hover:text-white">
                                Terms of Service
                            </Link>
                        </li>
                    </ul>

                    {/* EXTRA SEO LINKS */}
                    <div className="mt-4 flex flex-col gap-2">
                        <Link href="/blog/forex-for-beginners" className="hover:text-white">
                            Forex for Beginners
                        </Link>
                    </div>
                </div>

            </div>

            {/* 🔥 DISCLAIMER (CRITICAL FOR FOREX AFFILIATE) */}
            <div className="border-t border-[#1f2a36] px-6 py-6 text-center text-xs text-gray-500 max-w-4xl mx-auto">
                Trading forex involves significant risk and may not be suitable for all investors.
                Velmenora may receive commissions from affiliate partners. Always trade responsibly.
            </div>

            {/* 🔻 COPYRIGHT */}
            <div className="text-center text-xs text-gray-600 pb-6">
                © {new Date().getFullYear()} Velmenora. All rights reserved.
            </div>

        </footer>
    );
}