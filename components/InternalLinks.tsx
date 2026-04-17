import Link from "next/link";
import { LinkItem } from "@/lib/linkEngine";

export default function InternalLinks({
    title,
    links,
}: {
    title: string;
    links: LinkItem[];
}) {
    if (!links.length) return null;

    return (
        <section>
            <h3>{title}</h3>

            <ul>
                {links.map((l) => (
                    <li key={l.href}>
                        <Link href={l.href}>{l.title}</Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}