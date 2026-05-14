import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

/**
 * Map a collection slug to the public-facing paths that depend on it.
 * Add new entries here if you add a new collection that surfaces on the site.
 */
const PATHS_BY_COLLECTION: Record<string, string[]> = {
  services: ["/", "/servicios", "/agencia"],
  industries: ["/", "/industrias", "/casos"],
  cases: ["/", "/casos", "/agencia", "/industrias"],
  portfolio: ["/", "/portafolio"],
  testimonials: ["/", "/agencia", "/casos"],
  team: ["/", "/agencia"],
  posts: ["/", "/blog"],
  media: ["/"],
};

const SETTINGS_PATHS = ["/", "/contacto", "/agencia"];

/** Re-render every page that depends on this collection after edits. */
export const revalidateCollection: CollectionAfterChangeHook = ({
  collection,
}) => {
  const paths = PATHS_BY_COLLECTION[collection.slug] ?? ["/"];
  for (const p of paths) {
    try {
      revalidatePath(p);
    } catch {
      // revalidatePath only works in a request context. During seed/CLI runs
      // it throws — safe to ignore there.
    }
  }
};

export const revalidateOnDelete: CollectionAfterDeleteHook = ({
  collection,
}) => {
  const paths = PATHS_BY_COLLECTION[collection.slug] ?? ["/"];
  for (const p of paths) {
    try {
      revalidatePath(p);
    } catch {
      // see note above
    }
  }
};

/** Settings global — affects header/footer/contact info, so revalidate broadly. */
export const revalidateSettings: GlobalAfterChangeHook = () => {
  for (const p of SETTINGS_PATHS) {
    try {
      revalidatePath(p);
    } catch {
      // see note above
    }
  }
};

/**
 * Navigation global — appears in the layout (header + footer of EVERY
 * page), so we revalidate at the layout level which busts the cache for
 * the entire (frontend) tree in one shot.
 */
export const revalidateNavigation: GlobalAfterChangeHook = () => {
  try {
    revalidatePath("/", "layout");
  } catch {
    // see note above
  }
};
