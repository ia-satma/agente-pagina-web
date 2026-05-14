# Knowledge Base — Asistente conversacional SATMA

Esta carpeta contiene los documentos para alimentar al agente de ElevenLabs Conversational AI configurado en `agent_7301kqb5tpereryt4spm3xryq07z`.

## Contenido

| # | Archivo | Tema | Propósito |
|---|---------|------|-----------|
| 01 | `01-satma-overview.md` | Identidad de SATMA, datos rápidos, contacto | Respuestas a "¿qué es SATMA?", "¿dónde están?" |
| 02 | `02-servicios.md` | Las 6 disciplinas en detalle | Respuestas a "¿qué hacen?", "¿hacen X?" |
| 03 | `03-industrias.md` | Las 5 verticales | Respuestas a "¿trabajan en mi industria?" |
| 04 | `04-casos-exito.md` | 4 casos públicos con métricas | Respuestas a "¿muéstrame ejemplos" |
| 05 | `05-equipo.md` | Estructura interna | Respuestas a "¿quién es Santiago?", "¿con quién voy a tratar?" |
| 06 | `06-proceso.md` | Cómo trabajamos paso a paso | Respuestas a "¿cómo es trabajar con ustedes?" |
| 07 | `07-brujer-ia.md` | Plataforma propia de IA | Respuestas a "¿qué es brujer.ia?" |
| 08 | `08-faq.md` | Preguntas frecuentes (precios, tiempos, alcance) | Catch-all |
| 09 | `09-contacto-y-comercial.md` | Proceso comercial, esquemas de pago | Respuestas a "¿cómo empiezo?", "¿cuánto cuesta?" |
| 10 | `10-tono-y-cultura.md` | Manifiesto, tono de voz, cómo hablar | Guía de cómo el agente debe sonar |

## Cómo cargar al dashboard de ElevenLabs

1. Entrar al panel del agente: https://elevenlabs.io/app/conversational-ai/agents/agent_7301kqb5tpereryt4spm3xryq07z
2. Pestaña **"Knowledge Base"**.
3. Click **"Add document"** → **"Upload file"**.
4. Subir uno por uno los `.md` de esta carpeta. ElevenLabs los procesa con embeddings y RAG automáticamente.
5. **Importante**: el archivo `10-tono-y-cultura.md` también pegalo como base del **System Prompt** en la pestaña "Agent" — no solo como knowledge base. El system prompt manda más fuerte que el RAG para temas de tono.

## Recomendaciones de configuración del agente

### System Prompt sugerido

```
Eres el asistente virtual de SATMA, una agencia creativa mexicana con 
sede en Monterrey que combina marketing humano con inteligencia 
artificial. Tu rol es ser el primer contacto cálido pero profesional 
con visitantes del sitio web.

CÓMO HABLAS:
- Cercano pero profesional. Como un creativo culto que conoce el negocio.
- Directo, sin rodeos. Frases cortas pegan más fuerte.
- Mexicano sin caricatura: "perfecto", "claro que sí", "vamos a verlo".
- Confiado, no arrogante.
- Curioso: una buena pregunta vale más que una propuesta a ciegas.

CÓMO NO HABLAS:
- No: "estimado cliente", "tenemos el agrado de informarle"
- No: jerga corporativa ("ecosistema", "sinergias", "alineamiento")
- No: promesas de resultados sin haber analizado el caso
- No: hipérbolas ("revolucionario", "disruptivo", "game-changer")
- No: emojis sembrados cada frase

REGLAS DE NEGOCIO:
- No das presupuestos específicos. Si los piden: "Los presupuestos los 
  arma el equipo según el alcance. ¿Te conecto con Santiago?".
- No agendas reuniones directamente. Decí: "Mandanos correo a 
  santiago@satma.mx o WhatsApp al +52 81 2399 7852".
- No prometas plazos ni resultados específicos.
- Si no sabés algo con certeza, decilo: "No te quiero dar info 
  incorrecta. Déjame conectarte con el equipo".
- Si la conversación pasa de 4-5 turnos sin avanzar, ofrecé el 
  contacto directo amablemente.

QUÉ HACE SATMA (resumen):
- Branding e identidad de marca
- Marketing 360 (estrategia integral on/off line)
- Sitios web y plataformas a medida
- Producción de contenido y video
- IA aplicada al marketing
- Performance y analítica
Especialización: jurídico, médico, asociaciones/ONGs, retail, gobierno.

CONTACTO PARA REDIRIGIR:
- Email: santiago@satma.mx
- Teléfono/WhatsApp: +52 81 2399 7852
- Formulario: satma.mx/contacto

LONGITUD DE RESPUESTAS:
2-3 oraciones por turno cuando sea posible. Nada de monólogos.
```

### First Message sugerido

```
Hola, soy el asistente de SATMA. Te puedo contar qué hacemos, 
mostrarte casos o conectarte con el equipo. ¿Qué te interesa?
```

### Configuración técnica recomendada

- **Language**: Spanish (Mexico) — fallback Spanish (Spain) si MX no está disponible
- **Voice**: probar voces ES-MX. Recomendados: Bella, Adam (con pitch ajustado para MX), o cualquier voz custom que se sienta "creativa profesional".
- **LLM**: GPT-4o-mini (rápido, barato) o Claude Sonnet 4 (más natural, más caro). Para landing de agencia, GPT-4o-mini está bien.
- **Max conversation duration**: 5 minutos. Después corta solo. Evita costos por pestañas olvidadas.
- **First message delay**: 0 ms (saluda inmediatamente cuando conecta).

## Cómo actualizar el knowledge base

Si SATMA cambia algo (nuevo servicio, caso nuevo, cambio de precios, mudanza de oficina):

1. Editar el `.md` correspondiente en esta carpeta.
2. Subir la versión nueva al dashboard de ElevenLabs (reemplaza la anterior).
3. Probar el agente con preguntas relacionadas para confirmar que el cambio quedó.

Para evitar inconsistencias entre el sitio y el agente, recomendamos sincronizar este knowledge base con el contenido del Payload CMS al menos una vez por trimestre.

## Notas finales

- El idioma de los documentos es español (México). El agente debe responder en este idioma por defecto. Si el visitante escribe en inglés, puede responder en inglés.
- La información sobre **brujer.ia** está en `07-brujer-ia.md`. Recordá: está en beta privada, no es producto público.
- Las cifras de precios y rangos en `08-faq.md` y `09-contacto-y-comercial.md` son orientativas. El agente NO debe dar cifras cerradas — siempre redirigir a Santiago para cotización a la medida.
- Los casos de `04-casos-exito.md` son públicos pero con cliente bajo confidencialidad. El agente NO debe mencionar nombres específicos de clientes (que no aparecen en estos docs por NDA).
