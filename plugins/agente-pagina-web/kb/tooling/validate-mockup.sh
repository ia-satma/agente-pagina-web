#!/usr/bin/env bash
# =============================================================================
# validate-mockup.sh — Validador post-build del AGENTE PAGINA WEB
# =============================================================================
# Verifica que el mockup/sitio no tenga bugs introducidos por edits programáticos
# masivos (regex masivos, sed loops, scripts Python con f-strings, etc.).
#
# USO:
#   ./validate-mockup.sh <directorio_del_mockup>
#
# EJEMPLO:
#   ./validate-mockup.sh output/avalon-servicios/04-mockup
#
# CÓDIGOS DE SALIDA:
#   0 — sin errores críticos
#   1 — errores críticos detectados (CSS/JS rotos, bytes invisibles, etc.)
#   2 — solo warnings (SVGs sin width, contraste bajo, etc.)
# =============================================================================

set -uo pipefail

TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "ERROR: Falta argumento. Uso: $0 <directorio_del_mockup>"
  exit 1
fi
if [[ ! -d "$TARGET" ]]; then
  echo "ERROR: $TARGET no es un directorio."
  exit 1
fi

# Colors (with fallback for terminals without color)
if [[ -t 1 ]]; then
  RED='\033[0;31m'; YELLOW='\033[0;33m'; GREEN='\033[0;32m'; BOLD='\033[1m'; NC='\033[0m'
else
  RED=''; YELLOW=''; GREEN=''; BOLD=''; NC=''
fi

ERRORS=0
WARNINGS=0

err() { echo -e "${RED}✗ ERROR:${NC} $1"; ERRORS=$((ERRORS+1)); }
warn() { echo -e "${YELLOW}⚠ WARN: ${NC} $1"; WARNINGS=$((WARNINGS+1)); }
ok() { echo -e "${GREEN}✓ OK:${NC}    $1"; }
section() { echo -e "\n${BOLD}━━ $1 ━━${NC}"; }

echo -e "${BOLD}Validando mockup en: $TARGET${NC}"
echo "Fecha: $(date '+%Y-%m-%d %H:%M:%S')"

# =============================================================================
# CHECK 1 — Bytes de control invisibles (\x00-\x08, \x0B, \x0E-\x1F)
# Causa: scripts Python con f-string + backreferences regex (\\1, \\3, etc.)
# Síntoma: CSS/JS no carga, atributos rotos
# =============================================================================
section "Bytes de control invisibles (FATAL si presente)"

invisible_files=$(grep -rlP '[\x00-\x08\x0B\x0E-\x1F]' "$TARGET" --include='*.html' --include='*.css' --include='*.js' 2>/dev/null || true)
if [[ -n "$invisible_files" ]]; then
  err "Archivos con bytes de control invisibles (regex Python f-string bug):"
  while IFS= read -r f; do
    echo "    → $f"
    # Mostrar las líneas afectadas
    grep -nP '[\x00-\x08\x0B\x0E-\x1F]' "$f" | head -2 | sed 's/^/        /'
  done <<< "$invisible_files"
  echo
  echo "    FIX: ver kb/lessons-inbox.md entrada '2026-05-17 16:30'"
  echo "    Reemplazar f'\\\\1{var}\\\\2' por lambda m: m.group(1) + var + m.group(2)"
else
  ok "Sin bytes de control invisibles"
fi

# =============================================================================
# CHECK 2 — Todos los HTMLs tienen <link rel="stylesheet" href="...">
# Causa: regex masivo rompió el atributo href
# =============================================================================
section "CSS link tag intacto en todos los HTMLs"

html_files=$(find "$TARGET" -name "*.html" -type f 2>/dev/null)
total_html=0
broken_css=0
while IFS= read -r f; do
  [[ -z "$f" ]] && continue
  total_html=$((total_html+1))
  if ! grep -qE 'rel="stylesheet"[^>]*href="[^"]+\.css' "$f"; then
    err "CSS link roto o ausente: ${f#$TARGET/}"
    broken_css=$((broken_css+1))
  fi
done <<< "$html_files"
if [[ $broken_css -eq 0 ]]; then
  ok "Todos los $total_html HTMLs tienen <link rel=\"stylesheet\" href=\"...\">"
fi

# =============================================================================
# CHECK 3 — Scripts JS principales presentes (theme.js + motion.js si existen)
# =============================================================================
section "Scripts JS principales referenciados"

if [[ -f "$TARGET/styles.css" ]]; then
  # Es un mockup HTML estático
  for js in "motion.js" "theme.js"; do
    if [[ -f "$TARGET/$js" ]]; then
      pages_with_js=$(find "$TARGET" -name "*.html" -type f -exec grep -l "$js" {} \; 2>/dev/null | wc -l | tr -d ' ')
      if [[ $pages_with_js -lt $total_html ]]; then
        warn "$js existe pero solo está en $pages_with_js de $total_html HTMLs"
      else
        ok "$js referenciado en los $total_html HTMLs"
      fi
    fi
  done
fi

# =============================================================================
# CHECK 4 — SVGs inline tienen atributos width y height
# Causa: SVGs sin width/height explotan al viewport en algunos browsers
# =============================================================================
section "SVGs inline con dimensiones explícitas"

svg_without_dim=0
svg_total=0
while IFS= read -r f; do
  [[ -z "$f" ]] && continue
  # Contar SVGs totales y SVGs sin width=
  total=$(grep -oc '<svg' "$f" 2>/dev/null || echo 0)
  with_width=$(grep -oc '<svg[^>]* width=' "$f" 2>/dev/null || echo 0)
  missing=$((total - with_width))
  svg_total=$((svg_total + total))
  if [[ $missing -gt 0 ]]; then
    warn "${f#$TARGET/}: $missing SVGs sin width/height"
    svg_without_dim=$((svg_without_dim + missing))
  fi
done <<< "$html_files"
if [[ $svg_without_dim -eq 0 ]]; then
  ok "Los $svg_total SVGs inline tienen width/height"
fi

# =============================================================================
# CHECK 5 — CSS sintaxis: llaves balanceadas
# Causa: edit manual mal aplicado, regex que cortó una regla
# =============================================================================
section "CSS sintaxis: llaves balanceadas"

if [[ -f "$TARGET/styles.css" ]]; then
  opens=$(grep -o '{' "$TARGET/styles.css" | wc -l | tr -d ' ')
  closes=$(grep -o '}' "$TARGET/styles.css" | wc -l | tr -d ' ')
  diff=$((opens - closes))
  if [[ $diff -ne 0 ]]; then
    err "styles.css desbalanceado: $opens '{' vs $closes '}' (diff: $diff)"
  else
    ok "styles.css balanceado: $opens/$closes"
  fi
fi

# =============================================================================
# CHECK 6 — Imágenes referenciadas existen físicamente
# =============================================================================
section "Imágenes referenciadas existen"

missing_imgs=0
while IFS= read -r f; do
  [[ -z "$f" ]] && continue
  # Extraer paths de src= y srcset= que sean locales (no http)
  imgs=$(grep -oE '(src|srcset)="[^"]*\.(png|jpg|jpeg|webp|svg|gif)"' "$f" 2>/dev/null | \
         sed -E 's/.*="([^"]+)".*/\1/' | \
         grep -v '^http' | grep -v '^data:')
  while IFS= read -r img; do
    [[ -z "$img" ]] && continue
    # Resolver path relativo a la ubicación del HTML
    html_dir=$(dirname "$f")
    if [[ "$img" == /* ]]; then
      img_path="$TARGET$img"
    else
      img_path="$html_dir/$img"
    fi
    # Normalizar el path
    img_path=$(cd "$(dirname "$img_path")" 2>/dev/null && pwd)/$(basename "$img_path") 2>/dev/null || echo "$img_path"
    if [[ ! -f "$img_path" ]]; then
      warn "Imagen faltante: ${f#$TARGET/} → $img"
      missing_imgs=$((missing_imgs+1))
    fi
  done <<< "$imgs"
done <<< "$html_files"
if [[ $missing_imgs -eq 0 ]]; then
  ok "Todas las imágenes referenciadas existen"
fi

# =============================================================================
# CHECK 7 — Smoke test HTTP (si hay un servidor en puerto 4322 o 5500)
# =============================================================================
section "Smoke test HTTP (si hay servidor activo)"

for port in 4322 5500 8000 3000; do
  if lsof -i :$port -sTCP:LISTEN > /dev/null 2>&1; then
    if command -v python3 > /dev/null 2>&1; then
      status=$(python3 -c "
import urllib.request
try:
    r = urllib.request.urlopen('http://localhost:$port/', timeout=3)
    content = r.read().decode()
    if '<link rel=\"stylesheet\" href=' in content:
        print('OK')
    else:
        print('NO_CSS')
except Exception as e:
    print(f'ERROR: {e}')
" 2>/dev/null)
      case "$status" in
        OK)     ok "Servidor en :$port responde y sirve HTML con CSS link válido" ;;
        NO_CSS) err "Servidor en :$port responde pero sin <link rel=stylesheet href=> — CSS ROTO" ;;
        *)      warn "Servidor en :$port: $status" ;;
      esac
    fi
    break
  fi
done

# =============================================================================
# REPORTE FINAL
# =============================================================================
section "RESULTADO"

if [[ $ERRORS -gt 0 ]]; then
  echo -e "${RED}✗ FALLÓ:${NC} $ERRORS errores críticos, $WARNINGS warnings"
  echo
  echo "Ver kb/lessons-inbox.md para patrones comunes."
  exit 1
elif [[ $WARNINGS -gt 0 ]]; then
  echo -e "${YELLOW}⚠ OK con warnings:${NC} $WARNINGS warnings (no bloquean deploy)"
  exit 2
else
  echo -e "${GREEN}✓ TODO OK:${NC} mockup listo para revisar/desplegar"
  exit 0
fi
