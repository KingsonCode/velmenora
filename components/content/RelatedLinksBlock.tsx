import Link from "next/link";
import type { RelatedLink } from "@/lib/content";
import { buildLocalizedHref } from "@/lib/content/helpers";

type RelatedLinksBlockProps = {
    lang?: string;
    links?: RelatedLink[];
    title?: string;
};

export default function RelatedLinksBlock({
    lang = "en",
    links = [],
    title = "Related Pages",
}: RelatedLinksBlockProps) {
    if (!links.length) return null;

    return (
        <section className="mt-14" aria-labelledby="related-pages-heading">
            <h2 id="related-pages-heading" className="mb-5 text-2xl font-semibold">
                {title}
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
                {links.map((link) => (
                    <Link
                        key={`${link.href}-${link.label}`}
                        href={buildLocalizedHref(lang, link.href)}
                        className="rounded-2xl border border-white/10 p-4 transition hover:border-white/20"
                    >
                        <span className="text-sm text-gray-200">{link.label}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}