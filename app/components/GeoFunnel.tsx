"use client";

import CTAButton from "@/components/CTAButton";

/* =========================================================
   🔥 TYPES (MATCH GEO FUNNEL)
========================================================= */

type Funnel = {
  countryName: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  brokers: string[];
  payments: string[];
  slug: string;
};

type Props = {
  data: Funnel;
};

/* =========================================================
   🔥 COMPONENT
========================================================= */

export default function GeoFunnel({ data }: Props) {
  return (
    <section className="text-center py-24 px-6">

      {/* 🌍 GEO TAG */}
      <span className="text-yellow-400 text-sm block mb-3">
        🌍 Serving {data.countryName}
      </span>

      {/* 🔥 HEADLINE */}
      <h1 className="text-4xl md:text-6xl font-bold leading-tight">
        {data.title}
      </h1>

      {/* 🧠 DESCRIPTION */}
      <p className="text-gray-400 mt-6 max-w-xl mx-auto">
        {data.description}
      </p>

      {/* 💳 PAYMENTS */}
      <div className="flex justify-center gap-3 mt-6 flex-wrap text-xs text-gray-300">
        {data.payments.map((p) => (
          <span
            key={p}
            className="border border-[#1f2a36] px-3 py-1 rounded"
          >
            {p}
          </span>
        ))}
      </div>

      {/* 🚀 CTA STACK */}
      <div className="flex justify-center gap-4 mt-8 flex-wrap">

        {/* PRIMARY (AFFILIATE) */}
        <CTAButton broker="exness" />

        {/* SECONDARY */}
        <a
          href={data.ctaLink}
          className="px-6 py-3 rounded-xl font-semibold border border-[#1f2a36] hover:bg-[#121a24]"
        >
          {data.ctaText}
        </a>

      </div>

      {/* 🔒 TRUST */}
      <p className="mt-6 text-sm text-gray-500">
        ✔ Secure • ✔ Fast Withdrawals • ✔ Beginner Friendly
      </p>

      {/* 🏦 BROKERS */}
      <div className="mt-4 text-sm text-gray-400">
        Trusted brokers: {data.brokers.join(", ")}
      </div>

    </section>
  );
}