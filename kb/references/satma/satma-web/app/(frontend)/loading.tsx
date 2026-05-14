import { Container } from "@/components/ui/container";

/**
 * Subtle skeleton screen while a route segment is loading.
 * Uses brand tokens so it adapts to dark/light mode automatically.
 */
export default function Loading() {
  return (
    <main className="bg-ink py-40 text-off">
      <Container>
        <div className="space-y-8">
          <div className="h-3 w-32 animate-pulse rounded-full bg-off/10" />
          <div className="space-y-4">
            <div className="h-10 w-3/4 animate-pulse rounded-2xl bg-off/10" />
            <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-off/10" />
            <div className="h-10 w-1/2 animate-pulse rounded-2xl bg-off/10" />
          </div>
          <div className="grid gap-3 pt-12 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl bg-off/10"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
