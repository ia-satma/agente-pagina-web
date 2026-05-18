# Playbook SATMA — patrones destilados

Destilación cross-proyecto de los patrones que SATMA ya usa en `satma-web` (Next + Payload) y `ambrosia-web` (Astro). Los agentes deben consultar este archivo antes de tomar decisiones de diseño/código.

---

## 1. Tipografía

### Pares observados en proyectos SATMA
| Cliente | Display | Body | Notas |
|---|---|---|---|
| Ambrosia | Optimus Princeps (Trajan-derived) | Monkton Incised Solid | Lujo editorial mítico |
| SATMA | (a ver en globals.css) | (a ver en globals.css) | B2B serio |

### Escala tipográfica unificada (regla SATMA)
```css
--fs-eyebrow:      0.78rem;     /* tracking 0.36em uppercase */
--fs-body:         clamp(1rem, 1.15vw, 1.15rem);
--fs-body-lead:    clamp(1.05rem, 1.5vw, 1.3rem);
--fs-card-title:   clamp(1.85rem, 3.6vw, 2.8rem);
--fs-section-h2:   clamp(2.4rem, 5.5vw, 4.4rem);
--fs-hero-h1:      clamp(2.8rem, 6.5vw, 5.2rem);
```

### Tracking
```css
--tracking-eyebrow:  0.28em;   /* o 0.36em para uppercase mini */
--tracking-display:  0.04em;
--tracking-luxury:   0.18em;
```

### Reglas
- Display SOLO en h1/h2/numerales/wordmarks/eyebrow.
- Body en todo lo demás, sin excepciones.
- Si el display tiene problemas con tildes en mayúsculas → quitar acentos en UI visible (mantener en URLs si necesario).
- `font-feature-settings: "ss01", "kern"` cuando aplique.

---

## 2. Sistema de color

### Filosofía "luxury silencioso"
- Fondo dominante: blanco puro `#FFFFFF` o navy oscuro `#15173d`.
- **Máximo 3-4 highlights del color brand por scroll**.
- Acentos secundarios solo en hover, nunca en estado base.
- Sin gradientes baratos.

### Plantilla de tokens semánticos
```css
:root {
  --color-bg-page:          #FFFFFF;
  --color-bg-block:         <navy-o-marca>;
  --color-text-primary:     <navy-marca>;
  --color-text-on-color:    #FFFFFF o cream;
  --color-text-muted:       <navy-60%>;
  --color-brand:            <hex-pantone>;       /* el rojo Pantone 485 = #E22319 en ambrosia */
  --color-brand-soft:       <brand-12%>;          /* hovers, tap-highlight */
  --color-accent-1:         <hex>;
  --color-accent-2:         <hex>;
  --color-divider:          rgba(20, 23, 61, 0.08);
}
```

### Reglas
- Definir paleta primaria (1) + brand (1) + acentos (2-4 máx).
- Cada acento mapea a una sección/mundo de la web, no se mezclan.
- Hovers usan brand-soft, no el color full.
- Tap-highlight en mobile usa brand-soft (no el azul nativo).

---

## 3. Spacing y ritmo

```css
--space-section:    clamp(3rem, 6vw, 5.5rem);
--space-block:      clamp(1.5rem, 3vw, 2.5rem);
--space-gutter:     clamp(1rem, 2vw, 1.5rem);
--max-content:      72rem;        /* 1152px */
--max-prose:        38rem;        /* 608px — copy editorial */
--max-narrow:       30rem;        /* 480px — formularios */
```

**Regla:** entre secciones siempre `--space-section`. Dentro de una sección entre bloques `--space-block`.

---

## 4. Motion (GSAP)

### Tokens
```css
--dur-fast:        220ms;
--dur-medium:      380ms;
--dur-divine:      1200ms;
--dur-ceremony:    2200ms;

--ease-fast:       cubic-bezier(0.4, 0, 0.2, 1);
--ease-divine:     cubic-bezier(0.16, 1, 0.3, 1);
```

### Patrones recurrentes
1. **`data-anim="up"` + IntersectionObserver** → fade-up con stagger por `--i` CSS variable.
2. **GSAP timeline en `src/scripts/motion.ts`** (Astro) o `lib/motion.ts` (Next) — orquestador único, no scripts por componente.
3. **ScrollTrigger pin** para heros cinemáticos (ver Ambrosia `/origen`).
4. **Word-stagger con SplitText** para citas / interludios (opcional, Fase avanzada).

### Reduced-motion (obligatorio)
```ts
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) {
  gsap.set(el, { opacity: 1, y: 0 });  // estado final inmediato
  return;
}
```

### Antipatrones
- ❌ `opacity: 0` inicial en imágenes (pop-in). Imágenes siempre visibles.
- ❌ Animación CSS y GSAP simultáneos en el mismo elemento.
- ❌ Auto-play con sonido. Videos siempre `muted autoplay playsinline loop`.

---

## 5. Imágenes y video

### Formatos
- **WebP** como default. PNG con alpha real si necesario.
- **AVIF** opcional para imágenes >300KB (`<picture>` con fallback).
- **Video:** MP4 (H.264 + AAC) + WebM (VP9 + Opus) en `<source>` paralelos.

### Optimización
```bash
# WebP
cwebp -q 88 -m 6 input.png -o output.webp
cwebp -q 82 -m 6 fondo.png -o fondo.webp   # más compresión para fondos

# Alpha real con ImageMagick (botellas, productos, transparencias)
magick input.webp -fuzz 8% -transparent white -background none output.webp

# Video MP4
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow \
       -c:a aac -b:a 128k -ac 2 -movflags +faststart output.mp4

# Video WebM
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 \
       -c:a libopus -b:a 128k output.webm
```

### Loading
- `loading="eager"` para hero / above-the-fold + `fetchpriority="high"`.
- `loading="lazy"` para todo lo demás.
- Preload en `<head>` solo para 2-3 imágenes críticas con `rel="preload" as="image"`.

---

## 6. Mobile (regla mínima SATMA)

```css
/* Anti-zoom iOS */
@media (max-width: 768px) {
  input, textarea, select { font-size: 16px !important; }
}

/* Safe-area */
body {
  padding-top:    env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Touch targets WCAG AAA */
@media (hover: none) and (pointer: coarse) {
  a, button, [role="button"] { min-height: 44px; min-width: 44px; }
}

/* No tap-delay */
a, button, input, label, textarea, select, [role="button"] {
  touch-action: manipulation;
}

/* Custom tap-highlight */
* { -webkit-tap-highlight-color: rgba(226, 35, 25, 0.12); }   /* brand 12% */

/* Anti-rescale iOS landscape */
html { -webkit-text-size-adjust: 100%; }

/* Focus-visible global */
:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 3px; }
```

---

## 7. SEO + LLM optimization

### Meta obligatorios en cada página
- `<title>` único < 60 chars.
- `<meta name="description">` < 160 chars.
- `<link rel="canonical">` absoluto.
- OG: title, description, image, locale, site_name.
- Twitter card `summary_large_image`.
- hreflang ES + EN + x-default (si i18n).
- theme-color (matches navy o blanco).

### JSON-LD por tipo de página
| Página | Schema |
|---|---|
| Home | `Organization` + `LocalBusiness` (si MX) con `geo:GeoCoordinates` |
| Producto | `Product` con `additionalProperty[]` para specs únicos |
| FAQ | `FAQPage` con `Question`/`Answer` |
| Artículo | `Article` con `author` + `datePublished` |
| Colección | `CollectionPage` con `numberOfItems` |
| Restaurante / tienda | `Restaurant` / `Store` + `sameAs` (RRSS) |

### Archivos públicos
- `/robots.txt` — bloquea `/admin/*`, permite GPTBot/CCBot/Claude-Web/PerplexityBot/Google-Extended.
- `/sitemap-index.xml` + `/sitemap-0.xml` (generados por plugin del framework).
- `/llms.txt` — descripción narrativa del sitio para crawlers LLM (formato Ambrosia es referencia).
- `/llms-full.txt` (opcional) — versión extendida.

### Performance targets
- Lighthouse Performance ≥ 92 desktop, ≥ 85 mobile.
- CLS < 0.05.
- LCP < 2.5s.
- HTML inicial < 200KB.

---

## 8. Tests mínimos (smoke)

Adaptados de `ambrosia/web/tests/smoke.test.mjs`:

```
01  Build genera dist/ o .next/
02  Cada ruta pública genera HTML
03  Páginas EN generadas (si i18n)
04  Viewport meta presente
05  Canonical en cada página
06  hreflang correcto (si i18n)
07  OG + Twitter card
08  JSON-LD válido en home y página de producto
09  GEO context si aplica
10  LocalBusiness schema si MX
11  robots + sitemap + llms.txt presentes
12  Footer presente con crédito SATMA
13  Assets críticos (fonts, logo) presentes
14  robots bloquea /admin/
15  HTML home < 200KB
```

---

## 9. Footer SATMA (firma obligatoria)

Todo sitio entregado lleva en el footer:
- Pill minimal `POR SATMA ↗` con link a `https://satma.mx` (rel noopener).
- Tipografía body, uppercase, tracking generoso.
- Posición: bottom bar del footer, no en el cuerpo.

Ejemplo HTML:
```html
<a href="https://satma.mx" target="_blank" rel="noopener" class="satma-credit">
  POR SATMA <span aria-hidden="true">↗</span>
</a>
```

```css
.satma-credit {
  font-size: 0.72rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  opacity: 0.6;
  transition: opacity 200ms ease;
}
.satma-credit:hover { opacity: 1; }
```

---

## 10. Decisiones recurrentes (ya probadas)

1. **Fondo blanco puro >> cream o gris** para que las imágenes y la marca destaquen.
2. **Acentos por sección solo en hover** — luxury silencioso.
3. **3 niveles tipográficos máx por página**: hero h1, section h2, body. No agregar h3/h4 salvo necesario.
4. **Italics editoriales** con dos clases: `<em>` plano + `<em class="brand">` para claims fuertes.
5. **Numerales monumentales** en cards/secciones (01, 02, 03…) — funcionan visualmente y a SEO.
6. **Carrusel infinito con triplicación de slides** — render `[clones, originals, clones]` + jump silencioso en bordes.
7. **Imágenes siempre visibles, solo texto con reveal** — anti pop-in.
8. **Sticky scroll cinemático** para timelines / "5 mundos" (auto-disable en mobile).
9. **Chat bubble flotante persistente** con FAQ rápidas + mailto (no AI real salvo que se contrate).
10. **Admin discreto** — icono llave 22px bottom-right del footer, hover brand.

---

## 11. Antipatrones cross-proyecto

- ❌ Texto lorem ipsum en entregables.
- ❌ Hover en touch (`@media (hover: none)` para fallback).
- ❌ Mezclar sistema de énfasis (italics aleatorios sin propósito).
- ❌ Más de 3-4 highlights brand por scroll.
- ❌ `mix-blend-mode` para forzar transparencias — generar PNG/WebP con alpha real.
- ❌ Componentes sin variantes mobile-aware.
- ❌ Saltarse `prefers-reduced-motion`.
- ❌ Inventar specs del producto/marca — todo viene del knowledge-base.
- ❌ Copy en inglés en sitios MX salvo i18n explícito.
- ❌ Acentos en mayúsculas si la fuente display sufre con tildes.

---

## 12. Comandos comunes

### Setup
```bash
pnpm install
pnpm dev          # localhost:3000 (Next) o :4321 (Astro)
pnpm build
pnpm preview
```

### Imágenes
Ver sección 5.

### Tests
```bash
node --test tests/smoke.test.mjs
```

### Limpieza
```bash
rm -rf .next dist node_modules/.cache
```

---

## 13. Edición masiva de HTML: REGLA DE ORO

> Aprendido en **Avalon Servicios** (2026-05-17): un script Python con regex masivo destruyó `<link rel="stylesheet">` y `<script src>` en 60 archivos por un bug de f-string + backreferences. Ver `kb/lessons-inbox.md`.

### Cuándo SÍ usar regex masivo

- Reemplazos triviales sin atributos críticos (`text → text`)
- Cambios de un solo string literal sin grupos de captura
- Si el cambio es delicado: usar `Edit` tool por archivo

### Cuándo NUNCA usar regex masivo

- Modificar atributos críticos: `href`, `src`, `class` principales
- Mezclar f-strings con backreferences `\1`, `\2`, `\g<N>`
- Loops sed/awk con replacements complejos

### Patrones seguros de regex en Python

```python
# ❌ ANTIPATRÓN — Python interpreta \1 \3 como bytes \x01 \x03
re.sub(pattern, f'\\1{var}\\3', content)

# ✅ Patrón A — lambda (recomendado)
re.sub(pattern, lambda m: m.group(1) + var + m.group(3), content)

# ✅ Patrón B — token replacement
re.sub(pattern, r'\1__TOKEN__\3', content).replace('__TOKEN__', var)

# ✅ Patrón C — raw string + concatenación
re.sub(pattern, r'\1' + re.escape(var) + r'\3', content)
```

### Después de CUALQUIER edit programático masivo:

1. **Correr el validator**:
   ```bash
   bash kb/tooling/validate-mockup.sh output/<cliente>/04-mockup
   ```

2. **Verificar bytes invisibles**:
   ```bash
   grep -rlP '[\x00-\x08\x0B\x0E-\x1F]' output/<cliente>/04-mockup --include='*.html'
   ```

3. **Smoke test HTTP** (si hay servidor):
   ```bash
   python3 -c "
   import urllib.request
   r = urllib.request.urlopen('http://localhost:PORT/')
   c = r.read().decode()
   assert '<link rel=\"stylesheet\" href=' in c, 'CSS LINK ROTO'
   print('OK')
   "
   ```

---

## 14. SVGs inline: dimensiones OBLIGATORIAS

> Aprendido en **Avalon Servicios** (2026-05-17): un SVG sin `width`/`height` attributes se renderizó al tamaño del viewport cuando debía ser 16×16px. Ver `kb/lessons-inbox.md`.

### Regla absoluta

**TODO `<svg>` inline en HTML debe tener atributos `width` y `height` directos, no solo CSS.**

```html
<!-- ❌ ANTIPATRÓN — puede explotar al viewport -->
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">...</svg>

<!-- ✅ CORRECTO -->
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">...</svg>
```

### Tamaños canónicos por contexto

| Contexto | width/height |
|---|---|
| Labels en formularios (`label > svg`) | 14px |
| Nav links, lang-picker, theme-toggle | 16-18px |
| Botones (`.btn svg`) | 18-20px |
| Cards de servicio/feature | 24px |
| Featured/hero icons | 28-32px |
| Contact channel | 20px |

### Red de seguridad CSS bulletproof

Agregar siempre al `styles.css` global:

```css
/* Fallback: SVG sin dimensiones → 1em (evita explosión al viewport) */
svg:not([width]):not([height]) { width: 1em; height: 1em; }

/* Overrides por contexto con !important */
label svg, .quote-field label svg { width: 14px !important; height: 14px !important; flex-shrink: 0; }
button svg, .btn svg { max-width: 22px; max-height: 22px; flex-shrink: 0; }
.servicio-icon svg, .estandar-card-icon svg { width: 24px !important; height: 24px !important; }
.theme-toggle svg { width: 18px !important; height: 18px !important; }
.lang-picker > svg { width: 16px !important; height: 16px !important; }
```

---

## 15. Checklist post-build OBLIGATORIO

Después de cualquier generación masiva (mockup-builder, code-gen-*, qa-reviewer), correr SIEMPRE:

```bash
# 1. Validator integral
bash kb/tooling/validate-mockup.sh output/<cliente>/04-mockup

# 2. Smoke test del servidor (si está activo)
curl -s http://localhost:PORT/ | grep -q '<link rel="stylesheet" href=' && echo "CSS OK" || echo "CSS ROTO"

# 3. Búsqueda de SVGs sin dimensiones
python3 -c "
import re, os
for root, dirs, files in os.walk('output/<cliente>/04-mockup'):
    for f in files:
        if f.endswith('.html'):
            p = os.path.join(root, f)
            c = open(p).read()
            svgs = re.findall(r'<svg[^>]*?>', c, re.DOTALL)
            broken = [s for s in svgs if not re.search(r'(^|\\s)width=', s)]
            if broken:
                print(f'{p}: {len(broken)} SVGs sin width')
"
```

**Si el validator devuelve exit code 1 → NO entregar el mockup al cliente.**
**Si devuelve exit code 2 → solo warnings, decidir caso por caso.**
