# AMBROSIA Web — Deployment a Replit

Guía para que Replit despliegue el sitio sin romper nada. Pensado para
**Replit Agent** y **Replit Deployments (Reserved VM o Autoscale)**.

---

## Stack

- **Astro 6.2** con `output: 'server'` (SSR Node)
- **`@astrojs/node`** adapter, modo `standalone`
- **SQLite** (`better-sqlite3`) — DB local en `.data/ambrosia.db`
- **iron-session** para auth cookies
- **bcryptjs** para hash de contraseñas
- **@elevenlabs/react + client** para el ChatBubble de voz
- **GSAP + Lenis** para animaciones (peso bajo, todo cliente)
- **Tailwind 4** vía `@tailwindcss/vite`
- **pnpm 10.33.2** como package manager (especificado en package.json)

---

## Variables de entorno requeridas

Crea estos secrets en **Replit Secrets** (NO commitees el `.env`):

| Secret | Descripción | Valor sugerido |
|---|---|---|
| `AUTH_USER` | Email del único user admin | `ia@satma.mx` |
| `AUTH_PASS_HASH_B64` | Hash bcrypt **en base64** de tu contraseña | Generar con `pnpm gen-hash "tuPassword"` |
| `SESSION_SECRET` | 32+ chars random para firmar cookies | Generar con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `PORT` | Puerto HTTP (Replit lo provee automático) | `3000` (default) |
| `HOST` | Bind host (Replit usa 0.0.0.0) | `0.0.0.0` |

**IMPORTANTE**: si Replit Secrets tiene problemas con `$` en el valor de
`AUTH_PASS_HASH` (dotenv expansion), usa la variante **base64** que ya viene
preparada: `AUTH_PASS_HASH_B64=...`.

---

## Setup en Replit (paso a paso)

### 1. Importar el ZIP

```
Replit → Create Repl → Import from Upload → ambrosia-web.zip
```

Replit detectará Astro y propondrá un template Node. Selecciona **"Use existing config"**.

### 2. Configurar Secrets

Ve a **Tools → Secrets** y agrega las 4 variables de arriba (no `PORT`/`HOST`, Replit los inyecta).

### 3. Generar el hash de tu password

En la Replit Shell:
```bash
pnpm install
pnpm gen-hash "miPasswordSegura"
# Copia el output a Secrets como AUTH_PASS_HASH_B64
```

### 4. Comandos de build + start

Replit `.replit` config:
```toml
[deployment]
run = ["sh", "-c", "pnpm install --frozen-lockfile && pnpm build && node ./dist/server/entry.mjs"]
deploymentTarget = "cloudrun"

[[ports]]
localPort = 3000
externalPort = 80
```

O en `replit.nix`:
```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs_22
    pkgs.python3
    pkgs.gcc
  ];
}
```

### 5. Primera ejecución

```bash
pnpm install --frozen-lockfile
pnpm build
node ./dist/server/entry.mjs
```

La DB `.data/ambrosia.db` viene **pre-seedeada** con 26 settings (visibility +
social + elevenlabs agent_id) y 1 user admin. NO se sobrescribe.

---

## Estructura crítica (NO mover/borrar)

```
web/
├── .data/
│   └── ambrosia.db              ← SQLite con settings + users + content
├── public/
│   ├── fonts/                   ← Optimus Princeps + Monkton (8 MB)
│   ├── video/                   ← 4 videos hero + posters
│   ├── images/                  ← brand + decor + recetas (52 MB)
│   ├── models/ambrosia-bottle.glb ← 3D model 11 MB
│   ├── llms.txt                 ← GEO crawler standard
│   └── robots.txt
├── src/
│   ├── components/              ← 41 Astro components
│   ├── pages/                   ← 27 rutas + 10 API endpoints
│   ├── i18n/{es,en}.json        ← traducciones
│   ├── lib/                     ← DB, auth, settings, users
│   └── middleware.ts            ← RBAC + auth gate
├── astro.config.mjs             ← site URL: https://ambrosiasauceofgods.com
├── package.json                 ← deps + scripts
└── pnpm-lock.yaml               ← lockfile (FROZEN en CI)
```

---

## Gotchas conocidas

### 1. `Astro.site` apunta a producción
En `astro.config.mjs` está hardcoded:
```js
site: 'https://ambrosiasauceofgods.com'
```
**No lo cambies**. Si despliegas a un subdominio Replit temporal (`*.repl.co`),
los OG/canonical URLs seguirán apuntando al dominio final — eso es lo correcto
para SEO durante staging.

### 2. SQLite WAL files
Cuando Astro server corre, SQLite crea `ambrosia.db-shm` y `ambrosia.db-wal`.
**Replit puede borrarlos al restart**. La data principal vive en `ambrosia.db`
(que ya hicimos checkpoint). En producción Reserved VM no es problema.

### 3. CSRF protection de Astro
Astro 6 bloquea POSTs cross-site sin Origin matching. Si Replit pone tu app
detrás de un proxy con dominio diferente, agrega esto a `astro.config.mjs`:
```js
security: {
  checkOrigin: false,  // SOLO en staging detrás de proxy. PROD: dejar true.
}
```

### 4. Puerto 3000 vs 4321
- `pnpm dev` (Astro dev) usa puerto **4321**
- `node ./dist/server/entry.mjs` (production) usa **`process.env.PORT || 3000`**
- Replit puede inyectar otro PORT vía env. Funciona automático con el adapter.

### 5. ElevenLabs ChatBubble
El `agent_id` ya está en `settings.elevenlabs.agentId` de la DB. Para cambiarlo,
edita en `/admin/configuracion` después de login. El componente cae graceful si
está vacío (no renderiza el chat).

### 6. `pnpm install` puede fallar la primera vez
Si Replit no detecta `pnpm`, instala con:
```bash
npm install -g pnpm@10.33.2
pnpm install --frozen-lockfile
```

### 7. Aprobación de build scripts
pnpm 10 requiere aprobar scripts post-install para `better-sqlite3`, `sharp`,
`esbuild`. Ya está en `package.json → pnpm.onlyBuiltDependencies`. Si Replit
salta esto:
```bash
pnpm approve-builds
# Acepta: better-sqlite3, sharp, esbuild, puppeteer
pnpm rebuild
```

---

## Verificación post-deploy

Una vez arriba, valida que todo funciona:

```bash
# 1. Health check
curl -s -o /dev/null -w "%{http_code}\n" https://tu-app.replit.app/
# expected: 200

# 2. Suite de 50 smoke tests
SMOKE_BASE=https://tu-app.replit.app pnpm smoke
# expected: 50/50 passed (los mobile responsive necesitan Chromium)

# 3. Login admin (sin tocar UI)
curl -i -X POST https://tu-app.replit.app/api/auth/login \
  -H "Origin: https://tu-app.replit.app" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=ia@satma.mx&password=miPassword"
# expected: 302 redirect a /admin/
```

---

## Soporte

- TypeScript errors: `rm -rf .astro && pnpm exec astro check`
- DB corruption: borrar `.data/ambrosia.db-shm` y `.db-wal`, reiniciar
- Cookies no persisten: verificar `SESSION_SECRET` no está vacío
- Chat no carga: verificar `settings.elevenlabs.agentId` en DB
