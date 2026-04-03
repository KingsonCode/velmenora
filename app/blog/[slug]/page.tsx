import { generateAllSlugs, getPageData } from "@/lib/generate";
import CTAButton from "@/components/CTAButton";

type Params = {
    params: {
        slug: string;
    };
};

// 🔥 STATIC GENERATION
export async function generateStaticParams() {
    return generateAllSlugs().map((item) => ({
        slug: item.slug,
    }));
}

// 🔥 SEO METADATA
export function generateMetadata({ params }: Params) {
    const data = getPageData(params.slug);

    return {
        title: data?.title || "Velmenora",
        description: data?.description || "Learn trading with Velmenora.",
    };
}

// 🔥 PAGE COMPONENT
export default function Page({ params }: Params) {
    const data = getPageData(params.slug);

    if (!data) {
        return (
            <main className="p-10 text-center">
                <h1 className="text-2xl">Page not found</h1>
            </main>
        );
    }

    const { country, title, description } = data;

    return (
        <main className="max-w-3xl mx-auto px-6 py-16">

            {/* TITLE */}
            <h1 className="text-3xl font-bold mb-6">
                {title}
            </h1>

            {/* INTRO */}
            <p className="text-gray-400 mb-6">
                {description}
            </p>

            {/* CONTENT BLOCK */}
            <div className="space-y-6 text-gray-300">

                <p>
                    Forex trading in <strong>{country.name}</strong> is growing rapidly as more traders gain access to global markets.
                </p>

                <p>
                    Choosing the right broker is critical for success. Factors like spreads,
                    withdrawals, and regulation should be carefully considered.
                </p>

                <p>
                    Velmenora helps you find trusted brokers and learn smarter trading strategies.
                </p>

            </div>

            {/* CTA */}
            <div className="mt-10">
                <CTAButton broker="exness" />
            </div>

            {/* INTERNAL LINKING (SEO BOOST) */}
            <div className="mt-12 border-t border-[#1f2a36] pt-6">
                <h3 className="text-lg font-semibold mb-3">
                    Related Guides
                </h3>

                <ul className="space-y-2 text-blue-400">
                    <li>
                        <a href={`/blog/best-brokers-in-${country.slug}`}>
                            Best Brokers in {country.name}
                        </a>
                    </li>
                    <li>
                        <a href={`/blog/how-to-trade-in-${country.slug}`}>
                            How to Trade in {country.name}
                        </a>
                    </li>
                </ul>
            </div>

        </main>
    );
}