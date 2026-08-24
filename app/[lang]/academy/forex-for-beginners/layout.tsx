import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
    AcademySeoRoute,
    buildAcademyMetadata,
} from "../_lib/academy-seo";

type Props = {
    children: ReactNode;
    params: Promise<{ lang: string }>;
};

export async function generateMetadata({
    params,
}: Props): Promise<Metadata> {
    const { lang } = await params;

    return buildAcademyMetadata(
        "forex-for-beginners",
        lang
    );
}

export default function Layout({
    children,
}: Props) {
    return (
        <AcademySeoRoute slug="forex-for-beginners">
            {children}
        </AcademySeoRoute>
    );
}
