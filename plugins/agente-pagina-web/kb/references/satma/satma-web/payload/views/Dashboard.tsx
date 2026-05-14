import React from "react";
import Link from "next/link";
import type {
  DashboardViewServerProps,
} from "@payloadcms/next/views";

type RecentItem = {
  id: string | number;
  title: string;
  collectionSlug: string;
  collectionLabel: string;
  badge?: string;
  updatedAt: string;
  editHref: string;
};

const COLLECTION_LABELS: Record<string, string> = {
  posts: "Blog",
  cases: "Casos",
  services: "Servicios",
  industries: "Industrias",
  team: "Equipo",
  testimonials: "Testimonios",
  media: "Media",
};

const QUICK_ACTIONS: Array<
  | {
      kind: "link";
      label: string;
      href: string;
      icon: string;
      primary?: boolean;
      muted?: boolean;
      external?: boolean;
    }
  | { kind: "divider"; label: string }
> = [
  { kind: "divider", label: "Contenido" },
  { kind: "link", label: "Nuevo post", href: "/admin/collections/posts/create", icon: "pencil", primary: true },
  { kind: "link", label: "Todos los posts", href: "/admin/collections/posts", icon: "list" },
  { kind: "link", label: "Nuevo caso", href: "/admin/collections/cases/create", icon: "plus" },
  { kind: "link", label: "Todos los casos", href: "/admin/collections/cases", icon: "list" },
  { kind: "divider", label: "Sitio" },
  { kind: "link", label: "Servicios", href: "/admin/collections/services", icon: "grid" },
  { kind: "link", label: "Industrias", href: "/admin/collections/industries", icon: "grid" },
  { kind: "link", label: "Testimonios", href: "/admin/collections/testimonials", icon: "quote" },
  { kind: "link", label: "Equipo", href: "/admin/collections/team", icon: "users" },
  { kind: "link", label: "Galería de medios", href: "/admin/collections/media", icon: "image" },
  { kind: "divider", label: "Sistema" },
  { kind: "link", label: "Configuración general", href: "/admin/globals/settings", icon: "cog" },
  { kind: "link", label: "Usuarios y roles", href: "/admin/collections/users", icon: "key" },
  { kind: "link", label: "Ver sitio público", href: "/", icon: "external", external: true, muted: true },
];

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function getTitleFrom(doc: Record<string, unknown>, slug: string): string {
  if (typeof doc.title === "string" && doc.title) return doc.title;
  if (typeof doc.name === "string" && doc.name) return doc.name;
  if (typeof doc.author === "string" && doc.author && slug === "testimonials") {
    const company = typeof doc.company === "string" ? doc.company : "";
    return company ? `${doc.author} — ${company}` : doc.author;
  }
  if (typeof doc.alt === "string" && doc.alt) return doc.alt;
  if (typeof doc.filename === "string" && doc.filename) return doc.filename;
  return `(sin título · ${slug})`;
}

function getBadgeFrom(doc: Record<string, unknown>, slug: string): string | undefined {
  if (slug === "cases" && doc.industry) {
    const ind = doc.industry;
    if (typeof ind === "object" && ind !== null && "name" in ind) {
      return String((ind as Record<string, unknown>).name);
    }
  }
  if (slug === "services" && doc.icon) return String(doc.icon);
  if (slug === "industries" && doc.comingSoon) return "Próximamente";
  return undefined;
}

export async function CustomDashboard(props: DashboardViewServerProps) {
  const { payload, user } = props;
  const collectionsToScan = ["posts", "cases", "services", "industries", "testimonials", "team"] as const;

  const results = await Promise.all(
    collectionsToScan.map(async (slug) => {
      try {
        const res = await payload.find({
          collection: slug,
          limit: 5,
          sort: "-updatedAt",
          depth: 1,
          overrideAccess: true,
        });
        return res.docs.map((doc) => ({
          slug,
          doc: doc as unknown as Record<string, unknown>,
        }));
      } catch {
        return [];
      }
    })
  );

  const recent: RecentItem[] = results
    .flat()
    .map(({ slug, doc }, idx) => ({
      // Stable fallback id (slug + index) when neither `id` nor `_id` is
      // present — Math.random() would re-roll on each render and trip
      // React's purity rule.
      id: String(doc.id ?? doc._id ?? `${slug}-${idx}`),
      title: getTitleFrom(doc, slug),
      collectionSlug: slug,
      collectionLabel: COLLECTION_LABELS[slug] ?? slug,
      badge: getBadgeFrom(doc, slug),
      updatedAt: typeof doc.updatedAt === "string" ? doc.updatedAt : new Date().toISOString(),
      editHref: `/admin/collections/${slug}/${doc.id ?? doc._id}`,
    }))
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 6);

  const userName =
    (typeof user?.name === "string" && user.name) ||
    (typeof user?.email === "string" && user.email) ||
    "Equipo SATMA";

  return (
    <div className="satma-dash">
      <header className="satma-dash__hero">
        <div>
          <p className="satma-dash__eyebrow">Panel administrativo</p>
          <h1 className="satma-dash__title">
            Hola, {userName.split("@")[0].split(" ")[0]}.
          </h1>
          <p className="satma-dash__subtitle">
            Gestiona el contenido del sitio satma.mx desde aquí. Todos los cambios se publican en tiempo real.
          </p>
        </div>
        <a
          className="satma-dash__view-site"
          href="/"
          target="_blank"
          rel="noreferrer"
        >
          Ver sitio público
          <span aria-hidden>↗</span>
        </a>
      </header>

      <div className="satma-dash__grid">
        <section className="satma-card satma-card--recent">
          <div className="satma-card__head">
            <div className="satma-card__head-title">
              <span className="satma-card__icon" aria-hidden>
                ⏱
              </span>
              <h2>Actividad reciente</h2>
            </div>
            <Link className="satma-card__link" href="/admin/collections/posts">
              Ver todo
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="satma-empty">
              <p>Aún no hay actividad. Crea tu primer post o caso para empezar.</p>
              <Link className="satma-btn satma-btn--primary" href="/admin/collections/posts/create">
                + Crear primer post
              </Link>
            </div>
          ) : (
            <ul className="satma-activity">
              {recent.map((item) => (
                <li key={`${item.collectionSlug}-${item.id}`} className="satma-activity__row">
                  <div className="satma-activity__main">
                    <h3 className="satma-activity__title">{item.title}</h3>
                    <div className="satma-activity__meta">
                      <span className="satma-tag">{item.collectionLabel}</span>
                      {item.badge && <span className="satma-tag satma-tag--soft">{item.badge}</span>}
                      <span className="satma-activity__date">
                        {dateFormatter.format(new Date(item.updatedAt))}
                      </span>
                    </div>
                  </div>
                  <Link className="satma-activity__edit" href={item.editHref}>
                    Editar
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="satma-card satma-card--actions">
          <div className="satma-card__head">
            <div className="satma-card__head-title">
              <span className="satma-card__icon" aria-hidden>
                ⚡
              </span>
              <h2>Acciones rápidas</h2>
            </div>
          </div>

          <ul className="satma-actions">
            {QUICK_ACTIONS.map((entry, i) => {
              if (entry.kind === "divider") {
                return (
                  <li key={`d-${i}`} className="satma-actions__divider">
                    {entry.label}
                  </li>
                );
              }
              const className = [
                "satma-actions__item",
                entry.primary ? "satma-actions__item--primary" : "",
                entry.muted ? "satma-actions__item--muted" : "",
              ]
                .filter(Boolean)
                .join(" ");

              if (entry.external) {
                return (
                  <li key={entry.href}>
                    <a className={className} href={entry.href} target="_blank" rel="noreferrer">
                      <span className="satma-actions__icon" aria-hidden>
                        ↗
                      </span>
                      <span>{entry.label}</span>
                    </a>
                  </li>
                );
              }
              return (
                <li key={entry.href}>
                  <Link className={className} href={entry.href}>
                    <span className="satma-actions__icon" aria-hidden>
                      {entry.primary ? "+" : "›"}
                    </span>
                    <span>{entry.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
