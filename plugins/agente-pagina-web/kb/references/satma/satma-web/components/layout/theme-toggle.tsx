"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "satma-theme";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = React.useState<"dark" | "light">("light");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Read the actual theme set on <html data-theme="..."> by ThemeInit
    // (which runs before hydration via inline script). We then sync
    // the React state to match — required because the SSR'd attribute
    // is the source of truth and we can only access it client-side.
    // The set-state-in-effect rule is the right pattern here.
    const current = (document.documentElement.getAttribute("data-theme") as
      | "dark"
      | "light"
      | null) ?? "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current);
    setMounted(true);
  }, []);

  const toggle = React.useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable, fall back to in-memory state
    }
  }, [theme]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Cambiar a modo día" : "Cambiar a modo noche"
      }
      className={cn(
        "relative grid size-10 place-items-center rounded-full border border-line text-off/70 transition-all duration-300 ease-out hover:scale-110 hover:border-periwinkle/60 hover:text-periwinkle active:scale-95",
        className,
      )}
      // Avoid hydration mismatch flicker — render sun initially (light default),
      // swap after mount once we know the actual theme.
      suppressHydrationWarning
    >
      {mounted && theme === "dark" ? (
        <Moon size={16} strokeWidth={1.8} />
      ) : (
        <Sun size={16} strokeWidth={1.8} />
      )}
    </button>
  );
}
