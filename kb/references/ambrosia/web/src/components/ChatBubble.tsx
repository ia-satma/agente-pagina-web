/**
 * AMBROSIA — ChatBubble (clonado del patrón SATMA voice-agent.tsx)
 *
 * Patrón simple que SATMA tiene probado funcionando:
 *   - UNA sola sesión que puede arrancar muteada (texto) o sin mute (voz)
 *   - `ensureSession(startMuted)` siempre pide getUserMedia + startSession
 *   - Toggle voz ↔ texto via `setMuted()` sobre la MISMA sesión
 *   - Sin disconnectWaiters, sin AudioContext unlock manual, sin auto-start
 *
 * Formato de onMessage para @elevenlabs/client@1.3.1 (verificado en
 * BaseConversation.js): { source: 'user'|'ai', message, role, event_id }.
 * SATMA usa el formato viejo `e.type === 'agent_response'` (su SDK era
 * más viejo); aquí usamos el formato actual del cliente que tenemos.
 *
 * Visual: 100% clases CSS `.amb-chat__*` definidas en global.css.
 * Brand: Optimus Princeps + navy #15173d + Pantone 485 #E22319.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { useConversation, ConversationProvider } from '@elevenlabs/react';

type Locale = 'es' | 'en';

interface Props {
  agentId: string;
  locale: Locale;
}

interface Msg {
  id: number;
  role: 'user' | 'agent';
  text: string;
}

const COPY = {
  es: {
    fab: 'Concierge',
    title: 'AMBROSIA Concierge',
    subtitle: 'Asistente editorial',
    statusIdle: 'Listo para conversar',
    statusConnecting: 'Conectando',
    statusOnline: 'En linea',
    statusSpeaking: 'Hablando',
    placeholder: 'Escribe un mensaje',
    placeholderContact: 'Escribe tu correo o WhatsApp',
    close: 'Cerrar',
    micStart: 'Hablar con voz',
    micActive: 'Silenciar microfono',
    micMuted: 'Activar microfono',
    send: 'Enviar',
    errMicDenied: 'Sin permiso de micrófono. Puedes seguir por texto.',
    errMicGeneric: 'No se pudo abrir el micrófono.',
    errFallback: 'Sin conexión por ahora. Déjanos tu correo o WhatsApp aquí y te respondemos en cuanto vuelva la línea.',
    welcomeFallback: 'Hola, soy el concierge de AMBROSIA. ¿En qué te puedo ayudar?',
    menu: 'Volver al menú',
    menuShort: 'Menú',
    quick: [
      'Cómo se hace la salsa',
      'Dónde puedo comprarla',
      'Quiero dejar mis datos',
      'Síguenos en redes',
    ],
    quickFollow: [
      'Cuéntame más',
      'Déjame mis datos',
      'Síguenos en redes',
    ],
    intentContact: 'Me gustaría dejar mis datos de contacto para que me escriban — ¿qué necesitas saber?',
    intentSocials: '¿Dónde puedo seguir a AMBROSIA en redes sociales?',
  },
  en: {
    fab: 'Concierge',
    title: 'AMBROSIA Concierge',
    subtitle: 'Editorial assistant',
    statusIdle: 'Ready to chat',
    statusConnecting: 'Connecting',
    statusOnline: 'Online',
    statusSpeaking: 'Speaking',
    placeholder: 'Type a message',
    placeholderContact: 'Type your email or WhatsApp',
    close: 'Close',
    micStart: 'Speak with voice',
    micActive: 'Mute microphone',
    micMuted: 'Unmute microphone',
    send: 'Send',
    errMicDenied: 'Microphone denied. You can still type.',
    errMicGeneric: 'Could not open the microphone.',
    errFallback: 'Connection unavailable. Leave your email or WhatsApp here and we will reply once we are back.',
    welcomeFallback: 'Hi, I am the AMBROSIA concierge. How can I help you?',
    menu: 'Back to menu',
    menuShort: 'Menu',
    quick: [
      'How is the sauce made',
      'Where can I buy it',
      'I want to leave my contact',
      'Follow on socials',
    ],
    quickFollow: [
      'Tell me more',
      'Leave my contact',
      'Follow on socials',
    ],
    intentContact: 'I would like to leave my contact details so you can reach me — what do you need?',
    intentSocials: 'Where can I follow AMBROSIA on social media?',
  },
} as const;

/**
 * Extrae opciones clickeables de un mensaje del agente.
 * Detecta líneas que comienzan con "1)", "1.", "•", "-", "*" y las
 * devuelve como strings limpios (sin prefijo, sin puntuación final).
 * Devuelve [] si no hay patrón de opciones.
 */
function extractAgentOptions(text: string, max = 4): string[] {
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const opts: string[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    // Marcadores: •, -, *, ‣, ◦  o  números seguidos de ) . - :
    const m = line.match(/^(?:[•\-\*•‣◦]|\d+[\)\.\-:])\s*(.+)$/);
    if (m) {
      let opt = m[1].trim();
      // Quita puntuación final tipo "?" "." "¿"
      opt = opt.replace(/[\.\?¿!]+$/u, '').trim();
      if (opt.length >= 2 && opt.length <= 70) opts.push(opt);
    }
  }
  return Array.from(new Set(opts)).slice(0, max);
}

function ChatPanel({ agentId, locale }: Props) {
  const t = COPY[locale];
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /** Buffer de texto pendiente: si el usuario tipea antes que la sesión
   *  conecte, guardamos aquí y flusheamos en onConnect. */
  const pendingTextRef = useRef<string[]>([]);

  const addMessage = useCallback((role: 'user' | 'agent', text: string) => {
    setMessages((prev) => {
      // Dedup de mensajes consecutivos idénticos (el SDK a veces re-emite)
      const last = prev[prev.length - 1];
      if (last && last.role === role && last.text === text) return prev;
      return [
        ...prev,
        { id: Date.now() + Math.random(), role, text },
      ];
    });
  }, []);

  const conversation = useConversation({
    onMessage: (event: unknown) => {
      // SDK @elevenlabs/client@1.3.1 emite: { source, message, role, event_id }
      // (verificado en BaseConversation.js líneas 117-137 instalado).
      const e = event as { source?: string; message?: string };
      const msg = (e?.message ?? '').toString().trim();
      if (!msg) return;
      if (e.source === 'user') addMessage('user', msg);
      else if (e.source === 'ai') addMessage('agent', msg);
    },
    onError: (err: unknown) => {
      console.error('[AMB-CHAT]', err);
      setError(typeof err === 'string' ? err : t.errFallback);
    },
    onConnect: () => {
      setError(null);
      // Flushear texto buffereado al conectar
      const queued = pendingTextRef.current;
      pendingTextRef.current = [];
      queued.forEach((txt) => {
        try {
          (conversation as any).sendUserMessage(txt);
        } catch (e) {
          console.warn('[AMB-CHAT] flush failed', e);
        }
      });
    },
    onDisconnect: () => {
      // No reseteamos messages aquí; lo hace handleClose explícitamente
    },
  });

  const { status, isMuted, setMuted, isSpeaking, sendUserMessage } =
    conversation as any;
  const isActive = status === 'connected';
  const isConnecting = status === 'connecting';

  // Auto-scroll del transcript en cada mensaje nuevo
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSpeaking, isConnecting]);

  // Focus al input cuando se abre el panel
  useEffect(() => {
    if (open) {
      const tm = setTimeout(() => inputRef.current?.focus(), 140);
      return () => clearTimeout(tm);
    }
  }, [open]);

  // End sesión si el componente se desmonta
  useEffect(() => {
    return () => {
      if (status === 'connected' || status === 'connecting') {
        try {
          (conversation as any).endSession();
        } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * SATMA-pattern: UNA sola función que arranca la sesión (muteada o no).
   * - Pide getUserMedia siempre (necesario aun para "modo texto" porque
   *   el SDK necesita el stream incluso si lo mutaremos inmediatamente).
   * - startSession({ agentId }) sin overrides ni connectionType.
   * - setMuted(startMuted) inmediatamente para flujo texto.
   */
  const ensureSession = async (startMuted: boolean): Promise<boolean> => {
    if (isActive) {
      // Ya hay sesión; solo ajusta el mute si vamos a hablar
      if (!startMuted && isMuted) setMuted(false);
      return true;
    }
    if (isConnecting) return true;

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // connectionType: 'websocket' fuerza el path WebSocket en vez de
      // WebRTC/LiveKit. WebRTC tiene NegotiationError: timeout en algunas
      // redes (firewall/UDP bloqueado). WebSocket usa solo TCP/HTTPS y
      // funciona en cualquier red que permita HTTPS. El audio se routea
      // via OutputController + attachConnectionToOutput internamente.
      //
      // overrides.agent.language: pasa el locale del navegador/página al
      // agente. Requiere que el agente tenga ese idioma habilitado en
      // additional_languages (dashboard ElevenLabs → Agent → Voice tab)
      // Y que overrides estén permitidos en Security → Conversation overrides.
      (conversation as any).startSession({
        agentId,
        connectionType: 'websocket',
        overrides: {
          agent: {
            language: locale,
          },
        },
      });
      // Aplicar mute intent inmediatamente; el SDK respeta el estado
      // a través del handshake de conexión.
      if (startMuted) setMuted(true);
      return true;
    } catch (err) {
      const msg =
        err instanceof Error && err.name === 'NotAllowedError'
          ? t.errMicDenied
          : t.errMicGeneric;
      setError(msg);
      return false;
    }
  };

  const handleSend = async (rawText?: string) => {
    const txt = (rawText ?? input).trim();
    if (!txt) return;
    setInput('');
    addMessage('user', txt); // optimistic

    if (!isActive) {
      pendingTextRef.current.push(txt);
      const ok = await ensureSession(true);
      if (!ok) {
        addMessage('agent', t.errFallback);
        pendingTextRef.current = [];
      }
    } else {
      try {
        sendUserMessage(txt);
      } catch (e) {
        console.warn('[AMB-CHAT] sendUserMessage failed', e);
      }
    }
  };

  const handleMicToggle = async () => {
    if (!isActive && !isConnecting) {
      await ensureSession(false); // arranca con mic activo
    } else {
      setMuted(!isMuted);
    }
  };

  const handleClose = () => {
    if (isActive || isConnecting) {
      try {
        (conversation as any).endSession();
      } catch {}
    }
    setOpen(false);
    setMessages([]);
    setError(null);
    pendingTextRef.current = [];
  };

  /**
   * Volver al menú: cierra la sesión activa (para que el contexto
   * server-side se reinicie limpio), borra mensajes locales y mantiene
   * el panel abierto en estado welcome. La próxima opción que el usuario
   * elija (chip o tecleo) re-arranca una sesión fresca via ensureSession.
   */
  const handleMenu = () => {
    if (isActive || isConnecting) {
      try {
        (conversation as any).endSession();
      } catch {}
    }
    setMessages([]);
    setError(null);
    setInput('');
    pendingTextRef.current = [];
    // Re-focus al input para invitar a una nueva intent
    setTimeout(() => inputRef.current?.focus(), 60);
  };

  /** Warm up AudioContext + force play() en cualquier <audio> que LiveKit
   *  appenda a document.body. Necesario porque LiveKit attach() crea
   *  elementos audio DESPUÉS de que el click event termina, lo cual
   *  hace que browsers bloqueen autoplay aunque el SDK setea `autoplay=true`. */
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioObserverRef = useRef<MutationObserver | null>(null);

  const warmAudioAndObserve = () => {
    // 1. Crear/resumir AudioContext durante el user gesture → marca la
    //    página como "audio-permitida" para policies modernas.
    try {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AC) {
        if (!audioCtxRef.current) audioCtxRef.current = new AC();
        const ctx = audioCtxRef.current;
        if (ctx?.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      }
    } catch {}

    // 2. Observar appendChild de <audio> a body (LiveKit attach) y forzar play()
    if (audioObserverRef.current) return; // ya activo
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLAudioElement) {
            node.muted = false;
            node.volume = 1;
            const tryPlay = () => node.play().catch((e) => console.warn('[AMB-CHAT] audio.play() blocked', e));
            tryPlay();
            // Re-intentar tras 200ms (Safari a veces necesita un tick)
            setTimeout(tryPlay, 200);
          }
        });
      }
    });
    obs.observe(document.body, { childList: true });
    audioObserverRef.current = obs;
  };

  // Cleanup del observer cuando el componente se desmonta
  useEffect(() => {
    return () => {
      audioObserverRef.current?.disconnect();
      audioObserverRef.current = null;
    };
  }, []);

  /** Abrir el panel Y arrancar la sesión de voz inmediatamente.
   *  Warm-up AudioContext + observer ANTES de getUserMedia para que
   *  el browser considere el audio "user-activated" cuando LiveKit
   *  appenda sus <audio> elements (lo cual ocurre async tras connect). */
  const handleOpen = async () => {
    setOpen(true);
    warmAudioAndObserve();           // CRÍTICO: warm-up dentro del click
    await ensureSession(false);
  };

  const showWelcome = messages.length === 0 && !isConnecting;
  const statusLabel = isActive
    ? isSpeaking
      ? t.statusSpeaking
      : t.statusOnline
    : isConnecting
      ? t.statusConnecting
      : t.statusIdle;

  return (
    <div className="amb-chat" data-open={open ? 'true' : 'false'}>
      {/* FAB — burbuja compacta circular sin label, con bounce periódico */}
      {!open && (
        <button
          type="button"
          className="amb-chat__fab"
          onClick={handleOpen}
          aria-label={t.fab}
          title={t.fab}
        >
          <svg
            className="amb-chat__fab-icon"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <span className="amb-chat__fab-dot" aria-hidden="true" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          className="amb-chat__panel"
          role="dialog"
          aria-modal="false"
          aria-label={t.title}
        >
          <header className="amb-chat__head">
            <div className="amb-chat__head-text">
              <h3 className="amb-chat__title">{t.title}</h3>
              <p className="amb-chat__subtitle">
                <span
                  className={`amb-chat__status-dot amb-chat__status-dot--${
                    isActive ? 'on' : isConnecting ? 'pending' : 'off'
                  }`}
                  aria-hidden="true"
                />
                {statusLabel}
              </p>
            </div>
            <div className="amb-chat__head-actions">
              {messages.length > 0 && (
                <button
                  type="button"
                  className="amb-chat__icon-btn"
                  onClick={handleMenu}
                  aria-label={t.menu}
                  title={t.menu}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="13"
                    height="13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    aria-hidden="true"
                  >
                    <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                className="amb-chat__close"
                onClick={handleClose}
                aria-label={t.close}
              >
                <svg
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M4 4 L12 12 M12 4 L4 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </header>

          {/* Messages area */}
          <div ref={scrollRef} className="amb-chat__messages" aria-live="polite">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`amb-chat__msg amb-chat__msg--${m.role}`}
              >
                {m.text}
              </div>
            ))}
            {(isConnecting ||
              (isActive &&
                messages.length > 0 &&
                messages[messages.length - 1]?.role === 'user' &&
                !isSpeaking)) && (
              <div className="amb-chat__msg amb-chat__msg--agent amb-chat__msg--typing">
                <span />
                <span />
                <span />
              </div>
            )}
            {error && <div className="amb-chat__error">{error}</div>}
          </div>

          {/* Quick replies — dos modos:
              • Welcome: chips amplios con las 4 opciones de bienvenida
              • Mid-conversation: chips compactos con opciones extraídas
                del último mensaje del agente (1) 2) 3) o •) o, si no hay,
                un set curado de follow-ups + chip "Volver al menú". */}
          {showWelcome ? (
            <div className="amb-chat__quick">
              {t.quick.map((q, i) => {
                // Indices 2 y 3 = contacto / redes. Enviar intent largo
                // al agente para que entienda contexto completo, pero
                // el chip muestra el label corto editorial.
                const intent =
                  i === 2 ? t.intentContact :
                  i === 3 ? t.intentSocials :
                  q;
                return (
                  <button
                    type="button"
                    key={q}
                    className="amb-chat__chip"
                    onClick={() => handleSend(intent)}
                  >
                    {q}
                  </button>
                );
              })}
            </div>
          ) : (
            (() => {
              const lastAgent = [...messages]
                .reverse()
                .find((m) => m.role === 'agent');
              const agentOpts = lastAgent
                ? extractAgentOptions(lastAgent.text)
                : [];
              const fallback = t.quickFollow as readonly string[];
              const isFallback = agentOpts.length === 0;
              const options = isFallback ? fallback : agentOpts;
              return (
                <div className="amb-chat__quick amb-chat__quick--compact">
                  {options.map((o, i) => {
                    // En modo fallback, indices 1 y 2 = contacto/redes.
                    // Opciones extraídas del agente se envían tal cual.
                    let intent = o;
                    if (isFallback) {
                      if (i === 1) intent = t.intentContact;
                      if (i === 2) intent = t.intentSocials;
                    }
                    return (
                      <button
                        type="button"
                        key={o}
                        className="amb-chat__chip"
                        onClick={() => handleSend(intent)}
                      >
                        {o}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    className="amb-chat__chip amb-chat__chip--menu"
                    onClick={handleMenu}
                    aria-label={t.menu}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="11"
                      height="11"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 7h16M4 12h16M4 17h10"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{t.menuShort}</span>
                  </button>
                </div>
              );
            })()
          )}

          {/* Footer: mic + input + send */}
          <footer className="amb-chat__foot">
            <button
              type="button"
              className="amb-chat__mic"
              data-active={isActive && !isMuted ? 'true' : 'false'}
              onClick={handleMicToggle}
              disabled={isConnecting}
              aria-label={
                isActive
                  ? isMuted
                    ? t.micMuted
                    : t.micActive
                  : t.micStart
              }
            >
              {isActive && !isMuted ? (
                /* Mic activo (lleno) */
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" />
                  <path
                    d="M19 11v1a7 7 0 0 1-14 0v-1M12 19v3M8 22h8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                /* Mic apagado/inactivo (outline) */
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <rect
                    x="9"
                    y="3"
                    width="6"
                    height="11"
                    rx="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M19 11v1a7 7 0 0 1-14 0v-1M12 19v3M8 22h8"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>

            <form
              className="amb-chat__form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                ref={inputRef}
                className="amb-chat__input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={error ? t.placeholderContact : t.placeholder}
                disabled={isConnecting}
                aria-label={error ? t.placeholderContact : t.placeholder}
              />
              <button
                type="submit"
                className="amb-chat__send"
                aria-label={t.send}
                disabled={!input.trim() || isConnecting}
              >
                <svg
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8 L14 2 L9 14 L7.5 9 L2 8 Z"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </footer>
        </div>
      )}
    </div>
  );
}

export default function ChatBubble(props: Props) {
  return (
    <ConversationProvider>
      <ChatPanel {...props} />
    </ConversationProvider>
  );
}
