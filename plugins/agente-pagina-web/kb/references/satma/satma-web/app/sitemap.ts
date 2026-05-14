import type { MetadataRoute } from "next";
import { getPayloadClient } from "@/lib/payload-client";
import { site } from "@/lib/site";

/**
 * Dynamic sitemap.xml — lists static pages first (highest authority,
 * mostly stable URLs) then queries Payload for any published content
 * (blog posts, cases, portfolio, services, industries) so newly added
 * entries get indexed without a redeploy.
 *
 * Next.js serves this at /sitemap.xml automatically thanks to the
 * `app/sitemap.ts` metadata-route convention.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  const now = new Date();

  // ── Static landing-tier pages (in order of SEO priority) ────────────
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`,           lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/servicios`,  lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/casos`,      lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/industrias`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/portafolio`, lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${base}/agencia`,    lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contacto`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/blog`,       lastModified: now, changeFrequency: "weekly",  priority: 0.75 },
    { url: `${base}/brujer-ia`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // Legal pages — kept indexable but at lower priority.
    { url: `${base}/aviso-privacidad`,    lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/politica-cookies`,    lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/contrato-servicios`,  lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  // ── Dynamic content from Payload ─────────────────────────────────────
  // We try/catch each collection separately so a single failure doesn't
  // wipe the whole sitemap (better partial than empty).
  const dynamicEntries: MetadataRoute.Sitemap = [];

  try {
    const payload = await getPayloadClient();

    const collections: Array<{
      slug: "posts" | "cases" | "portfolio" | "services" | "industries";
      basePath: string;
      changeFrequency: "weekly" | "monthly";
      priority: number;
    }> = [
      { slug: "posts",      basePath: "/blog",       changeFrequency: "weekly",  priority: 0.7 },
      { slug: "cases",      basePath: "/casos",      changeFrequency: "monthly", priority: 0.8 },
      { slug: "portfolio",  basePath: "/portafolio", changeFrequency: "monthly", priority: 0.7 },
      { slug: "services",   basePath: "/servicios",  changeFrequency: "monthly", priority: 0.85 },
      { slug: "industries", basePath: "/industrias", changeFrequency: "monthly", priority: 0.8 },
    ];

    for (const c of collections) {
      try {
        const result = await payload.find({
          collection: c.slug,
          limit: 200,
          overrideAccess: true,
          // Only `posts` has drafts enabled in our Payload config — for
          // the other collections, the `_status` field doesn't exist so
          // querying it 400s.
          ...(c.slug === "posts"
            ? { where: { _status: { equals: "published" } } }
            : {}),
          depth: 0,
        });
        for (const doc of result.docs) {
          const slug = (doc as { slug?: string }).slug;
          if (!slug) continue;
          const updatedAt =
            (doc as { updatedAt?: string }).updatedAt ??
            (doc as { publishedAt?: string }).publishedAt ??
            now.toISOString();
          dynamicEntries.push({
            url: `${base}${c.basePath}/${slug}`,
            lastModified: new Date(updatedAt),
            changeFrequency: c.changeFrequency,
            priority: c.priority,
          });
        }
      } catch (err) {
        // Collection might not have detail pages yet — log and skip.
        console.warn(`[sitemap] collection ${c.slug} failed:`, err);
      }
    }
  } catch (err) {
    console.warn("[sitemap] Payload unavailable, returning static only:", err);
  }

  return [...staticEntries, ...dynamicEntries];
}
