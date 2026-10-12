import { getImage } from "astro:assets";
import { getCollection, type CollectionEntry } from "astro:content";
import * as simpleIcons from "simple-icons";

export type ProjectEntry = CollectionEntry<"projects">;

/** Every project in home-list order, with the slug and the shared logo resolved. */
export async function getProjects() {
  const entries = (await getCollection("projects")).sort((a, b) => a.data.order - b.data.order);
  return Promise.all(
    entries.map(async (entry) => {
      // One small webp per logo, used by the home row, the project hero and the
      // 404, so the morph between pages swaps identical pixels.
      const logo = await getImage({ src: entry.data.logo, width: 160, height: 160, format: "webp" });
      const peek = await getImage({ src: entry.data.previews[0].src, width: 560, format: "webp" });
      // The lightbox gets one large webp instead of the original file.
      const previews = await Promise.all(
        entry.data.previews.map(async (preview) => {
          const full = await getImage({ src: preview.src, width: Math.min(preview.src.width, 1800), format: "webp" });
          return { ...preview, fullSrc: full.src };
        }),
      );
      return { slug: entry.id, ...entry.data, previews, logoSrc: logo.src, peekSrc: peek.src };
    }),
  );
}

export type Project = Awaited<ReturnType<typeof getProjects>>[number];

export const morphName = (slug: string) => `project-logo-${slug}`;

export const iconFor = (key?: string): { path: string } | null => {
  if (!key) return null;
  const icon = (simpleIcons as unknown as Record<string, { path: string } | undefined>)[key];
  return icon ?? null;
};
