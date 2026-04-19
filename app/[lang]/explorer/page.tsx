import { Suspense } from "react";
import { notFound } from "next/navigation";
import ExplorerClient from "./ExplorerClient";

export const dynamic = "force-dynamic";

const SUPPORTED_LANGS = ["en", "de", "fr", "ar"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];
type RouteParams = Promise<{ lang: string }>;

function isValidLang(value: string): value is Lang {
    return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

export default async function ExplorerPage({
    params,
}: {
    params: RouteParams;
}) {
    const { lang } = await params;

    if (!isValidLang(lang)) {
        notFound();
    }

    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center text-white">
                    🔄 Loading brokers...
                </div>
            }
        >
            <ExplorerClient lang={lang} />
        </Suspense>
    );
}