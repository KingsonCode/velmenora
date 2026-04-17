import Link from "next/link";
import { BookOpen, TrendingUp, GraduationCap } from "lucide-react";
import { getLearnContent, Lang } from "@/lib/i18n";

type Props = {
    lang?: Lang;
};

export default function LearnForex({ lang = "en" }: Props) {
    const t = getLearnContent(lang);

    return (
        <section className="py-20 bg-black text-white">
            <div className="max-w-6xl mx-auto px-4">

                {/* 🔥 HEADER */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {t.title_1}{" "}
                        <span className="text-yellow-400">{t.highlight}</span>
                    </h2>

                    <p className="text-gray-400 max-w-2xl mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                {/* 💎 FEATURED */}
                <div className="mb-10">
                    <Link
                        href={`/${lang}/academy/what-is-forex`}
                        className="block p-8 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/10 border border-yellow-400/20 hover:scale-[1.02] transition"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <BookOpen className="text-yellow-400" size={28} />
                            <span className="text-sm text-yellow-400 font-semibold">
                                {t.start_here}
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold mb-2">
                            {t.featured_title}
                        </h3>

                        <p className="text-gray-300">
                            {t.featured_desc}
                        </p>
                    </Link>
                </div>

                {/* 📚 GRID */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">

                    <Link
                        href={`/${lang}/academy/how-to-trade-forex`}
                        className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <TrendingUp className="text-yellow-400" size={22} />
                            <h4 className="font-semibold text-lg">
                                {t.trade_title}
                            </h4>
                        </div>

                        <p className="text-gray-400 text-sm">
                            {t.trade_desc}
                        </p>
                    </Link>

                    <Link
                        href={`/${lang}/academy/forex-for-beginners`}
                        className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <GraduationCap className="text-yellow-400" size={22} />
                            <h4 className="font-semibold text-lg">
                                {t.beginner_title}
                            </h4>
                        </div>

                        <p className="text-gray-400 text-sm">
                            {t.beginner_desc}
                        </p>
                    </Link>

                </div>

                {/* 🚀 CTA */}
                <div className="text-center">
                    <Link
                        href={`/${lang}/academy`}
                        className="inline-block px-8 py-4 bg-yellow-500 text-black font-semibold rounded-xl hover:scale-105 transition shadow-lg"
                    >
                        {t.cta}
                    </Link>
                </div>

            </div>
        </section>
    );
}