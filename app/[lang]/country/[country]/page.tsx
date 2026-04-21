import { redirect } from "next/navigation";

const MAP: Record<string, string> = {
    gb: "united-kingdom",
    tz: "tanzania",
    ke: "kenya",
    ng: "nigeria",
    za: "south-africa",
    ug: "uganda",
    gh: "ghana",
    in: "india",
    pk: "pakistan",
    bd: "bangladesh",
    ae: "uae",
    sa: "saudi-arabia",
};

type PageProps = {
    params: Promise<{
        lang: string;
        country: string;
    }>;
};

export default async function LegacyCountryPage({ params }: PageProps) {
    const { lang, country } = await params;

    const normalized = country.toLowerCase();
    const mapped = MAP[normalized] || normalized;

    redirect(`/${lang}/best-brokers-in/${mapped}`);
}