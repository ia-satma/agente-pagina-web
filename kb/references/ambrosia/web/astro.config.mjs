import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://ambrosiasauceofgods.com',
  // ─── Hybrid SSR: marketing pages siguen SSG ultra-rápidas;
  // las rutas /admin/* y /api/* se renderizan en server (Node) con
  // middleware de auth. Esta combinación permite tener un CMS
  // protegido sin perder performance del sitio público.
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-MX', en: 'en-US' },
      },
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // ─── Redirects 301 desde slugs legacy a los nuevos mundos ───
  // (Reestructura "Clase Azul" — preserva SEO de URLs anteriores).
  redirects: {
    '/historia':       '/origen',
    '/producto':       '/la-salsa',
    '/coleccion':      '/la-salsa#boutique',
    '/horeca':         '/mesas/restaurantes',
    '/donde-comprar':  '/la-salsa#boutique',
    '/diario':         '/',
    '/contacto':       '/concierge',
    '/en/story':         '/en/origin',
    '/en/product':       '/en/the-sauce',
    '/en/collection':    '/en/the-sauce#boutique',
    '/en/restaurants':   '/en/tables/restaurants',
    '/en/where-to-buy':  '/en/the-sauce#boutique',
    '/en/journal':       '/en',
    '/en/contact':       '/en/concierge',
  },
  vite: {
    plugins: [tailwindcss()],
    preview: {
      // Permite acceso por tunnels HTTPS (localtunnel/ngrok/cloudflared) para
      // probar voz desde celulares — sin esto Astro bloquea hosts no-localhost.
      allowedHosts: true,
    },
    server: {
      allowedHosts: true,
    },
    // CRITICO: pre-bundle React + ElevenLabs para que 'react-dom/client'
    // exporte createRoot correctamente en dev. Sin esto, el ChatBubble
    // (React, client:load) lanza SyntaxError al hidratar, lo cual genera
    // un error en cascada que IMPIDE que motion.ts wire Lenis ↔ ScrollTrigger.
    // Resultado: el scroll-pin del Hero/Timeline no engancha la animacion.
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        '@elevenlabs/react',
        '@elevenlabs/client',
        // CRITICO: gsap y ScrollTrigger DEBEN deduplicarse o Hero.astro y
        // motion.ts importan instancias separadas. El wiring lenis.on('scroll',
        // ScrollTrigger.update) en motion.ts solo updatea su propia instancia,
        // dejando el pin del Hero (registrado en otra instancia) sin recibir
        // scroll events → la animacion de botella no progresa con el scroll.
        'gsap',
        'gsap/ScrollTrigger',
        'lenis',
      ],
    },
    ssr: {
      noExternal: ['@elevenlabs/react', '@elevenlabs/client'],
    },
  },
});
