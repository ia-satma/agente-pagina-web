---
description: Captura una lección/aprendizaje del uso del sistema en un proyecto real — feedback in-flight que el improvement-curator usa para mejorar los agentes
allowed-tools: ["Read", "Write", "Edit", "Bash", "Glob"]
---

# Capturar lección del sistema

Anota un aprendizaje, antipatrón, mejora o bug observado mientras usas el sistema. Va a `kb/lessons-inbox.md` para ser curado después por el `improvement-curator`.

## Uso

```
/web-aprende <texto libre con la lección>
```

Ejemplos:
- `/web-aprende El brand-researcher inventó un testimonio cuando no había uno real — hace falta regla más estricta`
- `/web-aprende El design-director propuso Söhne pero la licencia cuesta $X/año — agregar verificación de costo antes de proponer`
- `/web-aprende El mockup-builder generó un hero con video pesado de 8MB — debe optimizar a <2MB`
- `/web-aprende Patrón nuevo que funcionó: usar Diptych con bg=cyan + align=right para clientes premium`

## Pasos

### 1. Resolver dónde está el lessons-inbox.md

Buscar en este orden:
- **A.** En el plugin instalado: `~/.claude/plugins/marketplaces/satma-agentes/plugins/agente-pagina-web/kb/lessons-inbox.md`
- **B.** En el repo local clonado (si el user editó el plugin localmente): buscar `lessons-inbox.md` con `Glob` desde cwd hacia arriba.
- **C.** Si nada existe, crear en el cwd actual `lessons-inbox.md` como fallback.

Si la opción A o B existen (read-only en el plugin instalado), avisar al usuario que el archivo del plugin instalado es read-only y que la lección quedará en el cwd local. Para incorporarlas al sistema oficial hay que abrir un PR al repo `ia-satma/agente-pagina-web`.

### 2. Capturar metadatos

Para cada lección registrar:
- **Fecha + hora:** ISO 8601 (`2026-05-14T17:30:00Z`).
- **Cliente** (si aplica): inferir del cwd actual si está dentro de `output/<slug>/` o pedir al usuario.
- **Categoría:** clasificar automáticamente como una de:
  - `antipattern` → algo que NO debe hacer un agente.
  - `pattern` → algo que SÍ funcionó y debería replicarse.
  - `bug` → comportamiento incorrecto del sistema.
  - `feature-request` → mejora pedida.
  - `note` → observación general.
- **Agente afectado** (si aplica): cuál de los 10 agentes está involucrado.
- **Severidad:** `low` / `medium` / `high` (high = bloquea proyectos).

### 3. Escribir en el inbox

Agregar al final de `lessons-inbox.md`:

```markdown
---

## YYYY-MM-DD HH:MM — [categoría/severidad]
**Cliente:** <slug> (o `general` si aplica a todos)
**Agente:** <web-orchestrator | brand-researcher | ...> (o `multi` / `none`)
**Estado:** pendiente de curar

<Texto de la lección, tal como la dijo el usuario>

**Propuesta de fix (si el usuario la dio):** ...
```

### 4. Reportar al usuario

```
✓ Lección registrada en lessons-inbox.md
  Categoría: antipattern
  Agente: brand-researcher
  Severidad: medium

Esta lección será curada en la próxima sesión del improvement-curator.
Para invocarlo ya: > Cura las lecciones pendientes

Total de lecciones pendientes en el inbox: 7
```

## Reglas

- **Nunca pierdas una lección.** Aunque el plugin esté read-only, guardar en cwd local con un mensaje claro.
- **No filtres ni edites** el texto del usuario. Capturar literal.
- Si el usuario no proveyó cliente y el cwd no lo permite inferir, marcar como `general`.
- Si la lección es muy ambigua (1-2 palabras), pedirle al usuario que expanda con `AskUserQuestion` antes de registrar.
