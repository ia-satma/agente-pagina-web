---
description: Aprueba el mockup HTML de un cliente y continúa el pipeline al repo final (code-gen + QA + KB)
allowed-tools: ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "Agent"]
---

# Aprobar mockup y continuar al repo

Marca el mockup de un cliente como aprobado por el cliente real, y lanza las fases 5-7 del pipeline.

## Uso

```
/web-aprobar <slug>
```

Ejemplo: `/web-aprobar clinica-vital`

## Pasos

### 1. Verificar que existe el mockup

Confirmar que existe `output/<slug>/04-mockup/index.html`.

Si no existe, avisar al usuario y sugerir correr `/web-genera <slug> <stack>` primero.

### 2. Leer el stack del proyecto

Buscar el stack del proyecto en `output/<slug>/STATE.md` o `output/<slug>/02-strategy/`.

Si no es claro, preguntar al usuario.

### 3. Pedir confirmación

Mostrar:

```
Aprobar el mockup de <slug>?
  Mockup en:  output/<slug>/04-mockup/index.html
  Stack:      <stack>
  Continúa:   fase 5 (code-gen-<stack>) → fase 6 (qa-reviewer) → fase 7 (kb-writer)

Esto va a generar el repo final en output/<slug>/05-repo/. ¿Procedo?
```

### 4. Si confirma, registrar la aprobación

Editar `output/<slug>/STATE.md` agregando:

```
2026-MM-DD HH:MM — Mockup APROBADO por el usuario. Continuando pipeline a fase 5.
```

### 5. Invocar code-gen-<stack>

Pasar contexto completo al agent `code-gen-<stack>` correspondiente. Su output va a `output/<slug>/05-repo/`.

### 6. Tras code-gen, invocar qa-reviewer

Pasar `output/<slug>/05-repo/` al `qa-reviewer`. Su output incluye `QA_REPORT.md`.

### 7. Tras qa, invocar kb-writer

Pasar todo `output/<slug>/` al `kb-writer`. Genera `output/<slug>/KNOWLEDGE_BASE.md`.

### 8. Reportar al usuario el resultado final

```
✅ Pipeline completo para <slug>

Output:
  output/<slug>/
  ├── 01-research/        investigación
  ├── 02-strategy/        arquitectura
  ├── 03-design/          sistema de diseño
  ├── 04-mockup/          mockup aprobado
  ├── 05-repo/            repo final (<stack>)
  │   └── QA_REPORT.md    auditoría
  └── KNOWLEDGE_BASE.md   transferencia

Para correr el repo:
  cd output/<slug>/05-repo/
  pnpm install && pnpm dev

Pendientes (placeholders/[FALTAs]): N. Ver QA_REPORT.md.
```

## Reglas

- No re-correr fases 1-4 si ya están completas (idempotente).
- Si qa-reviewer encuentra issues no corregibles, reportarlos al usuario antes de invocar kb-writer.
