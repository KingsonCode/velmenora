import { ShieldCheck, Zap, BookOpen } from "lucide-react";

type Props = {
    lang?: string;
};

/* 🌐 CONTENT SYSTEM */
const content = {
    en: {
        title: "Why Traders Choose",
        brand: "Velmenora",
        subtitle:
            "We simplify forex trading by helping you find trusted brokers, compare features, and make smarter decisions — faster.",

        trust_title: "Verified & Trusted Brokers",
        trust_desc:
            "We only list regulated and reliable brokers with proven track records. No scams. No guesswork.",

        speed_title: "Fast & Smart Comparisons",
        speed_desc:
            "Instantly compare spreads, fees, platforms, and features — all in one place.",

        learn_title: "Beginner-Friendly Guides",
        learn_desc:
            "Learn forex step by step with simple guides, tips, and strategies tailored for traders.",

        badge1: "✔ 100% Free to Use",
        badge2: "✔ No Hidden Bias",
        badge3: "✔ Regularly Updated Data",
    },

    ar: {
        title: "لماذا يختار المتداولون",
        brand: "Velmenora",
        subtitle:
            "نُبسّط تداول الفوركس من خلال مساعدتك في العثور على وسطاء موثوقين ومقارنة الميزات بسهولة.",

        trust_title: "وسطاء موثوقون ومعتمدون",
        trust_desc:
            "نقوم بعرض الوسطاء المنظمين والموثوقين فقط. بدون احتيال أو تخمين.",

        speed_title: "مقارنات سريعة وذكية",
        speed_desc:
            "قارن الفروقات والرسوم والمنصات بسهولة وفي مكان واحد.",

        learn_title: "دروس سهلة للمبتدئين",
        learn_desc:
            "تعلم تداول الفوركس خطوة بخطوة مع أدلة مبسطة.",

        badge1: "✔ مجاني 100%",
        badge2: "✔ بدون تحيز",
        badge3: "✔ بيانات محدثة باستمرار",
    },
};

export default function WhyVelmenora({ lang = "en" }: Props) {
    const t = content[lang as keyof typeof content] || content.en;

    return (
        <section className="py-20 bg-gradient-to-b from-black to-gray-900 text-white">
            <div className="max-w-6xl mx-auto px-4 text-center">

                {/* 🔥 HEADER */}
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {t.title}{" "}
                    <span className="text-yellow-400">{t.brand}</span>
                </h2>

                <p className="text-gray-400 max-w-2xl mx-auto mb-12">
                    {t.subtitle}
                </p>

                {/* 💎 CARDS */}
                <div className="grid md:grid-cols-3 gap-6">

                    {/* 🛡 TRUST */}
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition shadow-lg">
                        <div className="mb-4 flex justify-center">
                            <ShieldCheck className="text-yellow-400" size={32} />
                        </div>

                        <h3 className="font-semibold text-lg mb-2">
                            {t.trust_title}
                        </h3>

                        <p className="text-gray-400 text-sm">
                            {t.trust_desc}
                        </p>
                    </div>

                    {/* ⚡ SPEED */}
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition shadow-lg">
                        <div className="mb-4 flex justify-center">
                            <Zap className="text-yellow-400" size={32} />
                        </div>

                        <h3 className="font-semibold text-lg mb-2">
                            {t.speed_title}
                        </h3>

                        <p className="text-gray-400 text-sm">
                            {t.speed_desc}
                        </p>
                    </div>

                    {/* 📚 EDUCATION */}
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition shadow-lg">
                        <div className="mb-4 flex justify-center">
                            <BookOpen className="text-yellow-400" size={32} />
                        </div>

                        <h3 className="font-semibold text-lg mb-2">
                            {t.learn_title}
                        </h3>

                        <p className="text-gray-400 text-sm">
                            {t.learn_desc}
                        </p>
                    </div>

                </div>

                {/* ✅ TRUST BADGES */}
                <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                    <span>{t.badge1}</span>
                    <span>{t.badge2}</span>
                    <span>{t.badge3}</span>
                </div>

            </div>
        </section>
    );
}