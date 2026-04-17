import { redirect } from "next/navigation";

const MAP: Record<string, string> = {
    gb: "united-kingdom",
    tz: "tanzania",
    ke: "kenya",
};

export default async function Page({
    params,
}: {
    params: Promise<{ lang: string; country: string }>;
}) {
    const { lang, country } = await params;

    const mapped = MAP[country.toLowerCase()];

    if (mapped) {
        redirect(`/${lang}/best-brokers-in/${mapped}`);
    }

    // fallback → homepage
    redirect(`/${lang}`);
}