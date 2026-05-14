"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * Scroll-driven video intro for the home page.
 *
 * Architecture (the third revision — first two had subtle bugs):
 *
 *   • BOTH theme variants are rendered in the DOM at once. CSS classes
 *     `.satma-theme-dark-only` / `.satma-theme-light-only` (defined in
 *     globals.css) hide the inactive one based on `<html data-theme>`.
 *     This is the same pattern used for the Fatima photos. Theme
 *     toggling is a CSS visibility flip — INSTANT, no reload, no flash.
 *
 *   • A SINGLE ScrollTrigger drives the active video's `currentTime`
 *     via `onUpdate`. We read the active theme from a ref (not closure
 *     capture) so theme toggles take effect on the very next frame
 *     without rebuilding the trigger.
 *
 *   • When theme changes, an effect re-syncs the newly-active video
 *     to the current scroll progress so the user sees the right frame
 *     immediately on toggle.
 *
 *   • NO `autoplay` attribute — that was the previous bug: the video
 *     started playing through before scrub took over, and on theme
 *     swap the new video would autoplay too. Now both videos sit
 *     paused at frame 0 until ScrollTrigger drives them.
 *
 *   • Mobile / coarse-pointer / reduced-motion paths fall back to a
 *     simple muted autoplay-loop on the active variant only.
 *
 * The MP4s are encoded with every frame as a key-frame
 * (`-g 1 -keyint_min 1 -no-scenecut 1`) so seeking is instant. Same
 * trick Apple uses on the iPhone product pages.
 */
export function HeroVideoScrollIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const darkVideoRef = useRef<HTMLVideoElement>(null);
  const lightVideoRef = useRef<HTMLVideoElement>(null);
  // We keep theme in a ref instead of state because ScrollTrigger's
  // onUpdate captures closure once at trigger creation; using a ref
  // guarantees it always reads the latest value without rebuilding
  // the trigger on every theme toggle.
  const themeRef = useRef<"light" | "dark">("dark");

  // ── Mirror site's data-theme into the ref. Re-syncs the active
  //    video to the current scroll position on each theme change so
  //    the user sees the correct frame instantly. ──────────────────
  useEffect(() => {
    if (typeof document === "undefined") return;

    const sync = () => {
      const trigger = ScrollTrigger.getById("hero-video-scroll");
      const v =
        themeRef.current === "light"
          ? lightVideoRef.current
          : darkVideoRef.current;
      if (trigger && v && !isNaN(v.duration)) {
        v.currentTime = v.duration * trigger.progress;
      }
    };

    const read = () => {
      const t = document.documentElement.getAttribute("data-theme");
      themeRef.current = t === "light" ? "light" : "dark";
      // Sync the new active video to current scroll progress.
      sync();
    };

    read();

    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === "attributes" && m.attributeName === "data-theme") {
          read();
          return;
        }
      }
    });
    obs.observe(document.documentElement, { attributes: true });
    return () => obs.disconnect();
  }, []);

  // ── Driver: one ScrollTrigger, mounts once, drives both videos. ──
  useGSAP(
    () => {
      const section = sectionRef.current;
      const dark = darkVideoRef.current;
      const light = lightVideoRef.current;
      if (!section || !dark || !light) return;
      if (typeof window === "undefined") return;

      // Reduced motion → poster only, no playback, no scroll work.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      // Touch / coarse pointer → autoplay-loop the active variant.
      // We keep both elements but only play the visible one (the
      // inactive is hidden via CSS so playback does nothing useful
      // there). Both videos get loop=true so the loop survives a
      // theme toggle without re-arming.
      const isCoarse = window.matchMedia(
        "(hover: none), (pointer: coarse)",
      ).matches;
      if (isCoarse) {
        dark.loop = true;
        light.loop = true;
        // Try to play both — only the visible one actually decodes
        // frames in most browsers. Errors are swallowed (autoplay
        // sometimes blocked until first user gesture).
        dark.play().catch(() => {});
        light.play().catch(() => {});
        return;
      }

      // Desktop scrub — drive currentTime of the ACTIVE video from
      // ScrollTrigger progress. The inactive video stays at frame 0;
      // when the user toggles themes, the effect above re-syncs the
      // newly-active video. The "active" decision is read from
      // themeRef inside the callback so it's always fresh.
      const setupTrigger = () => {
        // Both videos have identical duration (same source clip
        // re-encoded twice). Read whichever has it ready.
        const duration = dark.duration || light.duration;
        if (!duration || isNaN(duration)) return;

        ScrollTrigger.create({
          id: "hero-video-scroll",
          trigger: section,
          start: "top top",
          end: "+=150%",
          pin: true,
          pinSpacing: true,
          // Slight smoothing — masks single-frame decode jitter on
          // less powerful machines. 0.6s feels tied to the wheel
          // without a perceptible lag.
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const v =
              themeRef.current === "light" ? light : dark;
            if (!isNaN(v.duration)) {
              v.currentTime = v.duration * self.progress;
            }
          },
          onRefresh: (self) => {
            const v =
              themeRef.current === "light" ? light : dark;
            if (!isNaN(v.duration)) {
              v.currentTime = v.duration * self.progress;
            }
          },
        });
      };

      // Wait until at least one video has buffered enough metadata.
      // Both are downloading in parallel via preload="auto". Use the
      // EARLIEST signal from either video.
      let armed = false;
      const arm = () => {
        if (armed) return;
        armed = true;
        setupTrigger();
      };

      // If either is already ready, arm immediately.
      if (dark.readyState >= 2 || light.readyState >= 2) {
        arm();
      } else {
        // Listen on both — race wins.
        const handler = () => arm();
        dark.addEventListener("loadeddata", handler, { once: true });
        light.addEventListener("loadeddata", handler, { once: true });
        // Fallback timeout — Safari sometimes lazy-loads metadata.
        const t = window.setTimeout(arm, 1500);
        return () => {
          window.clearTimeout(t);
          dark.removeEventListener("loadeddata", handler);
          light.removeEventListener("loadeddata", handler);
        };
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-hero-video-scroll
      className="relative h-[100svh] w-full overflow-hidden bg-ink"
      aria-label="Intro de SATMA"
    >
      {/* Both videos always rendered. CSS .satma-theme-*-only classes
          (defined in globals.css) hide the inactive one based on
          the current data-theme. Theme toggle = instant CSS flip,
          no React reconciliation, no remount, no flash. */}
      <video
        ref={darkVideoRef}
        muted
        playsInline
        preload="auto"
        poster="/videos/scroll-intro-poster-dark.jpg"
        className="satma-theme-dark-only absolute inset-0 h-full w-full object-cover"
        aria-hidden
      >
        <source
          src="/videos/scroll-intro-scrub-720-dark.mp4"
          type="video/mp4"
        />
      </video>
      <video
        ref={lightVideoRef}
        muted
        playsInline
        preload="auto"
        poster="/videos/scroll-intro-poster-light.jpg"
        className="satma-theme-light-only absolute inset-0 h-full w-full object-cover"
        aria-hidden
      >
        <source
          src="/videos/scroll-intro-scrub-720-light.mp4"
          type="video/mp4"
        />
      </video>

      {/* Top edge fade — keeps the header readable. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[18%] bg-gradient-to-b from-ink to-transparent" />

      {/* Bottom dissolve into <Hero />. Stronger fade: from-ink solid
          for the first 30% of the gradient so the video edge is fully
          consumed, then easing to transparent. Hides the seam where
          the clip's last frame meets the next section. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[45%] bg-gradient-to-t from-ink via-ink/85 via-30% to-transparent" />

      {/* ── Dark-mode-only atmospheric finish: a soft periwinkle "lift"
            right above the seam so the video edge dissolves into the
            next section without a visible boundary. CSS class from
            globals.css drops it in light mode. NO horizontal line —
            that was the visible artifact the user reported. ── */}
      <div
        aria-hidden
        className="satma-theme-dark-only pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[35%]"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 100%, rgba(179, 203, 255, 0.18), transparent 55%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Scroll cue — only visible on hover-pointer devices. Just the
          text label; previously had a 1px vertical pulse below it that
          read as a stray line over the video. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 hidden items-center justify-center text-[10px] uppercase tracking-[0.32em] text-off/55 md:flex">
        <span aria-hidden>Scroll para entrar ↓</span>
      </div>
    </section>
  );
}
