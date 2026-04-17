"use client";

import { useState } from "react";

type FAQItem = {
    q: string;
    a: string;
};

export default function FAQ({
    items,
}: {
    items: FAQItem[];
}) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="max-w-3xl mx-auto py-16 px-4">

            {/* 🔥 TITLE (SEO IMPORTANT) */}
            <h2 className="text-2xl font-semibold mb-8 text-center">
                Frequently Asked Questions
            </h2>

            <div className="space-y-4">

                {items.map((item, i) => {
                    const isOpen = openIndex === i;

                    return (
                        <div
                            key={i}
                            className="border border-[#1f2a36] rounded-xl p-4 cursor-pointer transition hover:border-gray-500"
                            onClick={() =>
                                setOpenIndex(isOpen ? null : i)
                            }
                        >
                            {/* 🔥 QUESTION */}
                            <h3 className="font-semibold flex justify-between items-center">
                                {item.q}
                                <span className="text-lg">
                                    {isOpen ? "−" : "+"}
                                </span>
                            </h3>

                            {/* 🔥 ANSWER */}
                            <div
                                className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 mt-2" : "max-h-0"
                                    }`}
                            >
                                <p className="text-gray-400 text-sm">
                                    {item.a}
                                </p>
                            </div>
                        </div>
                    );
                })}

            </div>
        </section>
    );
}