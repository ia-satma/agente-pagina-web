# Usar el sistema desde la nube (no solo local)

Hay **dos formas** de acceder al sistema sin instalar nada en cada máquina:

| Vía | Dónde corre Claude | Plugin custom funciona | Móvil | Recomendado para… |
|---|---|---|---|---|
| **A. Remote Control** | En tu Mac (local) | ✅ sí | ✅ App Claude iOS/Android | **Tu uso diario** (Mac + iPhone) |
| **B. Claude Code en la Web** | En infraestructura Anthropic | ❌ no (no carga plugins ni MCP) | Limitado (solo web responsive) | Demos rápidas o cuando no tienes acceso a tu Mac |

---

## Vía A — Remote Control (recomendada)

Tu Mac sigue siendo el "servidor" — los plugins, MCP servers, agentes y filesystem persistente siguen funcionando. Solo el **terminal/UI** se mueve a la web o el móvil.

### Setup en el Mac (una sola vez)

1. Verificar versión de Claude Code (necesitas 2.1.51+):
   ```bash
   claude --version
   ```
2. Posicionarte en el repo:
   ```bash
   cd "/Users/alejandromtz-flowwork/Movies/satma/AGENTE PAGINA WEB"
   ```
3. Iniciar Remote Control:
   ```bash
   claude remote-control --name "agente-pagina-web"
   ```
4. Te muestra una URL + QR. Anótala o escanéala.

### Acceso desde otra Mac, iPhone o web

- **Desde web:** abrir la URL en cualquier navegador.
- **Desde iPhone:** descargar la app oficial [Claude by Anthropic](https://apps.apple.com/us/app/claude-by-anthropic/id6473753684), escanear el QR, listo.

### Ventajas
- ✅ Los 10 agentes en `agents/` se cargan idéntico que en sesión local.
- ✅ El plugin `.claude-plugin/plugin.json` funciona.
- ✅ MCP servers locales (si los tienes) siguen disponibles.
- ✅ `output/<cliente>/` persiste — los proyectos generados quedan en tu Mac.
- ✅ Sin cargo extra (incluido en Pro/Max/Team).
- ✅ Push notifications cuando Claude termina una tarea (vía app móvil).

### Limitaciones
- Tu Mac debe estar **encendida y con red** durante el uso remoto.
- Si pierde red >10 min, la sesión se desconecta — al reconectar continuas donde quedaste.
- Solo una sesión Remote Control activa a la vez.

Docs oficiales: https://code.claude.com/docs/en/remote-control

---

## Vía B — Claude Code en la Web (cloud puro)

Sesión 100% en infraestructura de Anthropic. Útil para acceso rápido sin tu Mac, **pero con limitaciones importantes**.

### Conectar el repo

1. Ir a [claude.ai/code](https://claude.ai/code).
2. Conectar GitHub (botón "Connect GitHub"). Autoriza acceso a repos privados.
3. Seleccionar el repo `ia-satma/agente-pagina-web`.
4. Iniciar sesión cloud — Anthropic clona el repo en un contenedor efímero.
5. Los agentes en `agents/` (raíz) se cargan automáticamente.

### Qué SÍ funciona
- ✅ Leer y editar archivos del repo.
- ✅ Los 10 agentes (porque son archivos `.md` que se cargan por convención).
- ✅ Comandos bash básicos (git, ls, etc.).
- ✅ Commit + push devuelta al repo de GitHub.

### Qué NO funciona
- ❌ El plugin custom (`.claude-plugin/plugin.json`) — no se "instala", solo se lee.
- ❌ MCP servers locales (los del menú "Add MCP" en tu Mac).
- ❌ Filesystem persistente — el contenedor se borra al cerrar sesión.
- ❌ Sesiones largas — timeout tras ~1h de inactividad.
- ❌ Acceso a `output/<cliente>/` previos generados en tu Mac (no están ahí).

### Cuándo usarla
- Cuando NO tienes acceso a tu Mac y quieres iterar el código del sistema (no proyectos de clientes).
- Para revisar/editar archivos del repo desde otro dispositivo.
- **NO para generar proyectos de clientes** — el filesystem efímero se lleva el `output/`.

Docs oficiales: https://code.claude.com/docs/en/claude-code-on-the-web

---

## Costos

- **Ambas vías están incluidas en Pro/Max/Team** ($20/mes Pro, $100/mes Max, Team enterprise).
- Sin cargo extra por minuto / sesión.

---

## Recomendación SATMA

| Escenario | Qué usar |
|---|---|
| Generar el sitio de un cliente nuevo (pipeline completo) | **Sesión local** en el Mac (cwd dentro del repo). |
| Continuar trabajo desde iPhone mientras estás fuera de la oficina | **Remote Control** + app Claude móvil. |
| Compartir progreso en vivo con un colega que está en otra ciudad | **Remote Control** + le mandas la URL temporal. |
| Editar un agente o el `playbook.md` rápido desde una laptop prestada | **Claude Code en la Web** (commit + push de vuelta al repo). |

---

## Setup para el resto del equipo SATMA

Si otro miembro del equipo quiere acceder al sistema:

1. **Darle acceso al repo privado:**
   ```bash
   gh repo add-collaborator ia-satma/agente-pagina-web <username>
   ```
2. El colaborador clona y abre con Claude Code local:
   ```bash
   git clone https://github.com/ia-satma/agente-pagina-web.git
   cd agente-pagina-web
   claude
   ```
3. O instala como plugin global:
   ```
   /plugin install ia-satma/agente-pagina-web
   ```
   (Funciona si tiene `gh` autenticado y permisos en el repo.)
