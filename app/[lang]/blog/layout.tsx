import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export default function BlogLayout({ children }: Props) {
    return (
        <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
            {/* BACKGROUND LAYERS */}
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[460px] bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent" />
            <div className="pointer-events-none absolute left-1/2 top-0 -z-20 h-[340px] w-[760px] -translate-x-1/2 rounded-full bg-white/[0.035] blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-20 h-32 bg-gradient-to-t from-white/[0.02] to-transparent" />

            {/* TOP STRIP */}
            <div className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex min-h-[52px] items-center justify-between gap-4">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-gray-400">
                            Velmenora Blog
                        </div>

                        <div className="hidden md:block text-[11px] uppercase tracking-[0.18em] text-gray-500">
                            Broker Guides · Comparisons · Research
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}