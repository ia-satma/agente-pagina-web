---
description: Muestra el estado actual del pipeline para un cliente (qué fases completadas, qué falta, pendientes)
allowed-tools: ["Read", "Bash", "Glob", "Grep"]
---

# Estado del proyecto

Reporte conciso del progreso del pipeline para un cliente.

## Uso

```
/web-estado <slug>
```

Ejemplo: `/web-estado clinica-vital`

Si no se pasa `<slug>`, listar TODOS los clientes con su estado en una tabla.

## Pasos

### 1. Si el usuario pasó `<slug>`

Leer:
- `output/<slug>/STATE.md` (si existe)
- `output/<slug>/NOTAS.md` (si existe)
- Estructura de carpetas con `ls -la output/<slug>/`
- `output/<slug>/05-repo/QA_REPORT.md` si existe (extraer issues pendientes)

Reportar tipo:

```
Cliente: <slug>
Stack:   <stack>

Fases:
  [✓] 01 Research      → output/<slug>/01-research/ (11 archivos, 0 [FALTA])
  [✓] 02 Strategy      → output/<slug>/02-strategy/
  [✓] 03 Design        → output/<slug>/03-design/
  [✓] 04 Mockup        → output/<slug>/04-mockup/ (aprobado YYYY-MM-DD)
  [⏳] 05 Repo          → output/<slug>/05-repo/ (en curso)
  [ ] 06 QA
  [ ] 07 KB final

Pendientes ([FALTA] / placeholders):
  - 3 fotos del equipo
  - Logo SVG vectorial
  - Texto del hero requiere validación

Siguiente paso sugerido:
  Resolver pendientes y luego correr /web-aprobar <slug>
```

### 2. Si NO pasó `<slug>`

Recorrer `output/` con `Glob` y listar todos los clientes:

```
Clientes en el pipeline EDITOR KIT:

| Slug             | Fase actual    | Última actualización | Stack       |
|------------------|----------------|----------------------|-------------|
| clinica-vital    | 05 Repo        | 2026-05-14 16:23     | astro       |
| tequila-don-x    | 04 Mockup ⏸    | 2026-05-13 18:50     | next-payload|
| jabalina-mx      | ✅ Completado  | 2026-05-10 11:42     | astro       |

Para detalles de uno: /web-estado <slug>
```

## Reglas

- Solo lectura. Nunca escribir archivos.
- Si `output/<slug>/STATE.md` no existe, reportar "proyecto no inicializado".
- Si la carpeta `output/` no existe del todo, sugerir crear con `/web-nuevo`.
