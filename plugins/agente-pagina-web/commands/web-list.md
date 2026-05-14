---
description: Lista todos los clientes (briefs y proyectos en pipeline) — vista resumen rápida
allowed-tools: ["Read", "Bash", "Glob"]
---

# Listar clientes

Vista rápida de todos los clientes del sistema EDITOR KIT.

## Uso

```
/web-list
```

(Sin argumentos.)

## Pasos

### 1. Recolectar info de briefs/

Recorrer `briefs/*/` (no `_template`). Para cada uno:
- ¿Existe `brief.md`? → llenado parcial
- ¿Existen los 11 archivos del `knowledge-base/`? → completo o parcial
- Última fecha de modificación

### 2. Recolectar info de output/

Recorrer `output/*/`. Para cada uno:
- ¿Qué fase es la última completada? (carpetas 01-05 presentes)
- ¿Existe `KNOWLEDGE_BASE.md`? → completado

### 3. Reportar como tabla

```
Clientes en el sistema EDITOR KIT (cwd actual):

📋 Briefs (entrada del pipeline)
| Slug             | Brief    | KB        | Assets | Último update |
|------------------|----------|-----------|--------|---------------|
| clinica-vital    | ✓        | 8/11      | 3      | hace 2 h      |
| tequila-don-x    | ✓        | 11/11     | 12     | ayer          |
| pendiente        | parcial  | 0/11      | 0      | hace 3 días   |

🏗  Output (proyectos en pipeline)
| Slug             | Fase actual         | Stack       | Completado |
|------------------|---------------------|-------------|------------|
| clinica-vital    | 04 Mockup ⏸         | astro       | 4/7        |
| tequila-don-x    | ✅ Done             | next-payload| 7/7        |
| jabalina-mx      | 06 QA               | astro       | 6/7        |

Comandos útiles:
  /web-nuevo "Cliente nuevo"   ← crear cliente
  /web-genera <slug> <stack>   ← lanzar pipeline
  /web-aprobar <slug>          ← aprobar mockup
  /web-estado <slug>           ← detalle de uno
```

## Reglas

- Solo lectura.
- Si `briefs/` u `output/` no existen, mostrar mensaje claro: "Aún no hay clientes. Empieza con /web-nuevo".
- Filas alineadas para legibilidad.
