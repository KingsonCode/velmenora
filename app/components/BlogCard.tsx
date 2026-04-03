import Link from "next/link";

type BlogPost = {
    title: string;
    slug: string;
    excerpt: string;
};

export default function BlogCard({ post }: { post: BlogPost }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="blog-card flex flex-col justify-between h-full p-6 rounded-xl border border-[#1f2a36] bg-[#121A24] transition hover:shadow-lg hover:-translate-y-1"
        >
            {/* TITLE */}
            <h3 className="text-lg font-semibold mb-2 text-center">
                {post.title}
            </h3>

            {/* DESCRIPTION */}
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {post.excerpt}
            </p>

            {/* CTA */}
            <span className="text-blue-400 text-sm mt-auto group-hover:underline">
                Read more →
            </span>
        </Link>
    );
}