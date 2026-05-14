import Link from "next/link";
import { Mail, Phone, MapPin, ArrowUpRight, Lock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { BrandMesh } from "@/components/ui/brand-mesh";
import { ScrollParallax } from "@/components/effects/scroll-parallax";
import { SatmaLogo } from "@/components/ui/satma-logo";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/ui/social-icons";
import { getSettings } from "@/lib/get-settings";
import { getNavigation } from "@/lib/navigation";

export async function Footer() {
  const year = new Date().getFullYear();
  const [settings, navItems] = await Promise.all([
    getSettings(),
    getNavigation(),
  ]);
  const { contact, socials, description } = settings;

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink text-off">
      {/* Brand mesh — geometric grid-dot pattern instead of the wireframe
          globe. Theme-aware tint: dark gray on light bg, light gray on dark.
          Soft radial mask + scroll parallax so the mesh drifts as the
          footer enters view. */}
      <ScrollParallax
        speed={0.6}
        className="pointer-events-none absolute -bottom-[20%] right-[-10%] h-[110%] w-[55%] text-off/30"
      >
        <div
          aria-hidden
          className="h-full w-full"
          style={{
            maskImage:
              "radial-gradient(closest-side, black 25%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(closest-side, black 25%, transparent 80%)",
          }}
        >
          <BrandMesh variant="grid-dot" cell={44} strokeWidth={0.5} />
        </div>
      </ScrollParallax>

      <Container className="relative py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <ScrollParallax speed={0.2} className="lg:col-span-5">
            <Link
              href="/"
              aria-label="satma — Inicio"
              className="block text-off transition-opacity hover:opacity-80"
            >
              <SatmaLogo className="h-6 w-auto lg:h-7" />
            </Link>
            <p className="mt-5 max-w-sm text-sm text-off/60 text-pretty">
              {description}
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { href: socials.instagram, icon: InstagramIcon, label: "Instagram" },
                { href: socials.facebook, icon: FacebookIcon, label: "Facebook" },
                { href: socials.x, icon: XIcon, label: "X" },
                { href: socials.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full border border-line p-2.5 text-off/70 transition-all duration-300 ease-out hover:scale-110 hover:border-periwinkle/50 hover:text-periwinkle active:scale-95"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </ScrollParallax>

          <ScrollParallax speed={0.1} className="lg:col-span-3">
            <h4 className="font-display text-xs uppercase tracking-[0.25em] text-off/55">
              Navegación
            </h4>
            <ul className="mt-4 space-y-3">
              {/* Footer nav reads from the editor-controlled global so
                  hidden items disappear here too. */}
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="focus-ring group inline-flex items-center gap-2 text-sm text-off/80 transition-colors hover:text-periwinkle"
                  >
                    {item.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollParallax>

          <ScrollParallax speed={-0.05} className="lg:col-span-4">
            <h4 className="font-display text-xs uppercase tracking-[0.25em] text-off/55">
              Contacto
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-off/80">
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-periwinkle" />
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-periwinkle"
                >
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-periwinkle" />
                <div className="space-y-0.5">
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="block hover:text-periwinkle"
                  >
                    {contact.phone}
                  </a>
                  <a
                    href={`tel:${contact.phoneAlt.replace(/\s/g, "")}`}
                    className="block text-xs text-off/55 hover:text-periwinkle"
                  >
                    {contact.phoneAlt}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-periwinkle" />
                <span className="leading-relaxed">
                  {contact.address.street}
                  <br />
                  {contact.address.neighborhood}
                  <br />
                  {contact.address.city}, {contact.address.state}{" "}
                  {contact.address.zip}
                </span>
              </li>
            </ul>
          </ScrollParallax>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <p className="text-xs text-off/55">
              © {year} satma agencia creativa. Hecho en Monterrey, MX.
            </p>
            <Link
              href="/admin"
              aria-label="Acceder al panel administrativo"
              title="Panel administrativo"
              className="group inline-flex size-7 items-center justify-center rounded-full border border-line text-off/55 transition-all duration-300 ease-out hover:scale-110 hover:border-periwinkle/50 hover:text-periwinkle active:scale-95"
            >
              <Lock size={12} strokeWidth={1.8} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-off/60">
            <Link
              href="/aviso-privacidad"
              className="focus-ring hover:text-periwinkle"
            >
              Aviso de privacidad
            </Link>
            <Link
              href="/politica-cookies"
              className="focus-ring hover:text-periwinkle"
            >
              Política de cookies
            </Link>
            <Link
              href="/contrato-servicios"
              className="focus-ring hover:text-periwinkle"
            >
              Contrato de servicios
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
