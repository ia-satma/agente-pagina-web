#!/usr/bin/env bash
# Ambrosía — 10 tests dummy de verificación end-to-end
# Uso: bash scripts/test-production.sh
# (Corre sobre el output del build estático en `dist/`)

set -u
cd "$(dirname "$0")/.."

PASS=0
FAIL=0
TOTAL=0

dist="dist"

check() {
  local name="$1"; shift
  local result="$1"; shift
  local detail="$1"; shift
  TOTAL=$((TOTAL + 1))
  if [ "$result" = "PASS" ]; then
    printf "  ✅ %-50s %s\n" "$name" "$detail"
    PASS=$((PASS + 1))
  else
    printf "  ❌ %-50s %s\n" "$name" "$detail"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "  🧪 AMBROSÍA — Production Verification Suite (10 tests)"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Test 1 — Build completo + número de páginas esperado (≥35)
if [ -d "$dist" ]; then
  pages=$(find "$dist" -name "*.html" | wc -l | tr -d ' ')
  if [ "$pages" -ge 35 ]; then
    check "1. Build estático ≥ 35 páginas" "PASS" "$pages páginas generadas"
  else
    check "1. Build estático ≥ 35 páginas" "FAIL" "solo $pages páginas (esperaba ≥35)"
  fi
else
  check "1. Build estático" "FAIL" "directorio dist/ no existe — corre pnpm build primero"
fi

# Test 2 — sitemap-index.xml presente y referencia sitemap-0.xml
if [ -f "$dist/sitemap-index.xml" ]; then
  if grep -q "sitemap-0.xml" "$dist/sitemap-index.xml"; then
    check "2. sitemap-index.xml válido" "PASS" "referencia sitemap-0.xml"
  else
    check "2. sitemap-index.xml válido" "FAIL" "no referencia sitemap-0.xml"
  fi
else
  check "2. sitemap-index.xml" "FAIL" "no existe"
fi

# Test 3 — robots.txt presente con menciones a Sitemap y AI crawlers
if [ -f "$dist/robots.txt" ]; then
  if grep -q "Sitemap:" "$dist/robots.txt" && grep -q "GPTBot" "$dist/robots.txt"; then
    check "3. robots.txt con Sitemap + AI crawlers" "PASS" "GPTBot, PerplexityBot, ClaudeBot permitidos"
  else
    check "3. robots.txt completo" "FAIL" "falta Sitemap directive o AI crawlers"
  fi
else
  check "3. robots.txt" "FAIL" "no existe"
fi

# Test 4 — /admin/ accesible (CMS instalado)
if [ -f "$dist/admin/index.html" ] && [ -f "$dist/admin/config.yml" ]; then
  if grep -q "decap-cms" "$dist/admin/index.html"; then
    check "4. /admin/ CMS instalado" "PASS" "Decap CMS + config.yml presentes"
  else
    check "4. /admin/ CMS instalado" "FAIL" "index.html sin script decap-cms"
  fi
else
  check "4. /admin/" "FAIL" "index.html o config.yml ausentes"
fi

# Test 5 — llms.txt + llms-full.txt para GEO
if [ -f "$dist/llms.txt" ] && [ -f "$dist/llms-full.txt" ]; then
  lines=$(wc -l < "$dist/llms-full.txt" | tr -d ' ')
  if [ "$lines" -ge 80 ]; then
    check "5. GEO: llms.txt + llms-full.txt" "PASS" "$lines líneas en llms-full"
  else
    check "5. GEO: llms-full.txt" "FAIL" "muy corto ($lines líneas)"
  fi
else
  check "5. GEO: llms.txt" "FAIL" "uno o ambos ausentes"
fi

# Test 6 — schema.org JSON-LD presente en home, la-salsa, mesas/restaurantes, concierge
schema_count=0
for page in "$dist/index.html" "$dist/la-salsa/index.html" "$dist/mesas/restaurantes/index.html" "$dist/concierge/index.html"; do
  if [ -f "$page" ] && grep -q "application/ld+json" "$page"; then
    schema_count=$((schema_count + 1))
  fi
done
if [ "$schema_count" -ge 4 ]; then
  check "6. Schema.org JSON-LD en ≥4 páginas" "PASS" "$schema_count páginas con structured data"
else
  check "6. Schema.org JSON-LD" "FAIL" "solo $schema_count páginas (esperaba ≥4)"
fi

# Test 7 — hreflang ES/EN presente en home
if [ -f "$dist/index.html" ] && grep -q 'hreflang="es-MX"' "$dist/index.html" && grep -q 'hreflang="en-US"' "$dist/index.html"; then
  check "7. hreflang ES-MX / EN-US" "PASS" "ambos locales declarados"
else
  check "7. hreflang ES/EN" "FAIL" "falta uno de los dos"
fi

# Test 8 — Meta description única en cada página crítica
desc_count=0
for page in "$dist/index.html" "$dist/origen/index.html" "$dist/la-salsa/index.html" "$dist/concierge/index.html"; do
  if [ -f "$page" ]; then
    desc=$(grep -oE '<meta name="description" content="[^"]+"' "$page" | head -1)
    if [ -n "$desc" ]; then
      desc_count=$((desc_count + 1))
    fi
  fi
done
if [ "$desc_count" -ge 4 ]; then
  check "8. Meta description en páginas críticas" "PASS" "$desc_count/4 con description"
else
  check "8. Meta description" "FAIL" "solo $desc_count/4"
fi

# Test 9 — Open Graph image presente
if [ -f "$dist/index.html" ] && grep -q 'property="og:image"' "$dist/index.html"; then
  check "9. Open Graph image declarada" "PASS" "og:image en <head>"
else
  check "9. Open Graph image" "FAIL" "no declarada"
fi

# Test 10 — Peso total de imágenes brand+ritual nuevas ≤ 2MB (perf budget)
brand_dir="$dist/images/brand"
ritual_img="$dist/images/ritual-guardianes.webp"
total_kb=0
if [ -d "$brand_dir" ]; then
  for f in "$brand_dir/mito-tezcatlipoca.webp" "$brand_dir/origen-molcajete.webp" "$ritual_img"; do
    if [ -f "$f" ]; then
      kb=$(du -k "$f" | cut -f1)
      total_kb=$((total_kb + kb))
    fi
  done
fi
if [ "$total_kb" -gt 0 ] && [ "$total_kb" -le 2048 ]; then
  check "10. Imágenes barrocas ≤ 2MB total" "PASS" "${total_kb}KB total (budget perf)"
else
  check "10. Imágenes barrocas budget" "FAIL" "${total_kb}KB (>2MB o no encontradas)"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "  Resultado: $PASS / $TOTAL tests PASS"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
exit 0
