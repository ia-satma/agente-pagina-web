"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

/**
 * Mirror the site's `data-theme` attribute into local React state with a
 * MutationObserver. The parallax hero needs to swap image assets, blend
 * modes and vignette tints when the user toggles light/dark.
 */
function useThemeMirror(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const read = () => {
      const t = document.documentElement.getAttribute("data-theme");
      setTheme(t === "dark" ? "dark" : "light");
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
  return theme;
}

/**
 * Hero parallax 3D — replaces the scroll-driven HeroVideoIntro.
 *
 * Composition:
 *   - Layer 0 (deepest): solid black backdrop
 *   - Layer 1: particle galaxy (slight scale, slowest mouse drift)
 *   - Layer 2: brighter particle field (mid drift)
 *   - Layer 3: portrait subject (front, biggest drift)
 *
 * Effects:
 *   - Mouse position drives X/Y of each layer with depth-proportional ranges
 *   - Subtle 3D rotation of the whole stage tracks the cursor (rotateX/Y)
 *   - Springs smooth all motion so it feels organic, not jittery
 *   - Idle drift via slow autoplay so the scene breathes even without mouse
 *
 * Falls back to a static composition on `prefers-reduced-motion: reduce`
 * or coarse pointers (touch).
 */

export function HeroParallax3D() {
  const stageRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const theme = useThemeMirror();
  const isLight = theme === "light";

  // Asset / palette swap by theme. The positivo images are designed for
  // a light/paper backdrop; the negativo set is for the dark navy backdrop.
  // Blend mode also flips: `screen` makes BLACK transparent (right for
  // dark mode where figures have white bg); `multiply` makes WHITE
  // transparent (right for light mode where bg is paper-light).
  const galaxySrc = isLight
    ? "/images/parallax-hero/1-light.webp"
    : "/images/parallax-hero/2.webp";
  const portraitSrc = isLight
    ? "/images/parallax-hero/2-light.webp"
    : "/images/parallax-hero/1.webp";
  const robotSrc = isLight
    ? "/images/parallax-hero/3-light.webp"
    : "/images/parallax-hero/robot.webp";
  const blendMode: "screen" | "multiply" = isLight ? "multiply" : "screen";
  // Stage bg color — a near-paper tone that matches the positivo galaxy bg
  // in light mode, and the deep void for dark.
  const stageBg = isLight ? "#eaf0fa" : "#020306";
  // Vignette tint — must match stageBg so the frame disappears into the page.
  const vignetteRgb = isLight ? "234, 240, 250" : "2, 3, 6";

  // Normalized mouse position [-0.5, 0.5] across the stage.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.5 });

  // Layer X/Y translations — back layers move less than front.
  const bgX = useTransform(sx, [-0.5, 0.5], [-15, 15]);
  const bgY = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  const fgX = useTransform(sx, [-0.5, 0.5], [-70, 70]);
  const fgY = useTransform(sy, [-0.5, 0.5], [-45, 45]);

  // Subtle 3D tilt of the entire stage tracks the cursor.
  const rotX = useTransform(sy, [-0.5, 0.5], [4, -4]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-4, 4]);

  // ── Robot reveal lens — an organic "drop" of light that follows the
  // cursor. Built from 4 radial gradients overlapping with independent
  // sine/cosine wobble offsets, so the silhouette never repeats — it
  // morphs continuously like a slow-flowing droplet.
  const lensX = useMotionValue(0);
  const lensY = useMotionValue(0);
  const lensRadius = useMotionValue(0);
  // Springs make the lens trail the cursor instead of snapping rigidly.
  const lx = useSpring(lensX, { stiffness: 220, damping: 30, mass: 0.6 });
  const ly = useSpring(lensY, { stiffness: 220, damping: 30, mass: 0.6 });
  const lr = useSpring(lensRadius, { stiffness: 110, damping: 22, mass: 0.5 });

  // Time accumulator for the morphing — drives the wobble offsets.
  const t = useMotionValue(0);
  // Four independent wobble pairs with strong amplitudes so the silhouette
  // deforms aggressively. Frequencies are incommensurable so the shape
  // never repeats — it always feels like flowing liquid.
  const wx1 = useTransform(t, (v) => Math.sin(v * 0.7) * 55);
  const wy1 = useTransform(t, (v) => Math.cos(v * 0.55) * 42);
  const wx2 = useTransform(t, (v) => Math.cos(v * 0.43) * 60);
  const wy2 = useTransform(t, (v) => Math.sin(v * 0.91) * 50);
  const wx3 = useTransform(t, (v) => Math.sin(v * 0.6 + 1.4) * 48);
  const wy3 = useTransform(t, (v) => Math.cos(v * 0.38 + 0.8) * 56);
  const wx4 = useTransform(t, (v) => Math.cos(v * 0.85 + 2.1) * 38);
  const wy4 = useTransform(t, (v) => Math.sin(v * 0.49 + 1.7) * 44);
  // Four radii with strong size variation for an asymmetric blob.
  const r1 = useTransform(lr, (v) => v * 1.0);
  const r2 = useTransform(lr, (v) => v * 0.92);
  const r3 = useTransform(lr, (v) => v * 0.78);
  const r4 = useTransform(lr, (v) => v * 0.7);

  // Four overlapping radial gradients with a refined 4-stop falloff —
  // solid core (robot reads crisp), gentle midfade, soft halo, clean exit.
  // No hard ring, no foggy blur — just an editorial-grade soft edge that
  // dissolves into the page without leaving a contour.
  //   0%–45%  : fully opaque (robot fully visible)
  //   45%–70% : 1.0 → 0.85 (subtle softening starts)
  //   70%–88% : 0.85 → 0.35 (the diffuse halo)
  //   88%–100%: 0.35 → 0 (last whisper, fully transparent)
  const lensMask = useMotionTemplate`
    radial-gradient(circle ${r1}px at calc(${lx}px + ${wx1}px) calc(${ly}px + ${wy1}px), rgba(0,0,0,1) 45%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.35) 88%, rgba(0,0,0,0) 100%),
    radial-gradient(circle ${r2}px at calc(${lx}px + ${wx2}px) calc(${ly}px + ${wy2}px), rgba(0,0,0,1) 45%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.35) 88%, rgba(0,0,0,0) 100%),
    radial-gradient(circle ${r3}px at calc(${lx}px + ${wx3}px) calc(${ly}px + ${wy3}px), rgba(0,0,0,1) 45%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.35) 88%, rgba(0,0,0,0) 100%),
    radial-gradient(circle ${r4}px at calc(${lx}px + ${wx4}px) calc(${ly}px + ${wy4}px), rgba(0,0,0,1) 45%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.35) 88%, rgba(0,0,0,0) 100%)
  `;
  // Glass overlay uses a slightly tighter falloff so the saturation bump
  // dies off fast past the visible drop — keeps the effect contained.
  const lensGlassMask = useMotionTemplate`
    radial-gradient(circle ${r1}px at calc(${lx}px + ${wx1}px) calc(${ly}px + ${wy1}px), rgba(0,0,0,1) 55%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0) 100%),
    radial-gradient(circle ${r2}px at calc(${lx}px + ${wx2}px) calc(${ly}px + ${wy2}px), rgba(0,0,0,1) 55%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0) 100%),
    radial-gradient(circle ${r3}px at calc(${lx}px + ${wx3}px) calc(${ly}px + ${wy3}px), rgba(0,0,0,1) 55%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0) 100%),
    radial-gradient(circle ${r4}px at calc(${lx}px + ${wx4}px) calc(${ly}px + ${wy4}px), rgba(0,0,0,1) 55%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0) 100%)
  `;

  // Track pointer at the document level so the parallax responds even when
  // the cursor is technically outside the section bounds (still feels alive).
  useEffect(() => {
    if (reduce) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const onMove = (e: PointerEvent) => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      // Parallax — use viewport-relative so it lives even when cursor is
      // technically over later sections.
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const nx = (e.clientX - cx) / window.innerWidth;
      const ny = (e.clientY - cy) / window.innerHeight;
      mx.set(Math.max(-0.5, Math.min(0.5, nx)));
      my.set(Math.max(-0.5, Math.min(0.5, ny)));

      // Lens — track stage-relative coordinates for the mask center.
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      lensX.set(localX);
      lensY.set(localY);

      // Activate the lens only while the cursor is inside the stage so the
      // robot doesn't peek out elsewhere on the page. Compact radius (90px =
      // ~180px diameter) for a precise "glass" feel à la Apple.
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      lensRadius.set(inside ? 90 : 0);
    };

    document.addEventListener("pointermove", onMove);
    return () => document.removeEventListener("pointermove", onMove);
  }, [mx, my, lensX, lensY, lensRadius, reduce]);

  // Idle drift + time accumulator for the morphing drop.
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      // Drive the morphing time so wx/wy useTransforms recompute every frame.
      t.set(elapsed);
      // very slow sine wave drift on parallax — only when mouse is idle.
      const driftX = Math.sin(elapsed * 0.18) * 0.06;
      const driftY = Math.cos(elapsed * 0.14) * 0.04;
      const cur = { x: mx.get(), y: my.get() };
      if (Math.abs(cur.x) < 0.04 && Math.abs(cur.y) < 0.04) {
        mx.set(driftX);
        my.set(driftY);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mx, my, t, reduce]);

  return (
    <section
      ref={stageRef}
      data-hero-parallax
      // h-[100svh] over h-screen: on iOS Safari, h-screen still takes the
      // full viewport including the URL chrome that auto-hides on scroll —
      // creating a layout jump. `svh` (small viewport height) anchors the
      // hero to the visible area, no jump.
      className="relative h-[100svh] w-full overflow-hidden"
      style={{ perspective: "1500px", backgroundColor: stageBg }}
      aria-hidden
    >
      <motion.div
        style={{
          rotateX: reduce ? 0 : rotX,
          rotateY: reduce ? 0 : rotY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full w-full"
      >
        {/* Layer 0 — particle galaxy (background). Theme-aware: dark-galaxy
            for night, light-galaxy for day. The section's background-color
            covers anything the galaxy doesn't reach. */}
        <motion.div
          style={{
            x: reduce ? 0 : bgX,
            y: reduce ? 0 : bgY,
            transform: "translateZ(-200px) scale(1.15)",
          }}
          className="absolute inset-0"
        >
          <Image
            src={galaxySrc}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {/* Layer 2 — portrait subject (front, biggest parallax).
            Container fills the stage; the image scales up with `scale-[1.55]`
            so the figure dominates the composition like a real hero shot.
            `object-contain` preserves aspect ratio; `screen` blend mode
            removes the white background of the source PNG. */}
        <motion.div
          style={{
            x: reduce ? 0 : fgX,
            y: reduce ? 0 : fgY,
            transform: "translateZ(50px)",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative h-full w-full">
            <Image
              src={portraitSrc}
              alt="SATMA agencia creativa — escena editorial del hero del sitio principal"
              fill
              priority
              sizes="100vw"
              // Mobile: object-cover so the figure fills the portrait viewport
              // (with `object-contain` + 16:9 source, the subject ended up tiny).
              // Desktop (sm+): back to object-contain so the full composition
              // breathes with the vignette frame.
              className="object-cover object-center sm:object-contain"
              style={{ mixBlendMode: blendMode }}
            />
          </div>
        </motion.div>

        {/* ── Layer 3 — robot reveal (AI underneath the human).
              Same props as the woman portrait so the figures align by their
              native framing. A small `translate-y` nudges the robot down so
              the eye-line lands on the woman's eyes when the lens passes
              over her face. The CSS mask is a radial gradient centered on
              the cursor — only the ~90px lens area shows the robot. ── */}
        {!reduce && (
          <motion.div
            style={{
              x: fgX,
              y: fgY,
              transform: "translateZ(60px)",
              maskImage: lensMask,
              WebkitMaskImage: lensMask,
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative h-full w-full">
              <Image
                src={robotSrc}
                alt=""
                fill
                sizes="100vw"
                // Mobile: object-cover so the figure fills the portrait viewport
              // (with `object-contain` + 16:9 source, the subject ended up tiny).
              // Desktop (sm+): back to object-contain so the full composition
              // breathes with the vignette frame.
              className="object-cover object-center sm:object-contain"
                style={{ mixBlendMode: blendMode }}
              />
            </div>
          </motion.div>
        )}

        {/* ── Apple "liquid glass" lens — NO frosted blur. Center fully
              transparent. Subtle saturation/contrast bump only inside the
              morphing drop shape. ── */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              maskImage: lensGlassMask,
              WebkitMaskImage: lensGlassMask,
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              backdropFilter: "saturate(125%) contrast(1.05) brightness(1.04)",
              WebkitBackdropFilter:
                "saturate(125%) contrast(1.05) brightness(1.04)",
            }}
          />
        )}
      </motion.div>

      {/* ── STATIC ATMOSPHERIC VIGNETTES — sit OUTSIDE the rotating motion.div
            so they never tilt with the parallax. This eliminates the visible
            seam at the section edges that the user spotted (the rotating
            vignettes were exposing layer edges as the scene tilted). The
            vignettes now act like a fixed picture-frame around the dynamic
            content underneath. ── */}
      <div className="pointer-events-none absolute inset-0 z-30">
        {/* 1. Cinematic radial darkening/lightening from edges to center.
              Theme-aware tint so the frame matches the stage bg. */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 55%, transparent 30%, rgba(${vignetteRgb},0.55) 70%, rgba(${vignetteRgb},0.95) 100%)`,
          }}
        />

        {/* 2. Side fades */}
        <div
          className="absolute inset-y-0 left-0 w-[18%]"
          style={{
            background: `linear-gradient(to right, rgb(${vignetteRgb}), transparent)`,
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-[18%]"
          style={{
            background: `linear-gradient(to left, rgb(${vignetteRgb}), transparent)`,
          }}
        />

        {/* 3. Top fade — header readability */}
        <div
          className="absolute inset-x-0 top-0 h-[22%]"
          style={{
            background: `linear-gradient(to bottom, rgb(${vignetteRgb}), rgba(${vignetteRgb},0.4) 50%, transparent)`,
          }}
        />

        {/* 4. Bottom dissolve into the next section (Hero). Uses semantic
              `from-ink` so it bridges to whichever theme is active — paper
              in light, navy in dark. */}
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink via-ink/85 via-30% to-transparent" />
        <div
          className="absolute inset-x-0 bottom-0 h-[35%]"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 100%, rgba(179, 203, 255, 0.18), transparent 55%)",
            mixBlendMode: "screen",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-periwinkle/30 to-transparent" />
      </div>
    </section>
  );
}
