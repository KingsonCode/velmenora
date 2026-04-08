"use client";

import Link from "next/link";

type Props = {
    href: string;
    text: string;
    variant?: "primary" | "secondary" | "ghost";
    className?: string;
};

export default function NavButton({
    href,
    text,
    variant = "primary",
    className = "",
}: Props) {
    const base =
        "group inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300";

    const styles = {
        primary:
            "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:scale-[1.03] hover:shadow-xl",
        secondary:
            "bg-white/10 text-white backdrop-blur hover:bg-white/20",
        ghost:
            "text-gray-300 hover:text-white",
    };

    return (
        <Link href={href} className={`${base} ${styles[variant]} ${className}`}>
            {text}
            <span className="ml-2 transition group-hover:translate-x-1">→</span>
        </Link>
    );
}