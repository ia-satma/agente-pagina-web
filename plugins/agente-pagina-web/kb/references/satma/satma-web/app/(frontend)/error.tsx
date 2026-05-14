"use client";

import * as React from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink, Button } from "@/components/ui/button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  React.useEffect(() => {
    // Surface the error to monitoring (Vercel Analytics, Sentry, etc.) if wired
    console.error("[satma] route error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[80vh] items-center bg-ink py-32 text-off">
      <Container>
        <div className="max-w-2xl">
          <div className="font-display text-xs uppercase tracking-[0.3em] text-periwinkle">
            Error inesperado
          </div>
          <h1 className="mt-6 font-display text-[clamp(1.625rem,3.75vw,3.5rem)] font-medium leading-[1] tracking-[-0.03em] text-balance">
            Algo salió mal de nuestro lado.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-off/70 text-pretty">
            Ya estamos enterados y revisando. Puedes intentar recargar la sección o regresar al inicio. Si el problema persiste, escríbenos a{" "}
            <a href="mailto:santiago@satma.mx" className="text-periwinkle hover:underline">
              santiago@satma.mx
            </a>
            .
          </p>

          {error.digest && (
            <p className="mt-4 font-mono text-xs text-off/55">
              ID: {error.digest}
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Button variant="primary" size="lg" onClick={reset}>
              <RefreshCw size={18} /> Reintentar
            </Button>
            <ButtonLink href="/" variant="secondary" size="lg">
              <ArrowUpRight size={18} /> Volver al inicio
            </ButtonLink>
          </div>
        </div>
      </Container>
    </main>
  );
}
