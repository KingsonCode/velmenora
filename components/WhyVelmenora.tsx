import {
    ShieldCheck,
    Zap,
    BookOpen,
    BadgeCheck,
    Globe2,
    BarChart3,
} from "lucide-react";

type Lang = "en" | "ar" | "de" | "fr";

type Props = {
    lang?: Lang;
};

type WhyCopy = {
    kicker: string;
    title: string;
    brand: string;
    subtitle: string;

    trust_title: string;
    trust_desc: string;

    speed_title: string;
    speed_desc: string;

    learn_title: string;
    learn_desc: string;

    trust_badge_title: string;
    trust_badge_desc: string;

    global_title: string;
    global_desc: string;

    data_title: string;
    data_desc: string;

    badge1: string;
    badge2: string;
    badge3: string;
};

const content: Record<Lang, WhyCopy> = {
    en: {
        kicker: "Why traders trust us",
        title: "Why Traders Choose",
        brand: "Velmenora",
        subtitle:
            "We help traders discover stronger brokers, compare the details that matter, and move faster with more confidence.",

        trust_title: "Verified & Trusted Brokers",
        trust_desc:
            "We focus on brokers with stronger credibility, recognized presence, and better overall trading confidence.",

        speed_title: "Fast & Smart Comparisons",
        speed_desc:
            "Compare ratings, core features, and trading conditions quickly without jumping across multiple websites.",

        learn_title: "Beginner-Friendly Guidance",
        learn_desc:
            "From first steps to broker selection, we simplify the learning curve so traders can make clearer decisions.",

        trust_badge_title: "Trust-first selection",
        trust_badge_desc:
            "We structure discovery around broker quality, relevance, and reliability signals.",

        global_title: "Built for multiple regions",
        global_desc:
            "Our framework supports country relevance, regional availability, and market-specific entry paths.",

        data_title: "Decision-focused data",
        data_desc:
            "We highlight the data points traders actually care about when choosing where to trade.",

        badge1: "100% free to use",
        badge2: "No hidden bias",
        badge3: "Regularly updated",
    },

    ar: {
        kicker: "لماذا يثق بنا المتداولون",
        title: "لماذا يختار المتداولون",
        brand: "Velmenora",
        subtitle:
            "نساعد المتداولين على اكتشاف وسطاء أقوى ومقارنة التفاصيل المهمة واتخاذ قرارات أسرع بثقة أكبر.",

        trust_title: "وسطاء موثوقون ومعتمدون",
        trust_desc:
            "نركز على الوسطاء ذوي المصداقية الأعلى والحضور الأقوى والثقة الأفضل للمتداول.",

        speed_title: "مقارنات سريعة وذكية",
        speed_desc:
            "قارن التقييمات والميزات الأساسية وظروف التداول بسرعة دون التنقل بين مواقع كثيرة.",

        learn_title: "إرشاد مناسب للمبتدئين",
        learn_desc:
            "من الخطوات الأولى إلى اختيار الوسيط، نُبسّط منحنى التعلم لمساعدة المتداول على اتخاذ قرار أوضح.",

        trust_badge_title: "اختيار قائم على الثقة",
        trust_badge_desc:
            "نرتب الاكتشاف حول جودة الوسيط وملاءمته وإشارات الموثوقية.",

        global_title: "مصمم لعدة مناطق",
        global_desc:
            "يدعم نظامنا ملاءمة الدولة والتوفر الإقليمي ومسارات دخول خاصة بكل سوق.",

        data_title: "بيانات تساعد على القرار",
        data_desc:
            "نبرز البيانات التي يهتم بها المتداول فعلاً عند اختيار مكان التداول.",

        badge1: "مجاني 100%",
        badge2: "بدون تحيز مخفي",
        badge3: "يتم التحديث باستمرار",
    },

    de: {
        kicker: "Warum Trader uns vertrauen",
        title: "Warum Trader",
        brand: "Velmenora",
        subtitle:
            "Wir helfen Tradern, stärkere Broker zu finden, relevante Details zu vergleichen und schneller mit mehr Sicherheit zu entscheiden.",

        trust_title: "Geprüfte & vertrauenswürdige Broker",
        trust_desc:
            "Wir konzentrieren uns auf Broker mit höherer Glaubwürdigkeit, solider Präsenz und mehr Vertrauen im Handel.",

        speed_title: "Schnelle & smarte Vergleiche",
        speed_desc:
            "Vergleiche Ratings, Kernfunktionen und Handelsbedingungen schnell an einem Ort.",

        learn_title: "Einsteigerfreundliche Orientierung",
        learn_desc:
            "Von den ersten Schritten bis zur Brokerwahl vereinfachen wir die Lernkurve für klarere Entscheidungen.",

        trust_badge_title: "Vertrauen zuerst",
        trust_badge_desc:
            "Unsere Auswahl priorisiert Broker-Qualität, Relevanz und Zuverlässigkeit.",

        global_title: "Für mehrere Regionen gebaut",
        global_desc:
            "Unser System unterstützt Länderrelevanz, regionale Verfügbarkeit und marktspezifische Einstiege.",

        data_title: "Daten für echte Entscheidungen",
        data_desc:
            "Wir zeigen die Kennzahlen, die Trader bei der Brokerwahl wirklich interessieren.",

        badge1: "100% kostenlos",
        badge2: "Kein versteckter Bias",
        badge3: "Regelmäßig aktualisiert",
    },

    fr: {
        kicker: "Pourquoi les traders nous font confiance",
        title: "Pourquoi les traders choisissent",
        brand: "Velmenora",
        subtitle:
            "Nous aidons les traders à trouver de meilleurs brokers, comparer les points essentiels et décider plus vite avec plus de confiance.",

        trust_title: "Brokers vérifiés et fiables",
        trust_desc:
            "Nous mettons en avant des brokers plus crédibles, plus solides et plus rassurants pour les traders.",

        speed_title: "Comparaisons rapides et intelligentes",
        speed_desc:
            "Comparez rapidement les notes, les fonctions clés et les conditions de trading au même endroit.",

        learn_title: "Guidance accessible aux débutants",
        learn_desc:
            "Des premiers pas au choix du broker, nous simplifions l’apprentissage pour des décisions plus claires.",

        trust_badge_title: "Sélection orientée confiance",
        trust_badge_desc:
            "Notre système met l’accent sur la qualité, la pertinence et la fiabilité des brokers.",

        global_title: "Pensé pour plusieurs régions",
        global_desc:
            "Notre structure prend en charge la pertinence locale, la disponibilité régionale et les parcours par marché.",

        data_title: "Des données utiles à la décision",
        data_desc:
            "Nous mettons en avant les éléments que les traders regardent vraiment avant d’ouvrir un compte.",

        badge1: "100% gratuit",
        badge2: "Sans biais caché",
        badge3: "Mis à jour régulièrement",
    },
};

export default function WhyVelmenora({ lang = "en" }: Props) {
    const t = content[lang] || content.en;

    const cards = [
        {
            icon: ShieldCheck,
            title: t.trust_title,
            desc: t.trust_desc,
        },
        {
            icon: Zap,
            title: t.speed_title,
            desc: t.speed_desc,
        },
        {
            icon: BookOpen,
            title: t.learn_title,
            desc: t.learn_desc,
        },
    ];

    const pillars = [
        {
            icon: BadgeCheck,
            title: t.trust_badge_title,
            desc: t.trust_badge_desc,
        },
        {
            icon: Globe2,
            title: t.global_title,
            desc: t.global_desc,
        },
        {
            icon: BarChart3,
            title: t.data_title,
            desc: t.data_desc,
        },
    ];

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-black via-[#0B1020] to-black py-24 text-white">
            <div className="absolute inset-0 opacity-40">
                <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[120px]" />
                <div className="absolute bottom-0 left-0 h-[260px] w-[260px] rounded-full bg-blue-500/10 blur-[100px]" />
            </div>

            <div className="relative mx-auto max-w-6xl px-4">
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <p className="mb-3 inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-yellow-300">
                        {t.kicker}
                    </p>

                    <h2 className="mb-4 text-3xl font-bold md:text-5xl">
                        {t.title} <span className="text-yellow-400">{t.brand}</span>
                    </h2>

                    <p className="text-base text-gray-400 md:text-lg">
                        {t.subtitle}
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition hover:border-yellow-500/30 hover:bg-white/[0.06]"
                            >
                                <div className="mb-5 inline-flex rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-3">
                                    <Icon className="text-yellow-400" size={26} />
                                </div>

                                <h3 className="mb-3 text-xl font-semibold text-white">
                                    {card.title}
                                </h3>

                                <p className="text-sm leading-7 text-gray-400">
                                    {card.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    {pillars.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-white/10 bg-black/30 p-5"
                            >
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                                        <Icon size={18} className="text-blue-300" />
                                    </div>

                                    <p className="font-semibold text-white">
                                        {item.title}
                                    </p>
                                </div>

                                <p className="text-sm leading-6 text-gray-400">
                                    {item.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
                    {[t.badge1, t.badge2, t.badge3].map((badge) => (
                        <span
                            key={badge}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-gray-300"
                        >
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}