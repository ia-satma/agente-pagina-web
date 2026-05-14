"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Detect Vimeo or YouTube and return a `background mode` embed URL — no
 * controls, autoplay, looped, muted. Perfect for grid covers / hero loops.
 *
 * Supported input shapes:
 *   - https://vimeo.com/123456789
 *   - https://vimeo.com/123456789/abcdef       (private/with hash)
 *   - https://player.vimeo.com/video/123456789
 *   - https://youtube.com/watch?v=ABC123
 *   - https://youtu.be/ABC123
 *   - https://youtube.com/shorts/ABC123
 *
 * Returns `{ src, platform }` or `null` if URL doesn't match.
 */
type Platform = "vimeo" | "youtube";

function parseVideoUrl(url: string): { src: string; platform: Platform } | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Vimeo
  const vimeoMatch = trimmed.match(
    /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)(?:\/([a-zA-Z0-9]+))?/,
  );
  if (vimeoMatch) {
    const [, id, hash] = vimeoMatch;
    // background=1 → no controls, autoplay, loop, muted
    const params = new URLSearchParams({
      background: "1",
      autoplay: "1",
      loop: "1",
      muted: "1",
      title: "0",
      byline: "0",
      portrait: "0",
      transparent: "0",
    });
    if (hash) params.set("h", hash); // private video hash if any
    return {
      src: `https://player.vimeo.com/video/${id}?${params.toString()}`,
      platform: "vimeo",
    };
  }

  // YouTube
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch) {
    const [, id] = ytMatch;
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      controls: "0",
      loop: "1",
      playlist: id, // YouTube needs `playlist=ID` to loop a single video
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
      iv_load_policy: "3",
    });
    return {
      src: `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`,
      platform: "youtube",
    };
  }

  return null;
}

type Props = {
  url: string;
  className?: string;
  /** Title for accessibility (defaults to "Video"). */
  title?: string;
  /** When true, the iframe only mounts after the parent enters the viewport. */
  lazy?: boolean;
};

/**
 * Background-mode video embed for Vimeo / YouTube.
 *
 * - Uses the `background=1` flag (Vimeo) / equivalent (YouTube) so the
 *   player auto-plays muted, loops, and shows no chrome.
 * - Iframe pointer-events disabled (use a link wrapper for click handling).
 * - Lazy mounts via IntersectionObserver to keep first paint cheap.
 */
export function VideoEmbed({ url, className, title = "Video", lazy = true }: Props) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = React.useState(!lazy);

  React.useEffect(() => {
    if (!lazy) return;
    const node = wrapperRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldMount(true);
            obs.disconnect();
            return;
          }
        }
      },
      { rootMargin: "200px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [lazy]);

  const parsed = parseVideoUrl(url);
  if (!parsed) return null;

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      {shouldMount && (
        <iframe
          src={parsed.src}
          title={title}
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture"
          // Native-size fill of the container — Vimeo's background=1 / YouTube
          // mute+autoplay+controls=0 already strip all chrome, so the iframe
          // just needs to fit the container exactly. No scale, no offset.
          className="absolute inset-0 h-full w-full border-0"
        />
      )}
    </div>
  );
}
