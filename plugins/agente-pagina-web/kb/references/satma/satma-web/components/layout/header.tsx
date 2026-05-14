"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, X, ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SatmaLogo } from "@/components/ui/satma-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Magnetic } from "@/components/effects/magnetic";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/navigation";

type HeaderProps = {
  /** Nav items, already filtered to enabled-only by the server. Order
   *  is whatever the editor set in /admin → Globals → "Menú de
   *  navegación". */
  navItems: NavItem[];
};

export function Header({ navItems }: HeaderProps) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  // Show "Inicio" in the nav whenever the user is on any page that
  // ISN'T the home page. The Satma logo on the left also links home,
  // but explicit "Inicio" link is more discoverable for users coming
  // from a deep page (especially mobile).
  const pathname = usePathname();
  const showInicio = pathname !== "/";

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape — required for keyboard accessibility (WCAG 2.1.2)
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-line bg-ink/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between lg:h-20">
        <Link
          href="/"
          aria-label="satma — Inicio"
          onClick={() => setOpen(false)}
          className="focus-ring block text-off transition-opacity hover:opacity-80"
        >
          <SatmaLogo className="h-4 w-auto lg:h-[18px]" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {/* Inicio link — only on non-home pages so users on a deep
              route (like /casos or /agencia) have an obvious way back
              without having to spot the logo. Has a Home icon to
              read instantly, no extra label needed. */}
          {showInicio && (
            <Link
              href="/"
              aria-label="Inicio"
              className="focus-ring group relative inline-flex items-center gap-1.5 text-sm text-periwinkle transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.06]"
            >
              <Home size={15} strokeWidth={1.6} />
              Inicio
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-periwinkle transition-all duration-300 ease-out group-hover:w-full" />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-periwinkle/0 blur-md transition-all duration-300 group-hover:bg-periwinkle/15"
              />
            </Link>
          )}
          {/* Desktop nav: show all enabled items EXCEPT /contacto, since
              the "Empezar proyecto" CTA on the right already routes there.
              Editor can also explicitly disable Contacto from /admin to
              hide it everywhere. */}
          {navItems
            .filter((item) => item.href !== "/contacto")
            .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring group relative inline-block text-sm text-off/70 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.06] hover:text-periwinkle"
            >
              {item.label}
              {/* Underline draws from left to right on hover */}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-periwinkle transition-all duration-300 ease-out group-hover:w-full" />
              {/* Subtle glow puddle behind the label */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-periwinkle/0 blur-md transition-all duration-300 group-hover:bg-periwinkle/15"
              />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Magnetic strength={0.25} radius={100}>
            <ButtonLink href="/contacto" variant="primary" size="sm">
              Empezar proyecto <ArrowUpRight size={16} />
            </ButtonLink>
          </Magnetic>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle className="size-9" />
          <button
            onClick={() => setOpen((o) => !o)}
            className="-mr-2 p-2 transition-transform duration-300 ease-out hover:scale-110 active:scale-95"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="lg:hidden">
          <Container className="flex flex-col gap-1 border-t border-line py-6">
            {/* Inicio link first when not on home — same pattern as
                desktop: prominent way back to the landing page. */}
            {showInicio && (
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="focus-ring group flex items-center justify-between border-b border-line/50 py-4 font-display text-2xl tracking-tight text-periwinkle transition-all duration-300 ease-out hover:translate-x-2 active:translate-x-1"
              >
                <span className="flex items-center gap-3">
                  <Home size={22} strokeWidth={1.6} />
                  Inicio
                </span>
                <span className="text-xs text-periwinkle/55 transition-all duration-300 group-hover:translate-x-1">
                  00
                </span>
              </Link>
            )}
            {/* Mobile menu shows ALL enabled items including Contacto —
                the CTA button at the bottom is bigger / styled, but on
                mobile a quick tap on the regular link is also valid. */}
            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="focus-ring group flex items-center justify-between border-b border-line/50 py-4 font-display text-2xl tracking-tight text-off transition-all duration-300 ease-out hover:translate-x-2 hover:text-periwinkle active:translate-x-1"
              >
                <span>{item.label}</span>
                <span className="text-xs text-off/55 transition-all duration-300 group-hover:text-periwinkle group-hover:translate-x-1">
                  0{i + 1}
                </span>
              </Link>
            ))}
            <ButtonLink
              href="/contacto"
              variant="primary"
              size="lg"
              className="mt-6 self-start"
              onClick={() => setOpen(false)}
            >
              Empezar proyecto <ArrowUpRight size={18} />
            </ButtonLink>
          </Container>
        </div>
      )}
    </header>
  );
}
