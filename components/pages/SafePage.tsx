import BaseProgrammaticPage from "./BaseProgrammaticPage";
import { buildSafePage } from "@/lib/content";

type SafePageProps = {
    lang?: string;
    country: {
        name: string;
        slug: string;
    };
    broker: {
        name: string;
        slug: string;
    };
    slug?: string;
};

export default function SafePage({
    lang = "en",
    country,
    broker,
    slug,
}: SafePageProps) {
    const page = buildSafePage({
        lang,
        country,
        broker,
        ...(slug ? { slug } : {}),
    });

    return <BaseProgrammaticPage lang={lang} page={page} />;
}