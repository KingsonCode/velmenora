import type { FAQItem } from "@/lib/content";

type FAQBlockProps = {
    items?: FAQItem[];
    title?: string;
};

export default function FAQBlock({
    items = [],
    title = "Frequently Asked Questions",
}: FAQBlockProps) {
    if (!items.length) return null;

    return (
        <section className="mt-14" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="mb-6 text-2xl font-semibold">
                {title}
            </h2>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <article
                        key={`${item.question}-${index}`}
                        className="rounded-2xl border border-white/10 p-5"
                    >
                        <h3 className="text-lg font-medium leading-7">{item.question}</h3>
                        <p className="mt-2 text-gray-400 leading-7">{item.answer}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}