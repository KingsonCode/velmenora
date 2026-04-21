import Link from "next/link";
import type { BuiltPageContent, ContentSection, CTAData } from "@/lib/content";
import { buildLocalizedHref } from "@/lib/content/helpers";
import JsonLd from "@/components/seo/JsonLd";
import FAQBlock from "@/components/content/FAQBlock";
import RelatedLinksBlock from "@/components/content/RelatedLinksBlock";
import BrokerCardsBlock from "@/components/content/BrokerCardsBlock";

type BaseProgrammaticPageProps = {
    lang?: string;
    page: BuiltPageContent;
};

function getSectionClassName(section: ContentSection): string {
    const baseClassName = "scroll-mt-24";

    switch (section.variant) {
        case "highlight":
            return `${baseClassName} rounded-2xl border border-white/10 bg-white/[0.03] p-6`;
        case "note":
            return `${baseClassName} rounded-2xl border border-white/10 p-6`;
        default:
            return baseClassName;
    }
}

function getCtaClassName(cta: CTAData): string {
    const baseClassName =
        "mt-5 inline-block rounded-xl px-5 py-3 transition";

    switch (cta.variant) {
        case "secondary":
            return `${baseClassName} border border-white/10 hover:border-white/20`;
        case "primary":
        default:
            return `${baseClassName} border border-white/10 hover:border-white/20`;
    }
}

export default function BaseProgrammaticPage({
    lang = "en",
    page,
}: BaseProgrammaticPageProps) {
    return (
        <>
            <JsonLd data={page.schema ?? null} />

            <main className="mx-auto max-w-5xl px-4 py-10">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
                    <p className="mt-4 text-lg text-gray-400">{page.description}</p>
                </header>

                <div className="space-y-10">
                    {page.sections.map((section) => (
                        <section
                            key={section.id}
                            className={getSectionClassName(section)}
                            aria-labelledby={`section-${section.id}`}
                        >
                            <h2
                                id={`section-${section.id}`}
                                className="mb-3 text-2xl font-semibold"
                            >
                                {section.title}
                            </h2>

                            <p className="leading-8 text-gray-300">{section.content}</p>
                        </section>
                    ))}
                </div>

                <BrokerCardsBlock lang={lang} brokers={page.brokerCards ?? []} />

                <FAQBlock items={page.faq ?? []} />

                <RelatedLinksBlock lang={lang} links={page.relatedLinks ?? []} />

                {page.cta ? (
                    <section
                        className="mt-14 rounded-2xl border border-white/10 p-6"
                        aria-labelledby="page-cta-heading"
                    >
                        <h2 id="page-cta-heading" className="text-2xl font-semibold">
                            {page.cta.title}
                        </h2>

                        <p className="mt-3 text-gray-400">{page.cta.description}</p>

                        <Link
                            href={buildLocalizedHref(lang, page.cta.href)}
                            className={getCtaClassName(page.cta)}
                        >
                            {page.cta.label}
                        </Link>
                    </section>
                ) : null}
            </main>
        </>
    );
}