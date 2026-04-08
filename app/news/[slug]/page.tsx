import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

/* 🔥 BASE URL */
function getBaseUrl() {
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return "http://localhost:3000";
}

/* 🔥 TYPES */
type News = {
    id: string;
    title: string;
    summary: string;
    content?: string;
    image?: string;
    source?: string;
    publishedAt?: string;
};

/* 🔥 FETCH SINGLE NEWS */
async function getNews(slug: string): Promise<News | null> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/news/${slug}`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data;
    } catch {
        return null;
    }
}

/* 🔥 SEO METADATA */
export async function generateMetadata(
    { params }: { params: { slug: string } }
): Promise<Metadata> {
    const article = await getNews(params.slug);

    if (!article) {
        return {
            title: "News Not Found",
        };
    }

    return {
        title: `${article.title} | Velmenora`,
        description: article.summary,
        openGraph: {
            title: article.title,
            description: article.summary,
            images: article.image ? [article.image] : [],
        },
    };
}

/* 🔥 PAGE */
export default async function NewsDetailPage({
    params,
}: {
    params: { slug: string };
}) {
    const article = await getNews(params.slug);

    if (!article) return notFound();

    return (
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-16">

            {/* 🔥 BACK */}
            <Link
                href="/news"
                className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block"
            >
                ← Back to News
            </Link>

            {/* 🔥 IMAGE */}
            {article.image && (
                <div className="mb-6 rounded-xl overflow-hidden border border-white/10">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-[300px] object-cover"
                    />
                </div>
            )}

            {/* 🔥 TITLE */}
            <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4">
                {article.title}
            </h1>

            {/* 🔥 META */}
            <div className="text-sm text-gray-400 mb-6 flex gap-4 flex-wrap">
                {article.source && <span>Source: {article.source}</span>}
                {article.publishedAt && (
                    <span>
                        {new Date(article.publishedAt).toLocaleString()}
                    </span>
                )}
            </div>

            {/* 🔥 SUMMARY */}
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                {article.summary}
            </p>

            {/* 🔥 CONTENT */}
            <div className="prose prose-invert max-w-none">
                {article.content ? (
                    <p>{article.content}</p>
                ) : (
                    <p>
                        Detailed article content will appear here once connected to a live news provider.
                    </p>
                )}
            </div>

            {/* 🔥 CTA (AFFILIATE POWER) */}
            <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-xl text-center">
                <h3 className="text-lg font-semibold mb-2">
                    Trade this market now
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                    Take advantage of market movements with top brokers.
                </p>

                <Link
                    href="/compare"
                    className="inline-block px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition"
                >
                    Start Trading →
                </Link>
            </div>
        </div>
    );
}