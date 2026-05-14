# 🍶 AMBROSIA — Knowledge Base completo

> **Documento maestro de transferencia.** Todo el conocimiento acumulado de la web de AMBROSIA (salsa picante mexicana ultra-lujo embotellada en Monterrey).
> **Actualizado:** mayo 2026. **Autor del sitio:** SATMA (https://satma.mx). **Stack:** Astro 6.2 + TypeScript + iron-session + SQLite.

---

## 📑 Tabla de contenidos

1. [Identidad y marca](#1-identidad-y-marca)
2. [Arquitectura técnica](#2-arquitectura-técnica)
3. [Estructura de páginas (5 mundos)](#3-estructura-de-páginas-5-mundos)
4. [Componentes principales](#4-componentes-principales)
5. [Sistema de diseño](#5-sistema-de-diseño)
6. [Backend / CMS editorial](#6-backend--cms-editorial)
7. [Internacionalización (i18n)](#7-internacionalización-i18n)
8. [Assets — imágenes, videos, fuentes](#8-assets--imágenes-videos-fuentes)
9. [SEO + GEO + LLM optimization](#9-seo--geo--llm-optimization)
10. [Tests](#10-tests)
11. [Mobile optimization](#11-mobile-optimization)
12. [Decisiones críticas de diseño](#12-decisiones-críticas-de-diseño)
13. [Antipatrones — qué NO hacer](#13-antipatrones--qué-no-hacer)
14. [Comandos útiles](#14-comandos-útiles)
15. [Roadmap pendiente](#15-roadmap-pendiente)

---

## 1. Identidad y marca

### Producto
- **Nombre:** AMBROSIA (siempre MAYÚSCULAS, sin tilde — la `í` rompe la estética en Optimus Princeps).
- **Tagline:** "The Divine Sauce of Gods" / "La salsa divina de los dioses".
- **Fonética:** `(am·brō·zhē)` — se renderiza con el componente `Phonetic.astro`.
- **Formato:** 200 ml en vidrio cobalto azul soplado, lacre rojo Pantone 485, etiqueta Otomí impresa a mano.
- **Fórmula 2024:** 6 chiles secos (ancho, morita, chipotle, pasilla, guajillo, árbol) + 90 días de reposo.
- **Edición fundacional:** Lote 001, embotellada en Monterrey, NL.
- **Receta familiar:** 3 generaciones desde 1962.

### 3 ediciones de cera (BottleShowcase)
1. **Edicion Onyx** — cera negra · `bottle-gray.png` · Edicion original
2. **Edicion Violeta** — cera morada · `bottle-green.png` · Edicion ceremonial
3. **Edicion Ambar** — cera ámbar · `bottle-amber.png` · Lote 003

### Brandbook
| Token | Valor | Uso |
|---|---|---|
| `--navy` | `#15173d` | color primario, fondo de bloques editoriales |
| `--red` | `#E22319` | rojo Pantone 485, lacre, acento brand |
| `--cream` | `#F6F1E6` | papel editorial (deprecado en favor de `--bg-page` blanco) |
| `--bg-page` | blanco puro | fondo de páginas (decisión "luxury silencioso") |
| Otomí palette | `#E22319 / #2DBBD8 / #FFC03A / #DD2396 / #0055B7` | rojo · cyan · amarillo · pink · azul |

**Acentos por mundo** (aparecen solo en hover, no en estado base):
- 01 Origen → `#2DBBD8` cyan
- 02 La Salsa → `#E22319` red (Pantone 485)
- 03 Recetario → `#DD2396` pink
- 04 Mesas → `#FFC03A` yellow
- 05 Concierge → `#0055B7` blue

### Storytelling target (del audit Clase Azul)
> **Asombro → Curiosidad → Admiración → Confianza → Deseo → Pertenencia → Acción**

### Inspiración editorial
- **Clase Azul** — luxury silencioso, italics como énfasis, navegación por mundos.
- **Pujol / Quintonil** — cinematografía gastronómica.
- **Cartier / Hermès** — magazine TOC editorial.

---

## 2. Arquitectura técnica

### Stack
```
Astro 6.2 + @astrojs/node (hybrid SSR)
TypeScript strict
iron-session (cookies auth)
bcryptjs (password hashing, 12 rounds)
better-sqlite3 (DB embebida)
GSAP 3.15 + ScrollTrigger.batch (motion)
WebP + WebM (assets optimizados)
pnpm (gestor de paquetes)
```

### Estructura de directorios
```
web/
├── src/
│   ├── components/        # 35+ componentes editoriales reutilizables
│   ├── data/recetas.ts    # 20 recetas hardcodeadas (parseadas del MD original)
│   ├── i18n/              # es.json + en.json + index.ts (routes)
│   ├── layouts/
│   │   ├── Base.astro     # shell con Nav + ChatBubble + main slot
│   │   └── AdminLayout.astro  # shell del backend
│   ├── lib/
│   │   ├── auth.ts        # iron-session config
│   │   ├── db.ts          # SQLite schema (5 tablas)
│   │   ├── i18n-cms.ts    # editor nativo i18n
│   │   ├── pages.ts       # CRUD custom pages
│   │   ├── settings.ts    # key-value store + helpers (social/gallery)
│   │   └── users.ts       # roles + PERMISSIONS
│   ├── pages/
│   │   ├── index.astro    # home ES
│   │   ├── origen.astro   # /origen
│   │   ├── la-salsa.astro # /la-salsa
│   │   ├── recetario/     # index + [slug].astro
│   │   ├── mesas/         # index + restaurantes
│   │   ├── concierge.astro
│   │   ├── p/[slug].astro # custom pages dinámicas
│   │   ├── en/            # mirror completo en inglés
│   │   ├── admin/         # backend SSR
│   │   ├── api/           # endpoints REST
│   │   └── 404.astro
│   ├── scripts/motion.ts  # orquestador GSAP global
│   └── styles/global.css  # 1000+ líneas
├── public/                # assets estáticos
├── tests/smoke.test.mjs   # 20 tests
└── astro.config.mjs
```

### Configuración Astro
- `output: 'server'` con `@astrojs/node` adapter (hybrid SSR para backend).
- `export const prerender = true` en páginas públicas (SSG estático).
- `site: 'https://ambrosiasauceofgods.com'` definido en config.
- `defaultLocale: 'es'`, `locales: ['es', 'en']`, `prefixDefaultLocale: false`.
- Redirects legacy: `/historia → /origen`, `/producto → /la-salsa`, etc.

### Variables de entorno (`.env`)
```bash
AUTH_USER=ia@satma.mx
AUTH_PASS_HASH_B64=<bcrypt hash en base64>  # evita problemas con $ expansion
SESSION_SECRET=<32-byte hex>
AMBROSIA_DB_PATH=.data/ambrosia.db          # opcional, default
```

---

## 3. Estructura de páginas (5 mundos)

### `/` Home — orquesta los 5 mundos
```
Base
  ↓
HeroVideo                  ← 01 Asombro (autoplay loop)
BrandStatement             ← 02 Curiosidad (AMBROSIA wordmark XL + tagline + CTA)
VideoReel                  ← 03 Ritual (3 videos 1080p)
WorldsGrid                 ← 04 Navegación a los 5 capítulos
MotionDivider variant=ornament
Manifesto                  ← 05 Admiración (isotype + "MIL RITUALES")
MotionDivider variant=drop
BottleGallery              ← 06 Carrusel infinito de 4 botellas
Footer                     ← 07 Acción (newsletter + social + admin)
```

### `/origen` — Capítulo I (mítico)
```
Back link flotante (top-left)
Hero scroll-driven        ← god-mexica + god-greco + bottle handover (pin scroll)
PageHero accent="purple"  ← intro textual con seal
Diptych "mito"            ← Tezcatlipoca descendiendo (bg white, align left)
Interlude                 ← cita editorial breve
Diptych "origen-mexica"   ← molcajete + chile (align right)
Ritual                    ← 3 guardianes indígenas
TimelineCultural          ← scroll cinemático sticky 4 hitos (800aC → 2024)
Footer
```

### `/la-salsa` — Capítulo II (producto)
**8 secciones limpias (post-audit):**
```
PageHero video=reel-01    ← presentación (cyan accent)
BottleAnatomy             ← IDENTIDAD: 6 hotspots + zoom interactivo
BottleShowcase            ← VARIANTES: Onyx · Violeta · Ámbar (zoom inline)
TastingNotes              ← SABOR: 8 notas (con FloatingDecor chile+ajo)
Pairings                  ← USO: 5 maridajes (con FloatingDecor molcajete+tomate)
Citation                  ← AUTORIDAD: testimonio editorial
BuyPoints #boutique       ← ACCIÓN: Jabalina + Carnes Ramos
Footer
```

**Eliminado por redundancia** (BrandFeature label-macro / museum-pedestal / Edicion).

### `/recetario` — Capítulo III
```
PageHero video=reel-02    ← pink accent
RecipeIndex               ← grid editorial 20 cards + filtros chips
Footer

/recetario/[slug]         ← detalle de cada receta (RecipeIntro + RecipeMeta + RecipeBody + RecipeNav)
```

### `/mesas` — Capítulo IV
```
PageHero video=reel-03    ← red accent
TablesSplit               ← 2 caminos: Restaurantes / Boutique
Footer

/mesas/restaurantes       ← Restaurants component (listado completo)
```

### `/concierge` — Capítulo V
```
PageHero video=hero-bottle-frame  ← yellow accent
ConciergeIntent           ← 3 intent cards (HORECA / Prensa / Regalo)
ConciergeForm             ← form segmentado
CommunityCTA              ← intent newsletter
Footer
```

---

## 4. Componentes principales

### Hero / cinematográficos
| Componente | Uso | Notas técnicas |
|---|---|---|
| `Hero.astro` | /origen full-viewport scroll-driven | god-mexica + god-greco + bottle handover con pin GSAP |
| `HeroVideo.astro` | / autoplay loop muted | bottle-frame video |
| `PageHero.astro` | hero textual de páginas internas | acepta `videoBg`, `accent`, `sealVariant`, `showPhonetic` |

### Editoriales narrativos
| Componente | Uso |
|---|---|
| `Diptych.astro` | imagen 50/50 + texto editorial, soporta `bg=white/purple/red/cyan` y `align=left/right` |
| `Interlude.astro` | blockquote editorial breve |
| `Ritual.astro` | imagen ceremonial + texto + seal |
| `Citation.astro` | testimonio con guillemets SVG rojas |
| `Manifesto.astro` | isotype centrado + título XL + caption uppercase |
| `BrandStatement.astro` | AMBROSIA wordmark + tagline + CTA principal |

### Carruseles / showcases
| Componente | Uso técnico |
|---|---|
| `BottleGallery.astro` | **Carrusel infinito seamless**: triplicación de slides + jump silencioso en bordes. Lee imágenes de `getGalleryImages()` o usa 4 default. |
| `BottleShowcase.astro` | 3 ediciones de cera con **zoom inline** click-to-enlarge, halo + reflection + float. Una zoom a la vez (closeAllZooms en otra apertura). |
| `BottleAnatomy.astro` | Infografía 55/45 split. 6 hotspots numerados sobre botella cobalto con alpha real (ImageMagick `-fuzz 8% -transparent white`). **Zoom 2.2× al click** con `transform-origin` dinámico. Sincronización bidireccional hotspot↔spec-row. |

### Listas y grids
| Componente | Uso |
|---|---|
| `WorldsGrid.astro` | 5 cards uniformes navy + glyphs SVG únicos + numeral monumental + tags + readtime + tone tonal por mundo en hover |
| `RecipeIndex.astro` | grid magazine 20 recetas con filtros chips + contador dinámico |
| `RecipeTeaser.astro` | 3 recetas destacadas para home (deprecado en home actual) |
| `TablesSplit.astro` | 2 caminos editoriales (restaurantes/boutique) |
| `Restaurants.astro` | listado completo restaurantes |
| `ConciergeIntent.astro` | 3 cards de intent |
| `BuyPoints.astro` | boutique destinations con **fotos ambientales generadas** (Jabalina/Carnes Ramos) + numeral romano + badge MICHELIN + social row + CTA pill red |
| `BottleGallery.astro` | carrusel home |

### Producto detalle
| Componente | Uso |
|---|---|
| `TastingNotes.astro` | 8 notas de cata con decor lateral chile/ajo |
| `Pairings.astro` | 5 maridajes con decor molcajete/tomate |
| `Edicion.astro` | specs grid (deprecado — eliminado de /la-salsa) |
| `BrandFeature.astro` | imagen full-width con caption (deprecado — eliminado de /la-salsa) |

### Cronología
| Componente | Uso técnico |
|---|---|
| `TimelineCultural.astro` | **Scroll cinemático sticky**: 400vh wrap + viewport 100vh sticky. Cross-fade entre 4 chapters según scrollProgress. Rail vertical con dots numerados + barra roja que crece. HUD con prev/next + counter "0X/04" + progress bar horizontal arriba. Scroll-hint que desaparece tras primer scroll. Cada chapter: 2-col interno (año monumental + glyph editorial). |

### Recetario
| Componente | Uso |
|---|---|
| `RecipeIntro.astro` | header de receta detail |
| `RecipeMeta.astro` | chips tiempo/porciones/categoría |
| `RecipeBody.astro` | 2 cols ingredientes/procedimiento |
| `RecipeNav.astro` | prev/next dentro de categoría |

### Decorativos / motion
| Componente | Uso |
|---|---|
| `MotionDivider.astro` | separadores SVG con 6 variantes: `ornament / bloom / drop / tile / lightning / transition` (motivos otomí) |
| `FloralRule.astro` | regla floral mini/mid/full con tone `ink/white/red` |
| `Seal.astro` | sello editorial 4 variantes: `magenta / purple / silver / brown` |
| `Phonetic.astro` | `(am·brō·zhē)` con tracking generoso, tone auto |
| `FloatingDecor.astro` | imagen flotante con placement + parallax + opacity |
| `Logo.astro` | wordmark AMBROSIA en 3 variantes: `wordmark / lockup / iso` |

### Footer + Nav
| Componente | Uso |
|---|---|
| `Nav.astro` | navegación top con 5 items + back-to-home en internas |
| `NavOverlay.astro` | menú móvil overlay |
| `Footer.astro` | minimalist: brand + nav 5 mundos + newsletter + social row dinámica + bottom bar (© + made-in + SATMA credit + admin key) |

### Interactivos persistentes
| Componente | Uso técnico |
|---|---|
| `ChatBubble.astro` | **bubble flotante bottom-right en TODAS las páginas** (montado en Base.astro). Click → panel desplegable con 4 FAQ rápidas + CTA mailto. ESC/click fuera/close cierran. Mobile <480px: full-width fixed bottom con scroll interno. |

### SEO / Schema
| Componente | Uso |
|---|---|
| `SEOSchema.astro` | JSON-LD por tipo: `home / product / restaurant-list / concierge / origen / recetario`. Incluye Organization+LocalBusiness+FoodEstablishment con GeoCoordinates Monterrey. |

---

## 5. Sistema de diseño

### Tipografía
| Familia | Archivo | Uso |
|---|---|---|
| **Optimus Princeps** | `/fonts/OptimusPrinceps.ttf` | display: títulos, numerales, wordmark |
| **Optimus Princeps SemiBold** | `/fonts/OptimusPrincepsSemiBold.ttf` | display weight 600 |
| **Monkton Incised Solid** | `/fonts/MonktonIncisedSolid.otf` | body text (reemplazó Futura) — Trajan-derived |

**Preload en Base.astro** con `rel="preload" as="font" crossorigin` para evitar FOIT.

**Escala tipográfica unificada** (aplicada en sweep masivo a TODOS los headers de sección):
- **Section title** `h2`: `clamp(2.4rem, 5.5vw, 4.4rem)`
- **Hero title** (PageHero): `clamp(2.8rem, 6.5vw, 5.2rem)`
- **Card title** (sub-nivel): `clamp(1.85rem, 3.6vw, 2.8rem)`
- **Eyebrow**: `0.78rem` + `letter-spacing: 0.36em` uppercase
- **Body header**: `clamp(1.05rem, 1.5vw, 1.3rem)`

### Tokens CSS críticos
```css
/* Spacing */
--space-section: clamp(3rem, 6vw, 5.5rem)

/* Tracking */
--tracking-eyebrow: 0.28em
--tracking-display: 0.04em
--tracking-luxury: 0.18em

/* Duraciones */
--dur-fast: 220ms
--dur-medium: 380ms
--dur-divine: 1200ms
--dur-ceremony: 2200ms

/* Easings */
--ease-fast: cubic-bezier(0.4, 0, 0.2, 1)
--ease-medium: cubic-bezier(0.4, 0, 0.2, 1)
--ease-divine: cubic-bezier(0.16, 1, 0.3, 1)
```

### Colores semánticos
```css
--navy: #15173d
--red: #E22319           /* Pantone 485 */
--cream: #F6F1E6          /* deprecado */
--bg-page: #FFFFFF        /* blanco puro */
--text-primary: var(--navy)
--text-on-color: var(--cream)
--bg-purple-block: var(--navy)
--bg-red-block: var(--red)
--bg-cyan-block: #2DBBD8
```

### Sistema de énfasis editorial (italics)
- `<em>` plano → `font-style: italic; color: inherit` (60% de los casos)
- `<em class="brand">` → `color: var(--red); font-style: italic` (40%, claims fuertes)
- `<em class="lining">` → `border-bottom: 1px solid` (raro)

### Animaciones globales
- **`data-anim="up"`** + IntersectionObserver → fade-up con stagger por `--i` en CSS
- **`title-skew`** → leve skew en h1/h2 al entrar viewport (IO global en Base.astro)
- **GSAP** orquestado en `src/scripts/motion.ts`: Hero pin scroll, mask reveals, word stagger, char stagger
- **Reduced-motion respetado** en TODOS los componentes (animaciones se pausan o se vuelven instant)

### Sistema de imágenes
- **Preload en Base.astro** para imágenes críticas de scroll (mito-tezcatlipoca, origen-molcajete, ritual-guardianes) solo en `/origen`.
- **Imágenes NO usan `opacity: 0` inicial** — patrón anti pop-in: imágenes siempre visibles, solo textos con reveal.
- **`loading="eager"`** para imágenes above-the-fold y preloadeadas, `lazy` para el resto.
- **WebP** como formato principal, PNG con alpha cuando hace falta (botellas onyx/violet/amber).

---

## 6. Backend / CMS editorial

### Auth
- **iron-session** cookie-based con `cookieName: 'ambrosia_admin'`.
- **bcryptjs** verify con hash en `AUTH_PASS_HASH_B64` (base64-encoded para evitar dotenv `$` expansion).
- **Login:** POST `/api/auth/login` con email+password.
- **Middleware:** `src/middleware.ts` protege `/admin/*` (redirect a `/admin/login` si no auth).
- **Session shape:** `{ id, email, role, name }`.

### Roles (PERMISSIONS map en `src/lib/users.ts`)
```ts
admin    → todos los permisos
editor   → content.write, pages.write, media.upload, settings.write
viewer   → solo content.read, pages.read
```

### DB SQLite (`src/lib/db.ts`)
5 tablas:
- `users` (id, email, password_hash, role, name, created_at)
- `media` (id, filename, mime, size, alt_text, uploaded_by, uploaded_at)
- `settings` (key, value JSON, updated_by, updated_at) — key-value store
- `audit_log` (id, user_id, action, entity, details JSON, ip, created_at)
- `pages` (id, slug, title, blocks JSON, locale, published, updated_by, updated_at)

### Páginas admin
| Ruta | Funcionalidad |
|---|---|
| `/admin/login` | login form |
| `/admin/` | dashboard editorial |
| `/admin/contenido` | listing de 18 secciones i18n editables |
| `/admin/contenido/[section]` | form generator dinámico desde estructura JSON |
| `/admin/paginas` | CRUD custom pages con block builder |
| `/admin/media` | upload + listado de imágenes |
| `/admin/usuarios` | gestión de usuarios + roles |
| `/admin/configuracion` | toggles visibilidad + **redes sociales editables** + **galería home JSON** |
| `/admin/actividad` | audit log |

### Settings key-value (settings.ts helpers)
- `getSetting<T>(key, fallback)` — lectura con cache en memoria
- `setSetting(key, value, userId)` — escritura con audit
- `isVisible(section)` — para toggles de visibilidad por componente
- `getSocialLinks()` — retorna array de URLs de redes configuradas (Instagram, Facebook, X, TikTok, YouTube, Email)
- `getGalleryImages()` — retorna imágenes de la galería home configuradas via admin, con fallback a defaults

### API endpoints (`src/pages/api/`)
- `POST /api/auth/login` · `POST /api/auth/logout`
- `GET/POST /api/users` · `GET/PUT/DELETE /api/users/[id]`
- `POST /api/content/[section]` — guarda traducciones con deep merge
- `GET/POST /api/pages` · `GET/PUT/DELETE /api/pages/[id]`
- `POST /api/media/upload` · `DELETE /api/media/[id]`
- `POST /api/settings` — procesa visibility checkboxes + social URLs + gallery JSON en un solo submit

---

## 7. Internacionalización (i18n)

### Rutas
`src/i18n/index.ts` define el mapping ES → EN:
```ts
routes = {
  origen:               { es: 'origen',              en: 'origin' },
  'la-salsa':           { es: 'la-salsa',            en: 'the-sauce' },
  recetario:            { es: 'recetario',           en: 'recipe-book' },
  mesas:                { es: 'mesas',               en: 'tables' },
  'mesas/restaurantes': { es: 'mesas/restaurantes',  en: 'tables/restaurants' },
  concierge:            { es: 'concierge',           en: 'concierge' },
}
```

### Helpers
- `t(locale)` → retorna dictionary completo
- `pathFor(locale, slug)` → genera URLs correctas según locale

### Hreflang
Renderizado en `Base.astro` para cada página: `hreflang="es-MX"`, `hreflang="en-US"`, `hreflang="x-default"`.

### Estado actual
- ES completo (es.json)
- EN completo para chrome (titles, body, nav)
- Recetas EN: solo índice traducido, detalle queda en ES con nota "Recipe in Spanish".

### Sin acentos
**Sweep ejecutado:** todos los acentos (`áéíóúñü`) eliminados de UI visible en i18n + components + data/recetas.ts. Razón: Optimus Princeps tiene problemas de kerning con tildes en mayúsculas. URLs y paths conservan acentos donde sea necesario (ningún slug lo usa).

---

## 8. Assets — imágenes, videos, fuentes

### `/public/images/`
```
brand/
  mito-tezcatlipoca.webp     — pintura barroca Tezcatlipoca descendiendo
  origen-molcajete.webp       — naturaleza muerta molcajete + chile
  label-macro.webp            — macro etiqueta Otomí
  museum-pedestal.webp        — botella sobre pedestal
  isotype.png                 — isotipo AMBROSIA
ritual-guardianes.webp        — 3 guardianes pintura barroca
god-mexica.*.webp             — deidad mexica con penacho (Hero)
god-greco.*.webp              — deidad griega (Hero)
bottle/
  bottle-01.webp              — cobalto sobre fondo neutro (4 ángulos)
  bottle-02.webp              — etiqueta otomí
  bottle-03.webp              — lacre Pantone 485
  bottle-04.webp              — composición editorial
  bottle-original-clean.webp  — botella generada Higgsfield (fondo blanco)
  bottle-original-transparent.webp  — alpha real procesada con ImageMagick
bottles/                      — botellas de cera para BottleShowcase
  bottle-gray.png             — Onyx (negra)
  bottle-green.png            — Violeta (morada)
  bottle-amber.png            — Ámbar
  bottle-onyx.webp            — generada Higgsfield (no usada actualmente)
  bottle-violet.webp          — generada Higgsfield
boutique/                     — ambient images generadas Higgsfield
  jabalina.webp               — interior restaurante boutique Barrio Antiguo
  carnes-ramos.webp           — carnicería boutique heritage
decor/                        — elementos otomí flotantes
  chile.webp · garlic.webp · molcajete.webp · tomato.webp
```

### `/public/video/`
```
hero-bottle-frame.{webm,mp4}        — Hero video loop
reel-01.{webm,mp4} + poster         — Ritual (gota de salsa)
reel-02.{webm,mp4} + poster         — Alquimista (frasco)
reel-03.{webm,mp4} + poster         — Encuentro (fuego)
```

Re-encoded con audio (sesiones anteriores el `-an` flag stripeaba audio):
- MP4: H.264 high CRF 23 + AAC 128k stereo + faststart
- WebM: VP9 CRF 32 + Opus 128k

### `/public/fonts/`
- OptimusPrinceps.ttf
- OptimusPrincepsSemiBold.ttf
- MonktonIncisedSolid.otf

### `/public/recetas/` (24 PNGs)
- 1 imagen por cada una de las 20 recetas + 4 extras (variantes/placeholders)

### Imágenes generadas con Higgsfield (nano_banana_2)
Generadas durante el desarrollo, ya descargadas a `/public/`:
- bottle-original-clean / transparent / alt
- bottle-onyx, bottle-violet (no usadas en showcase actual)
- jabalina.webp, carnes-ramos.webp (BuyPoints)

---

## 9. SEO + GEO + LLM optimization

### Meta tags (Base.astro)
- viewport, theme-color, robots index/follow
- canonical absoluto
- title + meta description únicos por página
- OG: title, description, image, locale (es_MX/en_US), site_name, alternate locale
- Twitter card summary_large_image
- hreflang ES + EN + x-default

### Schema.org JSON-LD (SEOSchema.astro)
**`organization`** ahora con triple `@type`:
- `Organization` + `LocalBusiness` + `FoodEstablishment`
- `geo: GeoCoordinates` Monterrey `25.6866, -100.3161`
- `areaServed`: Monterrey, CDMX, Mexico
- `knowsAbout`: keywords de dominio (chiles secos mexicanos, embotellado a mano, etiqueta Otomí)
- `priceRange: $$$`
- `foundingDate: 2024`

**`product`** (Salsa AMBROSIA):
- `additionalProperty`: volumen 200ml, reposo 90 días, 6 chiles, 3 generaciones
- `award`: Pujol, Quintonil, Alcalde, Casa Oaxaca, Rosetta, Sud 777, Le Chique

**`jabalina`** (Restaurant) + **`carnesRamos`** (Store):
- Address Monterrey NL + sameAs Instagram/Facebook
- award MICHELIN Guide Mexico 2025

**`faqConcierge`** (FAQPage) en /concierge:
- 4 preguntas: qué es, dónde comprar, en qué restaurantes, cuántos chiles

**`origenArticle`** (Article) en /origen
**`recetarioCollection`** (CollectionPage) en /recetario con `numberOfItems: 20`

### Sitemap + robots + llms.txt
- **sitemap-index.xml + sitemap-0.xml** generados por `@astrojs/sitemap`
- **robots.txt** bloquea `/admin/*`, permite GPTBot/CCBot/Claude-Web/PerplexityBot/Google-Extended
- **llms.txt** + **llms-full.txt** para LLM crawlers — descripción completa del producto/brand

### Performance targets
- Lighthouse Performance ≥ 92 desktop, ≥ 85 mobile
- CLS < 0.05
- HTML home < 200KB

---

## 10. Tests

### `tests/smoke.test.mjs` — 20 tests con `node:test`

Run: `node --test tests/smoke.test.mjs`

| # | Test |
|---|---|
| 01 | Build genera `dist/client/` |
| 02 | 5 mundos generan HTML |
| 03 | Páginas EN generadas |
| 04 | Viewport meta presente (mobile) |
| 05 | Canonical URL en cada página |
| 06 | hreflang ES + EN + x-default |
| 07 | OpenGraph + Twitter card |
| 08 | Schema.org JSON-LD en home y la-salsa |
| 09 | GEO context Monterrey |
| 10 | LocalBusiness schema + GeoCoordinates |
| 11 | robots.txt + sitemap + llms.txt presentes |
| 12 | AMBROSIA en mayúsculas (sin tilde) |
| 13 | UI sin acentos visibles |
| 14 | Footer + crédito SATMA en todas las páginas |
| 15 | ChatBubble presente |
| 16 | Assets críticos (favicon, fonts, logo) |
| 17 | Imágenes botella generadas |
| 18 | Videos hero (reel-01/02/03) |
| 19 | robots.txt bloquea /admin/ |
| 20 | HTML home <200KB |

**Estado actual: 20/20 passing ✅**

---

## 11. Mobile optimization

### Sweep CSS aplicado a `global.css` (líneas finales)
- **Safe-area insets** para iPhone notch via `env(safe-area-inset-*)`
- **Anti-zoom iOS**: `font-size: 16px !important` en `input/textarea/select` `<768px`
- **`touch-action: manipulation`** global en `a, button, input, label, textarea, select, [role="button"]` → elimina 300ms tap-delay
- **Touch targets ≥ 44px** en `@media (hover:none) and (pointer:coarse)` (WCAG AAA)
- **Tap highlight** custom rojo brand 12% en lugar del azul nativo
- **`-webkit-text-size-adjust: 100%`** evita rescale iOS landscape
- **`overflow-x: hidden`** en html+body
- **Focus-visible global** rojo brand outline 2px offset 3px
- **`-webkit-appearance: none`** limpia estilos nativos iOS
- **`scroll-behavior: smooth`** respetando `prefers-reduced-motion`

### Componentes mobile-aware específicos
- `Nav.astro` — overlay menu para mobile con backdrop
- `WorldsGrid.astro` — collapse a 2 cols en 1100px, 1 col en 560px, span correcto del 5to item
- `TimelineCultural.astro` — desactiva sticky scroll en <900px, layout vertical normal con `is-in` reveal por chapter
- `BottleAnatomy.astro` — 55/45 desktop → stack vertical en <980px
- `BottleShowcase.astro` — 3 cols → 1 col en <1080px con max-width 560px
- `BottleGallery.astro` — carrusel infinito funciona igual en mobile (swipe nativo + dots)
- `ChatBubble.astro` — panel pasa a fixed bottom full-width en <480px

---

## 12. Decisiones críticas de diseño

### Estructurales
1. **De 7 páginas catálogo a 5 mundos editoriales** — reestructura completa inspirada en Clase Azul. Eliminadas: `/historia`, `/producto`, `/coleccion`, `/donde-comprar`, `/diario`. Consolidadas en: `/origen`, `/la-salsa`, `/recetario`, `/mesas`, `/concierge`.

2. **AMBROSIA siempre en MAYÚSCULAS sin tilde** — la `í` rompe el peso óptico en Optimus Princeps. Sweep masivo aplicado en i18n + componentes + recetas.ts. Mantenida tilde solo en URLs/paths internos no visibles.

3. **Eliminadas redundancias en /la-salsa** — `BrandFeature(label-macro)`, `BrandFeature(museum-pedestal)`, `Edicion` duplicaban info que ya cubre `BottleAnatomy` (Anatomy.02 etiqueta, .04 200ml, .05 fórmula, .06 lote firmado).

4. **Fondo blanco puro** (`#FFFFFF`), no cream — decisión "luxury silencioso" para que las imágenes barrocas y la botella cobalto destaquen sin tintura de fondo.

5. **Acentos por mundo solo en hover** — luxury silencioso: el estado base de cada card de mundo es navy uniforme, el color tonal aparece como "recompensa" al hover.

### Técnicas
6. **Carrusel infinito con triplicación de slides** — render `[clones leading, originals, clones trailing]`, JS hace jump silencioso al equivalente center cuando entras a leading/trailing.

7. **Botella con alpha real** — ImageMagick `-fuzz 8% -transparent white` procesó `bottle-original-clean.webp` → `bottle-original-transparent.webp` para integrar limpio sobre cualquier fondo sin necesidad de `mix-blend-mode`.

8. **Imágenes siempre visibles, solo texto con reveal** — patrón anti pop-in: removido `opacity: 0` + `is-loaded` de Diptych/Ritual. Texto sí mantiene su `data-anim="up"`.

9. **Hotspots reactivos en BottleAnatomy** — sincronización bidireccional: hover sobre hotspot → highlight de spec-row correspondiente · hover sobre row → highlight de hotspot. Click → zoom 2.2× con `transform-origin` dinámico calculado desde la posición anatómica del hotspot.

10. **Timeline scroll cinemático sticky** — wrap 400vh + sticky 100vh + cross-fade entre 4 chapters según `scrollProgress / total`. Auto-disable en mobile.

11. **Carrusel BottleGallery: triplicación seamless** — ya descrito en #6, permite loop circular sin jumps visuales.

12. **Settings key-value para todo editable** — redes sociales (`social.<platform>`), galería (`gallery.home`), visibilidad de secciones (`visibility.<page>.<section>`). API único `/api/settings` procesa todo.

### UX
13. **ChatBubble persistente** en TODAS las páginas — montado en Base.astro. No es un AI chat real, es un panel con 4 FAQ que abren `mailto:` con asunto + cuerpo pre-llenado.

14. **Back link flotante en /origen** — porque el Hero full-viewport no tiene su propio back, agregamos un `position: fixed top-left` con backdrop-blur que persiste todo el scroll.

15. **Crédito SATMA visible** en bottom bar — pill minimal "POR SATMA ↗" con link a satma.mx.

16. **Acceso admin discreto** — icono llave 22px en bottom-right del footer, hover red.

---

## 13. Antipatrones — qué NO hacer

❌ **NO** usar acentos en textos visibles UI — siempre Optimus Princeps + mayúsculas + sin tilde.

❌ **NO** poner `opacity: 0` + `transform` en imágenes esperando `onload` para mostrarlas — causa pop-in. Imágenes siempre visibles desde el primer render.

❌ **NO** duplicar contenido entre `BottleAnatomy` y otros componentes (etiqueta, fórmula, lote ya están ahí).

❌ **NO** agregar más botellas al BottleShowcase sin actualizar el data array (son 3 ediciones por diseño: Onyx, Violeta, Ámbar).

❌ **NO** usar `mix-blend-mode: darken/multiply` para botellas — ya tenemos versión con alpha real (`bottle-original-transparent.webp`).

❌ **NO** mezclar el sistema de énfasis: `<em>` plano para italic editorial sutil, `<em class="brand">` solo para claims fuertes que justifiquen el rojo.

❌ **NO** poner más de 3-4 highlights rojos por scroll — "luxury silencioso" rule.

❌ **NO** hacer hover en touch — usar `@media (hover: none) and (pointer: coarse)` para fallback.

❌ **NO** crear nuevas rutas sin agregarlas en `src/i18n/index.ts` routes map.

❌ **NO** olvidar `prefers-reduced-motion` — todos los componentes deben tener su fallback estático.

❌ **NO** romper el sistema tipográfico unificado:
- Section h2 → `clamp(2.4rem, 5.5vw, 4.4rem)`
- Card title → `clamp(1.85rem, 3.6vw, 2.8rem)`
- Eyebrow → `0.78rem + tracking 0.36em`

❌ **NO** confiar en una sola revisión visual — la página ha pasado por 50+ iteraciones de feedback del usuario. Cada decisión está documentada arriba.

---

## 14. Comandos útiles

### Desarrollo
```bash
cd web

pnpm install          # primera vez
pnpm dev              # dev server en http://localhost:4321
pnpm build            # build estático SSG → dist/client
pnpm preview          # preview del build
```

### Tests
```bash
node --test tests/smoke.test.mjs       # corre los 20 smoke tests
node --test tests/                     # corre todos los tests
```

### Backend
```bash
# Admin local
# Acceder a http://localhost:4321/admin/login con AUTH_USER + password decodificado
# Default credentials están en /Users/alejandromtz-flowwork/Movies/satma/AMBROSIA - WEB /web/.env
```

### Imágenes (procesado offline)
```bash
# Generar alpha real con ImageMagick
magick input.webp -fuzz 8% -transparent white -background none output.webp

# Convertir PNG → WebP optimizado
cwebp -q 88 -m 6 input.png -o output.webp
cwebp -q 82 -m 6 fondo.png -o fondo.webp        # más compresión para fondos

# Video re-encode con audio (ffmpeg)
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow \
       -c:a aac -b:a 128k -ac 2 -movflags +faststart output.mp4

ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 \
       -c:a libopus -b:a 128k output.webm
```

### Limpieza
```bash
rm -rf dist .astro node_modules/.astro     # nuke cache
```

---

## 15. Roadmap pendiente

### Backend
- [ ] Editor visual de bloques para custom pages (actualmente JSON manual)
- [ ] Preview de redes sociales antes de guardar
- [ ] Bulk image upload con drag & drop
- [ ] Programación de publicación de custom pages

### Frontend
- [ ] Reemplazar 4 botellas hardcodeadas del Hero gallery por las generadas con Higgsfield si calidad sube
- [ ] Considerar SmoothScroll con Lenis (Fase 7 del plan editorial luxury, no implementado)
- [ ] Custom cursor (Fase 7 del plan editorial luxury, no implementado)
- [ ] Image mask reveals con clip-path en Diptych/BrandFeature (Fase 5 del plan editorial luxury, no implementado)
- [ ] Word-stagger en Citation/Interlude con GSAP SplitText (Fase 4 del plan editorial luxury, no implementado)

### Contenido
- [ ] Traducir 20 recetas al EN (actualmente solo índice traducido)
- [ ] Testimonios reales de chefs (placeholder en Citation actual)
- [ ] Más imágenes ambientales para BuyPoints / Restaurants
- [ ] Video reel-04 opcional para "el final" del ritual

### SEO / GEO
- [ ] Añadir BreadcrumbList schema en páginas internas
- [ ] Submit sitemap a Google Search Console + Bing Webmaster
- [ ] Migrar a domain final (cuando exista hosting de producción)
- [ ] OpenGraph image dinámica por página (actualmente todas usan label-macro)

### Tests
- [ ] Lighthouse CI integration
- [ ] Visual regression con Playwright (screenshots por viewport)
- [ ] E2E del flow de login + edición + logout

### Performance
- [ ] Auditar el bundle de motion.ts → dynamic import condicional por página
- [ ] Considerar `<picture>` con AVIF + WebP para imágenes de >300KB
- [ ] Service Worker para offline reading del recetario

### Operación
- [ ] Deploy a producción (Vercel / Netlify / fly.io con Node adapter)
- [ ] Domain `ambrosiasauceofgods.com` apuntado
- [ ] Backup automático del SQLite (.data/ambrosia.db)
- [ ] Monitoring (Sentry, Plausible)

---

## 📝 Notas finales

- **El proyecto pasó por una reestructura mayor** ("Clase Azul" / "5 mundos") y luego una capa de pulido editorial. Ambos planes están archivados en `/Users/alejandromtz-flowwork/.claude/plans/distributed-stargazing-nest.md`.
- **La identidad cromática es estricta**: navy `#15173d`, red Pantone 485 `#E22319`, blanco puro. Los acentos otomí se usan solo como tonos sutiles en hover por mundo.
- **El brand voice es "luxury silencioso"** — máximo 3-4 highlights rojos por scroll, italics como énfasis primario, tipografía respira, espacios generosos.
- **Todo el sitio es SSG estático** salvo `/admin/*` que es SSR con auth. Esto da Lighthouse top + permite hosting estático barato.
- **El backend es lightweight intencionalmente** — SQLite + iron-session, sin Postgres ni Redis. Solo 1 servidor Node.js para producción.

---

**Última actualización:** mayo 2026
**Autor del documento:** Claude (sesión de desarrollo con el equipo SATMA)
**Última verificación de tests:** 20/20 passing
**Última verificación de build:** ✅ ok
