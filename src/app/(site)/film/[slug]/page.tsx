import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FilmPage } from "@/components/room/FilmPage";
import { filmBySlug, films, nextFilm } from "@/lib/films";

export function generateStaticParams() {
  return films.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const film = filmBySlug(slug);
  if (!film) return {};
  const title = film.title + " | " + film.client + " | Tilted Needle";
  return {
    title,
    description: film.summary,
    alternates: { canonical: "/film/" + film.slug },
    openGraph: { title, description: film.summary, type: "video.other" },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const film = filmBySlug(slug);
  if (!film) notFound();
  return <FilmPage film={film} next={nextFilm(film)} />;
}
