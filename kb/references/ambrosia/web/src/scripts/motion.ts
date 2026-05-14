/**
 * Orquestador único de motion — GSAP + ScrollTrigger.
 * - ScrollTrigger.batch para reveals
 * - Parallax global a [data-parallax-speed]
 * - Animaciones slow editoriales para títulos h1/h2
 * - gsap.matchMedia para prefers-reduced-motion
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// ─── FASE 7: Lenis smooth scroll global ───
// Solo en desktop + sin reduced-motion. En touch/reduced cae a scroll nativo.
const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof window !== 'undefined' && !isTouch && !prefersReduced) {
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  // Conecta Lenis al ticker de GSAP (single RAF loop)
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time: number) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Anclas hash funcionando vía Lenis.scrollTo
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -80 });
      }
    });
  });
}

const mm = gsap.matchMedia();

mm.add(
  {
    isMotion: '(prefers-reduced-motion: no-preference)',
    isReduced: '(prefers-reduced-motion: reduce)',
    isMobile:  '(max-width: 768px)',
    isDesktop: '(min-width: 769px)',
  },
  (context) => {
    const conditions = context.conditions ?? {};
    const { isMotion, isReduced, isMobile } = conditions as {
      isMotion?: boolean;
      isReduced?: boolean;
      isMobile?: boolean;
      isDesktop?: boolean;
    };

    if (isReduced) {
      document
        .querySelectorAll<HTMLElement>('[data-reveal], [data-anim="up"], .title-skew, .floral')
        .forEach((el) => el.classList.add('is-in'));
      return;
    }

    if (!isMotion) return;

    // ─── Reveals globales (texto, eyebrows, captions) ───
    const reveals = gsap.utils.toArray<HTMLElement>(
      '[data-reveal]:not(h1):not(h2):not(.brand-statement [data-anim="up"]):not(.manifesto [data-anim="up"]), .title-skew:not(h1):not(h2)'
    );

    if (reveals.length > 0) {
      ScrollTrigger.batch(reveals, {
        start: 'top 88%',
        onEnter: (batch) => {
          batch.forEach((el) => (el as HTMLElement).classList.add('is-in'));
        },
        once: true,
      });
    }

    // ─── Animación SLOW EDITORIAL para títulos h1, h2 ───
    // Mask reveal de bottom hacia arriba con clip-path + parallax sutil + duración 1.8s
    const titleSelectors = [
      'h1:not(.brand-statement__logo):not(.page-hero__title):not(.hero h1)',
      'h2',
      '.brand-statement__logo',
      '.manifesto__title',
      '.page-hero__title',
    ].join(', ');

    const titles = gsap.utils.toArray<HTMLElement>(titleSelectors);

    titles.forEach((el) => {
      // Estado inicial
      gsap.set(el, {
        clipPath: 'inset(0 0 100% 0)',
        y: 24,
        opacity: 0,
      });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(el, {
            clipPath: 'inset(0 0 0% 0)',
            y: 0,
            opacity: 1,
            duration: 1.8,
            ease: 'power3.out',
          });
        },
      });
    });

    // ─── Stack reveal pronunciado: BrandStatement sube y se sobrepone al Hero ───
    // Solo activa cuando el predecessor es el Hero scroll-driven (.hero-pin),
    // NO cuando es el HeroVideo (autoplay loop en home). En home, BrandStatement
    // fluye normalmente sin overlap.
    if (!isMobile) {
      const brandStatement = document.querySelector<HTMLElement>('.brand-statement');
      const prev = brandStatement?.previousElementSibling;
      const hasOverlapContext = prev?.classList.contains('hero-pin') || prev?.classList.contains('hero');
      if (brandStatement && hasOverlapContext) {
        gsap.set(brandStatement, { yPercent: 35, opacity: 0.4 });
        ScrollTrigger.create({
          trigger: brandStatement,
          start: 'top bottom',
          end: 'top top+=30%',
          scrub: 0.8,
          onUpdate: (self) => {
            gsap.set(brandStatement, {
              yPercent: 35 * (1 - self.progress),
              opacity: 0.4 + 0.6 * self.progress,
            });
          },
        });
      }
    }

    // ─── FASE 6: Char-stagger en eyebrows del PageHero (entrada al mount) ───
    const charTargets = gsap.utils.toArray<HTMLElement>('[data-stagger="chars"]');
    charTargets.forEach((el) => {
      if (el.querySelector('.char')) return;
      const text = el.textContent || '';
      el.innerHTML = text
        .split('')
        .map((c) => (c === ' ' ? '<span class="char char--space">&nbsp;</span>' : `<span class="char">${c}</span>`))
        .join('');
      const chars = el.querySelectorAll<HTMLElement>('.char');
      gsap.set(chars, { opacity: 0, filter: 'blur(8px)', display: 'inline-block' });
      gsap.to(chars, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.025,
        delay: 0.2,
      });
    });

    // ─── FASE 5: Image mask reveal — clip-path inset desde la izquierda ───
    const maskTargets = gsap.utils.toArray<HTMLElement>('[data-reveal="mask-img"]');
    if (maskTargets.length > 0) {
      ScrollTrigger.batch(maskTargets, {
        start: 'top 85%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch as HTMLElement[], {
            clipPath: 'inset(0 0 0 0)',
            duration: 1.4,
            ease: 'power3.out',
            stagger: 0.12,
            onComplete: () => {
              (batch as HTMLElement[]).forEach((el) => {
                el.style.willChange = 'auto';
              });
            },
          });
        },
      });
    }

    // ─── FASE 4: Word-stagger en pull-quotes (Citation, Interlude) ───
    // Splitea texto por palabras (idempotente) y anima entrada con stagger 60ms.
    const wordTargets = gsap.utils.toArray<HTMLElement>('[data-anim="words"]');
    wordTargets.forEach((el) => {
      // Idempotencia: si ya tiene .word, no re-splittea
      if (el.querySelector('.word')) return;
      const text = el.textContent || '';
      // Preserva ya-existente HTML (em, br, etc.) — split simple por whitespace
      const html = el.innerHTML;
      const wrapped = html.replace(
        /(\s*)(\S+)/g,
        (_match, ws, word) => `${ws}<span class="word">${word}</span>`,
      );
      el.innerHTML = wrapped;

      const words = el.querySelectorAll<HTMLElement>('.word');
      gsap.set(words, { opacity: 0, y: 12, display: 'inline-block' });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(words, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.06,
          });
        },
      });
    });

    // ─── Parallax global a [data-parallax-speed] (excepto Hero) ───
    if (!isMobile) {
      const parallaxItems = gsap.utils.toArray<HTMLElement>('[data-parallax-speed]');

      parallaxItems.forEach((el) => {
        if (el.closest('[data-hero-pin]') || el.closest('[data-hero-stage]')) return;

        const speed = parseFloat(el.dataset.parallaxSpeed || '0.25');
        const target = el.querySelector<HTMLElement>('.brand-feature__img, img, video') || el;

        gsap.fromTo(
          target,
          { yPercent: -speed * 6 },
          {
            yPercent: speed * 6,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // Parallax sutil en imágenes de Diptychs
      const diptychFigures = gsap.utils.toArray<HTMLElement>('.diptych__figure');
      diptychFigures.forEach((fig) => {
        const img = fig.querySelector<HTMLElement>('img');
        if (!img) return;
        gsap.fromTo(
          img,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: fig,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      });
    }

    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
);

document.addEventListener('astro:before-preparation', () => {
  ScrollTrigger.killAll();
});
