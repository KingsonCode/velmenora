import { redirect } from "next/navigation";

export default async function OldCountryAcademyRedirectPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  redirect(`/${lang}/academy`);
}
