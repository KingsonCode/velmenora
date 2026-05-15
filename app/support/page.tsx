export default function SupportPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
          Velmenora Help
        </p>

        <h1 className="mb-6 text-4xl font-bold md:text-5xl">
          Support Center
        </h1>

        <p className="mb-10 max-w-3xl text-lg leading-8 text-zinc-300">
          Need help with payment, challenge access, account review, or reward
          status? Contact Velmenora support with your account details.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          {[
            ["Support email", "support@velmenora.com"],
            ["General inquiries", "hello@velmenora.com"],
            ["Typical response time", "24–48 business hours"],
            ["Payment help", "Include your account email and payment reference."],
            ["Reward review help", "Include your challenge account reference."],
            ["Compliance questions", "Include clear details and supporting information."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="mb-2 text-xl font-semibold text-white">{title}</h2>
              <p className="leading-7 text-zinc-300">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
