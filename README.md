# AGENTE PAGINA WEB — Generador de sitios web SATMA

Sistema multi-agente que **industrializa la creación de sitios web** para clientes de SATMA.

> Input: brief del cliente + investigación 360° de marca (+ URL del sitio actual, opcional).
> Output: mockup HTML para aprobación + repo final (Next.js, Astro, o HTML+Tailwind) + documento de transferencia.

---

## Cómo funciona

```
┌─────────────────────────────────────────────────────────────────┐
│ Brief del cliente (briefs/<cliente>/)                            │
│   • brief.md  (resumen ejecutivo)                                │
│   • knowledge-base/  (11 archivos numerados con la marca)        │
│   • assets/  (logos, fotos, videos del cliente)                  │
│   • web-actual/  (screenshots o URL del sitio actual)            │
└─────────────────────────────────────────────────────────────────┘
                                ↓
        ┌──────────────────────────────────────────────────┐
        │  web-orchestrator  (decide qué invocar y cuándo) │
        └──────────────────────────────────────────────────┘
                                ↓
   ┌────────────────────────────────────────────────────────────┐
   │  1. brand-researcher    → output/<cli>/01-research/         │
   │  2. site-architect      → output/<cli>/02-strategy/          │
   │  3. design-director     → output/<cli>/03-design/            │
   │  4. mockup-builder      → output/<cli>/04-mockup/  ⏸️ aprobar │
   │  5. code-gen-{stack}    → output/<cli>/05-repo/              │
   │  6. qa-reviewer         → corrige el repo + QA_REPORT.md     │
   │  7. kb-writer           → output/<cli>/KNOWLEDGE_BASE.md     │
   └────────────────────────────────────────────────────────────┘
```

---

## Cómo usarlo

### 1. Crear un proyecto nuevo

Desde Claude Code, dentro de `AGENTE PAGINA WEB/`:

```
> Crea un nuevo proyecto para "Clínica Vital" — su web actual es https://clinicavital.mx
```

El orchestrator:
1. Crea `briefs/clinica-vital/` desde la plantilla.
2. Te avisa qué archivos llenar en `briefs/clinica-vital/knowledge-base/`.

### 2. Llenar el brief

Edita manualmente:
- `briefs/clinica-vital/brief.md` — resumen ejecutivo (1 página).
- `briefs/clinica-vital/knowledge-base/01-overview.md` → `10-tono-y-cultura.md`.
- `briefs/clinica-vital/assets/` — logos, fotos.
- `briefs/clinica-vital/web-actual/` — screenshots o URL.

Lo que dejes vacío, el **brand-researcher** intentará completarlo investigando online. Lo que no encuentre quedará marcado como `[FALTA: ...]`.

### 3. Lanzar el pipeline

```
> Genera la página web para clinica-vital usando stack astro
```

Stacks disponibles:
- `next-payload` → Next.js 16 + Payload CMS + Tailwind 4 (admin editable)
- `astro` → Astro 6 + Tailwind 4 (editorial premium, opcional admin)
- `html-vanilla` → HTML + Tailwind 4 + JS puro (landing rápida)

### 4. Aprobar el mockup

Tras la fase 4, el orchestrator pausa. Abrir:

```bash
cd output/clinica-vital/04-mockup
python3 -m http.server 4321
# → http://localhost:4321
```

Cuando apruebes:

```
> Aprobado, continúa con el repo
```

### 5. Recibir el entregable

Al finalizar tienes:

```
output/clinica-vital/
├── 01-research/         ← knowledge-base destilado
├── 02-strategy/         ← sitemap, mensajes, specs por página
├── 03-design/           ← tokens, paleta, tipografía, moodboard
├── 04-mockup/           ← preview HTML aprobado
├── 05-repo/             ← repo final listo para deploy
│   └── QA_REPORT.md     ← auditoría del repo
├── KNOWLEDGE_BASE.md    ← documento maestro de transferencia (15 secciones)
├── STATE.md             ← progreso del pipeline
└── NOTAS.md             ← decisiones y overrides del usuario
```

---

## Estructura del sistema (Claude Code Plugin v1)

```
agente-pagina-web/
├── .claude-plugin/
│   └── plugin.json                ← manifest del plugin (name, version, author…)
├── agents/                        ← 10 subagentes
│   ├── web-orchestrator.md
│   ├── brand-researcher.md
│   ├── site-architect.md
│   ├── design-director.md
│   ├── mockup-builder.md
│   ├── code-gen-next.md
│   ├── code-gen-astro.md
│   ├── code-gen-html.md
│   ├── qa-reviewer.md
│   └── kb-writer.md
├── settings.json                  ← permisos por defecto del plugin
├── kb/                            ← conocimiento del sistema
│   ├── playbook.md                ← patrones SATMA destilados (tokens, motion, SEO, mobile…)
│   └── references/                ← proyectos vivos de referencia
│       ├── satma/satma-web/       ← patrón Next + Payload
│       └── ambrosia/web/          ← patrón Astro editorial
├── briefs/                        ← un directorio por cliente
│   └── _template/                 ← plantilla con los 11 archivos del knowledge-base
├── output/                        ← un directorio por proyecto generado
│   └── <cliente>/                 (gitignored — datos de clientes)
├── AGENTS.md                      ← reglas globales del proyecto
├── CLAUDE.md → @AGENTS.md
└── README.md                      ← este archivo
```

## Instalar como plugin

Desde cualquier sesión de Claude Code:

```
/plugin install ia-satma/agente-pagina-web
```

> **¿Quieres usarlo desde web o iPhone?** Ver [docs/CLOUD.md](docs/CLOUD.md) — opciones de Remote Control y Claude Code en la Web.

Tras instalar:
- Los 10 agentes quedan disponibles globalmente vía `Agent({ subagent_type: '...' })`.
- Los permisos de `settings.json` aplican por defecto.
- El `kb/`, `briefs/_template/` y `AGENTS.md` quedan accesibles dentro del plugin.

### Probar localmente (sin publicar cambios)

```bash
claude --plugin-dir "/Users/alejandromtz-flowwork/Movies/satma/AGENTE PAGINA WEB"
```

Dentro de la sesión:
```
/reload-plugins     # tras editar un agente
/agents             # lista los agentes cargados
```

### Usar como repo (sin plugin)

También puedes clonar el repo y abrirlo con Claude Code directamente — los agentes en `agents/` se cargan automáticamente:

```bash
git clone https://github.com/ia-satma/agente-pagina-web.git
cd agente-pagina-web
claude
```

---

## Comandos comunes

### Crear cliente nuevo
```
> Crea un nuevo proyecto para "<Cliente>" — web actual: https://...
```

### Lanzar pipeline completo
```
> Genera la página web para <slug-cliente> usando stack <next-payload|astro|html-vanilla>
```

### Solo investigación de marca
```
> Solo dame la investigación 360° de <slug-cliente>
```

### Regenerar una fase
```
> Regenera solo el mockup de <slug-cliente>
> Regenera solo el repo de <slug-cliente>
```

### Actualizar tras cambio al brief
```
> Re-ejecuta el pipeline de <slug-cliente> desde la fase de diseño
```

---

## Decisiones tomadas en este sistema

1. **Hospedaje:** Claude Code (local, nube de Anthropic, o como plugin instalable). Subagentes en `agents/` portables.
2. **Stack default por cliente:** lo elige el usuario al invocar (next | astro | html).
3. **Aprobación obligatoria del mockup** antes del repo final.
4. **Knowledge-base con 11 archivos numerados** — mismo formato que `satma-web/knowledge-base/`.
5. **KB final de 15 secciones** — mismo formato que `ambrosia-web/KNOWLEDGE_BASE.md`.
6. **Crédito SATMA obligatorio** en footer de todo sitio generado.
7. **No `lorem ipsum`** en ningún entregable. Si falta copy, queda `[REQUIERE COPY: ...]`.

---

## Iterando el sistema

El sistema mismo es código. Mejóralo:

- **Patrones nuevos** → agregar a `kb/playbook.md`.
- **Nuevos clientes con stack distinto** → puede valer crear un nuevo `code-gen-<stack>.md`.
- **Nuevas secciones en el knowledge-base** → editar `briefs/_template/knowledge-base/` y el agente `brand-researcher`.
- **Mejoras a un agente** → editar su archivo `.md` en `agents/` (luego `/reload-plugins` si lo estás probando como plugin).

Versionar con git:

```bash
cd "AGENTE PAGINA WEB"
git init
git add .
git commit -m "AGENTE PAGINA WEB v1 — sistema multi-agente para generación de sitios SATMA"
```

---

## Próximos pasos

1. **Probar con un cliente real** — sugerencia: tomar un cliente existente con `briefs/<cliente>/` parcialmente lleno y correr el pipeline end-to-end.
2. **Iterar el playbook** con los aprendizajes del primer proyecto real.
3. **Añadir auto-deploy** — un agente `deploy-vercel` que tome `output/<cli>/05-repo/` y lo despliegue.
4. **Añadir generación de imágenes con IA** — un agente `image-generator` que use Midjourney/Higgsfield para producir assets faltantes.

---

**Mantenido por:** SATMA · `ia@satma.mx` · https://satma.mx
