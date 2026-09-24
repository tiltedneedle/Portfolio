import { published, stillFor } from "@/lib/published";
import { embedFor, reelById } from "@/content/system/reel";
import { ClipRailClient } from "@/components/portal/ClipRailClient";

/**
 * Example clips from the studio's published library, or from the showreel
 * (a reel id plays in the platform's own player). The lookup runs on the
 * server so the page never carries the index; only the few clips it shows.
 */
export function ClipRail({ title, note, items }: { title?: string; note?: string; items: { id: string; caption?: string }[] }) {
  const clips = items.map((it) => {
    const r = reelById(it.id);
    if (r) return { id: it.id, title: r.client + ": " + r.title, caption: it.caption, thumb: r.thumb, handle: r.handle, src: embedFor(r), platform: r.platform };
    const found = published.find((p) => p.videoId === it.id);
    return {
      id: it.id,
      title: found?.title || it.caption || "Clip",
      caption: it.caption,
      thumb: stillFor(it.id),
      handle: found?.handle || "",
    };
  });
  return <ClipRailClient title={title} note={note} clips={clips} />;
}
