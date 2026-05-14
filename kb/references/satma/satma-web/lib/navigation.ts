/**
 * Navigation helper — reads the public site menu from Payload's
 * `navigation` global. Returns ONLY the items the editor has marked
 * as `enabled`, preserving the order they have in /admin.
 *
 * On any failure (DB unavailable, global not yet seeded) we fall back
 * to the hardcoded list from `lib/site.ts` so the public pages never
 * end up with an empty header / footer.
 */
import { getPayloadClient } from "@/lib/payload-client";
import { site } from "@/lib/site";

export type NavItem = {
  label: string;
  href: string;
};

// Defaults match the original hardcoded `site.nav`. brujer.ia is hidden
// by default to mirror the previous "commented out until ready" state.
const DEFAULTS: NavItem[] = site.nav.map((n) => ({
  label: n.label,
  href: n.href,
}));

type NavigationDoc = {
  items?: Array<{
    label?: string;
    href?: string;
    enabled?: boolean;
  }>;
};

export async function getNavigation(): Promise<NavItem[]> {
  try {
    const payload = await getPayloadClient();
    const doc = (await payload.findGlobal({
      slug: "navigation" as never,
      overrideAccess: true,
      depth: 0,
    })) as unknown as NavigationDoc;

    if (!Array.isArray(doc.items) || doc.items.length === 0) {
      return DEFAULTS;
    }

    return doc.items
      .filter(
        (item) =>
          item.enabled !== false && // default true
          typeof item.label === "string" &&
          typeof item.href === "string" &&
          item.label.trim().length > 0 &&
          item.href.trim().length > 0,
      )
      .map((item) => ({
        label: item.label as string,
        href: item.href as string,
      }));
  } catch (err) {
    console.warn(
      "[navigation] failed to load global — falling back to defaults:",
      err,
    );
    return DEFAULTS;
  }
}
