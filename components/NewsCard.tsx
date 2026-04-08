import Link from "next/link";
import Image from "next/image";
import { News } from "@/types/news";

/* 🔥 OPTIONAL: broker routing logic */
function getBrokerLink(category: string) {
    if (category === "crypto") return "/broker/binance";
    return "/broker/exness"; // default forex
}

export default function NewsCard({ item }: { item: News }) {
    const impactColor =
        item.impact === "high"
            ? "bg-red-500"
            : item.impact === "medium"
                ? "bg-yellow-500"
                : "bg-gray-500";

    return (
        <div className="bg-white/5 hover:bg-white/10 transition p-4 rounded-xl cursor-pointer border border-white/10 hover:border-white/20 group flex flex-col justify-between">

            {/* 🔗 MAIN CLICK AREA */}
            <Link href={`/news/${item.slug}`} className="block">

                {/* IMAGE */}
                <div className="relative w-full h-40 mb-3 overflow-hidden rounded-lg">
                    <Image
                        src={
                            item.image && item.image.startsWith("http")
                                ? item.image
                                : "/news/default.jpg"
                        }
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/news/default.jpg";
                        }}
                    />
                </div>

                {/* BADGES */}
                <div className="flex gap-2 mb-2">
                    <span className={`${impactColor} text-xs px-2 py-1 rounded`}>
                        {item.impact.toUpperCase()}
                    </span>

                    <span className="bg-white/10 text-xs px-2 py-1 rounded">
                        {item.category.toUpperCase()}
                    </span>
                </div>

                {/* TITLE */}
                <h3 className="font-semibold text-lg leading-tight min-h-[48px] line-clamp-2 group-hover:text-blue-400 transition">
                    {item.title}
                </h3>

                {/* EXCERPT */}
                <p className="text-sm text-gray-400 mt-1 min-h-[40px] line-clamp-2">
                    {item.excerpt}
                </p>
            </Link>

            {/* 💰 CTA */}
            <Link
                href={getBrokerLink(item.category)}
                className="mt-4 block bg-green-500/10 hover:bg-green-500/20 text-green-400 text-sm font-medium py-2 rounded-lg text-center transition"
            >
                Trade this setup →
            </Link>

            {/* DATE */}
            <div className="text-xs text-gray-500 mt-2 text-right">
                {new Date(item.publishedAt).toLocaleDateString()}
            </div>
        </div>
    );
}