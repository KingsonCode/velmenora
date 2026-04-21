import BaseProgrammaticPage from "./BaseProgrammaticPage";
import { buildPaymentPage } from "@/lib/content";

type PaymentPageProps = {
    lang?: string;
    country: {
        name: string;
        slug: string;
    };
    payment: string;
    slug?: string;
};

export default function PaymentPage({
    lang = "en",
    country,
    payment,
    slug,
}: PaymentPageProps) {
    const page = buildPaymentPage({
        lang,
        country,
        payment,
        ...(slug ? { slug } : {}),
    });

    return <BaseProgrammaticPage lang={lang} page={page} />;
}