# Manual de uso — 3 vías

Este sistema se puede usar de tres formas distintas. Elige según la situación.

---

# Vía 1 — Local (clonar el repo)

**Cuándo usarla:** trabajo diario en tu Mac, pipeline completo, generación de proyectos para clientes.

## Prerequisitos
- macOS con Claude Code instalado (`claude --version` debe responder).
- `git` instalado (viene con Xcode Command Line Tools).
- Acceso al repo privado `ia-satma/agente-pagina-web` (eres dueño, ya configurado).

## Instalación (una sola vez)

```bash
cd ~/Movies/satma
git clone https://github.com/ia-satma/agente-pagina-web.git
cd agente-pagina-web
```

## Abrir el sistema

```bash
cd ~/Movies/satma/agente-pagina-web
claude
```

Al abrir Claude Code, los 10 agentes en `agents/` se cargan automáticamente.

## Verificar que funciona

Dentro de Claude Code, escribe:

```
/agents
```

Deberías ver listados:
- `web-orchestrator`
- `brand-researcher`
- `site-architect`
- `design-director`
- `mockup-builder`
- `code-gen-next`
- `code-gen-astro`
- `code-gen-html`
- `qa-reviewer`
- `kb-writer`

## Cómo lanzar el pipeline

### Crear un cliente nuevo
```
> Crea un nuevo proyecto para "Clinica Vital" — su web actual es https://clinicavital.mx
```

El orchestrator copia `briefs/_template/` a `briefs/clinica-vital/` y te avisa qué llenar.

### Llenar el brief
Editar manualmente:
- `briefs/clinica-vital/brief.md`
- `briefs/clinica-vital/knowledge-base/01-overview.md` a `10-tono-y-cultura.md`
- `briefs/clinica-vital/assets/` (logos, fotos)

### Lanzar pipeline completo
```
> Genera la página web para clinica-vital usando stack astro
```

Stacks disponibles:
- `next-payload` — Next.js 16 + Payload CMS + Tailwind 4
- `astro` — Astro 6 + Tailwind 4
- `html-vanilla` — HTML + Tailwind 4 + JS puro

### Aprobar el mockup
Cuando el orchestrator termine la fase 4 y pause:

```bash
cd output/clinica-vital/04-mockup
python3 -m http.server 4321
```

Abrir http://localhost:4321 y revisar. Cuando apruebes, vuelves a Claude Code:

```
> Aprobado, continúa con el repo
```

### Resultado final
```
output/clinica-vital/
├── 01-research/          investigación 360° destilada
├── 02-strategy/          sitemap, mensajes, specs
├── 03-design/            tokens, paleta, tipografía
├── 04-mockup/            preview aprobado
├── 05-repo/              repo final listo para deploy
└── KNOWLEDGE_BASE.md     documento maestro
```

## Actualizar el sistema

Cuando salgan mejoras (commits en main):

```bash
cd ~/Movies/satma/agente-pagina-web
git pull
```

## Editar/mejorar el sistema mismo

```bash
cd ~/Movies/satma/agente-pagina-web
claude
> Mejora el agente design-director para que también considere brutalist editorial
```

Después de editar:
```bash
git add agents/design-director.md
git commit -m "design-director: agregar dirección brutalist editorial"
git push
```

## Desinstalar

```bash
rm -rf ~/Movies/satma/agente-pagina-web
```

(Esto solo borra tu copia local. El repo en GitHub queda intacto.)

---

# Vía 2 — Plugin instalable

**Cuándo usarla:** uso global desde cualquier proyecto de Claude Code, sin clonar el repo. Ideal para colaboradores del equipo SATMA.

## Prerequisitos
- macOS / Linux / Windows con Claude Code 2.x.
- `gh` (GitHub CLI) autenticado con acceso al repo privado:
  ```bash
  gh auth status   # debe mostrar "Logged in to github.com"
  ```
- Si no tienes `gh`: `brew install gh && gh auth login`.

## Instalación

Claude Code 2.x usa el modelo **marketplace + plugin**: primero registras el marketplace (el repo), después instalas el plugin.

Abre cualquier sesión de Claude Code y corre **estos dos comandos**:

```
/plugin marketplace add ia-satma/agente-pagina-web
```

```
/plugin install agente-pagina-web@satma-agentes
```

Claude Code:
1. Clona el repo a `~/.claude/plugins/marketplaces/satma-agentes/`.
2. Lee `.claude-plugin/marketplace.json` → encuentra el plugin "agente-pagina-web".
3. Lee `.claude-plugin/plugin.json` → registra metadata.
4. Registra los 10 agentes en `agents/` globalmente.
5. Aplica permisos de `settings.json`.

## Verificar instalación

```
/plugin list
```

Deberías ver:
```
agente-pagina-web v1.0.0  —  Sistema multi-agente Claude Code…
```

Y:
```
/agents
```

Lista los 10 agentes disponibles.

## Cómo trabajar

El plugin aporta los **agentes y la lógica**. Los **datos de clientes** (briefs, output) viven en tu proyecto local.

Flujo típico:
```bash
mkdir ~/Movies/satma/proyectos/clinica-vital
cd ~/Movies/satma/proyectos/clinica-vital
claude
> Crea un nuevo proyecto para "Clinica Vital"
```

El plugin tiene la plantilla `briefs/_template/` internamente, así que el orchestrator puede copiarla al cwd actual.

## Actualizar

```
/plugin update agente-pagina-web
```

O reinstalar:
```
/plugin uninstall agente-pagina-web
/plugin install ia-satma/agente-pagina-web
```

## Probar cambios locales antes de publicarlos

Si estás editando el plugin y quieres probar sin pushear:

```bash
claude --plugin-dir "/Users/alejandromtz-flowwork/Movies/satma/AGENTE PAGINA WEB"
```

Dentro de la sesión, tras editar un agente:
```
/reload-plugins
```

## Compartir con un colega del equipo

1. Darle acceso al repo:
   ```bash
   gh repo add-collaborator ia-satma/agente-pagina-web <github-username>
   ```
2. El colega instala `gh` + autentica + corre:
   ```
   /plugin install ia-satma/agente-pagina-web
   ```

## Desinstalar

```
/plugin uninstall agente-pagina-web
```

---

# Vía 3 — Remote Control (acceso desde web/iPhone)

**Cuándo usarla:** trabajar desde el iPhone, otra laptop, o cuando estás viajando — pero quieres seguir usando tu Mac como motor (con plugins, MCP, filesystem persistente).

## Prerequisitos
- Claude Code 2.1.51 o superior en tu Mac: `claude --version`.
- App oficial [Claude by Anthropic](https://apps.apple.com/us/app/claude-by-anthropic/id6473753684) si quieres móvil.
- Tu Mac encendida y con red durante el uso remoto.

## Setup (cada vez que abres sesión remota)

En tu Mac, terminal:

```bash
cd "/Users/alejandromtz-flowwork/Movies/satma/AGENTE PAGINA WEB"
claude remote-control --name "agente-web"
```

Te imprime algo como:
```
Remote Control listening at: https://claude.ai/code/remote/abc123def...
QR code: [imagen QR]
Press Ctrl+C to stop.
```

**Deja esa terminal abierta** — es tu "servidor".

## Acceder desde iPhone

1. Abrir la app Claude.
2. Tap en el icono de QR (esquina superior).
3. Escanear el QR de la terminal Mac.
4. La sesión se conecta — verás el mismo cwd con tus agentes y archivos.

## Acceder desde otra laptop / web

1. Abrir la URL `https://claude.ai/code/remote/...` que te dio la terminal.
2. Login con tu cuenta Anthropic.
3. La sesión se conecta.

## Cómo trabajar

Idéntico a trabajar en local:

```
> Genera la página web para clinica-vital usando stack astro
```

Diferencias:
- Los archivos generados se guardan en **tu Mac**, no en el dispositivo remoto.
- Si Claude tarda mucho, recibes **push notification** en tu iPhone cuando termina.
- Puedes cerrar el iPhone y volver más tarde — la sesión sigue corriendo en tu Mac.

## Limitaciones
- Solo **una sesión Remote Control activa** a la vez por Mac.
- Si tu Mac pierde red >10 minutos, la sesión se desconecta. Al reconectar se reanuda donde quedaste (siempre y cuando el proceso `claude remote-control` no haya muerto).
- Si cierras tu Mac, la sesión termina.
- El dispositivo remoto (iPhone) tiene **teclado virtual** — para edits largos conviene la web o tu Mac directamente.

## Terminar sesión remota

En la terminal de la Mac donde corre Remote Control: `Ctrl+C`.

O cerrar la terminal completa.

---

# Comparativa rápida

| Caso de uso | Vía recomendada |
|---|---|
| Pipeline completo de cliente nuevo (research → repo final) | 1 (Local) o 3 (Remote Control con Mac como motor) |
| Editar 1 archivo del sistema desde una laptop prestada | 2 (Plugin global, sin clonar) |
| Revisar mockup en el iPhone mientras estás en una reunión | 3 (Remote Control) |
| Onboardear a un colega de SATMA al sistema | 2 (Plugin) |
| Crear un agente nuevo o iterar el playbook | 1 (Local con git) |
| Demo en un evento sin tu Mac | 2 (Plugin) en una laptop del evento |

---

# Troubleshooting común

### "git clone" pide credenciales repetidamente
Configurar gh como helper:
```bash
gh auth setup-git
```

### `/plugin install` devuelve "isn't available in this environment"
- Estás corriendo en un entorno que no soporta plugins (ej: sesión del SDK, Claude Code Web).
- Verificar versión: `claude --version` debe ser **2.1.x o superior**.
- Verificar que existe el marketplace agregado: ver contenido de `~/.claude/plugins/known_marketplaces.json`.

### `/plugin marketplace add` falla con "repo not found"
- Verificar acceso: `gh repo view ia-satma/agente-pagina-web`.
- Si "not found": no tienes permisos. Pídele al owner que te agregue como colaborador.
- Asegúrate de tener `gh auth status` con sesión activa (Claude Code usa esa credencial para repos privados).

### `/agents` no muestra los agentes después de instalar
- Verificar `/plugin list` — ¿se ve "agente-pagina-web"?
- Reiniciar Claude Code (cerrar y abrir).
- `/reload-plugins`.

### Quiero forzar reinstalar el plugin
```
/plugin uninstall agente-pagina-web
/plugin marketplace remove satma-agentes
/plugin marketplace add ia-satma/agente-pagina-web
/plugin install agente-pagina-web@satma-agentes
```

### `claude remote-control` dice "comando no encontrado"
- Actualizar Claude Code: ver instrucciones en https://code.claude.com/docs.
- O usar `npx @anthropic-ai/claude-code remote-control --name "..."`.

### Remote Control se desconecta a los 10 min
- Tu Mac perdió red o entró en sleep.
- En Mac: **Configuración → Batería → "Evitar que la Mac entre en reposo automáticamente cuando la pantalla esté apagada"** activado.

### Los agentes inventan datos del cliente
- Esto NO debe pasar — están instruidos a marcar `[FALTA: ...]`.
- Revisar el `STATE.md` y `NOTAS.md` en `output/<cliente>/` para ver qué reportó cada fase.
- Si pasa, abre issue en el repo con el log.

### Quiero borrar todo y empezar de cero
```bash
# Vía 1 (local)
rm -rf ~/Movies/satma/agente-pagina-web
git clone https://github.com/ia-satma/agente-pagina-web.git ~/Movies/satma/agente-pagina-web

# Vía 2 (plugin)
/plugin uninstall agente-pagina-web
/plugin install ia-satma/agente-pagina-web
```

---

# Recursos

- Repo: https://github.com/ia-satma/agente-pagina-web
- Docs Claude Code: https://code.claude.com/docs
- Doc Remote Control: https://code.claude.com/docs/en/remote-control
- Doc Claude Web: https://code.claude.com/docs/en/claude-code-on-the-web
- Doc Plugins: https://code.claude.com/docs/en/plugins
- Soporte SATMA: ia@satma.mx
