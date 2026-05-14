# Changelog

Historial de cambios del plugin `agente-pagina-web`.

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Versionado: [SemVer](https://semver.org/lang/es/) — `MAJOR.MINOR.PATCH`.

## [1.1.0] — 2026-05-14

### Added — Sistema de mejora continua
- **Nuevo slash command `/web-aprende`** — captura lecciones del uso real in-flight, las guarda en `kb/lessons-inbox.md`.
- **Nuevo agente `improvement-curator`** — lee lecciones acumuladas (lessons-inbox + LESSONS.md de proyectos) y propone mejoras concretas al playbook y a los agentes. No aplica cambios sin confirmación del usuario.
- **`kb-writer` ahora genera `LESSONS.md` por proyecto** — patterns, antipatterns y propuestas al sistema. Fuente que alimenta al improvement-curator.
- **`kb/lessons-inbox.md`** inicial — cola estructurada para feedback continuo.
- **`CHANGELOG.md`** raíz para documentar cambios versionados.

### Added — Slash commands existentes (de 1.0.x → 1.1.0)
- `/web-nuevo "Nombre Cliente"` — crear estructura de brief.
- `/web-genera <slug> <stack>` — lanzar pipeline completo.
- `/web-aprobar <slug>` — aprobar mockup y continuar.
- `/web-estado <slug>` — ver progreso.
- `/web-list` — listar clientes.

### Changed
- Descriptions de los 7 agentes principales (`web-orchestrator`, `brand-researcher`, `site-architect`, `design-director`, `mockup-builder`, `qa-reviewer`, `kb-writer`) ampliadas con más frases trigger en español natural.
- `AGENTS.md` raíz del plugin agrega tabla de atajos verbales y mapa "si el usuario escribe → invocar este agente".

---

## [1.0.0] — 2026-05-14

### Added — Lanzamiento inicial
- Pipeline multi-agente de 7 fases: research → strategy → design → mockup → code (Next/Astro/HTML) → QA → handoff.
- **10 subagentes especializados** en `agents/`:
  - `web-orchestrator`, `brand-researcher`, `site-architect`, `design-director`, `mockup-builder`
  - `code-gen-next`, `code-gen-astro`, `code-gen-html`
  - `qa-reviewer`, `kb-writer`
- **`kb/playbook.md`** — patrones SATMA destilados (tipografía, paleta, motion, mobile, SEO).
- **`kb/references/`** — proyectos vivos como patrón:
  - `satma/satma-web/` (Next + Payload)
  - `ambrosia/web/` (Astro editorial)
- **`briefs/_template/knowledge-base/`** — plantilla de 11 archivos para investigación 360°.
- **`.claude-plugin/marketplace.json`** + **`plugin.json`** — manifest del plugin instalable.
- **`settings.json`** con permisos por defecto.
- **`docs/`** — `MANUAL.md` con guía de 3 vías de uso, `CLOUD.md` con Remote Control.

---

## Plantilla para futuras versiones

```markdown
## [X.Y.Z] — YYYY-MM-DD

### Added
- Nuevas features.

### Changed
- Cambios en comportamiento existente.

### Deprecated
- Features que serán removidas.

### Removed
- Features eliminadas.

### Fixed
- Bugs corregidos.

### Security
- Parches de seguridad.

### Lecciones que motivaron estos cambios
- Cita de lessons-inbox.md / LESSONS.md específicos.
```
