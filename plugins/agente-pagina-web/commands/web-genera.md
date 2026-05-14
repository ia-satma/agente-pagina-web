---
description: Lanza el pipeline completo para generar el sitio web de un cliente (research → strategy → design → mockup → code → QA)
allowed-tools: ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "Agent", "AskUserQuestion"]
---

# Generar página web de cliente

Lanza el pipeline EDITOR KIT completo para un cliente que ya tiene su brief llenado.

## Uso

```
/web-genera <slug> <stack>
```

Donde:
- `<slug>` = nombre del cliente en kebab-case (ej: `clinica-vital`).
- `<stack>` = `astro` | `next-payload` | `html-vanilla`.

Ejemplos:
- `/web-genera clinica-vital astro`
- `/web-genera tequila-don-x next-payload`
- `/web-genera jabalina-mx html-vanilla`

## Pasos

### 1. Validar argumentos

Si faltan `<slug>` o `<stack>`, preguntar al usuario con AskUserQuestion.

### 2. Verificar que el brief existe

Confirmar que existe `briefs/<slug>/` con:
- `brief.md`
- `knowledge-base/` con los 10 archivos numerados + README.md

Si falta algo crítico, parar y avisar al usuario qué falta.

### 3. Confirmar antes de empezar

Mostrar al usuario:

```
Pipeline a ejecutar para <slug>:
  Stack:           <stack>
  Brief:           briefs/<slug>/brief.md ✓
  Knowledge base:  briefs/<slug>/knowledge-base/ (10 archivos)
  Output destino:  output/<slug>/

El pipeline pausa en la fase 4 (mockup) para tu aprobación antes de generar el repo final.

¿Procedo?
```

### 4. Invocar al web-orchestrator

Pasarle el contexto completo:
- Slug del cliente.
- Stack elegido.
- Paths absolutos de briefs/<slug>/ y output/<slug>/.
- Instrucción de pausar en fase 4 para aprobación.

### 5. Acompañar el progreso

Mientras el orchestrator ejecuta, reportar al usuario cada fase completada:

```
✓ Fase 1: Investigación (brand-researcher) → output/<slug>/01-research/
✓ Fase 2: Arquitectura (site-architect) → output/<slug>/02-strategy/
✓ Fase 3: Diseño (design-director) → output/<slug>/03-design/
✓ Fase 4: Mockup (mockup-builder) → output/<slug>/04-mockup/
⏸  Esperando tu aprobación del mockup. Corre /web-aprobar <slug> para continuar.
```

## Reglas

- Si el cwd no tiene `briefs/<slug>/`, NO crear nada — primero pedir al usuario que corra `/web-nuevo` o coloque el brief.
- Si `output/<slug>/` ya existe parcialmente, leer `STATE.md` y reanudar desde donde quedó.
- Pausar SIEMPRE en fase 4 para aprobación, salvo que el usuario explícitamente pida `--skip-approval` o "no pares en mockup".
