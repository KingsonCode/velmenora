import Hero from "@/components/Hero";
import WhyVelmenora from "@/components/WhyVelmenora";
import FinalCTA from "@/components/FinalCTA";
import TopBrokers from "@/components/TopBrokers";

export type HomeLang = "en" | "ar" | "de" | "fr";

type Props = {
    lang: HomeLang;
};

/* ================= SHARED HOME SHELL ================= */
export default function HomeShell({ lang }: Props) {
    return (
        <main className="overflow-hidden bg-black text-white">
            <Hero lang={lang} />

            <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
                <div className="relative overflow-hidden rounded-[2rem] border border-green-500/20 bg-gradient-to-br from-green-950/30 via-white/[0.03] to-black p-6 shadow-[0_0_80px_rgba(34,197,94,0.08)] md:p-8">
                    <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

                    <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
                                New: Funded Challenge
                            </p>

                            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
                                Trade a virtual account. Follow the rules. Qualify for a fixed reward.
                            </h2>

                            <p className="mt-4 max-w-2xl text-gray-400">
                                Join a Velmenora funded challenge, connect your MT4/MT5 investor access,
                                sync trading metrics, pass review, and request your reward after meeting the target.
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <a
                                    href="/funded"
                                    className="rounded-2xl bg-green-500 px-6 py-3 text-center font-black text-black transition hover:bg-green-400"
                                >
                                    Start Funded Challenge
                                </a>

                                <a
                                    href="/funded"
                                    className="rounded-2xl border border-white/10 px-6 py-3 text-center font-bold text-white transition hover:border-green-500 hover:text-green-400"
                                >
                                    See How It Works
                                </a>
                            </div>
                        </div>

                        <div className="grid gap-3 text-sm">
                            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                <span className="mr-2 font-black text-green-400">01</span>
                                Apply and activate your challenge account
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                <span className="mr-2 font-black text-green-400">02</span>
                                Connect MT4/MT5 investor access for verification
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                <span className="mr-2 font-black text-green-400">03</span>
                                Hit the profit target while respecting risk rules
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                <span className="mr-2 font-black text-green-400">04</span>
                                Pass review and request your fixed reward
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <TopBrokers />

            <WhyVelmenora lang={lang} />


            <FinalCTA lang={lang} />
        </main>
    );
}