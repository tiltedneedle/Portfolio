import { GuidePage, guideMetadata, guideParams } from "@/components/portal/guide-routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return guideParams("create");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return guideMetadata("create", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GuidePage id="create" slug={slug} />;
}
