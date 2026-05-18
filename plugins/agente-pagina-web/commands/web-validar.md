---
description: Valida un mockup o repo del AGENTE PAGINA WEB — detecta bytes invisibles, CSS link roto, scripts ausentes, SVGs sin dimensiones, llaves CSS desbalanceadas, imágenes faltantes. Corre antes de entregar al cliente.
allowed-tools: ["Read", "Bash", "Grep"]
---

# Validar mockup o repo

Corre el validator integral `kb/tooling/validate-mockup.sh` sobre un directorio de salida del AGENTE PAGINA WEB para detectar bugs introducidos por edits programáticos masivos (regex, sed loops, etc.).

## Uso

```
/web-validar <slug>             # valida mockup (output/<slug>/04-mockup)
/web-validar <slug> mockup      # explícito: mockup
/web-validar <slug> repo        # explícito: repo final (output/<slug>/05-repo)
```

Ejemplos:
- `/web-validar avalon-servicios` → valida `output/avalon-servicios/04-mockup`
- `/web-validar clinica-vital repo` → valida `output/clinica-vital/05-repo`

## Qué verifica

| Check | Severidad |
|---|---|
| Bytes de control invisibles (`\x01`, `\x03`) | FATAL |
| `<link rel="stylesheet" href="...">` en todos los HTMLs | FATAL |
| Scripts JS principales (`motion.js`, `theme.js`) presentes | WARN |
| SVGs inline con `width` y `height` attributes | WARN |
| CSS llaves balanceadas (`{` vs `}`) | FATAL |
| Imágenes referenciadas existen físicamente | WARN |
| Smoke test HTTP (si hay servidor activo en :4322/:5500/:8000/:3000) | INFO |

## Exit codes

- `0` — todo OK
- `1` — errores críticos: NO entregar al cliente
- `2` — solo warnings: revisar caso por caso

## Pasos

1. Detectar el slug del proyecto (argumento `$1`).
2. Detectar tipo (mockup vs repo, default mockup) (`$2`).
3. Determinar path: `output/<slug>/04-mockup` o `output/<slug>/05-repo`.
4. Verificar que existe.
5. Ejecutar `bash kb/tooling/validate-mockup.sh <path>`.
6. Mostrar el resultado tal cual.
7. Si exit code = 1: marcar el proyecto como "no entregable" en el `STATE.md` del proyecto si existe.

## Implementación

Cuando el usuario invoque `/web-validar <slug> [mockup|repo]`:

```bash
SLUG="${1:?Falta slug del cliente}"
TYPE="${2:-mockup}"

if [[ "$TYPE" == "repo" ]]; then
  PATH_TO_CHECK="output/$SLUG/05-repo"
else
  PATH_TO_CHECK="output/$SLUG/04-mockup"
fi

if [[ ! -d "$PATH_TO_CHECK" ]]; then
  echo "ERROR: $PATH_TO_CHECK no existe."
  exit 1
fi

bash kb/tooling/validate-mockup.sh "$PATH_TO_CHECK"
```

Después de correr el validator, si hubo errores críticos, sugerir al usuario:
- Ver `kb/lessons-inbox.md` para patrones comunes
- Revisar `kb/playbook.md` secciones 13-15
- Re-correr `/web-validar <slug>` tras aplicar fixes
