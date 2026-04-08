"use client";

import { useEffect, useRef, useState } from "react";

type FadeInProps = {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    once?: boolean;
};

export default function FadeIn({
    children,
    delay = 0,
    duration = 700,
    once = true,
}: FadeInProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry?.isIntersecting) return;

                setVisible(true);

                // stop observing after first reveal (performance boost)
                if (once) observer.unobserve(entry.target);
            },
            { threshold: 0.1 }
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [once]);

    return (
        <div
            ref={ref}
            style={{
                transitionDelay: `${delay}ms`,
                transitionDuration: `${duration}ms`,
            }}
            className={`transform transition-all ease-out ${visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
        >
            {children}
        </div>
    );
}