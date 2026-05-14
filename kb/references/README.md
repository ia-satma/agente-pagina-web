# kb/references/ — proyectos de referencia

> ⚠️ **Contiene código real de clientes SATMA**. Si este repo alguna vez se vuelve público, **quitar esta carpeta primero**.

## Qué hay aquí

| Carpeta | Origen | Stack | Usado por los agentes como… |
|---|---|---|---|
| `satma/satma-web/` | `satma-web-FINAL-20260430-1228.zip` | Next.js 16 + Payload 3 + Tailwind 4 | patrón vivo para `code-gen-next` y referencia general |
| `ambrosia/web/` | `ambrosia-web-replit-20260514-131353.zip` | Astro 6 + Tailwind 4 + iron-session + SQLite | patrón vivo para `code-gen-astro`; el `KNOWLEDGE_BASE.md` de Ambrosia es la plantilla del kb-writer |

## Reglas

- Estos archivos son **read-only** para los agentes — nunca se modifican, solo se consultan.
- Ningún proyecto real generado por EDITOR KIT debe vivir aquí. Los proyectos de clientes van en `output/<slug>/` (excluido del repo).
- Si necesitas actualizar las referencias con versiones más nuevas, reemplaza la carpeta entera, no edites en sitio.

## Por qué viven en el repo

Los `system prompts` de los agentes en `.claude/agents/` referencian rutas concretas dentro de `kb/references/`. Si removemos esto, los agentes pierden su "patrón vivo" para inspirarse.
