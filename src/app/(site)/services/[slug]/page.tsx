import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/ServiceDetailPage";
import { servicesList } from "@/lib/services-data";

export function generateStaticParams() {
  return servicesList.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesList.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.title} | Tilted Needle`,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = servicesList.find((s) => s.slug === slug);
  if (!service) notFound();

  return <ServiceDetailPage service={service} />;
}
