import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center bg-ink py-32 text-off">
      <Container>
        <div className="max-w-2xl">
          <div className="font-display text-xs uppercase tracking-[0.3em] text-periwinkle">
            404
          </div>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[1] tracking-[-0.03em] text-balance">
            Esta página no existe (todavía).
          </h1>
          <p className="mt-6 max-w-xl text-lg text-off/70 text-pretty">
            Es probable que el enlace haya cambiado. Estos son los caminos que sí funcionan:
          </p>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              { href: "/", label: "Inicio" },
              { href: "/agencia", label: "Agencia" },
              { href: "/servicios", label: "Servicios" },
              { href: "/casos", label: "Casos" },
              { href: "/contacto", label: "Contacto" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex items-center justify-between rounded-xl border border-line bg-ink-soft/40 px-5 py-4 transition-colors hover:border-periwinkle/40 hover:bg-ink-soft/70"
                >
                  <span className="font-display text-base">{l.label}</span>
                  <ArrowUpRight
                    size={18}
                    className="text-off/45 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-periwinkle"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <ButtonLink href="/" variant="primary" size="lg">
              Volver al inicio <ArrowUpRight size={18} />
            </ButtonLink>
          </div>
        </div>
      </Container>
    </main>
  );
}
