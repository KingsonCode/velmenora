import { notFound } from "next/navigation";
import HomeShell, { type HomeLang } from "@/components/home/HomeShell";

const SUPPORTED_LANGS = ["en", "ar", "de", "fr"] as const;
type RouteParams = Promise<{ lang: string }>;

function isValidLang(value: string): value is HomeLang {
    return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

/* ================= LOCALIZED HOMEPAGE ================= */
export default async function LangHomePage({
    params,
}: {
    params: RouteParams;
}) {
    const { lang } = await params;

    if (!isValidLang(lang)) {
        return notFound();
    }

    return <HomeShell lang={lang} />;
}