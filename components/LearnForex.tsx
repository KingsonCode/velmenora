import Link from "next/link";
import {
    BookOpen,
    TrendingUp,
    GraduationCap,
    ArrowRight,
    ShieldCheck,
    LineChart,
    Shield,
    Monitor,
} from "lucide-react";
import { getLearnContent, Lang } from "@/lib/i18n";

type Props = {
    lang?: Lang;
};

export default function LearnForex({ lang = "en" }: Props) {
    const t = getLearnContent(lang);

    const base = `/${lang}/country/academy`;

    const cards = [
        {
            href: `${base}/how-to-trade-forex`,
            icon: TrendingUp,
            title: t.trade_title,
            desc: t.trade_desc,
        },
        {
            href: `${base}/forex-for-beginners`,
            icon: GraduationCap,
            title: t.beginner_title,
            desc: t.beginner_desc,
        },
        {
            href: `${base}/forex-demo-account`,
            icon: Monitor,
            title: "Demo Trading",
            desc: "Practice forex trading without risk and build confidence before using real money.",
        },
        {
            href: `${base}/forex-risk-management`,
            icon: Shield,
            title: "Risk Management",
            desc: "Learn how to protect your capital, control losses, and trade with discipline.",
        },
    ];

    const pillars = [
        {
            icon: ShieldCheck,
            title: "Build confidence first",
            desc: "Start with education and demo trading before risking real capital.",
        },
        {
            icon: LineChart,
            title: "Understand market behavior",
            desc: "Learn how price moves, trends form, and traders react to market conditions.",
        },
        {
            icon: BookOpen,
            title: "Learn with structure",
            desc: "Follow a clear path from basics to execution without confusion.",
        },
    ];

    return (
        <section className="relative overflow-hidden bg-black py-24 text-white">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0B1020] to-black" />
            <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[120px]" />
            <div className="absolute right-0 bottom-0 h-[240px] w-[240px] rounded-full bg-blue-500/10 blur-[100px]" />

            <div className="relative mx-auto max-w-6xl px-4">

                {/* HERO */}
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <p className="mb-3 inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-yellow-300">
                        Learning hub
                    </p>

                    <h2 className="mb-4 text-3xl font-bold md:text-5xl">
                        {t.title_1} <span className="text-yellow-400">{t.highlight}</span>
                    </h2>

                    <p className="text-base text-gray-400 md:text-lg">
                        {t.subtitle}
                    </p>
                </div>

                {/* FEATURED + WHY */}
                <div className="mb-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">

                    {/* START HERE */}
                    <Link
                        href={`${base}/what-is-forex`}
                        className="group block rounded-[28px] border border-yellow-400/20 bg-gradient-to-br from-yellow-500/15 via-white/[0.03] to-transparent p-8 transition hover:scale-[1.01] hover:border-yellow-400/30"
                    >
                        <div className="mb-5 flex items-center gap-4">
                            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-3">
                                <BookOpen className="text-yellow-400" size={28} />
                            </div>

                            <span className="text-sm font-semibold text-yellow-400">
                                {t.start_here}
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold md:text-3xl">
                            {t.featured_title}
                        </h3>

                        <p className="mt-3 max-w-2xl text-gray-300">
                            {t.featured_desc}
                        </p>

                        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-yellow-300 transition group-hover:gap-3">
                            Start learning
                            <ArrowRight size={16} />
                        </div>
                    </Link>

                    {/* WHY IT MATTERS */}
                    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
                        <p className="text-sm font-semibold text-white">
                            Why this matters
                        </p>

                        <div className="mt-5 space-y-4">
                            {pillars.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.title}
                                        className="rounded-2xl border border-white/10 bg-black/30 p-4"
                                    >
                                        <div className="mb-3 flex items-center gap-3">
                                            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                                                <Icon size={18} className="text-blue-300" />
                                            </div>

                                            <p className="font-semibold text-white">
                                                {item.title}
                                            </p>
                                        </div>

                                        <p className="text-sm leading-6 text-gray-400">
                                            {item.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* GUIDE CARDS */}
                <div className="grid gap-6 md:grid-cols-2">
                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <Link
                                key={card.href}
                                href={card.href}
                                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-yellow-500/30 hover:bg-white/[0.06]"
                            >
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-3">
                                        <Icon className="text-yellow-400" size={22} />
                                    </div>

                                    <h4 className="text-lg font-semibold text-white">
                                        {card.title}
                                    </h4>
                                </div>

                                <p className="text-sm leading-7 text-gray-400">
                                    {card.desc}
                                </p>

                                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-yellow-300 transition group-hover:gap-3">
                                    Open guide
                                    <ArrowRight size={16} />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* FINAL CTA */}
                <div className="mt-12 text-center">
                    <Link
                        href={`${lang}/explorer`}
                        className="inline-flex items-center gap-2 rounded-2xl bg-yellow-500 px-8 py-4 font-semibold text-black shadow-lg transition hover:scale-[1.02]"
                    >
                        Compare Brokers
                        <ArrowRight size={18} />
                    </Link>
                </div>

            </div>
        </section>
    );
}