type Props = {
    country: string;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
};

export default function CountryHero({
    country,
    title,
    description,
    ctaText,
    ctaLink,
    secondaryCtaText,
    secondaryCtaLink,
}: Props) {
    return (
        <section className="text-center py-24 px-6">

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {title}
            </h1>

            <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
                {description}
            </p>

            <p className="text-xs text-gray-500 mt-4">
                🌍 Available in {country}
            </p>

            <div className="mt-8 flex justify-center gap-4 flex-wrap">

                <a
                    href={ctaLink}
                    className="bg-blue-600 px-6 py-3 rounded-xl text-lg"
                >
                    {ctaText}
                </a>

                {secondaryCtaText && secondaryCtaLink && (
                    <a
                        href={secondaryCtaLink}
                        className="border border-white/20 px-6 py-3 rounded-xl text-lg"
                    >
                        {secondaryCtaText}
                    </a>
                )}

            </div>

        </section>
    );
}