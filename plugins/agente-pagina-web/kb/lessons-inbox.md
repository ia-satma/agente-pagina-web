# Lessons inbox — aprendizajes pendientes de curar

> **Cola de lecciones capturadas desde el uso real del sistema en proyectos SATMA.**
>
> Cada entrada es un aprendizaje, antipatrón, bug o mejora propuesta. Se agregan via `/web-aprende <texto>` y son procesadas periódicamente por el agente `improvement-curator`, que las consolida en `playbook.md` o las traduce a ediciones de los agentes correspondientes.
>
> **Formato de entrada:**
> ```
> ## YYYY-MM-DD HH:MM — [categoría/severidad]
> **Cliente:** <slug>
> **Agente:** <nombre>
> **Estado:** pendiente | curada | descartada
>
> <Texto de la lección>
> ```

---

## Categorías

- `antipattern` — algo que NO debe hacer un agente.
- `pattern` — algo que SÍ funcionó y debería replicarse.
- `bug` — comportamiento incorrecto del sistema.
- `feature-request` — mejora pedida.
- `note` — observación general.

## Severidad

- `low` — mejora opcional, no bloquea.
- `medium` — vale la pena resolver pronto.
- `high` — bloquea proyectos, urgente.

## Flujo

1. `/web-aprende "<texto>"` → entrada nueva al final de este archivo.
2. `improvement-curator` la lee, decide si incorporar al sistema, propone diff al usuario.
3. Si se aprueba: se aplica + se marca `Estado: curada`.
4. Si se rechaza: `Estado: descartada` + razón.

---

<!-- Entradas se agregan debajo de esta línea -->

---

## 2026-05-17 16:30 — [antipattern/high]
**Cliente:** avalon-servicios
**Agente:** code-gen-html (manual edit)
**Estado:** pendiente

### Bug: regex con `\1` y `\3` en f-string de Python inserta bytes de control invisibles

Al intentar agregar cache-busting (`?v=...`) a TODOS los `<link rel="stylesheet">` y `<script src>` de 60 archivos HTML, se usó este patrón Python:

```python
content = re.sub(
    r'(href="(?:\.\./)?styles\.css)(\?v=\d+)?(")',
    f'\\1?v={version}\\3',   # ← BUG
    content
)
```

**Lo que pasó:** Python interpretó `\1` y `\3` dentro del f-string como bytes literales `\x01` (SOH) y `\x03` (ETX), NO como backreferences de regex.

Resultado: en los 60 archivos quedó esto invisible al ojo:
```
<link rel="stylesheet" [\x01]?v=20260517[\x03]>
```

→ El browser no encontró `href="styles.css"` → CSS NUNCA se cargó → toda la página se vio sin estilos.
→ Lo mismo destruyó `<script src="motion.js">` y `<script src="theme.js">`.
→ Detectarlo costó ~10 minutos porque `grep` y `sed` no agarraban los bytes invisibles.

### Lección crítica

**NUNCA mezclar f-strings con backreferences `\1`, `\2`, etc. de `re.sub()` en Python.**

| Antipatrón | Alternativa segura |
|---|---|
| `re.sub(p, f'\\1{var}\\2', s)` ❌ | `re.sub(p, lambda m: m.group(1) + var + m.group(2), s)` ✓ |
| `re.sub(p, f'\\1{var}\\2', s)` ❌ | `re.sub(p, r'\g<1>__TOKEN__\g<2>', s).replace('__TOKEN__', var)` ✓ |
| `re.sub(p, f'\\1{var}\\2', s)` ❌ | `re.sub(p, r'\1' + re.escape(var) + r'\2', s)` ✓ |

### Implicación para los agentes

Cuando un agente (code-gen, qa-reviewer, manual edit) modifica HTML masivamente:

1. **SIEMPRE correr** `kb/tooling/validate-mockup.sh <path>` después de cualquier edit programático
2. **SIEMPRE verificar bytes de control invisibles** (`grep -lP '[\x00-\x08\x0B\x0E-\x1F]'` en cualquier archivo modificado)
3. **PREFERIR Edit/Write tool por archivo** sobre regex masivos cuando el cambio es delicado (href, src, attributes críticos)
4. **NUNCA usar f-string + `\\N`** en `re.sub()` — usar lambda o `\g<N>` con token
5. **Después de cualquier edit masivo programático: smoke test con `curl http://localhost:PORT/` y verificar respuesta contiene `<link rel="stylesheet" href=`**

### Documentación afectada
- `code-gen-html.md` → agregar checklist post-build de validator
- `qa-reviewer.md` → agregar validador de bytes de control + scripts vivos
- `playbook.md` → sección "Edición masiva de HTML: regla de oro"

---

## 2026-05-17 16:35 — [antipattern/high]
**Cliente:** avalon-servicios
**Agente:** code-gen-html / mockup-builder
**Estado:** pendiente

### Bug: SVGs sin `width`/`height` atributos explotan al viewport

En el quote-widget y la sección "Rutas populares" generé SVGs como:
```html
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
  <circle cx="12" cy="12" r="10"/>
</svg>
```

Sin atributos `width="..."` y `height="..."` directos en HTML.

**Lo que pasó:** El SVG del lang-picker (globo terráqueo, dos círculos concéntricos) se renderizó al **tamaño completo del viewport** (1080x1920px) en lugar de 16x16px porque:

1. El CSS `.lang-picker svg { width: 16px; height: 16px }` no aplicaba con suficiente especificidad
2. El SVG sin atributos toma el tamaño implícito del contenedor padre (que era flex sin width fijo)

Resultado: usuario vio un círculo NEGRO GIGANTE cubriendo toda la página.

### Lección crítica

**TODO `<svg>` SIEMPRE debe tener `width="N"` y `height="N"` directos como atributos HTML, no solo CSS.**

```html
<!-- ❌ Antipatrón -->
<svg viewBox="0 0 24 24">...</svg>

<!-- ✅ Correcto -->
<svg width="16" height="16" viewBox="0 0 24 24">...</svg>
```

Además, agregar CSS bulletproof como red de seguridad:
```css
svg:not([width]):not([height]) {
  width: 1em;
  height: 1em;
}
```

### Implicación para los agentes

`code-gen-html`, `mockup-builder`, `code-gen-astro`, `code-gen-next`:

- **Todo SVG inline en HTML/JSX debe tener width y height attributes**
- Tamaños canónicos: 14px (labels), 16px (nav/links), 20px (buttons), 24px (cards/featured)
- El validator post-build debe fallar si encuentra `<svg` sin `width=` (excluyendo `stroke-width=`)

### Documentación afectada
- `mockup-builder.md` → checklist SVG attributes
- `code-gen-*.md` → componentes con SVG inline siempre con dimensiones
- `qa-reviewer.md` → validador SVG anti-explosión
- `playbook.md` → sección "SVG inline: dimensiones obligatorias"

---

## 2026-05-17 — [pattern/high] · BATCH DE LECCIONES PROYECTO AVALON SERVICIOS
**Cliente:** avalon-servicios
**Agente:** todos
**Estado:** pendiente

Después de ~12 horas de trabajo intenso construyendo el sitio completo de Avalon Servicios (transporte ejecutivo Monterrey), capturo las lecciones clave que el `improvement-curator` debe consolidar:

---

### L01 — [pattern/high] Master plan en fases con agentes paralelos

Cuando el trabajo es masivo (10+ archivos, traducciones, refactors grandes):
1. **Hacer backup primero** (siempre — el bug del regex Python me ahorró 4 veces)
2. **Dividir en fases A-G** numeradas y verificables
3. **Delegar fases pesadas a agentes en paralelo** — yo coordino, agentes ejecutan
4. **Validar después de cada fase** con el validator + smoke tests
5. **Bump cache busting** después de cada cambio CSS/JS

Ejemplo concreto del proyecto Avalon:
- 3 agentes traduciendo simultáneamente (EN/PT/FR, DE/IT/JA, KO/AR/ZH) → 54 archivos traducidos en 3 horas paralelas vs 9 horas secuenciales

**Implicación para `web-orchestrator`**: cuando el trabajo es masivo, delegar a sub-agentes en paralelo y coordinar. NO hacer todo secuencial.

---

### L02 — [pattern/high] i18n masivo: script Python + agentes traductores

Para crear N idiomas desde una base ES:
1. Script Python que clona ES → idioma X aplicando transformaciones (paths, lang attr, nombres archivo, lang-picker)
2. Agente delegado traduce los textos NATIVAMENTE (no literal)
3. Validator verifica que cada idioma tiene los mismos componentes que ES

Estructura por idioma:
```
/<lang>/
├── index.html
├── flota_localizado.html   (fleet, frota, flotte, flotta, etc.)
├── servicios_localizado.html
├── nosotros_localizado.html
├── fiebre_localizado.html
└── contacto_localizado.html
```

Cada uno con:
- `<html lang="xx">` (o `xx-XX`)
- `dir="rtl"` si árabe
- Paths con `../public/`
- Scripts con `../motion.js`, `../theme.js`
- Lang-picker con TODOS los idiomas + actual marcado `.current`
- hreflang en `<head>` apuntando a las versiones

**Implicación para `mockup-builder` y `code-gen-*`**: si el sitio es i18n, generar UN script clonador + delegar traducciones a agentes con instrucciones específicas por idioma. NO meter todas las traducciones en el código del agente principal.

---

### L03 — [pattern/medium] Liquid Glass real (Apple iOS 18) usa SVG feDisplacementMap

El "glass" frosted tradicional con solo `backdrop-filter: blur()` se ve simple. El **Liquid Glass real** de Apple usa `<feDisplacementMap>` SVG + backdrop-filter combinados.

```html
<!-- En body, hidden -->
<svg width="0" height="0" style="position:absolute">
  <filter id="liquid-glass-filter" primitiveUnits="objectBoundingBox">
    <feImage href="data:image/webp;base64,..."/>  <!-- displacement map -->
    <feGaussianBlur stdDeviation="0.01"/>
    <feDisplacementMap scale="0.5" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</svg>
```

CSS:
```css
.glass-element {
  backdrop-filter: blur(20px) url(#liquid-glass-filter) saturate(180%);
  /* ... 10 box-shadows layered ... */
}
```

**Cuidado**: Safari NO soporta `url(#filter)` en backdrop-filter — degrade graceful a solo blur+saturate.

**Implicación para `design-director`**: cuando el cliente pide "estilo Apple/iOS Liquid Glass", proponer la técnica de feDisplacementMap. No el blur simple.

---

### L04 — [antipattern/high] Background-color en transitions causa "flash" feo

```css
/* ❌ Causa flash de color intermedio raro */
.btn {
  background-color: rgba(15, 15, 15, 0.92);
  transition: background-color 400ms ease;
}
.btn:hover { background-color: rgba(0, 0, 0, 1); }
/* Pasa por rgba(8, 8, 8, 0.96) — color sucio intermedio */
```

```css
/* ✅ Solo box-shadow transiciona */
.btn {
  background: #0A0A0A;  /* sólido fijo */
  box-shadow: 0 4px 12px -2px rgba(0,0,0,0.2);
  transition: box-shadow 200ms cubic-bezier(0.32, 0.72, 0.32, 1);
}
.btn:hover { box-shadow: 0 10px 24px -4px rgba(0,0,0,0.3); }
```

**Implicación para `design-director`** y `playbook.md` sección animaciones: NO transicionar `background-color` entre 2 rgba diferentes. Usar color fijo + variar solo shadow/transform.

---

### L05 — [pattern/high] Hero composition con zona inferior calma para UI overlay

Cuando se generan hero images con AI (Higgsfield, GPT Image 2):
- **Composición sujetos en upper 2/3** del frame
- **Lower 1/3 visualmente calmo** (road, pavement, soft shadows, blurred background)
- Promp incluir: `"INTENTIONALLY VISUALLY CALM for UI overlay"` o `"empty bottom third for text/widget"`

Resultado: el booking widget + tagline en la parte inferior NO compiten con el sujeto principal de la imagen.

**Implicación para `mockup-builder`**: cuando genera imágenes hero, especificar composición consciente del overlay UI.

---

### L06 — [pattern/medium] Carrusel hero con auto-rotate + pause + visibility API

```js
const INTERVAL = 6000;  // 6s por slide (no 7-10, perder atención)
let timer = setInterval(next, INTERVAL);

// Pausar al hover
heroSection.addEventListener('mouseenter', () => clearInterval(timer));
heroSection.addEventListener('mouseleave', () => timer = setInterval(next, INTERVAL));

// Pausar cuando pestaña no visible (ahorra batería)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) clearInterval(timer);
  else timer = setInterval(next, INTERVAL);
});

// Respetar prefers-reduced-motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // NO auto-rotate
}
```

**Crossfade 1.5s** entre slides con `opacity` + `position: absolute` — NO `transform: translateX` (eso es slider lateral).

---

### L07 — [pattern/medium] Lenis smooth scroll + integración con GSAP ScrollTrigger

```js
const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,  // ⚠ mobile usa scroll nativo
});

// CRÍTICO: integrar con ScrollTrigger o las animaciones de scroll se rompen
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Anclas: usar lenis.scrollTo, no scrollIntoView nativo
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    lenis.scrollTo(target, { offset: -80 });
  });
});

// data-lenis-prevent en scroll horizontal interno (carrusel mobile, lang-picker dropdown)
```

CSS necesario:
```css
html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-stopped { overflow: hidden; }
```

**Implicación para `playbook.md`**: agregar sección Lenis con esta receta exacta.

---

### L08 — [pattern/high] Backend admin CMS para sitios estáticos (Replit-friendly)

Stack ganador para CMS lite con deploy en Replit:
- **Node.js + Express 4**
- **bcryptjs** (NO bcrypt — bcrypt requiere compilación nativa, falla en Replit)
- **iron-session 8** (stateless, cookie-based, no Redis)
- **multer** para uploads
- **JSON files** como storage (suficiente para 1 admin, perfecto para Replit)
- **0.0.0.0 binding** (Replit requiere)
- **process.env.PORT** con fallback
- **process.on('uncaughtException')** + `unhandledRejection`

Estructura:
```
server/
├── index.js       # express setup + listen
├── auth.js        # login + bcryptjs + iron-session
├── store.js       # atomic JSON write (tmp + rename)
├── middleware/
│   └── requireAuth.js
└── routes/
    ├── content.js
    ├── images.js (multer)
    ├── contact.js
    ├── pages.js
    └── locales.js

data/
├── users.json
├── content.json
├── contact.json
├── pages.json
└── locales.json
```

**Endpoint público (sin auth)**: `/api/public/site-config` devuelve contact+pages+locales+content → el frontend lee esto al cargar.

**Implicación para `code-gen-html`**: agregar opción de generar repo con CMS admin opcional usando este stack.

---

### L09 — [pattern/high] public-bridge.js: patrón frontend estático ↔ backend dinámico

Para conectar HTML estático multilingüe con backend sin rebuild:

```html
<!-- HTML estático (renderizado al build) -->
<a href="https://wa.me/528112772833" data-bind-href="contact.whatsappLink">WhatsApp</a>
<span data-bind="contact.phoneDisplay">+52 81 1277 2833</span>
<li data-page="fiebre-futbolera"><a href="...">Fiebre Futbolera 2026</a></li>
<a href="ar/index.html" data-locale="ar">عربي</a>

<script src="/public-bridge.js"></script>
```

```js
// public-bridge.js (al cargar)
fetch('/api/public/site-config').then(json => {
  // 1. Reemplazar texto con data-bind
  document.querySelectorAll('[data-bind]').forEach(el => {
    el.textContent = config.contact[key];
  });
  // 2. Reemplazar href con data-bind-href
  document.querySelectorAll('[data-bind-href]').forEach(el => {
    el.setAttribute('href', config.contact[key]);
  });
  // 3. Ocultar páginas/idiomas deshabilitados
  document.querySelectorAll('[data-page]').forEach(el => {
    if (!config.pages[el.dataset.page].enabled) el.closest('li').style.display = 'none';
  });
});
```

**Implicación para `code-gen-*`**: este patrón es la solución para sitios estáticos+CMS sin SSR. Agregar al toolkit.

---

### L10 — [pattern/medium] Replit config completo (no rompe en deploy)

`.replit`:
```toml
run = "node server/index.js"
entrypoint = "server/index.js"
modules = ["nodejs-18"]
hidden = [".config", "package-lock.json", ".DS_Store"]

[deployment]
deploymentTarget = "cloudrun"
build = ["sh", "-c", "npm install --omit=dev"]
run = ["sh", "-c", "node server/index.js"]

[[ports]]
localPort = 3000
externalPort = 80
```

`replit.nix`:
```nix
{ pkgs }: {
  deps = [ pkgs.nodejs-18_x pkgs.nodePackages.npm ];
}
```

`.gitignore`:
```
node_modules/
.DS_Store
.env
*.log
```

`.env.example` con instrucciones para Replit Secrets.

`REPLIT-DEPLOY.md` con guía paso a paso + troubleshooting.

**Implicación para `code-gen-html` y `code-gen-astro`**: cuando el target es Replit, generar estos 4 archivos como parte del repo final. Incluir `REPLIT-DEPLOY.md` siempre.

---

### L11 — [pattern/medium] Galería expandible accordion-style (Apple/Linear vibes)

```css
.gallery {
  display: flex;
  gap: 0.5rem;
}
.gallery-item {
  flex: 1 1 0;
  transition: flex-grow 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.gallery-item.active,
.gallery-item:hover {
  flex-grow: 5;  /* el activo crece 5×, los demás se contraen */
}
```

Mobile (hover no funciona): scroll horizontal con scroll-snap. Detectar `(max-width: 768px)` y cambiar a grid.

**Implicación para `playbook.md`**: agregar sección "Galería expandible" con esta receta.

---

### L12 — [antipattern/high] Generar 8+ idiomas sin validar imágenes residuales

Al generar idiomas (pt, fr, de, etc.) con plantillas viejas que mencionan imágenes inexistentes (`sedán-ejecutivo.png` cuando ya se renombraron a `sienna.png`), el sitio rompe imágenes en esos idiomas.

**Solución**: el validator debe correr para CADA idioma generado, no solo ES.

**Implicación para `qa-reviewer`**: el validator `kb/tooling/validate-mockup.sh` debe iterar por carpeta de idioma y reportar imágenes faltantes específicamente por idioma.

---

### L13 — [pattern/medium] Backups antes de operaciones masivas

```bash
BACKUP="/path/04-mockup-backup-$(date +%Y%m%d-%H%M%S)-$DESC"
rsync -a --exclude='node_modules' "$SRC/" "$BACKUP/"
```

Para el proyecto Avalon hice 4 backups en momentos críticos:
- Pre-cleanup
- Pre-i18n
- Pre-backend
- Pre-replit

Salvaron la sesión 2 veces cuando el regex Python destrocé los HTMLs.

**Implicación para todos los agentes**: hacer backup automático antes de cualquier operación que modifique >10 archivos.

---

### L14 — [pattern/medium] Cache busting con timestamp para forzar reload

Después de cambios CSS/JS:
```python
import time
v = str(int(time.time()))
content = re.sub(r'styles\.css\?v=\d+', f'styles.css?v={v}', content)
content = re.sub(r'motion\.js\?v=\d+', f'motion.js?v={v}', content)
```

Sin esto, el browser usa CSS/JS cacheado y el usuario reporta "no veo los cambios".

**Implicación para `mockup-builder` y `code-gen-*`**: agregar `?v=TIMESTAMP` a CSS/JS/admin scripts en cada generación.

---

### L15 — [pattern/medium] Favicon + PWA manifest para sitios premium

Mínimo necesario:
- `favicon.ico` multi-size (16/32/48)
- `apple-touch-icon.png` 180×180
- `manifest.json` con name, short_name, icons, theme_color
- `<link rel="icon">`, `<link rel="apple-touch-icon">`, `<link rel="manifest">` en `<head>` de TODAS las páginas

Diseño favicon Avalon: fondo `#0A0A0A` + letra "A" dorada `#D1A01D`.

**Implicación para `mockup-builder`**: incluir favicon + PWA manifest como parte del entregable estándar.

---

### L16 — [pattern/medium] Generación de imágenes hero con Higgsfield + GPT Image 2

Modelo: `gpt_image_2`, aspect_ratio `16:9`, resolution `2k`, quality `high`.

Master prompt formula:
```
Cinematic [ANGLE] shot, [TIME OF DAY] [LIGHTING].
[SUBJECT description detallada] [ACTION].
Composition: [POSITION del sujeto en frame] — INTENTIONALLY VISUALLY CALM for UI overlay [WHERE].
[STYLE keywords]: anamorphic lens flare, 35mm film, warm color grading.
Editorial luxury aesthetic, NOT obvious advertising.
NO [things to avoid]: stadium, crowds, etc.
```

Resultado: imágenes premium estilo Blacklane, compositivas, listas para overlay UI.

Tiempo de generación: 60-90s por imagen quality:high.

**Implicación para `design-director`**: cuando el cliente pide hero images premium, usar Higgsfield gpt_image_2 con esta formula. Generar 3-5 variantes para carrusel.

---

### L17 — [antipattern/high] NUNCA delegar tareas críticas sin instrucciones específicas

Cuando delegué "traduce las 6 páginas EN a todas las páginas" al primer agente, tardó 30 min en hacer solo 175 bytes (falló).

Solución: instrucciones MUY específicas:
- Lista exacta de archivos a procesar
- Procedimiento paso a paso
- Strings clave de referencia con sus traducciones
- Formato de entregable esperado
- "NO consultes, decide con sensatez y entrega trabajo terminado"

Cuando volví a delegar con 3 agentes especificando cada uno traducir 3 idiomas con keys exactas, terminaron en 30-60 min cada uno.

**Implicación para `web-orchestrator`**: cuando delegues, especifica TODO. Listas exactas, ejemplos, traducciones literales de referencia, formato de output, alcance permitido y prohibido.

---

## Documentación afectada (TODO L01-L17)

- `playbook.md` → secciones 16-25 nuevas
- `code-gen-html.md`, `code-gen-astro.md`, `code-gen-next.md` → patrón CMS Replit + Bridge JS
- `mockup-builder.md` → cache busting + favicon + composición hero
- `qa-reviewer.md` → validator por idioma + bytes invisibles
- `design-director.md` → Liquid Glass real + no-transition background-color
- `web-orchestrator.md` → master plan en fases + delegación con instrucciones específicas
- `kb/tooling/` → posibles nuevos: build-locales.py, validate-i18n.sh
