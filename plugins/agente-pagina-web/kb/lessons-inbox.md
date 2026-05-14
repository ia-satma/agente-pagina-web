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
