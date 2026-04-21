import BaseProgrammaticPage from "./BaseProgrammaticPage";
import { buildGeoPage } from "@/lib/content";

type GeoPageProps = {
    lang?: string;
    country: {
        name: string;
        slug: string;
    };
    slug?: string;
};

export default function GeoPage({
    lang = "en",
    country,
    slug,
}: GeoPageProps) {
    const page = buildGeoPage({
        lang,
        country,
        ...(slug ? { slug } : {}),
    });

    return <BaseProgrammaticPage lang={lang} page={page} />;
}