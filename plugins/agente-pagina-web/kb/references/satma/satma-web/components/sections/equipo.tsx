import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/animations/reveal";
import { Tilt3D } from "@/components/effects/tilt-3d";
import { getPayloadClient } from "@/lib/payload-client";
import { cn } from "@/lib/utils";

/**
 * "Personas detrás de SATMA" — public team list pulled from Payload.
 * Mirrors the Santiago founder block above (4-col identity / 8-col
 * content) instead of the small-card grid we had before. Reads as a
 * continuation of his bio: same eyebrow + name + role typography,
 * same row geometry, separated by hairline dividers.
 *
 * Santiago is filtered out of this list — he has his own dedicated
 * row already. When the team grows, every new member surfaces here
 * automatically; CMS edits revalidate the page via the collection's
 * afterChange hook.
 */
export async function Equipo() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "team",
    sort: "order",
    limit: 30,
    overrideAccess: true,
    depth: 1, // populate the photo upload relation
  });

  // Pulls the best size (`card` → `avatar` → `thumbnail` → original).
  const pickPhoto = (
    photo: unknown,
  ): { url: string | null; alt: string } => {
    if (typeof photo !== "object" || photo === null)
      return { url: null, alt: "" };
    const p = photo as {
      url?: string;
      alt?: string;
      sizes?: {
        card?: { url?: string };
        avatar?: { url?: string };
        thumbnail?: { url?: string };
      };
    };
    return {
      url:
        p.sizes?.card?.url ??
        p.sizes?.avatar?.url ??
        p.sizes?.thumbnail?.url ??
        p.url ??
        null,
      alt: p.alt ?? "",
    };
  };

  const members = result.docs
    .map((doc) => {
      const dark = pickPhoto((doc as { photo?: unknown }).photo);
      const light = pickPhoto((doc as { photoLight?: unknown }).photoLight);
      return {
        id: doc.id,
        name: (doc as { name?: string }).name ?? "",
        role: (doc as { role?: string }).role ?? "",
        location: (doc as { location?: string }).location ?? "",
        bio: (doc as { bio?: string }).bio ?? "",
        linkedin: (doc as { linkedin?: string }).linkedin ?? "",
        // `photoDarkUrl` is the canonical photo (also used as fallback
        // for light mode if no light variant has been uploaded yet).
        photoDarkUrl: dark.url,
        photoLightUrl: light.url,
        photoAlt: dark.alt || light.alt,
      };
    })
    // Filter out Santiago — he has his own dedicated bio block above.
    .filter((m) => !/santiago\s+álvarez/i.test(m.name));

  if (members.length === 0) return null;

  return (
    <section
      id="equipo"
      className="relative overflow-hidden border-b border-line py-14 sm:py-20 lg:py-32"
    >
      <Container>
        {/* Section header — same SectionEyebrow + h2 cadence as the
            other top-level sections of /agencia. Single number for the
            whole block; each row underneath shares this context. */}
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionEyebrow number="04" label="Equipo" />
            <h2 className="mt-8 font-display text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
              Personas detrás de{" "}
              <span className="italic font-light text-periwinkle">SATMA</span>.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <p className="text-pretty text-base text-muted leading-relaxed lg:text-lg">
                Equipos pequeños, especialistas por disciplina. Sin cuentas
                rotando con 200 ejecutivos — cada cliente tiene un punto de
                contacto fijo y un equipo dedicado.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Member rows — each one repeats the Santiago layout proportions
            (4-col identity / 8-col content) so the section reads as a
            continuation of his bio rather than a different visual idiom. */}
        <ul className="mt-12 divide-y divide-line border-t border-line sm:mt-16 lg:mt-20">
          {members.map((m, i) => (
            <li
              key={m.id}
              id={slugify(m.name)}
              className="scroll-mt-24 py-12 lg:py-16"
            >
              <div className="grid gap-10 lg:grid-cols-12">
                {/* ── Identity column — name + role + location + PHOTO. ──
                      The photo sits below the meta block so the visual
                      stays anchored to the person. Bio + LinkedIn live in
                      the right column to keep the reading flow clean. ── */}
                <div className="lg:col-span-4">
                  <h3 className="font-display text-[clamp(1.5rem,3.25vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.025em] text-balance text-off">
                    {m.name}
                  </h3>
                  <div className="mt-3 text-sm uppercase tracking-[0.22em] text-periwinkle">
                    {m.role}
                  </div>
                  {m.location && (
                    <div className="mt-2 text-sm text-muted">
                      {m.location}
                    </div>
                  )}
                  <div className="mt-6">
                    <MemberPhoto
                      photoDarkUrl={m.photoDarkUrl}
                      photoLightUrl={m.photoLightUrl}
                      photoAlt={m.photoAlt || m.name}
                      name={m.name}
                    />
                  </div>
                </div>

                {/* ── Content column — bio + LinkedIn only. ── */}
                <div className="lg:col-span-8">
                  <Reveal delay={i * 0.06}>
                    <MemberBody bio={m.bio} linkedin={m.linkedin} />
                  </Reveal>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/**
 * Photo block for the LEFT column. Handles theme-aware swap (when a
 * `photoLight` variant exists) or a single render (when only the
 * dark `photo` is set). Falls back to a stylized placeholder so the
 * column doesn't shift its size before the editor uploads a headshot.
 */
function MemberPhoto({
  photoDarkUrl,
  photoLightUrl,
  photoAlt,
  name,
}: {
  photoDarkUrl: string | null;
  photoLightUrl: string | null;
  photoAlt: string;
  name: string;
}) {
  // Effective URLs per theme. If the editor only uploaded one variant,
  // it's used for both modes (no fall-through to placeholder).
  const darkUrl = photoDarkUrl ?? photoLightUrl;
  const lightUrl = photoLightUrl ?? photoDarkUrl;

  if (!darkUrl && !lightUrl) {
    return (
      <Tilt3D className="w-fit" intensity={6}>
        <PhotoPlaceholder name={name} />
      </Tilt3D>
    );
  }

  return (
    <Tilt3D className="w-fit" intensity={6}>
      <div className="relative aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl border border-line bg-ink-soft shadow-card transition-all duration-300 hover:scale-[1.02] hover:shadow-card-hover sm:max-w-[280px]">
        {darkUrl && lightUrl && darkUrl !== lightUrl ? (
          <>
            <Image
              src={darkUrl}
              alt={photoAlt}
              fill
              sizes="(max-width: 768px) 80vw, 280px"
              className="satma-theme-dark-only object-cover"
            />
            <Image
              src={lightUrl}
              alt={photoAlt}
              fill
              sizes="(max-width: 768px) 80vw, 280px"
              className="satma-theme-light-only object-cover"
            />
          </>
        ) : (
          <Image
            src={(darkUrl ?? lightUrl) as string}
            alt={photoAlt}
            fill
            sizes="(max-width: 768px) 80vw, 280px"
            className="object-cover"
          />
        )}
      </div>
    </Tilt3D>
  );
}

/**
 * Right column body — bio + LinkedIn link. Bio shows a soft italic
 * placeholder when not yet filled in by the editor.
 */
function MemberBody({ bio, linkedin }: { bio: string; linkedin: string }) {
  const hasBio = Boolean(bio.trim());
  return (
    <div className="flex flex-col gap-6">
      {hasBio ? (
        <p className="text-pretty text-base text-muted leading-relaxed lg:text-lg">
          {bio}
        </p>
      ) : (
        <p className="text-sm italic text-muted/70">
          Bio detallada próximamente.
        </p>
      )}

      {linkedin && (
        <Link
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-ink-soft/40 px-5 py-2.5 text-sm transition-colors hover:border-periwinkle/60 hover:text-periwinkle"
        >
          LinkedIn
          <ArrowUpRight size={14} />
        </Link>
      )}
    </div>
  );
}

/**
 * Visual placeholder when no photo has been uploaded yet. Reads as a
 * deliberate empty state, not as a broken image. Uses the same square
 * geometry the real photo will take so the row layout doesn't shift
 * once the editor uploads the headshot.
 */
function PhotoPlaceholder({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "·";
  // Generic "area team" rows (e.g. "Equipo creativo") get a Sparkles
  // icon instead of a letter — feels intentional, not blank.
  const isAreaTeam = /^equipo/i.test(name);
  return (
    <div
      className={cn(
        "relative flex aspect-square w-full max-w-[280px] items-center justify-center overflow-hidden rounded-2xl",
        "border border-periwinkle/20 bg-gradient-to-br from-periwinkle/10 via-mist/5 to-transparent",
        "sm:max-w-[320px]",
      )}
      aria-hidden="true"
    >
      {/* Soft halo behind the glyph */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(closest-side, rgba(179,203,255,0.18), transparent 70%)",
        }}
      />
      {isAreaTeam ? (
        <Sparkles size={56} className="relative text-periwinkle" />
      ) : (
        <span
          className="relative font-display text-[clamp(4rem,12vw,6rem)] font-medium tracking-[-0.04em] text-periwinkle"
        >
          {initial}
        </span>
      )}
    </div>
  );
}

/** Slugify a name into an anchor id (e.g. "Fatima Navarro" → "fatima-navarro"). */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    // Strip combining diacritics (Unicode range U+0300..U+036F).
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
