import { redirect } from "next/navigation";

export default async function BestBrokersAcademyArticleRedirectPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  redirect(`/${lang}/academy/${slug}`);
}
