"use client";

import { useState } from "react";

type FAQItem = {
    q: string;
    a: string;
};

export default function FAQ({ items }: { items: FAQItem[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="max-w-3xl mx-auto py-20 px-6">
            <h2 className="text-2xl font-semibold mb-8 text-center">
                Frequently Asked Questions
            </h2>

            <div className="space-y-4">
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="border border-[#1f2a36] rounded-xl p-4 cursor-pointer"
                        onClick={() =>
                            setOpenIndex(openIndex === i ? null : i)
                        }
                    >
                        <h3 className="font-semibold flex justify-between items-center">
                            {item.q}
                            <span>{openIndex === i ? "-" : "+"}</span>
                        </h3>

                        {openIndex === i && (
                            <p className="text-gray-400 mt-2 text-sm">
                                {item.a}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}