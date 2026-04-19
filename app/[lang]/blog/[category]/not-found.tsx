import Link from "next/link";

export default function BlogCategoryNotFound() {
    return (
        <main className="max-w-4xl mx-auto px-4 pt-32 pb-20">
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12 text-center backdrop-blur-sm">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.18em] text-gray-400 mb-6">
                    Blog Category
                </div>

                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                    Page not found
                </h1>

                <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-8">
                    The broker category page you are looking for does not exist, may have
                    moved, or is not available in this language yet.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="../"
                        className="inline-block rounded-lg bg-white px-5 py-3 font-medium text-black"
                    >
                        Back to Blog
                    </Link>

                    <Link
                        href="../../"
                        className="inline-block rounded-lg border border-white/15 px-5 py-3 font-medium text-white"
                    >
                        Back to Home
                    </Link>
                </div>
            </section>

            <section className="mt-10 text-center">
                <p className="text-sm text-gray-500">
                    Try exploring ECN brokers, low spread brokers, beginner-friendly
                    brokers, or fast withdrawal broker guides from the blog hub.
                </p>
            </section>
        </main>
    );
}