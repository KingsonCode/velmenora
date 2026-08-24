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
        "forex-risk-management",
        lang
    );
}

export default function Layout({
    children,
}: Props) {
    return (
        <AcademySeoRoute slug="forex-risk-management">
            {children}
        </AcademySeoRoute>
    );
}
