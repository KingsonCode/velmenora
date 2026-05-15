import { redirect } from "next/navigation";

export default async function OldCountryAcademyArticleRedirectPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  redirect(`/${lang}/academy/${slug}`);
}
