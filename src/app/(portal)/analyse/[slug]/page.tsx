import { GuidePage, guideMetadata, guideParams } from "@/components/portal/guide-routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return guideParams("analyse");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return guideMetadata("analyse", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GuidePage id="analyse" slug={slug} />;
}
