---
description: Inicia un nuevo proyecto de página web — crea estructura de brief desde la plantilla y prepara el pipeline
allowed-tools: ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "AskUserQuestion", "Agent"]
---

# Nuevo proyecto de página web

Inicia un nuevo proyecto SATMA usando el sistema multi-agente EDITOR KIT.

## Pasos

### 1. Capturar datos básicos del cliente

Si el usuario no proveyó el nombre del cliente y URL, pregúntale:

```
1. Nombre del cliente (ej: "Clínica Vital").
2. ¿Tiene web actual? Si sí: URL.
3. ¿Sector/industria? (1 frase).
```

### 2. Generar slug del cliente

Convertir el nombre a kebab-case sin acentos. Ejemplos:
- "Clínica Vital" → `clinica-vital`
- "Tequila Don Fulano" → `tequila-don-fulano`
- "Jabalina MX" → `jabalina-mx`

### 3. Crear directorio del cliente

Verificar si existe `briefs/<slug>/` en el cwd. Si NO existe:
- Copiar `briefs/_template/` a `briefs/<slug>/` (desde el plugin path si no existe `briefs/_template/` local).
- Si el cwd no tiene `briefs/`, crear toda la estructura.

### 4. Pre-llenar brief.md con lo que ya sabemos

Editar `briefs/<slug>/brief.md` reemplazando:
- Nombre del cliente
- URL actual (si la dieron)
- Sector

### 5. Reportar al usuario

Mostrar mensaje tipo:

```
✓ Proyecto creado: briefs/<slug>/

Siguiente paso:
1. Llena estos archivos con la investigación 360°:
   - briefs/<slug>/knowledge-base/01-overview.md
   - briefs/<slug>/knowledge-base/02-servicios.md
   - ... (10 archivos)

2. Coloca assets del cliente en briefs/<slug>/assets/

3. Cuando esté listo, corre:
   /web-genera <slug> astro
   /web-genera <slug> next-payload
   /web-genera <slug> html-vanilla

¿Quieres que el brand-researcher complete los huecos automáticamente investigando la web actual? Responde "sí" y lo lanzo.
```

### 6. Si el usuario pidió "completar automáticamente"

Invocar al `brand-researcher` agent con:
- `briefs/<slug>/` como input
- URL actual como input adicional
- Output a `output/<slug>/01-research/`

## Reglas

- NO inventar datos del cliente. Lo desconocido queda como `[FALTA: ...]`.
- Si el cwd ya tiene `briefs/<slug>/` existente, NO sobrescribir. Avisar al usuario y preguntar.
- Si el plugin path tiene `briefs/_template/`, usar ese como fuente. Si no, escribir uno mínimo inline.
