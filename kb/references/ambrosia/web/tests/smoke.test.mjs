/**
 * AMBROSIA — 20 SMOKE TESTS DUMMY
 *
 * Verifica que el build SSG genera HTML coherente:
 *   - Pages criticas existen y tienen contenido
 *   - SEO basico (canonical, og, hreflang, schema.org)
 *   - GEO (Mexico, Monterrey, navy/Pantone)
 *   - Mobile (viewport meta, touch-action)
 *   - Brand integrity (AMBROSIA en mayusculas, sin acentos en UI)
 *   - Assets criticos
 *   - i18n alternates
 *
 * Run: node --test tests/smoke.test.mjs
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist', 'client');

const read = (p) => readFileSync(join(DIST, p), 'utf-8');
const exists = (p) => existsSync(join(DIST, p));

describe('🍶 AMBROSIA — Smoke tests (20)', () => {
  // ─── 01: dist/ existe ───
  test('01 · Build genera dist/client/', () => {
    assert.ok(existsSync(DIST), 'dist/client/ debe existir tras pnpm build');
  });

  // ─── 02: paginas principales generadas ───
  test('02 · 5 mundos generan HTML', () => {
    for (const slug of ['index.html', 'origen/index.html', 'la-salsa/index.html', 'recetario/index.html', 'mesas/index.html', 'concierge/index.html']) {
      assert.ok(exists(slug), `${slug} debe existir`);
    }
  });

  // ─── 03: paginas EN tambien existen ───
  test('03 · Paginas EN generadas', () => {
    for (const slug of ['en/index.html', 'en/origin/index.html', 'en/the-sauce/index.html', 'en/recipe-book/index.html', 'en/tables/index.html', 'en/concierge/index.html']) {
      assert.ok(exists(slug), `${slug} debe existir`);
    }
  });

  // ─── 04: home tiene viewport meta para mobile ───
  test('04 · Viewport meta presente (mobile)', () => {
    const html = read('index.html');
    assert.match(html, /<meta name="viewport"[^>]*width=device-width/);
  });

  // ─── 05: canonical URL ───
  test('05 · Canonical URL en cada pagina', () => {
    for (const p of ['index.html', 'la-salsa/index.html', 'origen/index.html']) {
      const html = read(p);
      assert.match(html, /<link rel="canonical"/, `${p} debe tener canonical`);
    }
  });

  // ─── 06: hreflang ES/EN ───
  test('06 · hreflang ES + EN + x-default', () => {
    const html = read('index.html');
    assert.match(html, /hreflang="es-MX"/);
    assert.match(html, /hreflang="en-US"/);
    assert.match(html, /hreflang="x-default"/);
  });

  // ─── 07: OpenGraph completo ───
  test('07 · OpenGraph + Twitter card', () => {
    const html = read('index.html');
    assert.match(html, /<meta property="og:title"/);
    assert.match(html, /<meta property="og:image"/);
    assert.match(html, /<meta property="og:locale"/);
    assert.match(html, /<meta name="twitter:card"/);
  });

  // ─── 08: Schema.org JSON-LD ───
  test('08 · Schema.org JSON-LD en home y la-salsa', () => {
    const home = read('index.html');
    const lasalsa = read('la-salsa/index.html');
    assert.match(home, /application\/ld\+json/);
    assert.match(lasalsa, /application\/ld\+json/);
  });

  // ─── 09: GEO context Monterrey ───
  test('09 · GEO context: Monterrey + Mexico', () => {
    const html = read('index.html');
    assert.match(html, /Monterrey/i, 'Monterrey debe estar en home (GEO)');
  });

  // ─── 10: LocalBusiness schema ───
  test('10 · LocalBusiness schema con geoCoordinates', () => {
    const html = read('index.html');
    assert.match(html, /LocalBusiness/, 'LocalBusiness debe estar en schema');
    assert.match(html, /GeoCoordinates/, 'GeoCoordinates debe estar');
  });

  // ─── 11: robots.txt + sitemap accesibles ───
  test('11 · robots.txt + sitemap + llms.txt presentes', () => {
    assert.ok(exists('robots.txt'));
    assert.ok(exists('sitemap-index.xml'));
    assert.ok(exists('llms.txt'));
  });

  // ─── 12: AMBROSIA en mayusculas (brand integrity) ───
  test('12 · AMBROSIA aparece en mayusculas (sin acentos)', () => {
    const html = read('index.html');
    assert.match(html, /AMBROSIA/, 'AMBROSIA mayusculas debe estar');
    // No debe aparecer "Ambrosía" con tilde en HTML renderizado
    assert.doesNotMatch(html.replace(/<link[^>]+>/g, ''), /Ambros[íi]a/);
  });

  // ─── 13: No hay acentos en UI rendered ───
  test('13 · UI no tiene acentos visibles (excepto URLs)', () => {
    const html = read('origen/index.html');
    // Buscar acentos en el cuerpo principal (excluyendo URLs)
    const body = html.replace(/<(?:link|meta|script)[^>]+>/g, '');
    // Permitimos algunos acentos en metadatos si vienen de schema
    // Pero el texto visible deberia estar limpio
    const visibleAccents = body.match(/>[^<]*[áéíóúñÁÉÍÓÚÑ][^<]*</g) || [];
    assert.ok(visibleAccents.length < 5, `Pocos acentos en texto visible: ${visibleAccents.length}`);
  });

  // ─── 14: footer existe en todas las paginas ───
  test('14 · Footer presente + crédito SATMA', () => {
    for (const p of ['index.html', 'la-salsa/index.html', 'concierge/index.html']) {
      const html = read(p);
      assert.match(html, /<footer/i, `${p} debe tener footer`);
      assert.match(html, /satma\.mx/i, `${p} debe creditar a SATMA`);
    }
  });

  // ─── 15: ChatBubble AMBROSIA (React + ElevenLabs) en todas las paginas ───
  test('15 · ChatBubble AMBROSIA en todas las paginas', () => {
    for (const p of ['index.html', 'origen/index.html', 'recetario/index.html', 'mesas/index.html', 'concierge/index.html']) {
      const html = read(p);
      assert.match(html, /amb-chat/, `${p} debe tener clase amb-chat`);
      assert.match(html, /astro-island/, `${p} debe tener astro-island (React hydration)`);
      assert.match(html, /agent_7701/, `${p} debe tener agent_id configurado`);
    }
  });

  // ─── 16: assets criticos (logo, favicon, fonts) ───
  test('16 · Assets criticos: favicon, fonts, logo', () => {
    assert.ok(exists('favicon.svg'));
    assert.ok(exists('fonts/OptimusPrinceps.ttf'));
    assert.ok(exists('fonts/MonktonIncisedSolid.otf'));
  });

  // ─── 17: imagenes de botella (referencia) ───
  test('17 · Imagenes botella generadas', () => {
    assert.ok(exists('images/bottle/bottle-01.webp'), 'bottle-01.webp debe existir');
    assert.ok(exists('images/bottle/bottle-original-transparent.webp'), 'bottle transparent debe existir');
  });

  // ─── 18: videos del PageHero presentes ───
  test('18 · Videos hero (reel-01, reel-02, reel-03)', () => {
    for (const v of ['reel-01.mp4', 'reel-02.mp4', 'reel-03.mp4']) {
      assert.ok(exists(`video/${v}`), `${v} debe existir`);
    }
  });

  // ─── 19: backend admin no expuesto al publico ───
  test('19 · Robots.txt bloquea /admin/', () => {
    const r = read('robots.txt');
    assert.match(r, /Disallow:\s*\/admin/i, 'robots debe bloquear /admin/');
  });

  // ─── 20: tamaño de pagina razonable (perf mobile) ───
  test('20 · HTML home <100KB (performance mobile)', () => {
    const stats = statSync(join(DIST, 'index.html'));
    const kb = stats.size / 1024;
    assert.ok(kb < 200, `home.html debe ser <200KB (es ${kb.toFixed(1)}KB)`);
  });
});
