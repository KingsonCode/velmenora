import Link from "next/link";

type AcademyTopNavProps = {
    lang: string;
    current: string;
    currentLabel: string;
};

const academyLinks = [
    {
        href: "",
        label: "Academy Home",
    },
    {
        href: "what-is-forex",
        label: "What is Forex?",
    },
    {
        href: "forex-for-beginners",
        label: "Forex for Beginners",
    },
    {
        href: "forex-demo-account",
        label: "Demo Account",
    },
    {
        href: "forex-risk-management",
        label: "Risk Management",
    },
    {
        href: "how-to-trade-forex",
        label: "How to Trade Forex",
    },
];

export default function AcademyTopNav({
    lang,
    current,
    currentLabel,
}: AcademyTopNavProps) {
    return (
        <div className="mb-10 space-y-4">
            {/* BREADCRUMB */}
            <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 text-sm text-gray-400"
            >
                <Link
                    href={`/${lang}`}
                    className="transition hover:text-white"
                >
                    Home
                </Link>

                <span className="text-gray-600">/</span>

                <Link
                    href={`/${lang}/academy`}
                    className="transition hover:text-white"
                >
                    Academy
                </Link>

                {current && (
                    <>
                        <span className="text-gray-600">/</span>
                        <span className="text-white">{currentLabel}</span>
                    </>
                )}
            </nav>

            {/* MINI NAV */}
            <div className="overflow-x-auto">
                <div className="flex min-w-max gap-3 pb-1">
                    {academyLinks.map((item) => {
                        const isActive = item.href === current;

                        const href = item.href
                            ? `/${lang}/academy/${item.href}`
                            : `/${lang}/academy`;

                        return (
                            <Link
                                key={item.label}
                                href={href}
                                className={[
                                    "rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
                                    isActive
                                        ? "border-blue-500/40 bg-blue-500/15 text-blue-300 shadow-[0_0_0_1px_rgba(59,130,246,0.08)]"
                                        : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10 hover:text-white",
                                ].join(" ")}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}