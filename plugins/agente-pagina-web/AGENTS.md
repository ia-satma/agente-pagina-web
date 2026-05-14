# AGENTE PAGINA WEB — Sistema de generación de sitios web SATMA

Sistema multi-agente que recibe un **brief de cliente** (investigación 360° de marca + URL actual opcional) y produce:
1. Un **mockup HTML estático** para aprobación del cliente.
2. Un **repositorio de código** del sitio final (Next.js + Payload, Astro, o HTML+Tailwind).
3. Un **KNOWLEDGE_BASE.md** de transferencia.

---

## Reglas globales del proyecto

### 1. Idioma y voz
- **Español de México por defecto** en toda la UI de los sitios generados. Locale alterno `en-US` si el brief lo pide.
- Voz "SATMA": editorial, directa, sin floritura barata. Industria-aware: B2B mexicano serio.
- **Sin acentos** en headers de display si la tipografía elegida tiene problemas con tildes en mayúsculas (ver patrón Ambrosia con Optimus Princeps). Verificar caso por caso.

### 2. Stacks soportados (el usuario elige al invocar)
| Stack | Cuándo usarlo | Referencia viva |
|---|---|---|
| **Next.js 16 + Payload 3 + Tailwind 4** | Cliente necesita admin/CMS, contenido editable, multi-página. | `kb/references/satma/satma-web/` |
| **Astro 6 + Tailwind 4** | Editorial premium, mayormente estático, performance crítica. Admin opcional con iron-session + SQLite. | `kb/references/ambrosia/web/` |
| **HTML + Tailwind 4 + JS vanilla** | Landings rápidas, one-pagers, MVPs. Sin build complejo. | (a definir en proyectos futuros) |

**Comunes a todos:** pnpm, Tailwind 4, GSAP para motion, Sharp para imágenes, WebP/MP4+WebM, respeto a `prefers-reduced-motion`, tokens CSS semánticos.

### 3. Estructura de output por proyecto
Cada cliente vive en `output/<slug-cliente>/` con esta jerarquía exacta:
```
output/<cliente>/
├── 01-research/knowledge-base/    # 11 archivos numerados (formato SATMA)
├── 02-strategy/                   # sitemap.md, audiencias.md, mensajes.md
├── 03-design/                     # tokens.md, moodboard.md, paleta.md, tipografia.md
├── 04-mockup/                     # index.html + assets — preview de aprobación
├── 05-repo/                       # repo del stack elegido
└── KNOWLEDGE_BASE.md              # documento maestro de transferencia
```

### 4. Formato del knowledge-base (input de cliente)
Los briefs siguen **exactamente** el formato `briefs/_template/knowledge-base/` con 11 archivos:
```
01-overview.md           — quién es el cliente, qué hace, propuesta de valor
02-servicios.md          — qué ofrece (catálogo)
03-industrias.md         — a quién le vende
04-casos-exito.md        — pruebas sociales
05-equipo.md             — gente y cultura
06-proceso.md            — metodología propia
07-diferenciador.md      — la cosa única (equivalente a "brujer-ia" en SATMA)
08-faq.md                — preguntas frecuentes
09-contacto-y-comercial.md — CTAs, datos, pricing si aplica
10-tono-y-cultura.md     — voz, valores, cómo hablan
README.md                — índice
```
Si el brief llega incompleto, el `brand-researcher` lo completa con investigación 360°.

### 5. Antipatrones — qué NO hacer NUNCA
- ❌ Inventar datos del cliente. Si falta info, marcar `[FALTA: ...]` y preguntar.
- ❌ Copiar componentes literales de SATMA o Ambrosia. Inspirarse en el patrón, no replicar.
- ❌ Skip el mockup HTML. Siempre se entrega `04-mockup/` antes del repo final.
- ❌ Skip `prefers-reduced-motion`. Toda animación debe tener fallback.
- ❌ Skip mobile. Touch targets ≥44px, safe-area-insets para iPhone, font-size ≥16px en inputs (anti-zoom iOS).
- ❌ Skip SEO. Cada página debe tener title único, OG, canonical, JSON-LD apropiado, hreflang si i18n.
- ❌ Generar texto lorem ipsum. Toda copy debe venir del knowledge-base o ser marcada como `[REQUIERE COPY DEL CLIENTE]`.
- ❌ Saltarse el flujo de aprobación. El usuario debe firmar el mockup antes de pasar al repo final.

### 6. Referencias vivas (kb/references/)
Los agentes consultan `kb/references/` para ver patrones SATMA reales:
- **`satma/satma-web/`** — patrón Next + Payload + Tailwind. Mirar: `app/(frontend)/`, `app/(payload)/`, `payload/collections/`, `payload/globals/`, `payload.config.ts`, `globals.css`.
- **`ambrosia/web/`** — patrón Astro editorial. Mirar: `src/components/`, `src/styles/global.css`, `astro.config.mjs`, `KNOWLEDGE_BASE.md` (formato del entregable final).
- **`kb/playbook.md`** — destilación de patrones cross-proyecto (tokens, decisiones, antipatrones).

### 7. Pipeline canónico
```
brief llega → web-orchestrator
                ↓
        brand-researcher       → output/<cli>/01-research/knowledge-base/
                ↓
        site-architect          → output/<cli>/02-strategy/
                ↓
        design-director         → output/<cli>/03-design/
                ↓
        mockup-builder          → output/<cli>/04-mockup/  ← APROBACIÓN DEL USUARIO
                ↓
        code-gen-{next|astro|html} → output/<cli>/05-repo/
                ↓
        qa-reviewer             → corrige issues sobre el repo
                ↓
        kb-writer               → output/<cli>/KNOWLEDGE_BASE.md
```

### 8. Cuándo escalar a Opus
Por default los agentes corren con `sonnet` (rápido + barato). Subir a `opus` cuando:
- Decisiones de arquitectura tipográfica/cromática (design-director).
- Sitios muy grandes (>15 páginas) o con lógica de negocio compleja (Payload collections).
- Cuando el usuario lo pida explícitamente con "usa opus".

---

## Cómo invocar el sistema

Desde Claude Code, dentro de `AGENTE PAGINA WEB/`:

```
> Genera la página web para cliente-x usando stack astro
```

El `web-orchestrator` detecta el cliente, lee `briefs/cliente-x/`, valida que el knowledge-base esté completo, y delega al resto en cascada.

Si el brief no existe todavía:
```
> Crea un nuevo proyecto para "Cliente X" — su web actual es https://...
```

El orchestrator copia `briefs/_template/` a `briefs/cliente-x/`, ejecuta el `brand-researcher`, y para a pedir más info al usuario si falta.
